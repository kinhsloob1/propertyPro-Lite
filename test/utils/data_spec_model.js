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
  property: {
    id: {
      type: 'number',
      isUpdateable: false,
      registration: {
        required: false,
      },
      display: {
        property: true,
      },
    },
    description: {
      type: 'string',
      isUpdateable: true,
      invalid: {
        errorMessage: 'description should be above 3 charcters and below 255 characters.',
        invalidParams: [
          {
            value: 'de',
          },
          {
            value: String('a very long property description').repeat(10),
          },
        ],
      },
      registration: {
        required: true,
        errorMessage: 'Invalid property description',
      },
      display: {
        property: true,
      },
    },
    owner: {
      type: 'number',
      isUpdateable: false,
      registration: {
        required: false,
      },
      display: {
        property: true,
      },
    },
    price: {
      type: 'number',
      isUpdateable: true,
      registration: {
        required: true,
        errorMessage: 'Invalid property price',
      },
      display: {
        property: true,
      },
    },
    state: {
      type: 'string',
      isUpdateable: true,
      registration: {
        required: true,
        errorMessage: 'Invalid state or region',
      },
      invalid: {
        errorMessage: 'Invalid state or region. Please insert a valid property region',
        invalidParams: [
          {
            value: 'de',
          },
          {
            value: String('a very long property state / region').repeat(10),
          },
          {
            value: ' space_before_state',
          },
        ],
      },
      display: {
        property: true,
      },
    },
    city: {
      type: 'string',
      isUpdateable: true,
      registration: {
        required: true,
        errorMessage: 'Invalid property city',
      },
      invalid: {
        errorMessage: 'Invalid city. Please insert a valid property city',
        invalidParams: [
          {
            value: 'de',
          },
          {
            value: String('a very long property city inputed').repeat(10),
          },
          {
            value: ' space_before_city',
          },
        ],
      },
      display: {
        property: true,
      },
    },
    address: {
      type: 'string',
      isUpdateable: true,
      registration: {
        required: true,
        errorMessage: 'Invalid property address',
      },
      invalid: {
        errorMessage: 'Invalid address.. address should be above 6 characters and less than 255 characters',
        invalidParams: [
          {
            value: 'de',
          },
          {
            value: String('a very long property address inputed').repeat(10),
          },
          {
            value: ' space_before_address',
          },
        ],
      },
      display: {
        property: true,
      },
    },
    type: {
      type: 'string',
      isUpdateable: true,
      registration: {
        required: true,
        errorMessage: 'Invalid property type',
      },
      invalid: {
        errorMessage: 'Invalid property type... Please select a valid property type',
        invalidParams: [
          {
            value: 'no type',
          },
          {
            value: '3bedroom',
          },
          {
            value: '2bed',
          },
        ],
      },
      display: {
        property: true,
      },
    },
    option: {
      type: 'string',
      isUpdateable: true,
      registration: {
        required: true,
        errorMessage: 'Invalid property option',
      },
      invalid: {
        errorMessage: 'Invalid property option... Please select a valid property option',
        invalidParams: [
          {
            value: 'salesss',
          },
          {
            value: 'rentssss',
          },
          {
            value: ' ',
          },
          {
            value: 'buy',
          },
        ],
      },
      display: {
        property: true,
      },
    },
    images: {
      type: 'string',
      isUpdateable: true,
      registration: {
        required: true,
        errorMessage: 'At least, an image is required',
      },
      invalid: {
        errorMessage: 'Invalid images uploaded',
        invalidParams: [
          {
            value: '/path/to/an/image.jpg',
          },
          {
            value: 'fakeimages',
          },
          {
            value: {},
          },
          {
            value: false,
          },
        ],
      },
      display: {
        property: true,
      },
    },
    location: {
      type: 'string',
      isUpdateable: true,
      registration: {
        required: true,
      },
      invalid: {
        errorMessage: 'Ooops.. invalid location. location can be a string with latitude and logitude seperated by a comma(,) or an object containing both',
        invalidParams: [
          {
            value: '88.444 55.44444',
          },
          {
            value: '88.44444',
          },
          {
            value: ['string', 'another string'],
            errorMessage: 'Ooops.. invalid location. Invalid latitude',
          },
          {
            value: ['string', 116.4647],
            errorMessage: 'Ooops.. invalid location. Invalid latitude',
          },
          {
            value: {
              lat: 80.68,
              log: 145.67,
            },
            errorMessage: 'Ooops.. invalid location. Invalid latitude',
          },
          {
            value: {
              latitude: 'string',
              logitude: 145.67,
            },
            errorMessage: 'Ooops.. invalid location. Invalid latitude',
          },
          {
            value: {
              latitude: 80.456,
              logitude: 'string',
            },
            errorMessage: 'Ooops.. invalid location. Invalid logitude',
          },
          {
            value: [116.4647, 'string'],
            errorMessage: 'Ooops.. invalid location. Invalid logitude',
          },
          {
            value: false,
          },
        ],
      },
      display: {
        property: 'optional',
      },
    },
    created_on: {
      type: 'string',
      isUpdateable: true,
      registration: {
        required: false,
      },
      display: {
        property: true,
      },
    },
  },
};

export default spec;
export const {
  user: userSpec,
  property: propertySpec,
} = spec;
