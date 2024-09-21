import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { refreshUserSessionController } from '../controllers/user.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const routerUser = express.Router();
const parseJSON = express.json();

routerUser.use(authenticate);

routerUser.get(
  '/current',
  parseJSON,
  ctrlWrapper(refreshUserSessionController),
);

export default routerUser;
