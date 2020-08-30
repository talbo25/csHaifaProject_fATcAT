import Field from "./Field";

export const validateField = (validators, value) => {
  let error = "";
  validators.forEach((validator) => {
    const validationError = validator(value);
    if (validationError) {
      error = validationError;
    }
  });
  return error;
};

export const validateFields = (fields, values) => {
  // console.log("-D- validateFields");

  const errors = {};
  const fieldKeys = Object.keys(fields);
  fieldKeys.forEach((key) => {
    const field = fields[key];
    const validators = field.validators;
    const value = values[key];

    if (validators && validators.length > 0) {
      const error = validateField(validators, value);

      if (error) {
        errors[key] = error;
      }
    }
  });

  return errors;
};

export const hasValidationError = (errors) => {
  return Object.values(errors).find((error) => error.length > 0);
};

export const validateContent = (text) => {
  if (!text) {
    return "*can't be blank";
  }
};

export const validateLength = (text) => {
  if (text && text.length < 4) {
    return "Must be 4 characters or more.";
  }
};
