import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, IconButton, Avatar} from '@mui/material';
import { styled } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import PhoneIcon from '@mui/icons-material/Phone';
import GenderIcon from '@mui/icons-material/EmojiPeople';
import ImageIcon from '@mui/icons-material/Image';

import axios from 'axios';

const ContainerWrapper = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
}));

const StatCard = styled(Paper)({
  padding: (props) => props.theme.spacing(2),
  textAlign: 'center',
  backgroundColor: '#f0f0f0',
});

const ProfilePicture = styled(Avatar)({
  width: 120,
  height: 120,
  margin: '0 auto',
  marginBottom: 16,
  cursor: 'pointer',
});

const ImageInput = styled('input')({
  display: 'none',
});

const PaperWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
}));

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    birthdate: '',
    gender: '',
    profilePictureUrl: 'https://example.com/default-profile-picture.jpg',
  });


  const [editing, setEditing] = useState(false); 
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleUpload = () => {
    if (profilePicture) {
      const headers = {
        Authorization: localStorage.getItem('accessToken'),
        'Content-Type': 'application/json', 
      };
      
      axios.post('https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/upload-profile-photo', { picture: profilePicture }, { headers })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleSave = () => {
    const userData = {
      name,
      birthdate,
      phone,
    };

    const headers = {
      Authorization: localStorage.getItem('accessToken'),
      'Content-Type': 'application/json', 
    };
    
    axios
      .post('https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/update-user', userData, { headers })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    setEditing(false);
  };

  const [userStats, setUserStats] = useState({
    loss: 0,
    totalPoints: 500,
    win: 5,
    id: '1',
    achievements: 'none',
    totalGamePlayed: 4,
  });

  useEffect(() => {
    const headers = {
      Authorization: localStorage.getItem('accessToken'),
      'Content-Type': 'application/json', 
    };

    axios
      .get('https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/get-user', { headers }) 
      .then((response) => {
        setUserInfo(response.data);
        setName(response.data.name);
        setBirthdate(response.data.birthdate);

        if ('custom:phone' in response.data) {
          setPhone(response.data['custom:phone']);
        } else {
          console.log("'custom:phone' key not found in response.data.");
        }

        if (!response.data.picture) {
          setProfilePicture('https://example.com/default-profile-picture.jpg');
        } else {
          setProfilePicture(response.data.picture);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    const id = localStorage.getItem("UserId");
    console.log("User" + id);
    axios
      .post('https://4medd3y7ri.execute-api.us-east-1.amazonaws.com/get-game-data', { id }, { headers })
      .then((response) => {
        const parsedUserStats = {
          ...response.data,
          loss: parseInt(response.data.loss),
          totalPoints: parseInt(response.data.totalPoints),
          win: parseInt(response.data.win),
          totalGamePlayed: parseInt(response.data.totalGamePlayed),
        };

        setUserStats(parsedUserStats);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const chartData = [
    { name: 'Games Played', value: userStats.totalGamePlayed },
    { name: 'Win', value: userStats.win },
    { name: 'Loss', value: userStats.loss },
    { name: 'Total Points', value: userStats.totalPoints },
  ];

  return (
    <ContainerWrapper maxWidth="lg">
      <PaperWrapper>
        {/* Personal Information */}
        <Typography variant="h5" gutterBottom>
          Personal Information
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ProfilePicture
                alt="Profile Picture"
                src={profilePicture || 'path/to/default-profile-picture.jpg'}
                onClick={() => document.getElementById('imageInput').click()}
              />
              <label htmlFor="imageInput">
                <IconButton component="span">
                  <ImageIcon />
                </IconButton>
              </label>
            </div>
            <ImageInput type="file" id="imageInput" accept="image/*" onChange={handleImageUpload} />
            <IconButton color="primary" onClick={handleUpload}>
              <CloudUploadOutlinedIcon />
            </IconButton>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1">
              <PersonIcon /> Name: {editing ? <input value={name} onChange={(e) => setName(e.target.value)} /> : userInfo.name}
            </Typography>
            <Typography variant="body1">
              <EmailIcon /> Email: {userInfo.email}
            </Typography>
            <Typography variant="body1">
              <CakeIcon /> Birthdate:{' '}
              {editing ? <input value={birthdate} onChange={(e) => setBirthdate(e.target.value)} /> : userInfo.birthdate}
            </Typography>
            <Typography variant="body1">
              <GenderIcon /> Gender: {userInfo.gender}
            </Typography>
            <Typography variant="body1">
              <PhoneIcon /> Phone:{' '}
              {editing ? <input value={phone} onChange={(e) => setPhone(e.target.value)} /> : phone}
            </Typography>
            {editing ? (
              <div>
                <IconButton color="primary" onClick={handleSave}>
                  <SaveIcon /> Save
                </IconButton>
                <IconButton onClick={() => setEditing(false)}>
                  <CancelIcon /> Cancel
                </IconButton>
              </div>
            ) : (
              <IconButton color="primary" onClick={() => setEditing(true)}>
                <EditOutlinedIcon /> Edit
              </IconButton>
            )}
          </Grid>
        </Grid>
      </PaperWrapper>

      <PaperWrapper>
        {/* User Statistics */}
        <Typography variant="h5" gutterBottom>
          User Statistics
        </Typography>
        <Grid container spacing={2}>
          {chartData.map((dataItem) => (
            <Grid item xs={12} sm={6} md={3} key={dataItem.name}>
              <StatCard>
                <Typography variant="h6">{dataItem.name}</Typography>
                <Typography variant="h4">{dataItem.value}</Typography>
              </StatCard>
            </Grid>
          ))}
        </Grid>
      </PaperWrapper>

      <PaperWrapper>
        {/* Statistics Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        {/* Notifications Icon */}

       
      </PaperWrapper>

      {/* Snackbar */}
      
    </ContainerWrapper>
  );
};

export default UserProfile;
