
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Input, Form, Table, Modal, DatePicker, message, Typography } from "antd";
import "antd/dist/reset.css"; 
import moment from 'moment';

const { Title } = Typography;

const ClientProfile = () => {
  const { clientId } = useParams(); 
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    start_date: "",
    end_date: "",
    budget: "",
    client_id: clientId,
  });
  const [isModalVisible, setIsModalVisible] = useState(false); 

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5005/api/client/${clientId}`);
        setClient(response.data);
      } catch (err) {
        setError("Failed to load client details.");
      }
    };

    const fetchClientProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:5005/api/projects/${clientId}`);
        // Make sure team_members is always an array
        const updatedProjects = response.data.map((project) => ({
          ...project,
          team_members: Array.isArray(project.team_members) ? project.team_members : [],
        }));
        setProjects(updatedProjects);
      } catch (err) {
        setError("Failed to load projects.");
      }
    };

    fetchClientDetails();
    fetchClientProjects();
  }, [clientId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post("http://localhost:5005/api/projects", { ...formData, ...values });
      setProjects([...projects, response.data]); // Add new project to the list
      setShowForm(false); // Hide form after submission
      message.success("Project created successfully!");
      setIsModalVisible(true); // Show the confirmation modal
    } catch (error) {
      message.error("Error submitting form.");
    }
  };

  const columns = [
    {
      title: "Project Name",
      dataIndex: "project_name",
      key: "project_name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
    },
  ];

  if (error) {
    return <div>{error}</div>;
  }

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title level={1} style={{ textAlign: "center" }}>
        Tasks for {client.client_name}
      </Title>

      {/* Display Projects in Table Format */}
      {projects.length === 0 ? (
        <p>No Task found for this client.</p>
      ) : (
        <Table columns={columns} dataSource={projects} rowKey="_id" />
      )}

      {/* Button to Show/Hide Form */}
      <Button
        type="primary"
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: "20px" }}
      >
        {showForm ? "Cancel" : "Add New Task"}
      </Button>

      {/* Project Creation Form using Ant Design Modal */}
      <Modal
        title="Create a New Task"
        visible={showForm}
        onCancel={() => setShowForm(false)}
        footer={null}
      >
        <Form
          initialValues={formData}
          onFinish={handleFormSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Task Name"
            name="project_name"
            rules={[{ required: true, message: "Please input the Task name!" }]}
          >
            <Input
              value={formData.project_name}
              onChange={handleFormChange}
              name="project_name"
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input the task description!" }]}
          >
            <Input.TextArea
              value={formData.description}
              onChange={handleFormChange}
              name="description"
            />
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="start_date"
            rules={[{ required: true, message: "Please select the start date!" }]}
          >
            <DatePicker
              value={formData.start_date ? moment(formData.start_date) : null}
              onChange={(date) => setFormData({ ...formData, start_date: date })}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="end_date"
            rules={[{ required: true, message: "Please select the end date!" }]}
          >
            <DatePicker
              value={formData.end_date ? moment(formData.end_date) : null}
              onChange={(date) => setFormData({ ...formData, end_date: date })}
              style={{ width: "100%" }}
            />
          </Form.Item>
          {/* <Form.Item
            label="Budget"
            name="budget"
            rules={[{ required: true, message: "Please input the budget!" }]}
          > */}
            {/* <Input
              type="number"
              value={formData.budget}
              onChange={handleFormChange}
              name="budget"
            />
          </Form.Item> */}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Create Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        title="Task Submitted"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="ok" onClick={() => setIsModalVisible(false)}>
            OK
          </Button>
        ]}
      >
        <p>We will review your project soon and get back to you.</p>
      </Modal>
    </div>
  );
};

export default ClientProfile;
