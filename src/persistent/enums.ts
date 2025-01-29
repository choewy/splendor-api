export enum NodeEnv {
  Local = 'local',
  Development = 'development',
  Production = 'production',
}

export enum ContextPropertyKey {
  RequestId = 'request-id',
  RequestTimestamp = 'request-timestamp',
  ExecutionContext = 'execution-context',
}

export enum RequestHeader {
  Authorization = 'authorization',
  XRequestId = 'x-request-id',
  XRefreshToken = 'x-refresh-token',
}

export enum ResponseHeader {
  XRequestId = 'x-request-id',
  XAccessToken = 'x-access-token',
  XRefreshToken = 'x-refresh-token',
}
