import axios from "axios";

const API_URL = "http://localhost:8080/esti/tsg";

export const getSubjectsByTeacher = async (idTeacher) => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.get(`${API_URL}/by-teacher/${idTeacher}`, { headers });
  return response.data;
};

export const createTeacherSubject = async (teacherSubjectData) => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.post(`${API_URL}/create-tsg`, teacherSubjectData, { headers });
  return response.data;
};

export const deleteTeacherSubject = async (idTeacherSubject) => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.delete(`${API_URL}/${idTeacherSubject}`, { headers });
  return response.data;
};
