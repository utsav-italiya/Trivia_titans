import React, { useState } from "react";
import { TextField, Chip, Button, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Box } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/items";

const QuestionForm = () => {
  const [question, setQuestion] = useState({
    questionID: "",
    questionText: "",
    category: "",
    correctAnswer: "",
    difficultyLevel: "",
    options: ["", "", "", ""],
    questionHint: ["", "", ""],
  });
  const [tags, setTags] = useState([]);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };
  const handleHintChange = (event, index) => {
    const { value } = event.target;
    setQuestion((prevQuestion) => {
      const questionHint = [...prevQuestion.questionHint];
      questionHint[index] = value;
      return {
        ...prevQuestion,
        questionHint,
      };
    });
  };
  const handleOptionChange = (event, index) => {
    const { value } = event.target;
    setQuestion((prevQuestion) => {
      const options = [...prevQuestion.options];
      options[index] = value;
      return {
        ...prevQuestion,
        options,
      };
    });
  };

  const handleGenerateTags = (event) => {
    event.preventDefault();
    fetchTags();
  };

  const fetchTags = async () => {
    
    try {
      const response = await fetch("https://pythontagingfucntion-hjlycrezba-uc.a.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          
          questionText: question.questionText + '   ' +question.questionText+'    '+ question.questionText
          // questionText: "Who won the FIFA World Cup in 2018?  Who won the FIFA World Cup in 2018?  Who won the FIFA World Cup in 2018? "
        }),
      });
      console.log(response)
      const responseData = await response.json();
      console.log(responseData.Categories)
      if (responseData && responseData.Categories) {
        // Handle success
        setTags(responseData.Categories);

        toast.success("Tags fetched successfully!");
  
        
      } else {
        // Handle error
        toast.error("Failed to fetch tags.");
  
      }
    } catch (error) {
      toast.error("Failed to fetch tags.");
  
      console.error("Failed to fetch tags:", error);
    }


  };
  // const useStyles = makeStyles((theme) => ({
  //   chip: {
  //     margin: theme.spacing(0.5),
  //     backgroundColor: theme.palette.primary.main,
  //     color: '#fff',
  //   },
  // }));
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionID: question.questionID,
          questionText: question.questionText,
          category: question.category,
          correctAnswer: question.correctAnswer,
          difficultyLevel: question.difficultyLevel,
          options: question.options.filter((option) => option.trim() !== ""),
          questionHint: question.questionHint.filter((hint) => hint.trim() !== ""),
          questionTags: tags
        }),
      });
  
      if (response.ok) {
        // Handle success
        toast.success("Question added successfully!");
  
        console.log("Question added successfully!");
        // Reset form
        setQuestion({
          questionID: "",
          questionText: "",
          category: "",
          correctAnswer: "",
          difficultyLevel: "",
          options: ["", "", "", ""],
          questionHint: ["", "", ""],
        });
        setTags({})
      } else {
        // Handle error
        toast.error("Failed to add question.");
  
        console.error("Failed to add question.");
      }
    } catch (error) {
      toast.error("Failed to add question.");
  
      console.error("An error occurred:", error);
    }
  };
  

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={2}
    >
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* <TextField
              name="questionID"
              label="Question ID"
              value={question.questionID}
              onChange={handleInputChange}
              required
              fullWidth
              margin="normal"
            /> */}
            <TextField
              name="questionText"
              label="Question Text"
              value={question.questionText}
              onChange={handleInputChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              name="category"
              label="Category"
              value={question.category}
              onChange={handleInputChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              name="correctAnswer"
              label="Correct Answer"
              value={question.correctAnswer}
              onChange={handleInputChange}
              required
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                name="difficultyLevel"
                value={question.difficultyLevel}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
            {question.options.map((option, index) => (
              <TextField
                key={index}
                name={`option${index + 1}`}
                label={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(e, index)}
                required
                fullWidth
                margin="normal"
              />
            ))}
            {question.questionHint.map((hint, index) => (
              <TextField
                key={index}
                name={`questionHint${index}`}
                label={`Question Hint ${index + 1}`}
                value={hint}
                onChange={(e) => handleHintChange(e, index)}
                fullWidth
                margin="normal"
              />
            ))}
            <Box textAlign="center" marginTop={2}>
 
</Box>
{tags.length > 0 && (
        <FormControl>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(5, 1fr)`, gap: '8px' }}>
            {tags.map((category, index) => (
              <Chip key={index} label={category} />
            ))}
          </div>
        </FormControl>
      )}

<Button onClick={handleGenerateTags} variant="contained" color="secondary">
    Generate Tags
  </Button>
            <Box textAlign="center" marginTop={2}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QuestionForm;
