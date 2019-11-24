export const errorCodesObject = {
  USR_01: 'Email or Password provided is incorrect.',
  USR_02: '"Email" is required and must be a valid email.',
  USR_03: '"Email" already exists.',
  USR_04:
    '"Password" is required and must be at least 8 characters '
    + 'long and alphanumeric.',
  USR_05: 'Oops!, this "Email" is not registered yet.',
  USR_06: 'Unfortunately,this user has be deactivated.',
  USR_07: '"Email" must be a valid email',
  USR_09: '"Name" already exists.',
  USR_10: 'No spacing between words',
  USR_11: 'The ID(s) provided in the URL is invalid.',
  USR_12: 'Sorry, We could not find what you were looking for.',
  USR_13: '"name" is not allowed to be empty',
  USR_14:
    'The data with the ID(s) provided has already been '
    + 'deleted or does not exist.',
  USR_15: 'The ID provide provided is invalid.',
  USR_16: 'Successfully updated data.',
  USR_17: '"name" is required',
  SEV_01: 'Server error, Please contact the technical team.',
  AUTH_01: 'You are not authorized.',
  AUTH_02: 'You do not have the required permissions.',
  ENV_01: 'You are missing an env variables:',
  PERM_01: 'This role already has all permissions for this service.',
  PERM_02: 'This role already has this permission for this service.',
  PERM_03: 'This service doesn\'t exit or is inactive.',
  PERM_04: 'This role doesn\'t exist.',
};

export const messageCodeObject = {
  USR_MSG_01: 'Successfully deleted data.',
  USR_MSG_02: 'Successfully updated data.',
};
