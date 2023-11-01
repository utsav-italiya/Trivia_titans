import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Container,
  Grid,
  Checkbox,
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';


const CreateGames = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [timeFrame, setTimeFrame] = useState('');
  const [gameTitle, setGameTitle] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]); // Added the 'questions' state variable
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        'https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/categories'
      );
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchQuestions = async (category, difficulty) => {
    try {
      const response = await axios.get(
        `https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/categories/${category}/${difficulty}`
      );

      // Assuming the API response contains questionID along with questionText
      const questionsWithData = response.data.map((question) => ({
        questionID: question.questionID, // Assuming questionID is available in the API response
        questionText: question.questionText,
      }));

      setQuestions(questionsWithData);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleCheckboxChange = (event, questionText) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      const selectedQuestion = questions.find((question) => question.questionText === questionText);
      if (selectedQuestion) {
        setSelectedQuestions((prevSelectedQuestions) => [
          ...prevSelectedQuestions,
          selectedQuestion,
        ]);
      }
    } else {
      setSelectedQuestions((prevSelectedQuestions) =>
        prevSelectedQuestions.filter((question) => question.questionText !== questionText)
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare the data to be sent to the API
    const requestData = {
      gameTitle,
      questionID: selectedQuestions.map((question) => question.questionID),
      timeFrame: parseInt(timeFrame),
      category: selectedCategory,
      difficultyLevel: difficulty,
    };

    try {
      // Make the PUT request to the API
      const response = await axios.put(
        'https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/games',
        requestData
      );

      console.log('Data inserted successfully:', response.data);
      toast.success('Game created successfully!');

      // Reset the form after successful submission (optional)
      setGameTitle('');
      setSelectedCategory('');
      setDifficulty('easy');
      setTimeFrame('');
      setSelectedQuestions([]);
      setFormSubmitted(true);
      navigate('/managegames'); // Redirect back to the main page after updating the game

      
    } catch (error) {
      console.error('Error inserting data:', error);
      toast.error('Error creating Game!');
    }
  };

  useEffect(() => {
    // Fetching the count of questions for the selected category and difficulty
    if (selectedCategory && difficulty) {
      fetchQuestions(selectedCategory, difficulty);
    }
  }, [selectedCategory, difficulty]);

  return (
    <Container maxWidth="sm">
      <Grid container direction="column" alignItems="center" spacing={3}>
        <Grid item>
          <h1>Create Game</h1>
        </Grid>
        <Grid item>
          <TextField
            label="Game Title"
            type="text"
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Categories</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">
                <em>Select a category</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Difficulty Level</InputLabel>
            <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <TextField
            label="Time Frame (minutes)"
            type="number"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            InputProps={{ inputProps: { min: 1 } }}
            fullWidth
            required
          />
        </Grid>
        <Grid item>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Questions</InputLabel>
            <Select
              multiple
              value={selectedQuestions.map((question) => question.questionText)}
              onChange={() => {}}
              renderValue={() => null}
            >
              {questions.map((question) => (
                <MenuItem key={question.questionText} value={question.questionText}>
                  <Checkbox
                    checked={selectedQuestions.map((question) => question.questionText).includes(question.questionText)}
                    onChange={(event) => handleCheckboxChange(event, question.questionText)}
                  />
                  {question.questionText}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleSubmit}
            sx={{ marginTop: 3 }}
          >
            Create Game
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateGames;
