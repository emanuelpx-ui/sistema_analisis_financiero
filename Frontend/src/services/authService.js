// Servicio de autenticación para conectar con FastAPI
const API_URL = 'http://127.0.0.1:8000'; // URL base de nuestra API

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Credenciales incorrectas o error en el servidor.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en el login:', error);
    throw error;
  }
};