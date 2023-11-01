import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const QuizLogo = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 3, // Add some margin at the bottom
      }}
    >
      <img
        src={require('../assets/QuizLogo.png')} // Update the path to the quiz_icon.png file
        alt="Quiz Icon"
        style={{
          width: 64, // Adjust the width as needed
          height: 64, // Adjust the height as needed
          color: 'primary.main', // Set the icon color to primary color
        }}
      />
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        Trivia Titans
      </Typography>
    </Box>
  );
};

export default QuizLogo;
