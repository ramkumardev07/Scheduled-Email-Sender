const {celebrate,Segments,Joi} = require('celebrate')

const validations = celebrate({
    [Segments.BODY]:Joi.object().keys({
        username:Joi.string().alphanum().min(3).max(30),
        email:Joi.string().email().required(),
        password:Joi.string().max(50).required()
    })
})

module.exports = validations