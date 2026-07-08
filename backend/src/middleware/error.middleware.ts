import { Request, Response, NextFunction } from 'express';

interface ApiError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status = err.status ?? 500;
  const message = err.message ?? 'Internal server error';

  // Log non-client errors
  if (status >= 500) {
    console.error(`[Error ${status}] ${message}`, err.stack);
  }

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ success: false, error: 'Route not found' });
};
