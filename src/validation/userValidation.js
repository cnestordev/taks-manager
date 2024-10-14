import * as Yup from 'yup';

// Base schema for shared fields (username and password)
const baseSchema = Yup.object().shape({
    username: Yup.string().required('Username is required').min(3, 'Username must be at least 3 characters long'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

// Login schema: just uses the base schema
export const LoginSchema = baseSchema;

// Registration schema: extends the base schema with additional fields
export const RegistrationSchema = baseSchema.shape({
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
});
