import Joi from 'joi';

export const subscriptionValidationSchemas = {
  // Validate creating a subscription
  createSubscription: Joi.object({
    plan_id: Joi.string().uuid().required(),
    delivery_address_id: Joi.string().uuid().required(),
    payment_method_id: Joi.string().uuid().required(),
  }),

  // Validate updating subscription
  updateSubscription: Joi.object({
    delivery_address_id: Joi.string().uuid(),
    payment_method_id: Joi.string().uuid(),
  }).min(1),

  // Validate subscription plan creation
  createPlan: Joi.object({
    plan_name: Joi.string().max(100).required(),
    description: Joi.string().max(1000),
    price: Joi.number().positive().precision(2).required(),
    billing_cycle: Joi.number().integer().positive().default(30),
    frequency: Joi.string().valid('MONTHLY', 'QUARTERLY', 'ANNUAL').default('MONTHLY'),
    max_skip_per_year: Joi.number().integer().min(0).default(3),
  }),

  // Validate cancellation reason
  cancelSubscription: Joi.object({
    reason: Joi.string().max(500),
  }),
};

export const validate = (schema: Joi.ObjectSchema) => {
  return (data: any) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
      return {
        valid: false,
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      };
    }
    return { valid: true, value };
  };
};
