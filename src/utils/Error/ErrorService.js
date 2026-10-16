import HttpStatusCodes from "./httpStatusCode"

export class BaseError extends Error{
    constructor(name,statusCode,isOpertional,description){
    super(description)
    Object.setPrototypeOf =(this,new.target.prototype)
    this.name = name,
    this.statusCode = statusCode,
    this.isOpertional = isOpertional,
    Error.captureStackTrace = this
    }
}

export class BadRequestError extends BaseError{
    constructor(name,statusCode = HttpStatusCodes.BAD_REQUEST,description="Bad request",isOperational=true){
        super(name,statusCode,isOperational,description)
    }
}

export class UnauthorizedError extends BaseError {
    constructor(name,statusCode = HttpStatusCodes.UNAUTHORIZED ,description = "Unauthorized" , isOperational = true){
        super(name,statusCode,isOperational,description)
    }
}

export class ForbiddenError extends BaseError {
    construtor(name,statusCode = HttpStatusCodes.FORBIDDEN ,description = "description" , isOperational = true){
        super(name,statusCode,isOperational,description)
    }
}

export class NotFoundError extends BaseError {
    constructor(name,statusCode = HttpStatusCodes.NOT_FOUND,description="not found",isOperational = false){
        super(name,statusCode,description,isOperational)
    }
}

