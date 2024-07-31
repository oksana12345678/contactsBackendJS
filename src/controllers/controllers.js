import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import parseFilterParams from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {

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
  res.json({
    status: 200,
    message: 'Successfully found contact! ',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
      throw createHttpError(404, 'Contact not found!');
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}`,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};
export const createContactController = async (req, res) => {
  const allIdData = {
    ...req.body,
    userId: req.user._id,
  };
  const contact = await createContact(allIdData);

  res.status(201).json({
    status: 201,
    message: 'Successfully create a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found!');
  }

  res.status(204).send();
};
export const upsertContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body, { upsert: true });

    if (!result) {
      throw createHttpError(404, 'Contact not found!');
    }
    const status = result.isNew ? 201 : 200;
    res.status(status).json({
      status,
      message: 'Successfully upserted a contact!',
      data: result.contact,
    });
  } catch (err) {
    next(err);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);

    if (!result) {
      throw createHttpError(404, 'Contact not found!');
    }

    res.json({
      status: 200,
      message: 'Successfully patch a contact!',
      data: result.contact,
    });
  } catch (err) {
    next(err);
  }
};
