import * as Yup from 'yup';

const signUpValidationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    gender: Yup.string().required('Gender is required'),
    birthdate: Yup.string().required('Birthdate is required'),
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Must contain at least 1 number, 1 special character, 1 uppercase letter, and 1 lowercase letter'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  export {
    signUpValidationSchema,
  };