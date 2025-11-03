import axios from "axios";

//Instancia com url fixa
export const api = axios.create({
  baseURL: "http://localhost:5000",
});

//Conversa com back

//register
export async function registerUser(data) {
  return await api.post("/register", data);
}

//login
export async function loginUser(data) {
  return await api.post("/login", data);
}

//Get
export async function getTransactions(userId) {
  return await api.get(`/transactions/${userId}`);
}

//Create
export async function createTransaction(id, data) {
  return await api.post(`/transactions/${id}`, data);
}

//edit
export async function updateTransaction(id, data) {
  return await api.put(`/transactions/${id}`, data);
}

//delete
export async function deleteTransaction(id) {
  return await api.delete(`/transactions/${id}`);
}
