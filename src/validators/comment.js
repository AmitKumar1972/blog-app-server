const Joi = require('joi');

const commentSchema = Joi.object({
  text: Joi.string().min(1).required(),
});

module.exports = {
  commentSchema,
};
