import { getAllUsers } from '../api';

export const getListOfUsers = async () => {
    try {
        const { data: { user: users } } = await getAllUsers();
        return users;
    } catch (err) {
        console.log(err);
    }
};