import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useFormik } from 'formik';
import { NavLink, useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import { signUpValidationSchema } from '../../utils/validationSchema';
import axios from 'axios';
import QuizLogo from '../../components/QuizLogo';
import { Google, Facebook } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginSocialGoogle, LoginSocialFacebook } from "reactjs-social-login";
import KommunicateChat from './../Chatbot';

const defaultTheme = createTheme();

const SignUp = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      gender: '',
      birthdate: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/register', {
          name: values.name,
          email: values.email,
          gender: values.gender,
          birthdate: values.birthdate,
          password: values.password,
          'confirm password': values.confirmPassword,
        });

        if (response.data.userId) {
          try {
            const res = await axios.post('https://4medd3y7ri.execute-api.us-east-1.amazonaws.com/save-user', {
              id: response.data.userId
            });

            if (res.data.id) {
              console.log('Question and Answer submission successful:', res.data);
            } else {
              console.error('Question and Answer submission failed:', res.data);
            }
          } catch (error) {
            console.error('Error occurred during Question and Answer submission:', error);
          }

          localStorage.setItem('UserId', response.data.userId);
          localStorage.setItem('mfaVerified', false);
          localStorage.setItem('userEmail', values.email);
          toast.success('Sign up successful! Please verify your email.');
          navigate('/verify-email');
        } else {
          console.log('error is ', response.data);
          toast.error('Sign up failed. Please try again later.');
        }
      } catch (error) {
        console.log(error);
        toast.error('An error occurred. Please try again later.');
      }
    },
  },
  );

  const { handleSubmit, handleChange, values, errors, touched } = formik;

  const handleGoogleSignUp = async (response) => {
    try {
      const requestBody = {
        'confirm password': "Trivia@123",
        email: response?.email,
        password: "Trivia@123",
        name: response?.name,
        gender: "M",
        birthdate:"1990-01-01"
      };
      const responseData = await axios.post('https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/register', requestBody);
      console.log("res",responseData)
      if (responseData?.data?.error?.code === "UsernameExistsException") {
        const loginRequestData = {
          userId: response?.email,
          password: "Trivia@123",
        };
        const loginResponse = await axios.post('https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/login', loginRequestData);
        console.log("hello",loginResponse)
        if (loginResponse) {
          console.log("hello world")
          localStorage.setItem('accessToken', loginResponse.data.message.accessToken);
          localStorage.setItem('UserId', loginResponse.data.message.userId);
          localStorage.setItem('userEmail', loginResponse.data.message.email);
          localStorage.setItem("mfaVerified", true);
          toast.success("Login Success!");
          navigate("/home");
        } else {
          toast.error("Internal Server Error.");
          navigate("/login");
        }
      } else {
        console.log("hello",!responseData?.data?.error)
        if (!responseData?.data?.error) {

          console.log(responseData.data)
          if (responseData.data.userId) {
            try {
              const res = await axios.post('https://4medd3y7ri.execute-api.us-east-1.amazonaws.com/save-user', {
                id: responseData.data.userId
              });
  
              if (res.data.id) {
                console.log('Question and Answer submission successful:', res.data);
              } else {
                console.error('Question and Answer submission failed:', res.data);
              }
            } catch (error) {
              console.error('Error occurred during Question and Answer submission:', error);
            }
          } else {
            console.log('error is ', response.data);
            toast.error('Sign up failed. Please try again later.');
          }

          console.log("heelo world")
          const verifyEmailResponse = await axios.post('https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/verify-email-withoutcode',
          {email: response?.email}
          );

          console.log("this is verfied email respond",verifyEmailResponse)

          if (!verifyEmailResponse?.data?.error) {
            const loginRequestData = {
              userId: response?.email,
              password: "Trivia@123",
            };

            console.log("hello world")
            const loginResponse = await axios.post('https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/login', loginRequestData);
            if (loginResponse) {
              localStorage.setItem('accessToken', loginResponse.data.message.accessToken);
              localStorage.setItem('UserId', loginResponse.data.message.userId);
              localStorage.setItem('userEmail', loginResponse.data.message.email);
              localStorage.setItem("mfaVerified", true);
              toast.success("Login Success!");
              navigate("/home");
            } else {
              toast.error("Internal Server Error.");
              navigate("/login");
            }
          }
        }
      }
    } catch (error) {
      toast.error("Internal Server Error.");
    }
  };

  const handleFacebookSignUp = async (response) => {
    console.log("################",response);
    try {
      console.log("response", response);
      const requestBody = {
        'confirm password': "Trivia@123",
        email: response?.email,
        password: "Trivia@123",
        name: response?.name,
        gender: "M",
        birthdate:"1990-01-01"
      };
      const responseData = await axios.post('https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/register', requestBody);
      if (responseData?.data?.error?.code === "UsernameExistsException") {
        const loginRequestData = {
          userId: response?.email,
          password: "Trivia@123",
        };
        const loginResponse = await axios.post('https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/login', loginRequestData);
        if (loginResponse) {
          localStorage.setItem('accessToken', loginResponse.data.message.accessToken);
          localStorage.setItem('UserId', loginResponse.data.message.userId);
          localStorage.setItem('userEmail', loginResponse.data.message.email);
          localStorage.setItem("mfaVerified", true);
          toast.success("Login Success!");
          navigate("/home");
        } else {
          toast.error("Internal Server Error.");
          navigate("/login");
        }
      } else {
        if (!responseData?.data?.error) {
          if (responseData.data.userId) {
            try {
              const res = await axios.post('https://4medd3y7ri.execute-api.us-east-1.amazonaws.com/save-user', {
                id: responseData.data.userId
              });
  
              if (res.data.id) {
                console.log('Question and Answer submission successful:', res.data);
              } else {
                console.error('Question and Answer submission failed:', res.data);
              }
            } catch (error) {
              console.error('Error occurred during Question and Answer submission:', error);
            }
          } else {
            console.log('error is ', response.data);
            toast.error('Sign up failed. Please try again later.');
          }
          const verifyEmailRequestBody = {
            email: response?.email,
          };
          const verifyEmailResponse = await axios.post('https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/verify-email-withoutcode',
            verifyEmailRequestBody
          );
          if (!verifyEmailResponse?.data?.error) {
            const loginRequestData = {
              userId: response?.email,
              password: "Trivia@123",
            };
            const loginResponse = await axios.post('https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/login', loginRequestData);
            if (loginResponse) {
              localStorage.setItem('accessToken', loginResponse.data.message.accessToken);
              localStorage.setItem('UserId', loginResponse.data.message.userId);
              localStorage.setItem('userEmail', loginResponse.data.message.email);
              localStorage.setItem("mfaVerified", true);
              toast.success("Login Success!");
              navigate("/home");
            } else {
              toast.error("Internal Server Error.");
              navigate("/login");
            }
          }
        }
      }
    } catch (error) {
      toast.error("Internal Server Error.");
    }
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <QuizLogo />

          <Box
            sx={{
              mt: 3,
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              p: 3,
              maxWidth: 400,
              width: '100%',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar sx={{ m: 'auto', bgcolor: defaultTheme.palette.primary.main }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                Sign up
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <LoginSocialGoogle
                  client_id={
                    "317856908834-j0ta8coh33sv34t8srnc1qslhekua9vk.apps.googleusercontent.com"
                  }
                  scope="openid profile email"
                  discoveryDocs="claims_supported"
                  access_type="offline"
                  onResolve={({ provider, data }) => {
                    handleGoogleSignUp(data);
                  }}
                  onReject={(err) => {
                    console.log(err);
                  }}
                  className="loginwithgoogle"
                >
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mb: 1, bgcolor: '#DB4437', color: '#fff' }}
                    startIcon={<Google />}
                  >
                    Sign up with Google
                  </Button>
                </LoginSocialGoogle>
                <LoginSocialFacebook
                  appId="1705420153240159"
                  onResolve={(response) => {
                    handleFacebookSignUp(response.data)
                  }}
                  onReject={(error) => {
                    console.log(error)
                  }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mb: 3, bgcolor: '#3B5998', color: '#fff' }}
                    startIcon={<Facebook />}
                  >
                    Sign up with Facebook
                  </Button>
                </LoginSocialFacebook>

                <hr style={{ width: '100%', height: '1px', backgroundColor: '#ccc' }} />
              </Box>
            </Box>
            <form onSubmit={handleSubmit}>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    autoFocus
                    value={values.name}
                    onChange={handleChange}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
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
                    id="gender"
                    name="gender"
                    select
                    label="Gender"
                    value={values.gender}
                    onChange={handleChange}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="birthdate"
                    label="Birthdate"
                    type="date"
                    id="birthdate"
                    value={values.birthdate}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: defaultTheme.palette.primary.main, color: '#fff' }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component={NavLink} to="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
        <KommunicateChat />
      </Container>
      <ToastContainer />
    </ThemeProvider >
  );
};

export default SignUp;
