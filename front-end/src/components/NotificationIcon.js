import React, { useState, useEffect } from "react";
import { IconButton, Badge, Popover, Typography, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Fetch notifications from the server
  const fetchNotifications = () => {
    axios
      .post(process.env.REACT_APP_NOTIFICATION_URL,
        { userId: localStorage.getItem("UserId") },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        setNotifications(response.data);

        // Set newNotification to true if there are new unread notifications
        if (!newNotification && response.data.length > 0) {
          setNewNotification(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  };

  // Fetch notifications on component mount and every 5 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle click on notification icon
  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
    setNewNotification(false);
  };

  // Handle close of the popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Remove a notification by ID
  const removeNotification = (id) => {
    axios
      .post(
        "https://kj0t6mgu49.execute-api.us-east-1.amazonaws.com/update-message-read-status",
        { messageId: id },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(() => {
        // Remove the notification from the list
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification.messageId !== id
          )
        );
      })
      .catch((error) => {
        console.error("Error deleting notifications:", error);
      });
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleNotificationClick}>
        {newNotification ? (
          <Badge badgeContent=" " color="error">
            <NotificationsIcon />
          </Badge>
        ) : (
          <NotificationsIcon />
        )}
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box
          sx={{
            p: 2,
            width: "300px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {notifications.map((notification) => (
            <Box
              key={notification.messageId}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f7f7f7",
                marginBottom: 2,
                padding: 2,
                borderRadius: 2,
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {notification.message}
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => removeNotification(notification.messageId)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationIcon;
