const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); 

const app = express();
const PORT = 5005;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection

const MONGO_URI="mongodb+srv://harshitrishav987:hsVSQaWJ3Hkiucoy@cluster0.8nbzc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout for connection
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Failed to connect to MongoDB Atlas:", err));

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    client_name: { type: String, required: true },
    contact_person: { type: String, required: true },
    phone: { type: String },
    industry: { type: String },
    status: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postal_code: { type: String },
      country: { type: String },
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    isApproved: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // New field
  });
  
const User = mongoose.model("User", userSchema);

// Route to fetch a specific user's details (Corrected to use the User model)
app.get('/api/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await User.findById(clientId); 
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ message: 'Failed to load client details' });
  }
});

// API endpoint for fetching users with filters and sorting
app.get('/api/users', async (req, res) => {
  try {
    const { search, region, industry, status, sortColumn, sortOrder } = req.query;

    // Build filter object
    let filter = {};
    if (region) filter.region = region;
    if (industry) filter.industry = industry;
    if (status) filter.status = status;
    if (search) filter.client_name = { $regex: search, $options: 'i' }; // Case-insensitive search

    // Build sort object
    let sort = {};
    if (sortColumn && sortOrder) {
      sort[sortColumn] = sortOrder === 'asc' ? 1 : -1;
    }

    // Fetch users from DB with filters and sorting
    const users = await User.find(filter).sort(sort);

    // Send the data as a response
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update Client (User) by ID
app.put('/api/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const updateData = req.body;

    // Find the user by ID and update the details
    const updatedClient = await User.findByIdAndUpdate(clientId, updateData, { new: true });

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(updatedClient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update client details." });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user.role !== "admin" && user.isApproved !== "approved") {
        return res.status(403).json({ message: "Your account is not approved yet." });
      }
    
    if (user) {
      const token = jwt.sign({ email: user.email, role: user.role, clientId: user._id }, "secretKey", { expiresIn: "1h" });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/pending-users", async (req, res) => {
    try {
      const pendingUsers = await User.find({ role: "client", isApproved: "pending" });
      res.json(pendingUsers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

app.put("/api/approve-user/:id", async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update user's approval status
      user.isApproved = "approved"; // Change the status to approved
      await user.save();
  
      // Configure Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "harshitrishav987@gmail.com", // Replace with your email
          pass: "uqnw tuwc kqgi hxqb", // Replace with your email password or app-specific password
        },
      });
  
      // Email content
      const mailOptions = {
        from: "harshitrishav987@gmail.com", // Sender email
        to: user.email,              // Recipient email
        subject: "Approval Notification",
        text: `Hi ${user.client_name},\n\nCongratulations! Your account has been approved. You can now access the platform.\n\nBest regards,\nPolysia`,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      res.json({ message: "User approved successfully and email sent." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  app.delete("/api/reject-user/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findByIdAndDelete(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "User rejected and deleted successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
// PUT /api/users/:id - Update client by ID
app.put('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      console.log('Received PUT request for client ID:', id); // Log the incoming request ID
      console.log('Data to be updated:', updatedData); // Log the incoming data
  
      const updatedClient = await User.findByIdAndUpdate(id, updatedData, { new: true });
      if (!updatedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
  
      res.status(200).json(updatedClient); // Send back the updated client
    } catch (err) {
      console.error('Error updating client:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Delete Client (User) by ID
  app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid client ID' });
    }
  
    try {
      const deletedClient = await User.findByIdAndDelete(id);
      if (!deletedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json({ message: 'Client deleted successfully' });
    } catch (error) {
      console.error('Error deleting client:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
// Register Route
app.post("/api/register", async (req, res) => {
  const { client_name, contact_person, email, phone, industry, status, address, password } = req.body;
  
  // Basic validation
  if (!email || !password || !client_name || !contact_person || !status || !address) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }
  
  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }
  
    // Hash the password before saving it
    // const hashedPassword = await bcrypt.hash(password, 10);
  
    // Create the new user object with additional fields
    const newUser = new User({
      client_name,
      contact_person,
      email,
      phone,
      industry,
      status,
      address,
      password,
      role: 'client',
     
      created_at: new Date(),
      updated_at: new Date(),
      isApproved: 'pending',
    });
  
    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: "User registered successfully. Await admin approval." });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register user", error: err.message });
  }
});

// Define Project Schema and Model
const projectSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  project_name: { type: String, required: true },
  description: { type: String },
  start_date: { type: Date },
  end_date: { type: Date },
  status: { type: String, enum: ["Ongoing", "Completed", "On Hold"], default: "Ongoing" },
  isApproved: { type: Boolean, default: null },
  budget: { type: Number },
  team_members: [{ type: String }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);

app.post('/api/projects', async (req, res) => {
  try {
    console.log("POST /api/projects route hit");
    const { client_id, project_name, description, start_date, end_date, status, budget, team_members } = req.body;
    
    // Validate client existence
    const client = await User.findById(client_id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Create new project with isApproved set to false
    const newProject = new Project({
      client_id,
      project_name,
      description,
      start_date,
      end_date,
      status,
      budget,
      team_members,
      isApproved: false, // Ensure isApproved is false by default
    });

    await newProject.save();
    res.status(201).json({ message: "Project added successfully", project: newProject });
  } catch (err) {
    console.error("Error adding project:", err);
    res.status(500).json({ message: "Failed to add project" });
  }
});


app.get('/api/projects', async (req, res) => {
  try {
    const { isApproved } = req.query;
    const filter = isApproved !== undefined ? { isApproved: isApproved === 'true' } : {};
    const projects = await Project.find(filter)
      .populate('client_id', 'client_name')
      .exec();

    res.status(200).json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Failed to fetch projects.', error: err.message });
  }
});

app.get('/api/projects/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    // Validate client existence
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const projects = await Project.find({ client_id: clientId, isApproved: true }); // Fetch only approved projects
    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Failed to fetch projects", error: err.message });
  }
});

app.get('/api/project/:projectId', async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findOne({ _id: projectId, isApproved: true }) // Ensure the project is approved
      .populate('client_id', 'client_name contact_person email phone');

    if (!project) {
      return res.status(404).json({ message: 'Approved project not found' });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error('Error fetching project details:', err);
    res.status(500).json({ message: 'Failed to fetch project details', error: err.message });
  }
});

// Update a project
app.put('/api/projects/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const updateData = req.body;

    const updatedProject = await Project.findByIdAndUpdate(projectId, updateData, { new: true });

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project updated successfully", project: updatedProject });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ message: "Failed to update project" });
  }
});

// Delete a project
app.delete('/api/projects/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Failed to delete project" });
  }
});

// Approve Project
app.put('/api/projects/:projectId/approve', async (req, res) => {
  try {
    const { projectId } = req.params;

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { isApproved: true, status: 'approved', updated_at: Date.now() },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project approved successfully", project: updatedProject });
  } catch (err) {
    console.error("Error approving project:", err);
    res.status(500).json({ message: "Failed to approve project", error: err.message });
  }
});



app.put('/api/projects/:projectId/reject', async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find and delete the project by ID
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project rejected and deleted successfully", project: deletedProject });
  } catch (err) {
    console.error("Error rejecting and deleting project:", err);
    res.status(500).json({ message: "Failed to reject and delete project", error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
