import AppError from '../utils/AppError';
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ZodObject } from 'zod';

export const validateBody = (schema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  Validate
    const result = await schema.parseAsync(req.body);

    //  Re-assign cleaned data to req
    req.body = result;
    // req.query = result.query;
    // req.params = result.params;

    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      //Map the errors and pass to our custom AppError
      const mappedErrors = error.issues.map((e) => ({
        field: e.path.length > 1 ? e.path.slice(1).join('.') : e.path[0],
        message: e.message,
      }));

      return next(new AppError(`${mappedErrors[0]?.message} :(${mappedErrors[0]?.field?.toString()})`, 400));
    }
    next(error);
  }
};
