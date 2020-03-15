const moviesController = require('./Controllers/MoviesController');
const showsController = require('./Controllers/ShowController');
//const projectController = require('./controllers/ProjectController');

const routes = [
    {
        method: 'GET',
        path: '/movies',
        handler: moviesController.getAll
    },
    {
        method: 'GET',
        path: /\/movies\/([0-9a-zA-Z]+)/,
        handler: moviesController.getMovieWithID
    },
    {
        method: 'POST',
        path: '/movies',
        handler: moviesController.createMovie
    },
    {
        method: 'PUT',
        path: /\/movies\/([0-9a-zA-Z]+)/,
        handler: moviesController.updateMovie
    },
    {
        method: 'DELETE',
        path: /\/movies\/([0-9a-zA-Z]+)/,
        handler: moviesController.deleteMovieWithID
    },
    {
        method: 'GET',
        path: '/shows',
        handler: showsController.getAll
    },
    {
        method: 'GET',
        path: /\/shows\/([0-9a-zA-Z]+)/,
        handler: showsController.getShowWithID
    },
    {
        method: 'POST',
        path: '/shows',
        handler: showsController.createShow
    },
    {
        method: 'PUT',
        path: /\/shows\/([0-9a-zA-Z]+)/,
        handler: showsController.updateShow
    },
    {
        method: 'DELETE',
        path: /\/shows\/([0-9a-zA-Z]+)/,
        handler: showsController.deleteShowWithID
    }
];

module.exports = routes;