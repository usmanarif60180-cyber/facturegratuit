import axios from "axios";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND}/api`;

function getWorkspaceId() {
  let ws = localStorage.getItem("workspaceId");
  if (!ws) {
    ws = "ws-" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem("workspaceId", ws);
  }
  return ws;
}

export const workspaceId = getWorkspaceId();

const http = axios.create({ baseURL: API });

export const api = {
  workspaceId,
  // Clients
  listClients: () => http.get("/clients", { params: { workspaceId } }).then((r) => r.data),
  createClient: (data) => http.post("/clients", { ...data, workspaceId }).then((r) => r.data),
  updateClient: (id, data) => http.put(`/clients/${id}`, data).then((r) => r.data),
  deleteClient: (id) => http.delete(`/clients/${id}`).then((r) => r.data),
  // Vehicles
  listVehicles: (clientId) => http.get("/vehicles", { params: { workspaceId, clientId } }).then((r) => r.data),
  createVehicle: (data) => http.post("/vehicles", { ...data, workspaceId }).then((r) => r.data),
  updateVehicle: (id, data) => http.put(`/vehicles/${id}`, data).then((r) => r.data),
  deleteVehicle: (id) => http.delete(`/vehicles/${id}`).then((r) => r.data),
  // Invoices
  listInvoices: (q) => http.get("/invoices", { params: { workspaceId, q } }).then((r) => r.data),
  getInvoice: (id) => http.get(`/invoices/${id}`).then((r) => r.data),
  createInvoice: (data) => http.post("/invoices", { ...data, workspaceId }).then((r) => r.data),
  updateInvoice: (id, data) => http.put(`/invoices/${id}`, data).then((r) => r.data),
  deleteInvoice: (id) => http.delete(`/invoices/${id}`).then((r) => r.data),
  duplicateInvoice: (id) => http.post(`/invoices/${id}/duplicate`).then((r) => r.data),
  // Settings
  getSettings: () => http.get("/settings", { params: { workspaceId } }).then((r) => r.data),
  saveSettings: (data) => http.put("/settings", { ...data, workspaceId }).then((r) => r.data),
  // Stats
  stats: () => http.get("/stats", { params: { workspaceId } }).then((r) => r.data),
};
