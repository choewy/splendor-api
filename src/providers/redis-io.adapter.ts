import { Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import IoRedis, { RedisOptions } from 'ioredis';
import { Server, ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private readonly logger = new Logger(RedisIoAdapter.name);

  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(options: RedisOptions): Promise<void> {
    const pub = new IoRedis(options);
    const sub = new IoRedis(options);

    await Promise.all([pub.connect(), sub.connect()])
      .then(() => this.logger.debug('Redis IO Adaptor Connected'))
      .catch((e) => {
        this.logger.error('Redis IO Adapter Connection Error', {
          name: e?.name,
          message: e?.message,
          cause: e?.cause,
        });
      });

    this.adapterConstructor = createAdapter(pub, sub);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options) as Server;

    server.adapter(this.adapterConstructor);

    return server;
  }
}
