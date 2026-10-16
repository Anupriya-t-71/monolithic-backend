import Log from '../../models/LogError/logError_model.js';

const errorHandler = (err, req, res, next) => {
    const log = new Log({
        level: 'error',
        message: err.message,
        stack: err.stack,
        endpoint: req.originalUrl,
        user: req.user ? req.user._id : null,
    });

    log.save()
        .then(() => {
            console.error('Error logged to database');
        })
        .catch((error) => {
            console.error('Failed to log error to database', error);
        });

    res.status(500).send({
        success: false,
        message: 'Something went wrong',
        error: err.message,
    });
};

export default errorHandler;