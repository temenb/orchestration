import * as grpc from '@grpc/grpc-js';
import * as engineGrpc from '../generated/engine';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const engineManager = new GrpcClientManager<engineGrpc.EngineClient>(() => {
  return new engineGrpc.EngineClient(config.serviceEngineUrl, grpc.credentials.createInsecure());
});

