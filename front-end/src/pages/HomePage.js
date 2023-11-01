import React from 'react';
import {Button, Card } from '@mui/material';
import { Link } from 'react-router-dom';




const HomePage = () => {
  const tabButtonStyle = {
    width: '200px',
    height: '100px',
    margin: '10px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: 'inherit',
  };


  return (
    <div style={{ display: 'flex' }}>

      <Card style={tabButtonStyle}>
        <Link to="/user-profile" style={tabButtonStyle}>
          <Button variant="contained">User Profile</Button>
        </Link>
      </Card>


    </div>
  );
};

export default HomePage;
