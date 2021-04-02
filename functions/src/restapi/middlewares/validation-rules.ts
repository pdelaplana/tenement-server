import { check } from 'express-validator';

export const validationRules = {

  newRegistrationRequest: [
    check('email').isEmail(),
    check('password').isAlphanumeric().isLength({ min: 6 }),
    check('name').notEmpty(),
    check('organization').notEmpty(),
  ],

  newPropertyCommand: [
    check('name').notEmpty(),
  ],

};
