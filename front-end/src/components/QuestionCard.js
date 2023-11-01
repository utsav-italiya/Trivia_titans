import { CardContent, Typography, IconButton } from "@mui/material";
import { EditIcon, DeleteIcon } from "@mui/icons-material";
import StyledCard from "./StyledCard";

const QuestionCard = ({ question, handleEditQuestion, handleDeleteQuestion }) => {
  // Extract properties from the 'question' object
  const { questionID, questionText, category, difficultyLevel, options, correctAnswer, questionHint } = question;

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6">{questionText}</Typography>
        <Typography variant="body1">Category: {category}</Typography>
        <Typography variant="body1">Difficulty Level: {difficultyLevel}</Typography>
        <Typography variant="body2">Options: {options.join(", ")}</Typography>
        <Typography variant="body2">Correct Answer: {correctAnswer}</Typography>
        <Typography variant="body2">Question Hint: {questionHint.join(", ")}</Typography>
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
          onClick={() => handleDeleteQuestion(questionID)}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </StyledCard>
  );
};

export default QuestionCard;
