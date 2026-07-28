function errorMiddleware(err, req, res, next) {
    console.error({
        method: req.method,
        url: req.url,
        message: err.message,
        stack: err.stack
    });

    return res.status(500).json({
        message: "Internal Server Error"
    })
}

export default errorMiddleware;