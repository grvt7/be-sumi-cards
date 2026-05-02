// import type { Request, Response, NextFunction } from 'express';
// import { z, ZodError } from 'zod';

// import { ErrorCategory } from '@/types/errorTypes';
// import { ApiError } from '@/utils/ApiErrors';

// export const validateRequest = (schema: z.ZodSchema) => {
//   return (req: Request, _res: Response, next: NextFunction): void => {
//     try {
//       const data = schema.parse({
//         body: req.body,
//         query: req.query,
//         params: req.params,
//       });

//       // Merge validated data back into request
//       if (data.body) req.body = data.body;
//       if (data.query) req.query = data.query;
//       if (data.params) req.params = data.params;

//       next();
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
//         throw new ApiError(
//           400,
//           `Validation failed: ${messages.join(', ')}`,
//           undefined,
//           ErrorCategory.VALIDATION,
//           false,
//           error.stack,
//         );
//       }
//       throw error;
//     }
//   };
// };

// export const validateBody = (schema: z.ZodSchema) => {
//   return (req: Request, _res: Response, next: NextFunction): void => {
//     try {
//       req.body = schema.parse(req.body || {});
//       next();
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
//         throw new ApiError(
//           400,
//           `Validation failed: ${messages.join(', ')}`,
//           undefined,
//           ErrorCategory.VALIDATION,
//           false,
//           error.stack,
//         );
//       }
//       throw error;
//     }
//   };
// };

// export const validateQuery = (schema: z.ZodSchema) => {
//   return (req: Request, _res: Response, next: NextFunction): void => {
//     try {
//       const parsed = schema.parse(req.query);
//       Object.assign(req.query, parsed);
//       next();
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
//         throw new ApiError(
//           400,
//           `Validation failed: ${messages.join(', ')}`,
//           undefined,
//           ErrorCategory.VALIDATION,
//           false,
//           error.stack,
//         );
//       }
//       throw error;
//     }
//   };
// };

// export const validateParams = (schema: z.ZodSchema) => {
//   return (req: Request, _res: Response, next: NextFunction): void => {
//     try {
//       req.params = schema.parse(req.params);
//       next();
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
//         throw new ApiError(
//           400,
//           `Validation failed: ${messages.join(', ')}`,
//           undefined,
//           ErrorCategory.VALIDATION,
//           false,
//           error.stack,
//         );
//       }
//       throw error;
//     }
//   };
// };
