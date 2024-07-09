import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts';

export const getContactsController = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    res.json({
      status: 200,
      message: 'Successfully found contact! ',
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      next(createHttpError(404, 'Contact not found!'));
      return;
    }

    res.json({
      status: 200,
      message: 'Successfully found contact with id ${contactId}',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};
export const createContactController = async (req, res, next) => {
  try {
    const contact = await createContact(req.body);
    res.json({
      status: 201,
      message: 'Successfully create a contact!',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};
export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId);
    if (!contact) {
      next(createHttpError(404, 'Contact not found!'));
      return;
    }
  } catch (err) {
    next(err);
  }
};
export const upsertContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body, { upsert: true });

    if (!result) {
      next(createHttpError(404, 'Contact not found!'));
      return;
    }
    const status = result.isNew ? 201 : 200;
    res.json({
      status: status,
      message: 'Successfully upserted a contact!',
      data: result.contact,
    });
  } catch (err) {
    next(err);
  }
};
