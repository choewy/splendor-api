import { Type } from '@nestjs/common';
import { AsyncApiPub, AsyncApiSpecificOperationOptions, AsyncApiSub } from 'nestjs-asyncapi';

type AsyncApiEventOptions = {
  type: 'pub' | 'sub';
  channel: string;
  summary: string;
  payload?: Type<any>;
};

export const AsyncApiEvent = (options: AsyncApiEventOptions) => {
  const operationOptions: AsyncApiSpecificOperationOptions[] = [
    {
      channel: options.channel,
      summary: options.summary,
      message: { payload: options.payload ?? Object },
    },
  ];

  if (options.type === 'pub') {
    return AsyncApiPub(...operationOptions);
  } else {
    return AsyncApiSub(...operationOptions);
  }
};
