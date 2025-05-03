import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import axios from "axios";
import '../App.css';

const ProjectDetailPage = () => {
  const { projectId } = useParams();  // Get projectId from URL
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        console.log(projectId);  // Check if the projectId is correct
        const response = await axios.get(`http://localhost:5005/api/project/${projectId}`);
        setProject(response.data);
      } catch (err) {
        setError("Failed to load project details.");
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (error) {
    return <div>{error}</div>; 
  }

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="client-profile-card">
      <h1>{project.project_name}</h1>
      <p><strong>Task Name:</strong> {project.project_name}</p>
      <p><strong>Description:</strong> {project.description}</p>
      <p><strong>Start Date:</strong> {new Date(project.start_date).toLocaleDateString()}</p>
      <p><strong>End Date:</strong> {new Date(project.end_date).toLocaleDateString()}</p>
      {/* <p><strong>Budget:</strong> ${project.budget}</p> */}
      <p><strong>Status:</strong> {project.status}</p>
      <h3>User Details:</h3>
      <p><strong>User Name:</strong> {project.client_id?.client_name || 'N/A'}</p>
      <p><strong>Contact Person:</strong> {project.client_id?.contact_person || 'N/A'}</p>
      <p><strong>Email:</strong> {project.client_id?.email || 'N/A'}</p>
      <p><strong>Phone:</strong> {project.client_id?.phone || 'N/A'}</p>
    </div>
  );
};

export default ProjectDetailPage;
