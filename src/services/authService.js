import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/users';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, { username, password });
    if (response.data.access) {
      localStorage.setItem('login', response.data.access);
    }
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
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