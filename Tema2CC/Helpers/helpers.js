module.exports.validationError = (res, error = 'Data provided is not valid') => {
    res.setHeader('Content-Type', 'application/json');

    res.statusCode = 422;

    res.end(JSON.stringify({
        status: 'fail',
            error
    }, null, 3));
};

module.exports.error = (res, error = 'An unknown error occurred', statusCode = 500) => {
    res.setHeader('Content-Type', 'application/json');

    res.statusCode = statusCode;

    res.end(JSON.stringify({
        status: 'fail',
        error
    }, null, 3));
};

module.exports.success = (res, data = null) => {
    res.setHeader('Content-Type', 'application/json');

    res.statusCode = 200;

    res.end(JSON.stringify({
        status: 'success',
        data
    }, null, 3));
};

