import grpcServer from './grpc/server';
import * as grpc from '@grpc/grpc-js';
import logger from '@shared/logger';

const GRPC_PORT = process.env.GRPC_PORT ?? '50051';

async function startGrpc() {
  return new Promise<void>((resolve, reject) => {
    grpcServer.bindAsync(
      `0.0.0.0:${GRPC_PORT}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          logger.error('❌ Failed to start gRPC:', err);
          return reject(err);
        }
        logger.info(`🟢 gRPC server started on port ${port}`);
        resolve();
      }
    );
  });
}

async function bootstrap() {
  try {
    await Promise.all([startGrpc()]);
    logger.info('🚀 Orchestration successfully started');
  } catch (err) {
    logger.error('💥 Failed to start Orchestration:', err);
    process.exit(1);
  }

  process.on('SIGINT', () => {
    logger.info('🛑 Shutting down...');
    grpcServer.forceShutdown();
    process.exit(0);
  });
}

bootstrap();
