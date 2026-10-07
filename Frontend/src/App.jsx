import React, { useState } from 'react';
import Login from './views/Login.jsx';
import Dashboard from './views/Dashboard.jsx';
import AlertasRiesgo from './views/AlertasRiesgo.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLoginSuccess = (data) => {
    setUserData(data.usuario);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
  };

  return (
    <>
      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard user={userData} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;