import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
  upsertContactController,
} from '../controllers/controllers.js';
import validateBody from '../middlewares/validateBody.js';
import { validateContact, validateUpdate } from '../validation/contacts.js';
import isValid from '../middlewares/isValid.js';
import authenticate from '../middlewares/authenticate.js';

const contactsRouter = Router();
contactsRouter.use(authenticate);

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/contacts/:contactId',
  isValid,
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post(
  '/register',
  validateBody(validateContact),
  ctrlWrapper(createContactController),
);

contactsRouter.post(
  '/',
  validateBody(validateContact),
  ctrlWrapper(createContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValid,
  ctrlWrapper(deleteContactController),
);

contactsRouter.put(
  '/:contactId',
  isValid,
  validateBody(validateContact),
  ctrlWrapper(upsertContactController),
);

contactsRouter.patch(
  '/:contactId',
  isValid,
  validateBody(validateUpdate),
  ctrlWrapper(patchContactController),
);

export default contactsRouter;
