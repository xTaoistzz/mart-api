function successResponse(res, status = 200, message = 'Success.', data = []) {
    return res.status(status).json({
        status,
        message,
        data
    })
}

function errorResponse(res, status = 500, message = 'Something went wrong.', data = []) {
    return res.status(status).json({
        status,
        message,
        data
    })
}

module.exports = {
    successResponse,
    errorResponse,
    
}