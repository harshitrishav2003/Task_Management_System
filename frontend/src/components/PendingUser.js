
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, message, Spin, Tag } from "antd";
import { Link } from "react-router-dom";

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5005/api/pending-users")
      .then((response) => response.json())
      .then((data) => {
        setPendingUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pending users:", error);
        setLoading(false);
      });
  }, []);

  const approveUser = async (userId) => {
    try {
      const response = await axios.put(`http://localhost:5005/api/approve-user/${userId}`);
      message.success(response.data.message);
      setPendingUsers((prevState) => prevState.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Error approving user:", err);
      message.error("Failed to approve user");
    }
  };

  const rejectUser = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:5005/api/reject-user/${userId}`);
      message.success(response.data.message);
      setPendingUsers((prevState) => prevState.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Error rejecting user:", err);
      message.error("Failed to reject user");
    }
  };

  const handleAction = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleConfirm = (action) => {
    if (selectedUser) {
      action === "approve" ? approveUser(selectedUser._id) : rejectUser(selectedUser._id);
    }
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Client Name",
      dataIndex: "client_name",
      render: (text, record) => <Link to={`/client/${record._id}`}>{text}</Link>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => <Tag color={status === "Pending" ? "orange" : "green"}>{status}</Tag>,
    },
    {
      title: "Industry",
      dataIndex: "industry",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Contact Person",
      dataIndex: "contact_person",
    },
    {
      title: "Action",
      render: (text, record) => (
        <>
          <Button type="primary" onClick={() => handleAction(record)} style={{ marginRight: 8 }}>
            Approve
          </Button>
          <Button type="danger" onClick={() => handleAction(record)}>
            Reject
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
  <h2 style={{ margin: '0 auto', fontSize: '24px', fontWeight: 'bold' }}>Pending Users</h2>
</div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table columns={columns} dataSource={pendingUsers} rowKey="_id" pagination={{ pageSize: 5 }} />
      )}

      <Modal
        title="Confirm Action"
        visible={isModalVisible}
        onOk={() => handleConfirm("approve")}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="reject" type="danger" onClick={() => handleConfirm("reject")}>Reject</Button>,
          <Button key="approve" type="primary" onClick={() => handleConfirm("approve")}>
            Approve
          </Button>,
        ]}
      >
        <p>Are you sure you want to approve/reject {selectedUser?.client_name}?</p>
      </Modal>
    </div>
  );
};

export default PendingUsers;