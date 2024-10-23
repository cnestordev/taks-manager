import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const useSocket = (taskId, assignedToLength, onTaskUpdated, user) => {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!socketRef.current) {
            const apiBaseUrl = window.location.hostname === 'localhost'
                ? "http://localhost:5000"
                : "http://192.168.0.41:5000";

            // Initialize the socket connection
            socketRef.current = io(apiBaseUrl, {
                query: { userId: user.id, username: user.username },
                transports: ['websocket'],
                withCredentials: true
            });
        }

        // Join task room if necessary
        if (taskId && assignedToLength > 1) {
            socketRef.current.emit('joinTaskRoom', taskId);

            // Listen for taskUpdated event
            socketRef.current.on('taskUpdated', (updatedTask) => {
                if (onTaskUpdated) {
                    onTaskUpdated(updatedTask);
                }
            });
        }

        // Listen for the "message" event
        socketRef.current.on('message', (message) => {
            console.log(message)
        });

        // Cleanup function on component unmount or task change
        return () => {
            if (taskId && assignedToLength > 1) {
                socketRef.current.emit('leaveTaskRoom', taskId);
            }

            if (socketRef.current) {
                socketRef.current.off('taskUpdated');  // Clean up taskUpdated listener
                socketRef.current.off('message');      // Clean up message listener
            }
        };
    }, [taskId, assignedToLength, onTaskUpdated]);

    const updateTask = (updatedTask) => {
        if (socketRef.current) {
            socketRef.current.emit('taskUpdated', updatedTask); // Notify backend of task update
        }
    };

    return { socket: socketRef.current, updateTask };
};

export default useSocket;
