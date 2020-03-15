const { parse } = require('querystring');
const helpers = require('./Helpers/helpers');

module.exports = async (req, res, routes) => {
    // Find a matching route
    const route = routes.find((route) => {
        const methodMatch = route.method === req.method;
        let pathMatch = false;

        if (typeof route.path === 'string') {
            pathMatch = route.path === req.url;
        }
        else {
            pathMatch = req.url.match(route.path);
           
        }
        return pathMatch && methodMatch;
    });


    // Extract the "id" parameter from route and pass it to controller
    let param = null;

    if (route && typeof route.path === 'object') {
        param = req.url.match(route.path)[1];
    }

    // Extract request body
    if (route) {
        let body = null;
        if (req.method === 'POST' || req.method === 'PUT') {
            body = await getBody(req);
        }
        return route.handler(req, res, param, body);
    }
    else {
        return helpers.error(res, 'Endpoint not found', 404);
    }
};

function getBody(req) {
    return new Promise((resolve, reject) => {
       try {
            let body = [];
            req.on('data', (chunk) => {
            body.push(chunk);
            }).on('end', () => {
            body = Buffer.concat(body).toString();
            resolve(body)
        });
       }
       catch (e) {
           reject(e);
       }
    });
}