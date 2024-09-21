import createHttpError from 'http-errors';
import SessionCollection from '../db/models/Session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { randomBytes } from 'crypto';


const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  console.log(
    `Looking for session with ID: ${sessionId} and refreshToken: ${refreshToken}`,
  );

  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    console.log('Session not found');
    throw createHttpError(401, 'Session not found');
  }

  console.log('Session found:', session);

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    console.log('Session token expired');
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  console.log('Deleting old session');
  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  console.log('Creating new session');
  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};