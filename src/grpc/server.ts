import {OrchestrationService} from './generated/orchestration';
import * as grpc from '@grpc/grpc-js';
import * as healthHandler from "./handlers/health.handler";
import * as profileHandler from "./handlers/profile.handler";
import * as authHandler from "./handlers/auth.handler";

const server = new grpc.Server();

server.addService(OrchestrationService, {
  health: healthHandler.health,
  status: healthHandler.status,
  livez: healthHandler.livez,
  readyz: healthHandler.readyz,

  getMyUser: authHandler.getMyUser,
  anonymousSignIn: authHandler.anonymousSignIn,
  refreshTokens: authHandler.refreshTokens,

  getMyProfile: profileHandler.getMyProfile,
  getProfile: profileHandler.getProfile,
});

export default server;

