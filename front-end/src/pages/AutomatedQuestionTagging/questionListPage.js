import React, { useEffect, useState } from "react";
import {
  Card,
  Chip,
  CardContent,
  Grid,
  Typography,
  Button,
  IconButton,
  Popover,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const AddCard = styled(StyledCard)`
  border: 2px dashed #bdbdbd;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const QuestionListPage = () => {
  const [questions, setQuestions] = useState([]);
  const [editQuestion, setEditQuestion] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        "https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/items"
      );
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  
  const handleAddQuestion = () => {
    navigate("/addquestion");
  };

  const handleDeleteQuestion = (questionID) => {
    toast.dark(
      <div>
        <p>Are you sure you want to delete this question?</p>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            deleteQuestion(questionID);
            toast.dismiss();
          }}
        >
          Yes
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => toast.dismiss()}
        >
          No
        </Button>
      </div>
    );
  };

  const deleteQuestion = async (questionID) => {
    try {
      const response = await fetch(
        `https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/items/${questionID}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        // Refresh the list after successful deletion
        fetchQuestions();
      } else {
        console.error("Failed to delete question.");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleEditQuestion = (question) => {
    setEditQuestion(question);
    setAnchorEl(question.questionID);
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

  const handleEditOptionChange = (event, index) => {
    const { value } = event.target;
    setEditQuestion((prevQuestion) => {
      const options = [...prevQuestion.options];
      options[index] = value;
      return {
        ...prevQuestion,
        options,
      };
    });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch(
        `https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/items/${editQuestion.questionID}`,
        {
          method: "PUT",
          body: JSON.stringify(editQuestion),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.ok) {
        toast.success("Question updated successfully!");

        // Refresh the list after successful update
        fetchQuestions();
      } else {
        toast.error("Failed to update question!");

        console.error("Failed to update question.");
      }
    } catch (error) {
      console.error("Error updating question:", error);
    }
  
    // Close the popover
    setEditQuestion(null);
    setAnchorEl(null);
  };
  

  const isEditPopoverOpen = Boolean(anchorEl);
  const editPopoverId = isEditPopoverOpen ? "edit-popover" : undefined;

  return (
    <Grid container spacing={2}>
      {questions.map((question) => (
        <Grid item key={question.questionID} xs={12} sm={6} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6">{question.questionText}</Typography>
              <Typography variant="body1">
                Category: {question.category}
              </Typography>
              <Typography variant="body1">
                Difficulty Level: {question.difficultyLevel}
              </Typography>
              <Typography variant="body2">
                Options: {question.options.join(", ")}
              </Typography>
              <Typography variant="body2">
                Correct Answer: {question.correctAnswer}
              </Typography>
              <Typography variant="body2">
                Question Hint: {question.questionHint.join(", ")}
              </Typography>
              {/* <Typography variant="body2">
                Tags: {question.questionTags.join(", ")}
              </Typography> */}
              {question.questionTags.length > 0 && (
        <FormControl>
          <div style={{ display: 'grid',  gap: '8px' }}>
            {question.questionTags.map((category, index) => (
              <Chip key={index} label={category} />
            ))}
          </div>
        </FormControl>
      )}
            </CardContent>
            <div>
              <IconButton
                color="primary"
                aria-label="Edit"
                onClick={() => handleEditQuestion(question)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="secondary"
                aria-label="Delete"
                onClick={() => handleDeleteQuestion(question.questionID)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </StyledCard>
        </Grid>
      ))}
      <Grid item xs={12} sm={6} md={4}>
        <AddCard onClick={handleAddQuestion}>
          <AddIcon fontSize="large" />
        </AddCard>
      </Grid>

      {/* Edit Popover */}
      <Popover
        id={editPopoverId}
        open={isEditPopoverOpen}
        anchorEl={anchorEl}
        onClose={() => {
          setEditQuestion(null);
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box p={2}>
          <form onSubmit={handleEditSubmit}>
            <TextField
              name="questionText"
              label="Question Text"
              value={editQuestion?.questionText || ""}
              onChange={handleEditInputChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              name="category"
              label="Category"
              value={editQuestion?.category || ""}
              onChange={handleEditInputChange}
              required
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                name="difficultyLevel"
                value={editQuestion?.difficultyLevel || ""}
                onChange={handleEditInputChange}
                required
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
            {editQuestion?.options.map((option, index) => (
              <TextField
                key={index}
                name={`option${index + 1}`}
                label={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleEditOptionChange(e, index)}
                required
                fullWidth
                margin="normal"
              />
            ))}
            <TextField
              name="correctAnswer"
              label="Correct Answer"
              value={editQuestion?.correctAnswer || ""}
              onChange={handleEditInputChange}
              required
              fullWidth
              margin="normal"
            />
            {editQuestion?.questionHint.map((hint, index) => (
              <TextField
                key={index}
                name={`questionHint${index}`}
                label={`Question Hint ${index + 1}`}
                value={hint}
                onChange={(e) => handleEditInputChange(e, index)}
                fullWidth
                margin="normal"
              />
            ))}
             {editQuestion?.questionTags.length > 0 && (
        <FormControl>
          <div style={{ display: 'grid',  gap: '8px' }}>
            {editQuestion?.questionTags.map((category, index) => (
              <Chip key={index} label={category} />
            ))}
          </div>
        </FormControl>
      )}
            <Box textAlign="center" marginTop={2}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Popover>
    </Grid>
  );
};

export default QuestionListPage;
