export default class AppError extends Error {
  public status: number;
  public errors?: any[];
  constructor(message: string, status: number = 500,errors?: any[]) {
    super(message);
    this.status = status;
    this.errors = errors;

  // The "Glue" that holds the inheritance together
    Object.setPrototypeOf(this, AppError.prototype);
    
    // Optional: Keeps the stack trace clean by hiding this constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}
