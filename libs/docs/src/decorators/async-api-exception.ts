import { ApiResponseProperty } from '@nestjs/swagger';
import { AsyncApiSub } from 'nestjs-asyncapi';

type AsyncApiEventOptions = {
  channel: string;
  summary: string;
};

class AsyncApiExceptionType {
  @ApiResponseProperty({ type: String })
  name: string;
  @ApiResponseProperty({ type: String })
  message: string;
  @ApiResponseProperty({ type: Object })
  cause?: object;
  @ApiResponseProperty({ type: Object })
  error?: object;
}

export const AsyncApiException = (options: AsyncApiEventOptions) =>
  AsyncApiSub({
    summary: options.summary,
    channel: options.channel,
    message: { payload: AsyncApiExceptionType },
  });
