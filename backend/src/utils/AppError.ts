export interface ValidationError {
  field: string;
  message: string;
  code?: string; 
}
export default class AppError<T=ValidationError> extends Error {
  public status: number;
  public errors?: T[];
  constructor(message: string, status: number = 500,errors?: T[]) {
    super(message);
    this.status = status;
    this.errors = errors;

 
    Object.setPrototypeOf(this, AppError.prototype);
   
    Error.captureStackTrace(this, this.constructor);
  }
}
