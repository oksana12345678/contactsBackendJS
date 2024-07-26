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
import {
  validateContact,
  validateUpdate,
} from '../validation/models/contact.js';
import isValid from '../middlewares/isValid.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get(
  '/contacts/:contactId',
  isValid,
  ctrlWrapper(getContactByIdController),
);

router.post(
  '/contacts',
  validateBody(validateContact),
  ctrlWrapper(createContactController),
);

router.delete(
  '/contacts/:contactId',
  isValid,
  ctrlWrapper(deleteContactController),
);

router.put(
  '/contacts/:contactId',
  isValid,
  validateBody(validateContact),
  ctrlWrapper(upsertContactController),
);

router.patch(
  '/contacts/:contactId',
  isValid,
  validateBody(validateUpdate),
  ctrlWrapper(patchContactController),
);

export default router;
