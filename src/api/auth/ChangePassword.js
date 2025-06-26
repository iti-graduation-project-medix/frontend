import axios from 'axios';

export const changePassword = async (data, token) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/v1/auth/change-password',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || 'Change password failed');
  }
};
