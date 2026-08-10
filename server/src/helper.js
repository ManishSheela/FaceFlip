import { prisma } from "./db.js";
import {
  AUTH_ERRORS,
  CLIENT_AUTH_CALLBACK_PATH,
  CLIENT_AUTH_PATH,
  CLIENT_ORIGIN,
  GENDER_VALUES,
} from "./constants.js";

export function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    gender: user.gender?.toLowerCase() ?? null,
    genderPref: user.genderPref.toLowerCase(),
  };
}

export async function withFriendCount(user) {
  const friendCount = await prisma.friendship.count({
    where: {
      status: "ACCEPTED",
      OR: [{ requesterId: user.id }, { addresseeId: user.id }],
    },
  });
  return { ...toPublicUser(user), friendCount };
}

export function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

export function clientAuthUrl(error) {
  return error
    ? `${CLIENT_ORIGIN}${CLIENT_AUTH_PATH}?error=${error}`
    : `${CLIENT_ORIGIN}${CLIENT_AUTH_CALLBACK_PATH}`;
}

function isAllowed(allowedValues, value) {
  return typeof value === "string" && Object.hasOwn(allowedValues, value);
}

export function buildProfileUpdate({ gender, genderPref }) {
  const data = {};

  if (gender !== undefined) {
    if (!isAllowed(GENDER_VALUES, gender)) {
      return { error: AUTH_ERRORS.invalidGender };
    }
    data.gender = GENDER_VALUES[gender];
  }

  if (genderPref !== undefined) {
    if (!isAllowed(GENDER_VALUES, genderPref)) {
      return { error: AUTH_ERRORS.invalidGenderPref };
    }
    data.genderPref = GENDER_VALUES[genderPref];
  }

  if (Object.keys(data).length === 0) {
    return { error: AUTH_ERRORS.nothingToUpdate };
  }
  return { data };
}
