import { isValidObjectId } from 'mongoose';
import { HttpError } from 'http-errors';

const isValid = (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw HttpError(404, 'Not found');
  }
  next();
};

export default isValid;
