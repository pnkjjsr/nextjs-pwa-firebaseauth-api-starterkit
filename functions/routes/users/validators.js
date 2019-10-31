const {
  isEmail,
  isEmpty,
  isBoolean
} = require('../../utils/validation');

exports.validateSignupData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = 'Email must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address';
  }

  if (isEmpty(data.password)) errors.password = 'Password must not be empty';
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Passwords must match';
  // if (isEmpty(data.handle)) errors.handle = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLocationData = (data) => {
  let errors = {};

  if (isEmpty(data.token)) {
    errors.token = 'Token must not be empty';
  }
  if (isEmpty(data.address)) {
    errors.address = 'Address must not be empty';
  }
  if (isEmpty(data.state)) {
    errors.state = 'State must not be empty';
  }
  if (isEmpty(data.pincode)) {
    errors.pincode = 'Pincode must not be empty';
  }
  if (isEmpty(data.country)) {
    errors.country = 'Country must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = 'Email is not be empty';
  if (isEmpty(data.password)) errors.password = 'Password not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.reduceUserDetails = (data) => {
  let userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    // https://website.com
    if (data.website.trim().substring(0, 4) !== 'http') {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};

exports.validateMobileData = (data) => {
  let errors = {};

  if (isEmpty(data.token)) {
    errors.token = 'Token must not be empty';
  }
  if (isEmpty(data.phoneNumber)) {
    errors.phoneNumber = 'Mobile must not be empty';
  }
  if (isEmpty(data.country_code)) {
    errors.country_code = 'Country Code is not define.';
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
}
exports.validateOTPData = (data) => {
  let errors = {};

  if (isEmpty(data.token)) {
    errors.token = 'Token not define.';
  }
  if (isBoolean(data.phoneVerified)) {
    errors.phoneVerified = 'phoneVerified not define.';
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
}