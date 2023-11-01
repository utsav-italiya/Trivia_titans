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
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateGame = () => {
  const { gameID } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [timeFrame, setTimeFrame] = useState('');
  const [gameTitle, setGameTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGameDetails(gameID);
    fetchCategories();
  }, [gameID]);

  const fetchGameDetails = async (gameID) => {
    try {
      const response = await axios.get(
        `https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/games/${gameID}`
      );
      const { gameTitle, category, difficultyLevel, timeFrame, questionID } = response.data;
      setGameTitle(gameTitle);
      setSelectedCategory(category);
      setDifficulty(difficultyLevel);
      setTimeFrame(timeFrame);

      if (questionID && questionID.length > 0) {
        fetchQuestionsForGame(category, difficultyLevel, questionID);
      } else {
        setQuestions([]);
        setSelectedQuestions([]);
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
    }
  };

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

  const fetchQuestionsForGame = async (category, difficulty, questionIDs) => {
    try {
      const response = await axios.get(
        `https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/categories/${category}/${difficulty}`
      );

      const questionsWithData = response.data.map((question) => ({
        questionID: question.questionID,
        questionText: question.questionText,
      }));

      setQuestions(questionsWithData);
      setSelectedQuestions(
        questionsWithData.filter((question) => questionIDs.includes(question.questionID))
      );
    } catch (error) {
      console.error('Error fetching questions for game:', error);
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
        `https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/games/${gameID}`,
        requestData
      );

      console.log('Data inserted successfully:', response.data);
      toast.success('Game updated successfully!');

      // Reset the form after successful submission (optional)
      setGameTitle('');
      setSelectedCategory('');
      setDifficulty('');
      setTimeFrame('');
      setSelectedQuestions([]);
      navigate('/managegames'); // Redirect back to the main page after updating the game
    } catch (error) {
      console.error('Error updating data:', error);
      toast.error('Error updating Game!');
    }
  };
  const fetchQuestions = async (category, difficulty) => {
    try {
      const response = await axios.get(
        `https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/categories/${category}/${difficulty}`
      );

      const questionsWithData = response.data.map((question) => ({
        questionID: question.questionID,
        questionText: question.questionText,
      }));

      setQuestions(questionsWithData);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  useEffect(() => {
    // Fetch the count of questions for the selected category and difficulty
    if (selectedCategory && difficulty) {
      fetchQuestions(selectedCategory, difficulty);
    }
  }, [selectedCategory, difficulty]);

  return (
    <Container maxWidth="sm">
      <Grid container direction="column" alignItems="center" spacing={3}>
        <Grid item>
          <h1>Update Game</h1>
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
                    checked={selectedQuestions
                      .map((question) => question.questionText)
                      .includes(question.questionText)}
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
            Update Game
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UpdateGame;
