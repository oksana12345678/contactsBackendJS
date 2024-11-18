import createHttpError from 'http-errors';
// import { ONE_DAY } from '../constants/index.js';
import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';

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

  // res.cookie('refreshToken', session.refreshToken, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + ONE_DAY),
  // });
  // res.cookie('sessionId', session._id, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + ONE_DAY),
  // });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      user: {
        name: session.user.name,
        email: session.user.email,
      },
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

// const setupSession = (res, session) => {
//   res.cookie('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'None',
//     expires: new Date(Date.now() + ONE_DAY),
//   });
//   res.cookie('sessionId', session._id, {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'None',
//     expires: new Date(Date.now() + ONE_DAY),
//   });
// };

export const refreshUserSessionController = async (req, res) => {
  try {
    const { refreshToken } = req.body; // Отримуємо refreshToken з тіла запиту
    if (!refreshToken) {
      throw createHttpError(400, 'Refresh token is required');
    }

    const session = await refreshSession({ refreshToken });

    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      },
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: err.status || 500,
      message: err.message || 'Failed to refresh the session.',
    });
  }
};
