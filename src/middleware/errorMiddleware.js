import logger from "../config/logger.js";

function errorMiddleware(err, req, res, next) {
    logger.error({
            method: req.method,
            url: req.originalUrl,
            message: err.message,
            stack: err.stack
        },
        "Unhandled error"
    );

    return res.status(500).json({
        message: "Internal Server Error"
    })
}

export default errorMiddleware;