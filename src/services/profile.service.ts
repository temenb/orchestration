import * as profileClient from "../grpc/clients/profile.client";

export const getProfileByUser = async (userId: string) =>
  await profileClient.getProfileByUser(userId);

export const getProfile = async (profileId: string) =>
  await profileClient.getProfile(profileId);

