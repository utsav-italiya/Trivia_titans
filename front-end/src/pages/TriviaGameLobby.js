import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const TriviaGameLobby = () => {
  const [filter, setFilter] = useState({
    category: 'all',
    difficulty: 'all',
    timeFrame: 'all',
  });
  const navigate = useNavigate(); 
  const [gameData, setGameData] = useState([]);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await axios.get('https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/games');
        setGameData(response.data);
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    fetchGameData();
  }, []);

  const handleJoinGame = async (gameID) => {
    try {
      // Make an API call to check if the team exists
      const email = localStorage.getItem('userEmail');
      const response = await axios.post(`https://8ymtebk0n0.execute-api.us-east-1.amazonaws.com/test/check_member?email=${email}`);
      console.log(response);
      if(Object.keys(response.data.body).length === 0){
        navigate('/create-team');
      }
      const data = JSON.parse(response.data.body)
      console.log(data)
      const team = data;
      console.log(data.team_name)
      
      if (team.team_name) {
        const body ={
            team_name:team.team_name['S'],
            game_id:gameID
        }
        const teamStats = axios.post('https://us-central1-serverless-chat-sdp13.cloudfunctions.net/addTeamStats',body);
        const userBody={
            team_name:team.team_name['S'],
            game_id:gameID,
            user_id:localStorage.getItem('userEmail')
        }
        const userStats = axios.post('https://us-central1-serverless-chat-sdp13.cloudfunctions.net/addUserStats',userBody);
        localStorage.setItem('game_id',gameID);
        localStorage.setItem('admin', team.admin['S']);
        localStorage.setItem('team_name',team.team_name['S']);
        navigate('/game')

      }
    
       
    } catch (error) {
      console.error('Error checking team:', error);
    }
  };
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredGames = gameData.filter((game) => {
    const isCategoryMatch = filter.category === 'all' || game.category === filter.category;
    const isDifficultyMatch = filter.difficulty === 'all' || game.difficultyLevel === filter.difficulty;
    const isTimeFrameMatch = filter.timeFrame === 'all' || game.timeFrame <= parseInt(filter.timeFrame);
    return isCategoryMatch && isDifficultyMatch && isTimeFrameMatch;
  });

  const theme = createTheme({
    palette: {
      primary: {
        main: '#2196f3',
      },
    },
  });

  const listItemStyle = {
    marginBottom: '16px',
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box mt={3} textAlign="center">
          <Typography variant="h4">Trivia Game Lobby</Typography>
          <Box mt={3} display="flex" justifyContent="center" alignItems="center">
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select name="category" value={filter.category} onChange={handleFilterChange} label="Category">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="anime">Anime</MenuItem>
                <MenuItem value="sports">Sports</MenuItem>
                {/* Add other categories as needed */}
              </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select name="difficulty" value={filter.difficulty} onChange={handleFilterChange} label="Difficulty">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
                {/* Add other difficulty levels as needed */}
              </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
              <InputLabel>Time Frame (seconds)</InputLabel>
              <Select name="timeFrame" value={filter.timeFrame} onChange={handleFilterChange} label="Time Frame">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="15">15</MenuItem>
                {/* Add other time frame options as needed */}
              </Select>
            </FormControl>
          </Box>
          <Box mt={3}>
            {filteredGames.length === 0 ? (
              <Typography variant="body1">No trivia games available based on the selected filters.</Typography>
            ) : (
              filteredGames.map((game) => (
                <Paper key={game.gameID} elevation={3} sx={{ padding: '16px', marginBottom: '16px' }}>
                  <Box sx={listItemStyle}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.5rem', mb: '8px' }}>
                      {game.gameTitle}
                    </Typography>
                    <Typography variant="body1">Category: {game.category}</Typography>
                    <Typography variant="body1">Difficulty Level: {game.difficultyLevel}</Typography>
                    <Typography variant="body1">Time Frame (seconds): {game.timeFrame}</Typography>
                    <Box mt={2} display="flex" justifyContent="center">
                      {/* Add Join Game and Start Game buttons */}
                      <Button  onClick={() => handleJoinGame(game.gameID)} variant="contained" color="primary" sx={{ marginRight: '8px' }}>
                        Join Game
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              ))
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default TriviaGameLobby;
