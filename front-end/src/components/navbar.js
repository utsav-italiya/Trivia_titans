import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

import NotificationIcon from "./NotificationIcon";

const Navbar = () => {
  return (
    // The top navigation bar using Material-UI's AppBar component
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Trivia App
        </Typography>
        <Button component={Link} to="/" color="inherit">
          Home
        </Button>
        <Button component={Link} to="/managequestions" color="inherit">
          Manage Question
        </Button>
        <Button component={Link} to="/managegames" color="inherit">
          Manage Games
        </Button>
        <Button component={Link} to="/user-profile" color="inherit">
          User Profile
        </Button>
        <NotificationIcon />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
