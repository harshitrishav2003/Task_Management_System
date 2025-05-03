
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, Grid, IconButton, Divider, Box } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import '../App.css';
import Chatbot from "./Bot";

const ClientProfile = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [error, setError] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };
  
  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5005/api/client/${clientId}`);
        setClient(response.data);
      } catch (err) {
        setError("Failed to load client details.");
      }
    };

    fetchClientDetails();
  }, [clientId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container" style={{ paddingTop: "80px" }}> {/* Added padding to avoid header overlap */}
      <Card className="client-profile-card" sx={{ maxWidth: 700, margin: "auto", boxShadow: 5, borderRadius: 3, padding: 3, backgroundColor: "#f9f9f9" }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <AccountCircleIcon sx={{ fontSize: 50, color: "#1976d2" }} />
            <Typography variant="h4" component="div" fontWeight={600}>
              {client.client_name}
            </Typography>
          </Box>
          <Divider sx={{ marginBottom: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" fontWeight={500}>
                <AccountCircleIcon fontSize="small" /> Contact Person:
              </Typography>
              <Typography>{client.contact_person}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" fontWeight={500}>
                <EmailIcon fontSize="small" /> Email:
              </Typography>
              <Typography>{client.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" fontWeight={500}>
                <PhoneIcon fontSize="small" /> Phone:
              </Typography>
              <Typography>{client.phone}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" fontWeight={500}>
                <BusinessIcon fontSize="small" /> Industry:
              </Typography>
              <Typography>{client.industry}</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          <Typography variant="h6" fontWeight={500}>Status:</Typography>
          <Typography>{client.status}</Typography>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          <Typography variant="h6" fontWeight={500}>
            <LocationOnIcon fontSize="small" /> Address:
          </Typography>
          {client?.address ? (
            <Typography>
              {client.address.street}, {client.address.city}, {client.address.state} {client.address.postal_code}, {client.address.country}
            </Typography>
          ) : (
            <Typography>Address information is unavailable.</Typography>
          )}
        </CardContent>
      </Card>
      
      {/* Floating chat button outside the card */}
      <div className="chatbot-toggle" onClick={toggleChatbot}>
        <img src="/bot.png" alt="Chat" className="chat-icon" />
      </div>
      
      {/* Conditional rendering of the Chatbot */}
      {showChatbot && <Chatbot />}
    </div>
  );
};

export default ClientProfile;
