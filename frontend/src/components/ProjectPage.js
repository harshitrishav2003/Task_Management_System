
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Table,
  Select,
  Modal,
  Input,
  Form,
  Typography,
  message,
  Spin,
  Card,
  Space,
  Alert,
} from "antd";
import { EditOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

const { Title } = Typography;
const { Option } = Select;

const ProjectsPage = () => {
  const [pendingProjects, setPendingProjects] = useState([]);
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/projects");
        const allProjects = response.data;
        setPendingProjects(allProjects.filter((project) => !project.isApproved));
        setApprovedProjects(allProjects.filter((project) => project.isApproved));
      } catch (err) {
        setError("Failed to fetch projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleViewDetails = (projectId) => navigate(`/project/${projectId}`);

  const handleApprove = async (projectId) => {
    try {
      await axios.put(`http://localhost:5005/api/projects/${projectId}/approve`);
      message.success("Project approved successfully");
      setPendingProjects((prev) => prev.filter((project) => project._id !== projectId));
      const approvedProject = pendingProjects.find((project) => project._id === projectId);
      setApprovedProjects((prev) => [...prev, { ...approvedProject, isApproved: true }]);
    } catch (err) {
      message.error("Failed to approve project");
    }
  };

  const handleReject = async (projectId) => {
    try {
      await axios.put(`http://localhost:5005/api/projects/${projectId}/reject`);
      message.success("Project rejected successfully");
      setPendingProjects((prev) => prev.filter((project) => project._id !== projectId));
    } catch (err) {
      message.error("Failed to reject project");
    }
  };

  const handleStatusChange = async (projectId, status) => {
    try {
      await axios.put(`http://localhost:5005/api/projects/${projectId}`, { status });
      message.success("Project status updated successfully");
      setApprovedProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId ? { ...project, status } : project
        )
      );
    } catch (err) {
      message.error("Failed to update project status");
    }
  };

  const handleEdit = (project) => {
    setEditProject(project);
    form.setFieldsValue({ ...project, team_members: project.team_members.join(", ") });
  };

  const handleEditSubmit = async () => {
    try {
      const updatedProject = {
        ...form.getFieldsValue(),
        team_members: form.getFieldValue("team_members").split(", "),
      };
      await axios.put(`http://localhost:5005/api/projects/${editProject._id}`, updatedProject);
      message.success("Project updated successfully");
      setApprovedProjects((prev) =>
        prev.map((p) => (p._id === editProject._id ? updatedProject : p))
      );
      setEditProject(null);
    } catch (err) {
      message.error("Failed to update project");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
        Task Management
      </Title>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <>
          {/* Pending Projects Section */}
          <Card title="User Task" bordered={false} style={{ marginBottom: "20px" }}>
            <Table
              dataSource={pendingProjects}
              rowKey="_id"
              columns={[
                { title: "Project ID", dataIndex: "_id" },
                { title: "Project Name", dataIndex: "project_name" },
                { title: "Client", dataIndex: ["client_id", "client_name"] },
                { title: "Description", dataIndex: "description" },
                {
                  title: "Actions",
                  render: (_, project) => (
                    <Space>
                      <Button type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(project._id)}>
                        Approve
                      </Button>
                      <Button danger icon={<CloseOutlined />} onClick={() => handleReject(project._id)}>
                        Reject
                      </Button>
                    </Space>
                  ),
                },
              ]}
            />
          </Card>

          {/* Approved Projects Section */}
          <Card title="Approved Projects" bordered={false}>
            <Table
              dataSource={approvedProjects}
              rowKey="_id"
              columns={[
                { title: "Project ID", dataIndex: "_id" },
                { title: "Project Name", dataIndex: "project_name" },
                { title: "Client", dataIndex: ["client_id", "client_name"] },
                {
                  title: "Status",
                  render: (_, project) => (
                    <Select
                      defaultValue={project.status}
                      onChange={(value) => handleStatusChange(project._id, value)}
                    >
                      <Option value="Pending">Pending</Option>
                      <Option value="Ongoing">Ongoing</Option>
                      <Option value="Completed">Completed</Option>
                    </Select>
                  ),
                },
                {
                  title: "Actions",
                  render: (_, project) => (
                    <Space>
                      <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(project._id)}>
                        View
                      </Button>
                      <Button icon={<EditOutlined />} onClick={() => handleEdit(project)}>
                        Edit
                      </Button>
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
        </>
      )}

      {/* Edit Modal */}
      <Modal
        title="Edit Project"
        open={!!editProject}
        onCancel={() => setEditProject(null)}
        onOk={handleEditSubmit}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="project_name" label="Project Name" rules={[{ required: true, message: "Please enter a project name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Ongoing">Ongoing</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
          <Form.Item name="team_members" label="Team Members">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
