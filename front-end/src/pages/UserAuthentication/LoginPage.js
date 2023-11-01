import React from 'react';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import QuizLogo from '../../components/QuizLogo';

const defaultTheme = createTheme();

const LoginPage = () => {
  const navigate = useNavigate();

  const loginValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    q1: Yup.string().required('Answer to Question 1 is required'),
    q2: Yup.string().required('Answer to Question 2 is required'),
    q3: Yup.string().required('Answer to Question 3 is required'),
  });

  const questions = [
    "What is your favorite dish?",
    "What is your favorite movie?",
    "What is your favorite hobby?",
  ];

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      q1: '',
      q2: '',
      q3: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        const loginResponse = await axios.post('https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/login', {
          userId: values.email,
          password: values.password,
        });

        if (loginResponse.data.message.accessToken) {
          const qaResponse = await axios.post('https://app-szvap77ria-uc.a.run.app/validate-answer', {
            userID: loginResponse.data.message.userId,
            'Q&A': {
              q1: values.q1,
              q2: values.q2,
              q3: values.q3,
            },
          });

          if (qaResponse.data.isValid) {
            toast.success('Question and answer validation successful!');
            localStorage.setItem('accessToken', loginResponse.data.message.accessToken);
            localStorage.setItem('UserId', loginResponse.data.message.userId);
            localStorage.setItem('userEmail', loginResponse.data.message.email);
            localStorage.setItem('mfaVerified', true);
            navigate('/home');
          } else {
            toast.error('Answers are wrong!');
          }
        } else {
          toast.error('Email or password invalid!');
        }
      } catch (error) {
        console.error('Error occurred during login:', error);
        toast.error('Error occurred during login');
      }
    },
  });

  const { handleSubmit, handleChange, values, errors, touched } = formik;

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
                Log In
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="email"
                  name="email"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoFocus
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
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
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Grid>
            </Grid>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={NavLink} to="/forgot-password" variant="body2">
                  Forgot Password?
                </Link>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #ccc' }}>
              <Typography variant="body1" sx={{ marginBottom: '8px' }}>
                Question 1: {questions[0]}
              </Typography>
              <TextField
                required
                fullWidth
                name="q1"
                id="q1"
                value={values.q1}
                onChange={handleChange}
                error={touched.q1 && Boolean(errors.q1)}
                helperText={touched.q1 && errors.q1}
              />
              <Typography variant="body1" sx={{ marginBottom: '8px', mt: 2 }}>
                Question 2: {questions[1]}
              </Typography>
              <TextField
                required
                fullWidth
                name="q2"
                id="q2"
                value={values.q2}
                onChange={handleChange}
                error={touched.q2 && Boolean(errors.q2)}
                helperText={touched.q2 && errors.q2}
              />
              <Typography variant="body1" sx={{ marginBottom: '8px', mt: 2 }}>
                Question 3: {questions[2]}
              </Typography>
              <TextField
                required
                fullWidth
                name="q3"
                id="q3"
                value={values.q3}
                onChange={handleChange}
                error={touched.q3 && Boolean(errors.q3)}
                helperText={touched.q3 && errors.q3}
              />
            </Box>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Log In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={NavLink} to="/" variant="body2">
                  Don't have an account? Sign up
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

export default LoginPage;
