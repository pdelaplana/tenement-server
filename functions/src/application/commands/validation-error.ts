export class ValidationError extends Error {
  commandName: string;
  validationErrors: string[];

  constructor(commandName: string, validationErrors:string[], ...params: any) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }

    this.name = 'ValidationError';
    this.message = `Validation errors found executing ${commandName}`;
    this.commandName = commandName;
    this.validationErrors = validationErrors;
  }
}
