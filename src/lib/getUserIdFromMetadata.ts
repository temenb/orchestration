import jwt from 'jsonwebtoken';
import config from '../config/config';
import * as grpc from '@grpc/grpc-js';
import logger from "@shared/logger";

const JWT_SECRET = config.jwtAccessSecret;

export const getUserIdFromMetadata = (
  call: grpc.ServerUnaryCall<any, any>
): string => {

  // logger.log('getUserIdFromMetadata');

  const authHeader = call.metadata.get('authorization')[0] as string;
  // logger.log(call.metadata.get('authorization'));
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }

  const token = authHeader.slice(7);
  const payload = jwt.verify(token, JWT_SECRET) as { sub: string };

  if (!payload.sub) {
    throw new Error('JWT payload missing sub');
  }

  // logger.log(payload.sub);

  return payload.sub;
};

export default getUserIdFromMetadata;