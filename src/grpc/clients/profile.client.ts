import * as grpc from '@grpc/grpc-js';
import * as profileGrpc from '../generated/profile';
import * as authGrpc from '../generated/auth';
import config from '../../config/config';
import {GrpcClientManager} from '@shared/grpc-client-manager';

const profileManager = new GrpcClientManager<profileGrpc.ProfileClient>(() => {
  return new profileGrpc.ProfileClient(config.serviceProfileUrl, grpc.credentials.createInsecure());
});

export const getProfileByUser = (userId: string): Promise<profileGrpc.ProfileObject | null> => {
  const grpcRequest: authGrpc.UserIdRequest = {userId};
  return profileManager.call((client, cb) => client.getProfileByUser(grpcRequest, cb));
};

export const getProfile = (profileId: string): Promise<profileGrpc.ProfileObject | null> => {
  const grpcRequest: profileGrpc.ProfileIdRequest = {profileId};
  return profileManager.call((client, cb) => client.getProfile(grpcRequest, cb));
};
