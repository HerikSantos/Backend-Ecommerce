class MissingParams extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, MissingParams.prototype);
    }
}

export { MissingParams };
