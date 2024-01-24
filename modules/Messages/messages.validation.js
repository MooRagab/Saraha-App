import joi from "joi";

export const sendMessage = {
  params: joi
    .object()
    .required()
    .keys({
      reciverId: joi.string().min(24).max(24).required(),
    }),
  body: joi.object().required().keys({
    message: joi.string().required(),
  }),
};
