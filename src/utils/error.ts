export class BaseError extends Error {
    status: any;
    constructor(message: string, name: string, status: any,) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.status = status;
        Error.captureStackTrace(this);
    }
}