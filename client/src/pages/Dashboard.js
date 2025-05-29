import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

import AuthContext from '../context/AuthContext';
import Layout from '../components/layouts/Layout';

import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Typography,
    CircularProgress, Box, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';


const Dashboard = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const [todos, setTodos] = useState([]);
    const [taskDate, setTaskDate] = useState(null);
    const [taskTime, setTaskTime] = useState(null);

    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [taskTitle, setTaskTitle] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editTodoId, setEditTodoId] = useState(null);
    const [taskStatus, setTaskStatus] = useState('Pending');
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleteTodoId, setDeleteTodoId] = useState(null);

    const fetchTodos = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_SERVER_PATH}/todo/alltodos`, {
                withCredentials: true
            });

            if (res.data.data) {
                setTodos(res.data.data);
            } else {
                toast.error('No tasks founds');
            }
        } catch (err) {
            toast.error('Failed to load todos');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setDeleteTodoId(id);
        setConfirmDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_SERVER_PATH}/todo/deletetodo/${deleteTodoId}`, {
                withCredentials: true,
            });
            toast.success('Todo deleted');
            setTodos((prev) => prev.filter(todo => todo._id !== deleteTodoId));
        } catch (err) {
            toast.error('Failed to delete todo');
        } finally {
            setConfirmDeleteOpen(false);
            setDeleteTodoId(null);
        }
    };

    const handleModalOpen = () => {
        setIsEditing(false);
        setTaskTitle('');
        setTaskDate(null);
        setTaskTime(null);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setTaskTitle('');
        setEditTodoId(null);
        setIsEditing(false);
    };

    const handleEdit = (todo) => {
        setTaskTitle(todo.title);
        setEditTodoId(todo._id);
        setTaskDate(new Date(todo.date));

        const todayStr = new Date().toISOString().split('T')[0];
        const dateTimeStr = `${todayStr} ${todo.time}`;
        const parsedTime = new Date(dateTimeStr);

        setTaskTime(parsedTime);
        setTaskStatus(todo.isCompleted ? 'Completed' : 'Pending');
        setIsEditing(true);
        setModalOpen(true);
    };


    const handleSubmit = async () => {
        if (!taskTitle.trim()) {
            toast.error("Task title cannot be empty");
            return;
        }

        if (!taskDate || !taskTime) {
            toast.error("Please select date and time");
            return;
        }

        const formattedDate = formatDate(taskDate);
        const formattedTime = formatTime12Hour(taskTime);
        const isCompleted = taskStatus === 'Completed';

        try {
            if (isEditing) {
                const res = await axios.put(`${process.env.REACT_APP_SERVER_PATH}/todo/updatetodo/${editTodoId}`, {
                    title: taskTitle,
                    date: formattedDate,
                    time: formattedTime,
                    isCompleted,
                }, {
                    withCredentials: true
                });
                toast.success(res.data.message || 'Task updated');
            } else {
                const res = await axios.post(`${process.env.REACT_APP_SERVER_PATH}/todo/createtodo`, {
                    title: taskTitle,
                    date: formattedDate,
                    time: formattedTime,
                    isCompleted,
                }, {
                    withCredentials: true
                });
                toast.success(res.data.message || 'Task added');
            }

            handleModalClose();
            fetchTodos();
        } catch (err) {
            toast.error('Error submitting task');
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            fetchTodos();
        }
    }, [isAuthenticated, navigate]);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };

    const formatTime12Hour = (date) => {
        const hours = date.getHours();
        const minutes = (`0${date.getMinutes()}`).slice(-2);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    if (!isAuthenticated || loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Layout>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Dashboard - Your Todos</Typography>
                <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleModalOpen}>
                    Add Task
                </Button>
            </Box>

            {todos.length === 0 ? (
                <Typography>No tasks found.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell>Task Name</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {todos.map((todo, index) => {
                                const date = new Date(todo.date);
                                return (
                                    <TableRow key={todo._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{todo.title}</TableCell>
                                        <TableCell>{date.toLocaleDateString()}</TableCell>
                                        <TableCell>{todo.time}</TableCell>
                                        <TableCell>{todo.isCompleted ? 'Completed' : 'Pending'}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => confirmDelete(todo._id)} color="error">
                                                <Delete />
                                            </IconButton>
                                            <IconButton onClick={() => handleEdit(todo)}>
                                                <Edit />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={modalOpen} onClose={handleModalClose}>
                <DialogTitle>{isEditing ? 'Edit Task' : 'Add New Task'}</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TextField
                            fullWidth
                            label="Task Title"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            margin="normal"
                        />
                        <DatePicker
                            label="Select Date"
                            value={taskDate}
                            onChange={(newValue) => setTaskDate(newValue)}
                            renderInput={(params) => <TextField fullWidth margin="normal" {...params} />}
                        />
                        <TimePicker
                            label="Select Time"
                            value={taskTime}
                            onChange={(newValue) => setTaskTime(newValue)}
                            ampm
                            renderInput={(params) => <TextField fullWidth margin="normal" {...params} />}
                        />
                        {isEditing && (
                            <TextField
                                select
                                fullWidth
                                margin="normal"
                                label="Task Status"
                                value={taskStatus}
                                onChange={(e) => setTaskStatus(e.target.value)}
                                SelectProps={{ native: true }}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                            </TextField>
                        )}

                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {isEditing ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this task?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>

        </Layout>
    );
};

export default Dashboard;
