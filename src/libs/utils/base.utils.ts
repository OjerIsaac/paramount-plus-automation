import * as isemail from 'isemail';

export const isEmail = (email: string) => {
  return isemail.validate(email);
};
