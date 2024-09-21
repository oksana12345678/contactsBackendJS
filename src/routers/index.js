import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';
import routerUser from './user.js';

const routers = Router();

routers.use('/contacts', contactsRouter);

routers.use('/auth', authRouter);

routers.use('/users', routerUser);

export default routers;
