import * as grpc from '@grpc/grpc-js';
import * as emptyGrpc from '../generated/common/empty';
import * as authGrpc from '../generated/auth';
import * as authService from '../../services/auth.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";
import getUserIdFromMetadata from "../../lib/getUserIdFromMetadata";

export const getMyUser = async (
  call: grpc.ServerUnaryCall<emptyGrpc.Empty, authGrpc.UserObject>,
  callback: grpc.sendUnaryData<authGrpc.UserObject>
) => {
  try {
    const userId = getUserIdFromMetadata(call);

    // if (!userId) {
    //   return;
    // }

    const response = await authService.getUser(userId);

    callback(null, response);

  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};

export const anonymousSignIn = async (
  call: grpc.ServerUnaryCall<authGrpc.AnonymousSignInRequest, authGrpc.AuthObject>,
  callback: grpc.sendUnaryData<authGrpc.AuthObject>
) => {
  try {
    const response = await authService.anonymousSignIn(call.request);

    callback(null, response);

  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};

export const refreshTokens = async (
  call: grpc.ServerUnaryCall<authGrpc.RefreshTokensRequest, authGrpc.AuthObject>,
  callback: grpc.sendUnaryData<authGrpc.AuthObject>
) => {
  try {
    const response = await authService.refreshTokens(call.request);

    callback(null, response);

  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};
