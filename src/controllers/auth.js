import createHttpError from 'http-errors';
import {
  loginUser,
  registerUser,
  requestResetToken,
  resetPassword,
  refreshAccessToken,
} from '../services/auth.js';

export const registerUserController = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(err.status || 500).json({
      status: err.status || 500,
      message: err.message || 'Failed to register a user.',
    });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { accessToken, refreshToken, user } = await loginUser(req.body);

    // Встановлюємо refreshToken у cookies (опціонально)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Використовуйте лише HTTPS
      sameSite: 'None',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 день
    });

    res.json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
        accessToken,
      },
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: err.status || 500,
      message: err.message || 'Failed to log in a user.',
    });
  }
};

export const logoutUserController = async (req, res) => {
  try {
    // Якщо refreshToken передається у cookies
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });

    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({
      status: err.status || 500,
      message: err.message || 'Failed to log out a user.',
    });
  }
};

export const requestResetEmailController = async (req, res) => {
  try {
    await requestResetToken(req.body.email);

    res.json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: err.status || 500,
      message:
        err.message || 'Failed to send the email, please try again later.',
    });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    await resetPassword(req.body);

    res.json({
      message: 'Password has been successfully reset.',
      status: 200,
      data: {},
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: err.status || 500,
      message: err.message || 'Failed to reset the password.',
    });
  }
};

export const refreshUserSessionController = async (req, res) => {
  try {
    // Якщо refreshToken передається через cookies
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      throw createHttpError(400, 'Refresh token is required');
    }

    const { accessToken, newRefreshToken } = await refreshAccessToken(
      refreshToken,
    );

    // Оновлюємо refreshToken у cookies
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 день
    });

    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken,
      },
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: err.status || 500,
      message: err.message || 'Failed to refresh the session.',
    });
  }
};
