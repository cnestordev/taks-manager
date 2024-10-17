import axiosInstance from "../services/axiosInstance";

// Get User tasks
export const getTasks = async (user) => {
    const response = await axiosInstance.get(`/task/${user.id}`);
    return response;
};

export const createTask = async (task) => {
    const response = await axiosInstance.post('/task/create', task);
    return response;
};

export const updateTaskOrder = async (task) => {
    const response = await axiosInstance.post('/task/updateTaskOrder', task);
    return response;
};