export class HttpExceptionErrorDto {
  name: string;
  message: string;

  constructor(cause: unknown) {
    if (typeof cause === 'object') {
      this.name = cause['name'] ?? null;
      this.message = cause['message'] ?? null;
    }
  }
}
