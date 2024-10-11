import axiosInstance from "../services/axiosInstance";

// Create new Task

export const createTask = async (task) => {
    const response = await axiosInstance.post('/task/create', task);
    return response;
};