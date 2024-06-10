exports.kParamMissing = {
  status: 400,
  message: 'Required param missing',
};

exports.kAlreadyExists = (message) => {
  return {
    status: 409,
    message: message,
  };
};

exports.kInternalError = {
  status: 500,
  message: 'Internal server error',
};

exports.kSuccess = {
  status: 200,
  message: 'Success',
};

exports.kNotFound = (message) => {
  return {
    status: 404,
    message: message,
  };
};

exports.kAccessDenied = {
  status: 403,
  message: 'Password is incorrect',
};

exports.kAuthorizationFailed = {
  status: 401,
  message: 'Authorization Failed!',
};
