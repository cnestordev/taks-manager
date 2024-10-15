const { createTask } = require('./tasks');

const createRandomTaskList = () => {
    const numTasks = Math.floor(Math.random() * 5) + 3; // Generate between 3 and 7 tasks
    return Array.from({ length: numTasks }, () => createTask());
};

// User seed data
const users = [
    {
        username: 'red',
        password: 'red',
        tasks: createRandomTaskList(),
    },
    {
        username: 'blue',
        password: 'blue',
        tasks: createRandomTaskList(),
    },
    {
        username: 'gold',
        password: 'gold',
        tasks: createRandomTaskList(),
    },
    {
        username: 'silver',
        password: 'silver',
        tasks: createRandomTaskList(),
    },
];

module.exports = { users };