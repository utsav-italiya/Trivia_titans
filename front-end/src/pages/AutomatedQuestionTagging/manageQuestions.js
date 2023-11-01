import React from "react";
import { Button, Grid } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const ManageQuestionsPage = () => {
  const navigate = useNavigate();

  const handleAddQuestionsClick = () => {
    navigate("/addquestion");
  };

  const buttonStyle = {
    margin: "8px",
    animation: "1s fadeIn",
    // Add custom background colors here
    backgroundColor: {
      addButton: "#43a047",
      viewButton: "#fbc02d",
      deleteButton: "#e53935",
      updateButton: "#1e88e5",
    },
  };

  return (
    <Grid
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container direction="column" spacing={2} alignItems="center">
        <Grid item>
          <Button
            variant="contained"
            onClick={handleAddQuestionsClick}
            startIcon={<AddCircleIcon />}
            style={{
              ...buttonStyle,
              backgroundColor: buttonStyle.backgroundColor.addButton,
            }}
          >
            Add Questions
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<VisibilityIcon />}
            style={{
              ...buttonStyle,
              backgroundColor: buttonStyle.backgroundColor.viewButton,
            }}
          >
            View All Questions
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            style={{
              ...buttonStyle,
              backgroundColor: buttonStyle.backgroundColor.deleteButton,
            }}
          >
            Delete Questions
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            style={{
              ...buttonStyle,
              backgroundColor: buttonStyle.backgroundColor.updateButton,
            }}
          >
            Update Questions
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ManageQuestionsPage;
