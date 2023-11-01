import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Container, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useNavigate } from 'react-router-dom';

const ViewGameDetails = () => {
  const { gameID } = useParams();
  const [gameDetails, setGameDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGameDetails(gameID);
  }, [gameID]);

  const fetchGameDetails = async (gameID) => {
    try {
      const response = await axios.get(
        `https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/games/${gameID}`
      );
      setGameDetails(response.data);

      if (response.data.questionID && response.data.questionID.length > 0) {
        fetchQuestions(response.data.questionID);
      } else {
        // Handle the case where there are no questions available for the game
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
    }
  };

  const fetchQuestions = async (questionIDs) => {
    try {
      const questionPromises = questionIDs.map(async (questionID) => {
        const response = await axios.get(
          `https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/items/${questionID}`
        );
        return response.data;
      });
      const questions = await Promise.all(questionPromises);
      setQuestions(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleDeleteQuestion = async (questionID) => {
    try {
      const updatedQuestions = questions.filter((question) => question.questionID !== questionID);
      setQuestions(updatedQuestions);

      // Update the game object with the new set of questions
      const updatedGameDetails = {
        ...gameDetails,
        questionID: updatedQuestions.map((question) => question.questionID),
      };

      const response = await axios.put(
        `https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/games/${gameID}`,
        updatedGameDetails
      );

      if (response.status === 200) {
        // Game updated successfully
        setGameDetails(updatedGameDetails);
        console.log('Game updated successfully:', updatedGameDetails);
      } else {
        // Handle update failure
        console.error('Failed to update the game:', response.data);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleUpdateClick = () => {
    navigate(`/updateGame/${gameID}`);
  };

  return (
    <Container maxWidth="md">
      {gameDetails ? (
        <div>
          <Typography variant="h4" component="h2" style={{ textAlign: 'center' }}>
            {gameDetails.gameTitle}
          </Typography>
          {questions.map((question, index) => (
            <div key={index}>
              <Typography variant="h6">Question {index + 1}: {question.questionText}</Typography>
              <Typography variant="body1">
                {question.options.map((option, optionIndex) => (
                  <span key={optionIndex}>{option} {optionIndex % 2 !== 0 ? '\n' : ' '}</span>
                ))}
              </Typography>
              {question.questionHint.map((hint, hintIndex) => (
                <Typography variant="body2" key={hintIndex}>Hint {hintIndex + 1}: {hint}</Typography>
              ))}
              <Typography variant="body2">Correct Answer: {question.correctAnswer}</Typography>
              <IconButton
                aria-label="delete"
                color="secondary"
                onClick={() => handleDeleteQuestion(question.questionID)}
              >
                <DeleteIcon />
              </IconButton>
              <br />
            </div>
          ))}
          <Button variant="contained" color="primary" onClick={handleUpdateClick}>
            Update
          </Button>
        </div>
      ) : (
        <Typography variant="h6">Loading...</Typography>
      )}
    </Container>
  );
};

export default ViewGameDetails;
