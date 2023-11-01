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
import axios from 'axios';
import QuizLogo from '../../components/QuizLogo';

const defaultTheme = createTheme();

const QuestionAnswerPage = () => {
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
  });

  const questions = [
    "What is your favorite dish?",
    "What is your favorite movie?",
    "What is your favorite hobby?",
  ];

  const userId = localStorage.getItem('UserId');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://app-szvap77ria-uc.a.run.app/store-user-response', {
        userID: userId,
        'Q&A': answers,
      });

      if (response.data.isAdded) {
        console.log('Question and Answer submission successful:', response.data);
        navigate('/login');
      } else {
        console.error('Question and Answer submission failed:', response.data);
      }
    } catch (error) {
      console.error('Error occurred during Question and Answer submission:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

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
                Register Question & Answer
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ marginBottom: '8px' }}> {questions[0]}</Typography>
                <TextField
                  required
                  fullWidth
                  id="q1"
                  label="Answer 1"
                  name="q1"
                  value={answers.q1}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ marginBottom: '8px' }}> {questions[1]}</Typography>
                <TextField
                  required
                  fullWidth
                  id="q2"
                  label="Answer 2"
                  name="q2"
                  value={answers.q2}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ marginBottom: '8px' }}> {questions[2]}</Typography>
                <TextField
                  required
                  fullWidth
                  id="q3"
                  label="Answer 3"
                  name="q3"
                  value={answers.q3}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Submit
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={NavLink} to="/login" variant="body2">
                  Back to Sign In
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default QuestionAnswerPage;
