import * as grpc from '@grpc/grpc-js';
import * as authGrpc from '../generated/auth';
import * as emptyGrpc from '../generated/common/empty';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';
import * as profileGrpc from "../generated/profile";

const authManager = new GrpcClientManager<authGrpc.AuthClient>(() => {
  return new authGrpc.AuthClient(config.serviceAuthUrl, grpc.credentials.createInsecure());
});

export const register = (email: string, password: string): Promise<authGrpc.AuthObject | null> => {
  const grpcRequest: authGrpc.RegisterRequest = {email, password};
  return authManager.call((client, cb) => client.register(grpcRequest, cb));
};

export const anonymousSignIn = (deviceId: string): Promise<authGrpc.AuthObject | null> => {
  const grpcRequest: authGrpc.AnonymousSignInRequest = {deviceId};
  return authManager.call((client, cb) => client.anonymousSignIn(grpcRequest, cb));
};

export const login = (email: string, password: string): Promise<authGrpc.AuthObject | null> => {
  const grpcRequest: authGrpc.LoginRequest = {email, password};
  return authManager.call((client, cb) => client.login(grpcRequest, cb));
};

export const refreshTokens = (token: string): Promise<authGrpc.AuthObject | null> => {
  const grpcRequest: authGrpc.RefreshTokensRequest = {token};
  return authManager.call((client, cb) => client.refreshTokens(grpcRequest, cb));
};

export const logout = (userId: string): Promise<authGrpc.LogoutResponse | null> => {
  const grpcRequest: authGrpc.LogoutRequest = {userId};
  return authManager.call((client, cb) => client.logout(grpcRequest, cb));
};

export const forgotPassword = (email: string): Promise<emptyGrpc.Empty | null> => {
  const grpcRequest: authGrpc.ForgotPasswordRequest = {email};
  return authManager.call((client, cb) => client.forgotPassword(grpcRequest, cb));
};

export const resetPassword = (token: string, newPassword: string): Promise<authGrpc.AuthObject | null> => {
  const grpcRequest: authGrpc.ResetPasswordRequest = {token, newPassword};
  return authManager.call((client, cb) => client.resetPassword(grpcRequest, cb));
};

export const getUser = (userId: string): Promise<authGrpc.UserObject | null> => {
  const grpcRequest: authGrpc.UserIdRequest = {userId};
  return authManager.call((client, cb) => client.getUser(grpcRequest, cb));
};