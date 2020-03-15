const helpers = require('./../Helpers/helpers');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MovieSchema = new Schema({
    token: { type: String, required: true, max: 100 },
    name: { type: String, required: true, max: 100 },
    director: { type: String, required: true, max: 100 },
    actors: { type: String, required: true, max: 100 },
  }, { collection: 'Movies' });

mongoose.model('Movie', MovieSchema);

Movie = mongoose.model("Movie");

//console.log(mongoose.modelNames())

var mongoDB = "";
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

class MoviesController {
    // GET /movies
    getAll (req, res) {
        Movie.find({}, function (err, result) {
            if (!err) {
                helpers.success(res, result)
            }else {
                helpers.error(res, err)
            }
            })
            
    }

    // GET /movies/:id
    getMovieWithID (req, res, param) {
        //console.log(param)
        Movie.find({"token" : param}, function (err, result) {
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

    // POST /movies

    createMovie (req, res, param, postData) {
        postData = JSON.parse(postData);
        let { name, director, actors } = postData;
        const token = tokenGenerator(name, director);
        var newMovie = {
            token: token,
            name: name,
            director: director,
            actors: actors
        }
        console.log(newMovie)
        var movie = new Movie(newMovie);
        movie.save().then(() => {
            helpers.success(res, "Succesfully added a new Movie")
        }).catch((err) => {
            if (err) {
                helpers.error(res, statusCode = 404)
            }
        })

    }

    // PUT /movies/:id

    updateMovie (req, res, param, postData) {
        postData = JSON.parse(postData);
        let { name, director, actors } = postData;
        var newMovie = {
            token: param,
            name: name,
            director: director,
            actors: actors
        }
        var newvalues = { $set: newMovie };
        Movie.find({"token" : param}, function (err, result) {
            if (!err) {
                console.log(result.length)
                if (result.length === 0) {
                    helpers.error(res, "Not Found", 404)
                }else {
                    Movie.updateOne({"token" : param}, newvalues, (err, result) => {
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


    // DELETE /movies/:id
    deleteMovieWithID (req, res, param) {
        console.log(param)
        Movie.find({"token" : param}, function (err, result) {
            if (!err) {
                console.log(result.length)
                if (result.length === 0) {
                    helpers.error(res, "Not Found", 404)
                }else {
                    Movie.deleteOne({"token" : param}, (err, result) => {
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

module.exports = new MoviesController();
