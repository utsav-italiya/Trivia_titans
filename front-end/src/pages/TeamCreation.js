import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container, Box, Card, CardContent } from '@mui/material';


const TeamCreation = () => {
  const [suggestedTeamName, setSuggestedTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const SuccessPopup = ({ onClose }) => {
    return (
      <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '16px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', borderRadius: '4px' }}>
        <Typography variant="h6" gutterBottom>
          Invites Sent Successfully!
        </Typography>
        <Button variant="contained" color="primary" onClick={onClose}>
          OK
        </Button>
      </Box>
    );
  };
  
  const handleSuggestTeamName = async () => {
    try {
      const response = await axios.get('https://8ymtebk0n0.execute-api.us-east-1.amazonaws.com/test/team_name');
      console.log(response);
      const data=JSON.parse(response.data.body);
      setSuggestedTeamName(data.team_name);
    } catch (error) {
      console.error('Error fetching suggested team name:', error);
    }
  };

  const handleChangeEmail = (event, index) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = event.target.value;
    setTeamMembers(updatedMembers);
  };

  const handleAddMember = () => {
    if (email.trim() !== '') {
      setTeamMembers((prevMembers) => [...prevMembers, email]);
      setEmail('');
    }
  };

  const handleSubmitInvites = async (event) => {
    event.preventDefault();
    try {
      const body = {
        team_name: suggestedTeamName,
        inviters: teamMembers,
        creator: localStorage.getItem("userEmail"),
      };
      const response = await axios.post('https://8ymtebk0n0.execute-api.us-east-1.amazonaws.com/test/send-invites', body);
      console.log(response);
      console.log('Invites sent and stored successfully:', response.data);
      setEmail('');
      setTeamMembers([]);
      setIsSuccess(true); 
    } catch (error) {
      console.error('Error sending invites:', error);
    }
  };

  const handleCloseSuccessPopup = () => {
    setIsSuccess(false); // Close the success popup
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Card sx={{ boxShadow: 4, backgroundColor: '#F8F8F8', width: 400, height: 500 }}>
      <CardContent>
        <Box mt={3} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Team
          </Typography>
          <Button variant="contained" color="primary" onClick={handleSuggestTeamName}>
            Create Team Name
          </Button>
            {suggestedTeamName && (
              <Box mt={3}>
                <Typography variant="h5">Team Name:</Typography>
                <Typography variant="body1">{suggestedTeamName}</Typography>
                <form onSubmit={handleSubmitInvites}>
                  {teamMembers.map((member, index) => (
                    <Box key={index} mt={2}>
                      <TextField
                        label={`Team Member's Email ${index + 1}`}
                        variant="outlined"
                        value={member}
                        onChange={(e) => handleChangeEmail(e, index)}
                        fullWidth
                      />
                    </Box>
                  ))}
                  <Box mt={2}>
                    <TextField
                      label="Team Member's Email"
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                    />
                  </Box>
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button type="button" variant="contained" onClick={handleAddMember}>
                      Add Team Member
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                      Send Invites
                    </Button>
                  </Box>
                </form>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
      {isSuccess && <SuccessPopup onClose={handleCloseSuccessPopup} />}
    </Container>
  );
};

export default TeamCreation;
