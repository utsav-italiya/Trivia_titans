import React from 'react';
import './Leaderboard.css'; // Importing the styles for the Leaderboard component
import Navbar from '../../components/navbar'; // Importing the Navbar component

// Leaderboard component responsible for rendering the leaderboard page
const Leaderboard = () => {
  return (
    <div className="leaderboard-container">
      <Navbar /> 
      <h1>Leaderboard</h1> 
      <iframe
        width="100%" // Setting the iframe width to fill the container
        height="100%" // Setting the iframe height to fill the container
        src="https://lookerstudio.google.com/embed/reporting/27a59d08-53e1-4ebd-8449-0e3e47949165/page/cgBZD" // URL to the embedded leaderboard report
        frameBorder="0" // Removing the border from the iframe
        style={{ border: '0' }} // Additional styling to remove the border
        allowFullScreen // Allowing the iframe to be viewed in full-screen mode
      ></iframe> 
     
    </div>
  );
};

export default Leaderboard; // Exporting the Leaderboard component for use in other parts of the application
