
import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  Avatar,
  Divider,
} from "@mui/material";
import { PlayCircleOutline, Settings, Person, Code, Security, Dashboard, TrendingUp } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import './HomePage.css';
import Footer from './Footer';
const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};
const stats = [
  { label: "Tasks Completed", value: 45000 },
  { label: "Projects Managed", value: 1800 },
  { label: "Teams Onboarded", value: 350 }
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(to right, #0D1B2A, #1B263B, #415A77)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#000",
        py: 6,
      }}
    >
      {/* Hero Section */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Organize Your Work, Empower Your Team
        </Typography>
        <Typography variant="h5" sx={{ maxWidth: 700, mx: "auto", opacity: 0.9 }}>
          A smarter way to track tasks, manage projects, and boost productivity.
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, maxWidth: 600, mx: "auto", opacity: 0.8 }}>
          Stay on top of your work with real-time updates, intuitive UI, and collaboration tools.
        </Typography>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          {/* <Button
            variant="contained"
            sx={{
              mt: 4,
              px: 5,
              py: 1.5,
              fontSize: "1.2rem",
              bgcolor: "#FFD700",
              color: "#000",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#FFC107" },
            }}
            onClick={() => navigate("/client-login")}
          >
            Get Started
          </Button> */}
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <Container sx={{ mt: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          {[
            { icon: <Dashboard fontSize="large" />, text: "Project Dashboard", desc: "Visualize all your tasks and progress at a glance." },
            { icon: <Code fontSize="large" />, text: "Team Collaboration", desc: "Assign tasks, leave comments, and tag teammates." },
            { icon: <PlayCircleOutline fontSize="large" />, text: "Quick Start", desc: "Set up your workspace in minutes and start organizing." },
            { icon: <TrendingUp fontSize="large" />, text: "Productivity Insights", desc: "Get reports on project velocity and team output." },
            { icon: <Settings fontSize="large" />, text: "Workflow Automation", desc: "Automate recurring tasks and reminders." },
            { icon: <Security fontSize="large" />, text: "Secure Access", desc: "Role-based access and data encryption built-in." },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div initial="hidden" animate="visible" variants={cardVariants}>
                <Card sx={{ p: 3, textAlign: "center", boxShadow: 4, bgcolor: "#1E1E1E", color: "#fff", borderRadius: 3 }}>
                  {feature.icon}
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">{feature.text}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7, color: "#4FC3F7" }}>{feature.desc}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Statistics, Testimonials, CTA, and Footer remain the same, just updated text */}
      <section className="flex justify-around bg-gray-900 text-white py-16">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <h2 className="text-4xl font-bold">{stat.value}</h2>
            <p className="text-lg text-gray-300">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {/* Testimonials Section */}
      <Box sx={{ mt: 10, maxWidth: 800 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          What Our Users Say
        </Typography>
        <Divider sx={{ bgcolor: "#FFD700", width: "50%", mx: "auto", mb: 3 }} />
        <Grid container spacing={3}>
          {[
            { name: "Alex Johnson", feedback: "This TMS is a game-changer. Our team is more aligned than ever!", role: "Project Manager, Creatix" },
            { name: "Priya Mehta", feedback: "Intuitive design and features that actually save us time.", role: "Team Lead, CollabSoft" },
          ].map((testimonial, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ p: 3, bgcolor: "#1E1E1E", color: "#fff", borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="body1" sx={{ fontStyle: "italic", opacity: 0.9, color: "#FFD700" }}>
                    "{testimonial.feedback}"
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#FFD700" }}>{testimonial.name[0]}</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">{testimonial.name}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>{testimonial.role}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Final Call to Action */}
      <Box
        sx={{
          mt: 10,
          width: "100%",
          py: 4,
          bgcolor: "#FFD700",
          textAlign: "center",
          color: "#000",
          fontWeight: "bold",
        }}
      >
        <Typography variant="h5">
          Ready to level up your task management?
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2, px: 4, bgcolor: "#000", color: "#FFD700", "&:hover": { bgcolor: "#222" } }}
          onClick={() => navigate("/login")}
        >
          Start Now
        </Button>
      </Box>
      <Footer />
    </Box>
  );
};

export default HomePage;
