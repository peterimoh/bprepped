import { NextResponse } from 'next/server';
import { CustomError, InternalServerError } from '@/lib/backend';
import { z } from 'zod';

export function formatRequestError(error: unknown, defaultMessage?: string) {
  const defaultErrMssg = defaultMessage || 'Something went wrong';
  if (error instanceof CustomError) {
    return NextResponse.json(
      { error: error.message, type: error.type },
      { status: error.statusCode }
    );
  }
  if (error instanceof z.ZodError) {
    const errorMessages = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return NextResponse.json(
      {
        error: 'Validation failed',
        type: 'ValidationError',
        details: errorMessages,
      },
      { status: 400 }
    );
  }
  const { message, type } = new InternalServerError(
    (error as Error).message || defaultErrMssg
  );
  return NextResponse.json({ error: message, type }, { status: 500 });
}
