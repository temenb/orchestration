import * as authClient from "../grpc/clients/auth.client";
import * as authGrpc from "../grpc/generated/auth";

export const getUser = async (userId: string) =>
  await authClient.getUser(userId);

export const anonymousSignIn = async (req: authGrpc.AnonymousSignInRequest) =>
  await authClient.anonymousSignIn(req.deviceId);

export const refreshTokens = async (req: authGrpc.RefreshTokensRequest) =>
  await authClient.refreshTokens(req.token);

