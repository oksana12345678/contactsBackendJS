import { ONE_DAY } from '../constants/index.js';
import { refreshSession } from '../services/user.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', //TODO прибрати якщо перестану  використовувати
    expires: new Date(Date.now() + ONE_DAY),
    sameSite: 'lax', //TODO прибрати якщо перестану  використовувати
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', //TODO прибрати якщо перестану  використовувати
    expires: new Date(Date.now() + ONE_DAY),
    sameSite: 'lax', //TODO прибрати якщо перестану  використовувати
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

    setupSession(res, session);
    // TODO headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
      user: {
        name: req.user.name,
        email: req.user.email,
      },
    },
  });
};
