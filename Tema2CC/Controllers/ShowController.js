const helpers = require('../Helpers/helpers');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ShowSchema = new Schema({
    token: { type: String, required: true, max: 100 },
    name: { type: String, required: true, max: 100 },
    director: { type: String, required: true, max: 100 },
    actors: { type: String, required: true, max: 100 },
  }, { collection: 'Shows' });

mongoose.model('Shows', ShowSchema);

Show = mongoose.model("Shows");


var mongoDB = "mongodb+srv://robertT:parola1234@cluster0-zknkc.mongodb.net/Tema2?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true  });

const tokenGenerator = function (name, director) {
    var token = '';
    for (var i = 0; i < name.length; i++) {
        if (name.charAt(i) ===" ") {
            continue
        }
        if (director.charAt(i) === " ") {
            continue
        }
        token += name.charAt(i);
        token += director.charAt(i);
    }
    return token;
};

class ShowController {
    // GET /shows
    getAll (req, res) {
        Show.find({}, function (err, result) {
            if (!err) {
                helpers.success(res, result)
            }else {
                helpers.error(res, err)
            }
            })
            
    }

    // GET /shows/:id
    getShowWithID (req, res, param) {
        //console.log(param)
        Show.find({"token" : param}, function (err, result) {
            if (!err) {
                console.log(result.length)
                if (result.length === 0) {
                    helpers.error(res, "Not Found", 404)
                }else {
                    helpers.success(res, result)
                }
            }else {
                helpers.error(res, err)
            }
            })     
    }

    // POST /show

    createShow (req, res, param, postData) {
        postData = JSON.parse(postData);
        let { name, director, actors } = postData;
        const token = tokenGenerator(name, director);
        var newShow = {
            token: token,
            name: name,
            director: director,
            actors: actors
        }
        console.log(newShow)
        var show = new Show(newShow);
        show.save().then(() => {
            helpers.success(res, "Succesfully added a new Show")
        }).catch((err) => {
            if (err) {
                helpers.error(res, statusCode = 404)
            }
        })

    }

    // PUT /shows/:id

    updateShow (req, res, param, postData) {
        console.log("ceva")
        postData = JSON.parse(postData);
        let { name, director, actors } = postData;
        var newShow = {
            token: param,
            name: name,
            director: director,
            actors: actors
        }
        var newvalues = { $set: newShow };
        Show.find({"token" : param}, function (err, result) {
            if (!err) {
                console.log(result.length)
                if (result.length === 0) {
                    helpers.error(res, "Not Found", 404)
                }else {
                    Show.updateOne({"token" : param}, newvalues, (err, result) => {
                        if (!err) {
                            helpers.success(res, "SuccesfullyUpdate")
                        } else {
                            helpers.error(res, err)
                        }
                    })
                }
            }else {
                helpers.error(res, err)
            }
            })     
    }


    // DELETE /show/:id
    deleteShowWithID (req, res, param) {
        console.log(param)
        Show.find({"token" : param}, function (err, result) {
            if (!err) {
                console.log(result.length)
                if (result.length === 0) {
                    helpers.error(res, "Not Found", 404)
                }else {
                    Show.deleteOne({"token" : param}, (err, result) => {
                        if (!err) {
                            helpers.success(res, "SuccesfullyDeleted")
                        } else {
                            helpers.error(res, err)
                        }
                    })
                }
            }else {
                helpers.error(res, err)
            }
            })     
    }

    
}

module.exports = new ShowController();
