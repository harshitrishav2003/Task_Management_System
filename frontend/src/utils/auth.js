export const isAuthenticated = () => {
    const token = localStorage.getItem("jwtToken");
    return token !== null;
  };
  
  export const logout = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/";
  };
  