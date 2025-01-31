export enum NodeEnv {
  Local = 'local',
  Development = 'development',
  Production = 'production',
}

export enum ContextPropertyKey {
  RequestId = 'request-id',
  RequestTimestamp = 'request-timestamp',
  RequestUser = 'request-user',
  RequestPlayer = 'request-player',
  ExecutionContext = 'execution-context',
}

export enum RequestHeader {
  Authorization = 'authorization',
  XRequestId = 'x-request-id',
  XRefreshToken = 'x-refresh-token',
  XForwarededFor = 'x-forwarded-for',
}

export enum ResponseHeader {
  XRequestId = 'x-request-id',
  XAccessToken = 'x-access-token',
  XRefreshToken = 'x-refresh-token',
}

export enum MetadataKey {
  RequiredJwtAuthGuard = 'required-jwt-auth-guard',
  RequiredPlayerAuthGuard = 'required-player-auth-guard',
  RequiredEmptyPlayerAuthGuard = 'required-empty-player-auth-guard',
}

export enum TakeTokenCount {
  Zero = 0,
  One = 1,
  Two = 2,
}
