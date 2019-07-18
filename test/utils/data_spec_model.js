const spec = {
  user: {
    login: {
      type: 'string',
      isUpdateable: false,
      invalid: {
        errorMessage: 'Invalid login specified... Please insert your registered email address',
        invalidParams: [
          {
            value: '',
          },
          {
            value: 'aaaaaaa',
          },
          {
            value: '000000000',
          },
          {
            value: 'hhhh@hh.',
          },
        ],
      },
      login: {
        required: true,
        errorMessage: 'Invalid login is required Please insert your email address',
      },
      registration: {
        required: false,
      },
      display: {
        registration: false,
        login: false,
        user: false,
      },
    },
    email: {
      type: 'string',
      isUpdateable: false,
      invalid: {
        errorMessage: 'Invalid email address.',
        invalidParams: [
          {
            value: '',
          },
          {
            value: 'aaaaaaa',
          },
          {
            value: '000000000',
          },
          {
            value: 'hhhh@hh.',
          },
        ],
      },
      registration: {
        required: true,
        errorMessage: 'Invalid email address',
        unique: {
          required: true,
          errorMessage: 'Email already registered... If you are the owner please try logging in',
        },
      },
      login: {
        reuired: false,
      },
      display: {
        registration: true,
        login: true,
        user: true,
      },
    },
    first_name: {
      type: 'string',
      isUpdateable: true,
      invalid: {
        errorMessage: 'First name should be above 3 charcters and below 255 characters.',
        invalidParams: [
          {
            value: '',
          },
          {
            value: 'aa',
          },
          {
            value: String('character_is_longer_than_the_255_limit_').repeat(30),
          },
          {
            value: 'obinna okafor',
            errorMessage: 'Invalid characters as first name',
          },
        ],
      },
      registration: {
        required: true,
        errorMessage: 'Invalid first name',
      },
      login: {
        reuired: false,
      },
      display: {
        registration: true,
        login: true,
        user: true,
      },
    },
    last_name: {
      type: 'string',
      isUpdateable: true,
      invalid: {
        errorMessage: 'Last name should be above 3 charcters and below 255 characters.',
        invalidParams: [
          {
            value: '',
          },
          {
            value: 'aa',
          },
          {
            value: String('character_is_longer_than_the_255_limit_').repeat(30),
          },
          {
            value: 'obinna okafor',
            errorMessage: 'Invalid characters as last name',
          },
        ],
      },
      registration: {
        required: true,
        errorMessage: 'Invalid last name',
      },
      login: {
        reuired: false,
      },
      display: {
        registration: true,
        login: true,
        user: true,
      },
    },
    password: {
      type: 'string',
      isUpdateable: true,
      invalid: {
        errorMessage: 'Password should be above 3 charcters and below 255 characters.',
        invalidParams: [
          {
            value: '',
          },
          {
            value: 'aa',
          },
          {
            value: String('character_is_longer_than_the_255_limit_').repeat(30),
          },
        ],
      },
      registration: {
        required: true,
        errorMessage: 'Invalid password... please insert your password',
      },
      login: {
        required: true,
        errorMessage: 'Invalid password... please insert your password',
      },
      display: {
        registration: false,
        login: false,
        user: false,
      },
    },
    password_confirmation: {
      type: 'string',
      isUpdateable: false,
      invalid: {
        errorMessage: 'Passwords does not match',
        invalidParams: [
          {
            value: '',
          },
          {
            value: 'aa',
          },
          {
            value: String('character_is_longer_than_the_255_limit_').repeat(30),
          },
        ],
      },
      registration: {
        required: true,
        errorMessage: 'Password confirmation is required',
      },
      login: {
        reuired: false,
      },
      display: {
        registration: false,
        login: false,
        user: false,
      },
    },
    phoneNumber: {
      type: 'string',
      isUpdateable: true,
      invalid: {
        errorMessage: 'Phone number must be 11 digits or at most 15 digits only',
        invalidParams: [
          {
            value: 'atextphonenumberisbeing',
          },
          {
            value: 'mixture00000000000',
          },
          {
            value: '000000000',
          },
        ],
      },
      registration: {
        required: true,
        errorMessage: 'Invalid phone number',
      },
      login: {
        reuired: false,
      },
      display: {
        registration: true,
        login: true,
        user: true,
      },
    },
    address: {
      type: 'string',
      isUpdateable: true,
      invalid: {
        errorMessage: 'Invalid address.. please insert a valid address',
        invalidParams: [
          {
            value: '   an_invalid_address',
          },
        ],
      },
      registration: {
        required: true,
        errorMessage: 'Invalid address',
      },
      login: {
        reuired: false,
      },
      display: {
        registration: true,
        login: true,
        user: true,
      },
    },
    is_verified: {
      type: 'boolean',
      isUpdateable: false,
      registration: {
        required: false,
      },
      login: {
        reuired: false,
      },
      default: false,
      display: {
        registration: true,
        login: true,
        user: true,
      },
    },
    is_blocked: {
      type: 'boolean',
      isUpdateable: false,
      default: false,
      registration: {
        required: false,
      },
      login: {
        reuired: false,
      },
      display: {
        registration: true,
        login: true,
        user: true,
      },
    },
    is_admin: {
      type: 'boolean',
      isUpdateable: false,
      default: false,
      registration: {
        required: false,
      },
      login: {
        reuired: false,
      },
      display: {
        registration: true,
        login: true,
        user: true,
      },
    },
    id: {
      type: 'number',
      isUpdateable: false,
      registration: {
        required: false,
      },
      login: {
        reuired: false,
      },
      display: {
        registration: true,
        login: true,
        user: true,
      },
    },
    created_on: {
      type: 'string',
      isUpdateable: false,
      registration: {
        required: false,
      },
      login: {
        reuired: false,
      },
      display: {
        registration: true,
        login: true,
        user: true,
      },
    },
    token: {
      type: 'string',
      isUpdateable: false,
      registration: {
        required: false,
      },
      login: {
        reuired: false,
      },
      display: {
        registration: true,
        login: true,
        user: false,
      },
    },
  },
};

export default spec;
export const { user: userSpec } = spec;
