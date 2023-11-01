import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Input, List } from 'antd';
import Chat from './Chat';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InGame = () => {
  const styles = {
    messageContent: {
      fontWeight: 'bold',
      marginLeft: '10px', 
  },
  userEmail: {
      color: '#888', 
      marginRight: 'auto', 
  },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: "hidden"
    },
    topDiv: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '100px',
      width: '100%',
      backgroundColor: '#1203ad',
      padding: '10px',
      color: 'white',
      fontSize: '20px'
    },
    bottomDiv: {
      flexGrow: 1,
      display: 'flex',
      backgroundColor: '#6f8ee4',
    },
    bottomLeft: {
        width: '20%',
        height: "100%",
        backgroundColor: '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
      chatList: {
        overflowY: 'auto',
        height: 'calc(100% - 80px)', 

        padding: '10px',
      },
      chatControls: {
        alignSelf: "flex-end",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
      },
    bottomRight: {
      flexGrow: 1,
      backgroundColor: '#f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    button: {
      margin: '10px',
      padding: '10px',
      fontSize: '18px',
      width: '200px', 
      overflow: 'hidden', 
      textOverflow: 'ellipsis', 
      whiteSpace: 'nowrap',
    },
    question: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    gameEnd: {
      fontSize: '30px',
      fontWeight: 'bold',
    },
    timer: {
      marginRight: '20px',
    },
  };

 // Hook to navigate between pages
const navigate = useNavigate();

// State hook to manage questions
const [questions, setQuestions] = useState([]);

// Fetching questions from the API using useEffect on mount
useEffect(() => {
  axios.get('https://wuzrd9lvhj.execute-api.us-east-1.amazonaws.com/items')
    .then(response => {
      console.log("questions from api", response.data); // Update state with fetched questions
      setQuestions(response.data);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));

 }, []);


 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');

 // Hardcoded values from local storage
  const user = localStorage.getItem("userEmail");
  console.log("User ID is " + user);
  const admin_email = localStorage.getItem("admin"); 
  const email = localStorage.getItem('userEmail');
  const team_name = localStorage.getItem("team_name");
  const game_id = localStorage.getItem("game_id");
  
  // State hook for the game logic
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameEnded, setGameEnded] = useState(false);

  const [score, setScore] = useState(0);

  useEffect(() => {
    if (gameEnded) {
      const timer = setTimeout(() => {
        updateTeamStats();
        console.log("Team stats updated after game ended.");
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [gameEnded]);

  const updateUserStats = () => {
    // Get the required params
    const params = {
      user_id: email,
      game_id: game_id,
      score: score
    }
  
    // Make the API request
    axios.post('https://us-central1-serverless-chat-sdp13.cloudfunctions.net/updateUserStats',params)
    .then(response => {
      console.log("User stats updated successfully:", response.data);
    })
    .catch(error => {
      console.error('Error updating user stats:', error);
    });
  };
  
  const updateUserTable = () => {
    // Get the required params
    const params = {
      userId: localStorage.getItem('UserId'),
      loss: 0,
      totalPoints: score,
      win: 0,
      totalGamePlayed: 1
    }
  
    // Make the API request
    axios.post('https://4medd3y7ri.execute-api.us-east-1.amazonaws.com/update-game-data',params)
    .then(response => {
      console.log("User Game data updated successfully:", response.data);
    })
    .catch(error => {
      console.error('Error updating user game data:', error);
    });
  };

  const updateTeamStats = () => {
    if (email !== admin_email) return; // Only allow admin to update the team's score
  
    const params = {
      team_name: team_name,
      game_id: game_id,
    }
  
    axios.post('https://us-central1-serverless-chat-sdp13.cloudfunctions.net/updateTeamStats', params)
      .then(response => {
        console.log("Team stats updated successfully:", response.data);
      })
      .catch(error => {
        console.error('Error updating team stats:', error);
      });
  }
  

  
  const handleOptionClick = (option) => {
    if (!answered) {
      setSelectedOption(option);
      setCorrectAnswer(questions[currentQuestionIndex].correctAnswer);
      setAnswered(true);
    
      // Check and update score if the answer is correct
      if (option === questions[currentQuestionIndex].correctAnswer) {
        setScore(prevScore => prevScore + 10);
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        setSelectedOption(null);  
        setAnswered(false);  
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setCorrectAnswer(questions[currentQuestionIndex].correctAnswer);
          setIsModalOpen(true); // Make sure to show the modal here
          setHintIndex(null);
          setTimeLeft(20);
        } else {
          setGameEnded(true);
          if(gameEnded){
            updateUserStats();
            updateUserTable();
            console.log("Game Ended! Final Score:", score);
            
            axios.post('https://us-central1-serverless-chat-sdp13.cloudfunctions.net/leaderboard', {
              "name": "Hello World"
            })
      .then(response => {
        console.log("Leader board initiated successfully", response.data);
      })
      .catch(error => {
        console.error('Error in Leaderboard:', error);
      });

            navigate("/leaderboard")
          }
          setIsModalOpen(true); //show the modal when the game ends
          clearInterval(timer);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, currentQuestionIndex, gameEnded]);
  

 

  const [hintIndex, setHintIndex] = useState(null);

  const handleShowHint = () => {
  if (hintIndex === null) {
    setHintIndex(0);
  } else if (hintIndex < questions[currentQuestionIndex].questionHint.length - 1) {
    setHintIndex((prevHintIndex) => prevHintIndex + 1);
  } else {
    alert("No more hints available.");
  }
};



  const [msg, setMsg] = useState('');
  const [msgHistory, setMsgHistory] = useState([]);

  const handleChatClick = (e) => {
    e.preventDefault();

    if (msg) {
      setMsgHistory((prev) => [...prev, { content: msg, userEmail: email }]);
      setMsg('');
  }

  }

  return (
    <div style={styles.container}>
      <div style={styles.topDiv}>
      <div>Score: {score}</div>  {/* Display score here */}
        <div style={styles.timer}>
          {gameEnded ? 'Game Ended' : `Time Remaining: ${timeLeft}s`}
        </div>
      </div>
      <div style={styles.bottomDiv}>
        <div style={styles.bottomLeft}>  
          <Chat />        
              </div>
        <div style={styles.bottomRight}>
          {!gameEnded  && questions[currentQuestionIndex] ? (
            <>
              <div style={styles.question}>
  {questions[currentQuestionIndex].questionText}
</div>
{questions[currentQuestionIndex].questionHint && hintIndex < questions[currentQuestionIndex].questionHint.length ? (
  <div>
    <span><h2>Hint:  {questions[currentQuestionIndex].questionHint[hintIndex]}</h2></span>
    <button onClick={handleShowHint} style={styles.button}>Show hint</button>
  </div>
) : (
  <button onClick={handleShowHint} style={styles.button}>Show hint</button>
)}
{questions[currentQuestionIndex].options.map((option, index) => (
  <button 
    key={index}
    onClick={() => handleOptionClick(option)}
    style={{
      ...styles.button,
      backgroundColor: answered ? (selectedOption === option ? (option === questions[currentQuestionIndex].correctAnswer ? 'green' : 'red') : 'initial') : 'initial',
      cursor: answered ? 'not-allowed' : 'pointer',
    }}
    disabled={answered}
  >
    {option}
  </button>
))}

            </>
          ) : (
            <div style={styles.gameEnd}>Game Ended</div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Correct Answer"
        style={{
            overlay: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
            content: {
              position: 'relative',
              width: '300px',
              height: '300px',
            },
          }}
      >
        <h2>Correct Answer</h2>
        <p>{correctAnswer}</p>
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default InGame;
