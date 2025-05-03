
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { ChevronDown, LogOut, User, FileText, BarChart2, Shield } from "lucide-react";
import logo from "../assets/meatech.jpeg";
import { Bell } from "lucide-react";
const Header = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const token = localStorage.getItem("jwtToken");
  const isAuthenticated = !!token;

  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const isClient = decodedToken?.role === "client";
  const isAdmin = decodedToken?.role === "admin";

  const handleLogout = () => {
    logout(navigate);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header style={headerStyle}>
      <div style={logoContainerStyle}>
        <img src={logo} alt="Company Logo" style={logoStyle} />
        <h1 style={titleStyle}>Task Management System</h1>
      </div>
      <nav style={navStyle}>
        {isAuthenticated ? (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {isClient && (
              <>
              <div style={{ position: "relative", cursor: "pointer" }}>
          <Bell size={20} onClick={() => alert("View Notifications")} />
          <span style={notificationBadgeStyle}>3</span> {/* Example: 3 Unread */}
        </div>
                <NavButton
                  icon={<User size={18} />}
                  text="Profile"
                  onClick={() => navigate(`/client/${decodedToken.clientId}`)}
                />
                <NavButton
                  icon={<FileText size={18} />}
                  text="Tasks"
                  onClick={() =>
                    navigate(`/contract-management/${decodedToken.clientId}`)
                  }
                  
                />
                
              </>
            )}

            {isAdmin && (
              <>
                <NavButton
                  icon={<BarChart2 size={18} />}
                  text="Dashboard"
                  onClick={() => navigate(`/dashboard`)}
                />
                <NavButton
                  icon={<Shield size={18} />}
                  text="Tasks Management"
                  onClick={() => navigate(`/admin/projects`)}
                />
              </>
            )}

            <NavButton
              icon={<LogOut size={18} />}
              text="Logout"
              onClick={handleLogout}
            />
          </div>
        ) : (
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button style={loginButtonStyle} onClick={toggleDropdown}>
              Login <ChevronDown size={16} />
            </button>
            {showDropdown && (
              <div style={dropdownStyle}>
                <DropdownItem
                  text="Login as Admin"
                  onClick={() => {
                    navigate("/admin-login");
                    setShowDropdown(false);
                  }}
                />
                <DropdownItem
                  text="Login as User"
                  onClick={() => {
                    navigate("/client-login");
                    setShowDropdown(false);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

const NavButton = ({ icon, text, onClick }) => (
  <button style={buttonStyle} onClick={onClick}>
    {icon}
    <span>{text}</span>
  </button>
);

const DropdownItem = ({ text, onClick }) => (
  <button style={dropdownItemStyle} onClick={onClick}>
    {text}
  </button>
);

const headerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  backgroundColor: "#0D1117",
  color: "#fff",
  padding: "15px 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "2px solid #30363D",
  zIndex: 1000, // Ensures it stays above other elements
};

const titleStyle = {
  fontSize: "20px",
  fontWeight: "600",
};

const navStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};
const notificationBadgeStyle = {
  position: "absolute",
  top: "-5px",
  right: "-5px",
  background: "red",
  color: "white",
  borderRadius: "50%",
  padding: "3px 6px",
  fontSize: "12px",
  fontWeight: "bold",
};

const buttonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "#21262D",
  color: "#fff",
  border: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  transition: "0.3s",
  outline: "none",
};

const loginButtonStyle = {
  background: "transparent",
  color: "#fff",
  border: "1px solid #fff",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  transition: "0.3s",
};

const dropdownStyle = {
  position: "absolute",
  top: "110%",
  right: "0",
  backgroundColor: "#21262D",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
  borderRadius: "8px",
  zIndex: 1000,
  minWidth: "150px",
};

const dropdownItemStyle = {
  padding: "10px 15px",
  color: "#fff",
  background: "none",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  width: "100%",
  display: "block",
};
const logoContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const logoStyle = {
  height: "40px",
  width: "auto",
};

export default Header;
