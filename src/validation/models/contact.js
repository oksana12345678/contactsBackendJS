import Joi from 'joi';
import { model, Schema } from 'mongoose';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ('work', 'home', 'personal'),
      required: true,
      default: 'personal',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
const Contact = model('contacts', contactSchema);
export default Contact;

export const validateContact = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should by less {#limit} characters',
    'string.max': 'Name cannot be more then {#limit} characters ',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Phone number should have at less {#limit}',
    'string.max': 'Phone number should have at most {#limit}',
  }),
  email: Joi.string().email(),
  ifFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .default('personal')
    .messages({
      'string.base': 'Choose one of proposed options ',
      'all.required': 'Plisse choose option is required',
    }),
});

export const validateUpdate = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should by less {#limit} characters',
    'string.max': 'Name cannot be more then {#limit} characters ',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.min': 'Phone number should have at less {#limit}',
    'string.max': 'Phone number should have at most {#limit}',
  }),
  email: Joi.string().email(),
  ifFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .default('personal')
    .messages({
      'string.base': 'Choose one of proposed options ',
    }),
});
