import Joi from 'joi';

export default Joi.object({
  name: Joi.string().min(1),
  content: Joi.string().min(1),
  position: Joi.number().greater(0),
  list_id: Joi.number().integer().greater(0),
  tags: Joi.array().items(Joi.object(
    {
    id: Joi.number().integer().greater(0),
    name: Joi.string().min(1).required(),
    code_color: Joi.string().regex(/^#[a-fA-F0-9]{6}$/).message('Color must be a valid hex color code'),
    project_id: Joi.number().integer().greater(0),}
    )),
  project_id: Joi.number().integer().greater(0).required(),
  positionChange: Joi.boolean().default(false),
}).min(1);
