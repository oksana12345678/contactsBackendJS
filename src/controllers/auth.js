import createHttpError from 'http-errors';
import { ONE_DAY } from '../constants/index.js';
import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import parseFilterParams from '../utils/parseFilterParams.js';
import { getAllContacts } from '../services/contacts.js';
import { verifyToken } from '../utils/verifyToken.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      name: user.name,
      email: user.email,
      _id: user._id,
    },
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshUserSessionController = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // або з cookies, якщо це ваш випадок

  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  // Перевірте токен
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const session = await refreshSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
      user: { name: req.user.name, ...contacts },
    },
  });
};

export const requestResetEmailController = async (req, res, next) => {
  try {
    await requestResetToken(req.body.email);

    res.json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    createHttpError(500, 'Failed to send the email, please try again later.');
    next(err);
  }
};
export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
};
