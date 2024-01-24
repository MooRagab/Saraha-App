import joi from "joi";

export const signUp = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string().min(2).max(15).required(),
      email: joi.string().email().required().messages({
        "any.required": "Plz Send Your Email",
        "any.empty": "Plz Send Your Email",
        "string.email": "Plz Enter Valid Email",
        "string.base": "Email Accept String Value Only",
      }),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        )
        .required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),
    }),
};

export const signIn = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "any.required": "Plz Send Your Email",
        "any.empty": "Plz Send Your Email",
        "string.email": "Plz Enter Valid Email",
        "string.base": "Email Accept String Value Only",
      }),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        )
        .required(),
    }),
};

export const checkToken = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};
