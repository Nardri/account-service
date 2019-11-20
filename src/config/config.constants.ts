class ConfigConstants {
  private readonly errorCodes: { [key: string]: string };

  constructor() {
    this.errorCodes = {
      USR_01: 'Email or Password provided is incorrect.',
      USR_02: '"Email" is required and must be a valid email.',
      USR_03: '"Email" already exists.',
      USR_04:
        '"Password" is required and must be at least 8 characters long and alphanumeric.',
      USR_05: 'Oops!, this "Email" is not registered yet.',
      USR_06: 'Unfortunately,this user has be deactivated.',
      USR_07: '"Email" must be a valid email.',
      SEV_01: 'Server error, Please contact the technical team.',
      AUTH_01: 'You are not authorized to view this endpoint.',
      ENV_01: 'You are missing an env variables:',
    };
  }

  getErrorMsg(key: string): string {
    return this.errorCodes[key] ? this.errorCodes[key] : 'Invalid';
  }
}

const constants = new ConfigConstants();
export default constants;
