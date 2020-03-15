var express = require('express');
var request = require('request');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const expressSession = require('express-session');
var querystring = require('querystring');
var cookieParser = require('cookie-parser')
let {configs} = require("./config")
var router = express.Router();

var client_id = configs.client_id; 
var client_secret = configs.client_secret; 
const redirectUri = configs.redirectUri;


var stateKey = 'spotify_auth_state';

const data = {};

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

router.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirectUri,
      state: state
    }));
});

router.get('/callback', (req, res) => {
   
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  
  if (state === null || state !== storedState) {
    res.redirect('/#' +
        querystring.stringify({
            error: 'state_mismatch'
        }));
    } else {
        res.clearCookie(stateKey);

        var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                code: code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
                },
                headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                },
                json: true
        };
        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const refresh_token = body.refresh_token;
                var access_token = body.access_token;

                data.spotify = {
                 token: access_token
                };

                let url = "https://api.random.org/json-rpc/2/invoke"
                request.post(url, {
                    json: {
                      "jsonrpc": "2.0",
                      "method": "generateIntegers",
                      "params": {
                          "apiKey": configs.randomORG_API,
                          "n": 1,
                          "min": 0,
                          "max": 9,
                          "base": 10
                      },
                      "id": 32716
                  }
                }, (error, response, body) => {
                  
                    if (!error && response.statusCode === 200) {
                        //console.log(body.result.random.data[0])
                        var index = body.result.random.data[0]
                        url = "https://api.deezer.com/chart/0"
                        request.get(url, (error, response, body) => {
                          if (!error && response.statusCode === 200) {
                            let top = JSON.parse(body)
                             //console.log(top.tracks.data[index].artist.name)
                             artistName = String(top.tracks.data[index].artist.name).replace(" ","+")
                             //console.log(artistName)
                              url = "https://api.spotify.com/v1/search?q="+artistName+"&type=artist"
                              request({url:url, headers: { 'Authorization': 'Bearer ' + access_token }}, function(err,response){
                                if(response) {
                                  let content = JSON.parse(response.body);
                                  //console.log(content.artists.items[0].images[0].url)
                                  data.spotify = {
                                    picture: content.artists.items[0].images[0].url
                                  }
                                  //console.log(data)
                                  res.render('index', data);
                                }
                            });
                             
                          }
                      });

                    }
                });
                
                

            } else {
                res.status(403).json({ message: 'invalid token' })
            }
        });
        
     }
      
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
