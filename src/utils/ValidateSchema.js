import * as Yup from 'yup';

export const SigninSchema = Yup.object({
  email: Yup.string()
    .email('Please re-enter your email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const ResetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  rePassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('rePassword is required'),
});

export const ForgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Please enter correct email format	')
    .required('Email is required'),
});

export const AddUserSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  email: Yup.string()
    .email('Please enter correct email format	')
    .required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string(),
  country: Yup.string(),
  roles: Yup.array()
    .required('Role is required')
    .of(
      Yup.object().shape({
        id: Yup.string(),
        text: Yup.string(),
      }),
    ),

  color: Yup.string(),
  bio: Yup.string(),
  newPassword: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref('newPassword'), null],
    'Passwords must match',
  ),
  category: Yup.string(),
  tier: Yup.string(),
});

export const EditUserSchema = Yup.object().shape(
  {
    username: Yup.string().required('Username is required'),
    email: Yup.string()
      .email('Please enter correct email format	')
      .required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string(),
    country: Yup.string(),
    // roles: Yup.array()
    //   .required('Role is required')
    //   .of(
    //     Yup.object().shape({
    //       id: Yup.string(),
    //       text: Yup.string(),
    //     }),
    //   ),
    color: Yup.string(),
    bio: Yup.string(),
    newPassword: Yup.string()
      .notRequired()
      .when('newPassword', {
        is: (val) => {
          return val && val.length > 0;
        },
        then: (rule) => rule.min(6, 'Password must be at least 6 characters'),
      }),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .when('newPassword', {
        is: (val) => val && val.length > 0,
        then: Yup.string().required('Confirm password is required'),
      }),
    category: Yup.string(),
    tier: Yup.string(),
  },
  [
    // Add Cyclic deps here because when require itself
    ['newPassword', 'newPassword'],
  ],
);
export const AddRoleSchema = Yup.object({
  name: Yup.string().required('Role name is required'),
  description: Yup.string().required('Role description is required'),
});

export const addCampaignSchema = Yup.object({
  name: Yup.string().required('Campaign Name is required'),
});

export const addModelSchema = Yup.object({
  name: Yup.string().required('Model Name is required'),
});

export const fileTrainingSetting = Yup.object({
  keyword: Yup.string().required('Keyword is required'),
});
