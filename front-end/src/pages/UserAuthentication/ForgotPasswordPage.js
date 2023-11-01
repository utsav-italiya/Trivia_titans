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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuizLogo from '../../components/QuizLogo';

const defaultTheme = createTheme();

const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    const forgotPasswordSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: forgotPasswordSchema,
        onSubmit: async (values) => 
        {
            try {
                const forgotPasswordResponse = await axios.post(
                    'https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/forgot-password', 
                    {
                        userId: values.email,
                    }
                );

                if (forgotPasswordResponse.data.message === 'Password reset initiated') {
                    localStorage.setItem('userEmail', values.email);
                    navigate('/reset-password');
                } else {
                    toast.error('Password reset failed');
                }
            } catch (error) {
                console.error('Error occurred during forgot password:', error);
                toast.error('Error occurred during forgot password');
            }
        }});

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
                                Forgot Password
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
                        </Grid>

                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Submit
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

export default ForgotPasswordPage;
