import * as grpc from '@grpc/grpc-js';
import * as emptyGrpc from '../generated/common/empty';
import * as profileGrpc from '../generated/profile';
import * as profileService from '../../services/profile.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";
import getUserIdFromMetadata from "../../lib/getUserIdFromMetadata";

export const getMyProfile = async (
  call: grpc.ServerUnaryCall<emptyGrpc.Empty, profileGrpc.ProfileObject>,
  callback: grpc.sendUnaryData<profileGrpc.ProfileObject>
) => {
  try {
    const userId = getUserIdFromMetadata(call);

    // if (!userId) {
    //   return;
    // }

    const response = await profileService.getProfileByUser(userId);

    callback(null, response);

  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};

export const getProfile = async (
  call: grpc.ServerUnaryCall<profileGrpc.ProfileIdRequest, profileGrpc.ProfileObject>,
  callback: grpc.sendUnaryData<profileGrpc.ProfileObject>
) => {
  try {
    const {profileId} = call.request;

    // if (!userId) {
    //   return;
    // }

    const response = await profileService.getProfile(profileId);

    callback(null, response);

  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};
