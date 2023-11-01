import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { NavLink, useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import QuizLogo from '../../components/QuizLogo';

const defaultTheme = createTheme();

const ResetPasswordPage = () => {
  const [resetPasswordInProgress, setResetPasswordInProgress] = useState(false);
  const navigate = useNavigate();

  const resetPasswordSchema = Yup.object().shape({
    verificationCode: Yup.string().required('Verification code is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      verificationCode: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      try {
        const userId = localStorage.getItem('userEmail');
        const resetPasswordResponse = await axios.post(
          'https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/reset-password',
          {
            verificationCode: values.verificationCode,
            newPassword: values.password,
            userId: userId,
          }
        );

        console.log(resetPasswordResponse.data);

        if (resetPasswordResponse.data.message === 'Password reset successful') {
          setResetPasswordInProgress(true);
        } else {
          toast.error('Password reset failed');
        }
      } catch (error) {
        console.error('Error occurred during reset password:', error);
        toast.error('Error occurred during reset password');
      }
    },
  });

  const { handleSubmit, handleChange, values, errors, touched } = formik;

  if (resetPasswordInProgress) {
    navigate('/login');
    return null;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <QuizLogo />
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              mt: 3,
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              p: 3,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar sx={{ m: 'auto', bgcolor: defaultTheme.palette.primary.main }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                Reset Password
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="verificationCode"
                  name="verificationCode"
                  required
                  fullWidth
                  id="verificationCode"
                  label="Verification Code"
                  autoFocus
                  value={values.verificationCode}
                  onChange={handleChange}
                  error={touched.verificationCode && Boolean(errors.verificationCode)}
                  helperText={touched.verificationCode && errors.verificationCode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </Grid>
            </Grid>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Reset Password
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={NavLink} to="/login" variant="body2">
                  Back to Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default ResetPasswordPage;
