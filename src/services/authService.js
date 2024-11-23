import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/users';
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json',
        // Add CORS headers if needed
        'Accept': 'application/json'
      }
    });

    console.log("Raw API Response:", response);

    if (response.data && response.data.tokens && response.data.tokens.access) {
      const accessToken = response.data.tokens.access;
      localStorage.setItem('token', accessToken);
      return response.data;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Login error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};


export const register = async (email, password) => {
  const response = await axios.post(`${API_URL}/register/`, { email, password });
  return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API_URL}/change-password/`, { oldPassword, newPassword }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Funkcja, która zwraca aktualną rolę użytkownika na podstawie tokena JWT
export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decoded = JSON.parse(atob(token.split('.')[1]));
  return decoded.role;
};

export const logout = () => {
  localStorage.removeItem('token');
};