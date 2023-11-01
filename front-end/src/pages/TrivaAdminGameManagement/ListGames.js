import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography,  IconButton,
    Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from "@mui/icons-material/Add";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";



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

const ListGames = () => {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  const handleAddGame = () => {
    navigate("/creategames");
  };
  const fetchGames = async () => {
    try {
      const response = await axios.get(
        'https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/games'
      );
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleDeleteGame = async (gameID) => {
    try {
      const response = await axios.delete(
        `https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/games/${gameID}`
      );
      if (response.status === 200) {
        // Game deleted successfully
        setGames(games.filter((game) => game.gameID !== gameID));
        toast.success('Game deleted successfully!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        // Handle deletion failure
        toast.error('Failed to delete the game!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  const handleDeleteConfirmation = (gameID) => {
    toast.dark(
      <div>
        <Typography variant="h6">Are you sure you want to delete this game?</Typography>
        <Button variant="contained" color="primary" onClick={() => handleDeleteGame(gameID)}>
          Yes
        </Button>
        <Button variant="contained" color="secondary" onClick={() => toast.dismiss()}>
          No
        </Button>
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={game.gameID}>
            <Link to={`/game/${game.gameID}`} style={{ textDecoration: 'none' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {game.gameTitle}
                  </Typography>
                  <Typography color="textSecondary">
                    Difficulty: {game.difficultyLevel}
                  </Typography>
                </CardContent>

              </Card>
            </Link>
            <IconButton
                color="secondary"
                aria-label="Delete"
                onClick={() => handleDeleteConfirmation(game.gameID)}
                >
                <DeleteIcon />
              </IconButton>
            {/* <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteConfirmation(game.gameID)}
            >
              Delete Game
            </Button> */}
            
          </Grid>
        ))}
              <Grid item xs={12} sm={6} md={4}>
        <AddCard onClick={handleAddGame}>
          <AddIcon fontSize="large" />
        </AddCard>
      </Grid>
      </Grid>
    </Container>
  );
};

export default ListGames;
