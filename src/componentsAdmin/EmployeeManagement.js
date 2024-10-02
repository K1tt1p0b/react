import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Box,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Typography,
    Paper,
    MenuItem,
    Button,
    Grid,
    CircularProgress,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CssBaseline,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';

const drawerWidth = 240;

function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [newEmployee, setNewEmployee] = useState({ username: '', password: '', firstName: '', lastName: '', email: '', gender: '' });
    const [error, setError] = useState('');
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}api/employee`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (Array.isArray(response.data)) {
                setEmployees(response.data);
                setError('');
            } else {
                setEmployees([]);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            setEmployees([]);
            setError('An error occurred while fetching employees.');
            setOpenErrorDialog(true);
        } finally {
            setLoading(false);
        }
    };

    const handleClickOpenEdit = (employee) => {
        setSelectedEmployee(employee);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => setOpenEdit(false);

    const handleClickOpenDelete = (employee) => {
        setSelectedEmployee(employee);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => setOpenDelete(false);

    const handleClickOpenAdd = () => setOpenAdd(true);

    const handleCloseAdd = () => setOpenAdd(false);

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setSelectedEmployee({ ...selectedEmployee, [name]: value });
    };

    const handleAddChange = (event) => {
        const { name, value } = event.target;
        setNewEmployee({ ...newEmployee, [name]: value });
    };

    const handleAddEmployee = async () => {
        try {
            const token = localStorage.getItem('token');
            const newEmployeeData = { ...newEmployee, gender: newEmployee.gender === 'Male' ? 0 : 1 };
            const response = await axios.post(`${process.env.REACT_APP_API_URL}api/employee`, newEmployeeData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { message, status } = response.data;

            if (status === true || message === 'เพิ่มข้อมูลพนักงานเรียบร้อยแล้ว') {
                fetchEmployees();
                handleCloseAdd();
                setNewEmployee({ username: '', password: '', firstName: '', lastName: '', email: '', gender: '' });
                setError('');
            } else {
                setError(message);
                setOpenErrorDialog(true);
            }
        } catch (error) {
            setError('An error occurred while adding the employee. Please try again.');
            setOpenErrorDialog(true);
        }
    };

    const handleUpdateEmployee = async () => {
        try {
            const token = localStorage.getItem('token');
            const updatedEmployeeData = { ...selectedEmployee, gender: selectedEmployee.gender === 'Male' ? 0 : 1 };
            const response = await axios.put(`${process.env.REACT_APP_API_URL}api/employee/${selectedEmployee.empID}`, updatedEmployeeData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { message, status } = response.data;

            if (status === true || message === 'แก้ไขข้อมูลพนักงานเรียบร้อยแล้ว') {
                fetchEmployees();
                handleCloseEdit();
                setError('');
            } else {
                setError(message);
                setOpenErrorDialog(true);
            }
        } catch (error) {
            setError('An error occurred while updating the employee. Please try again.');
            setOpenErrorDialog(true);
        }
    };

    const handleDeleteEmployee = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}api/employee/${selectedEmployee.empID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { message, status } = response.data;

            if (status === true || message === 'ลบข้อมูลพนักงานเรียบร้อยแล้ว') {
                fetchEmployees();
                handleCloseDelete();
                setError('');
            } else {
                setError(message);
                setOpenErrorDialog(true);
            }
        } catch (error) {
            setError('An error occurred while deleting the employee. Please try again.');
            setOpenErrorDialog(true);
        }
    };

    const handleCloseErrorDialog = () => {
        setOpenErrorDialog(false);
        setError('');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Employee Management
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem button onClick={() => window.location.href = '/admindashboard'}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem button onClick={() => window.location.href = '/customer'}>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Customer" />
                        </ListItem>
                        <ListItem button onClick={() => window.location.href = '/Management'}>
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary="Employees" />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Container sx={{ marginTop: '64px', marginLeft: '250px', padding: '20px' }}>
                <Button variant="contained" color="primary" onClick={handleClickOpenAdd} sx={{ mb: 2 }}>
                    Add Employee
                </Button>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>First Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees.map((employee) => (
                                    <TableRow key={employee.empID}>
                                        <TableCell>{employee.username}</TableCell>
                                        <TableCell>{employee.firstName}</TableCell>
                                        <TableCell>{employee.lastName}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>{employee.gender === 0 ? 'Male' : 'Female'}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleClickOpenEdit(employee)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleClickOpenDelete(employee)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent>
                        <Typography color="error">{error}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseErrorDialog}>Close</Button>
                    </DialogActions>
                </Dialog>

                {/* Add Employee Dialog */}
                <Dialog open={openAdd} onClose={handleCloseAdd}>
                    <DialogTitle>Add Employee</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    name="username"
                                    label="Username"
                                    fullWidth
                                    value={newEmployee.username}
                                    onChange={handleAddChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    value={newEmployee.password}
                                    onChange={handleAddChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="firstName"
                                    label="First Name"
                                    fullWidth
                                    value={newEmployee.firstName}
                                    onChange={handleAddChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="lastName"
                                    label="Last Name"
                                    fullWidth
                                    value={newEmployee.lastName}
                                    onChange={handleAddChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    name="email"
                                    label="Email"
                                    fullWidth
                                    value={newEmployee.email}
                                    onChange={handleAddChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    name="gender"
                                    label="Gender"
                                    fullWidth
                                    select
                                    value={newEmployee.gender}
                                    onChange={handleAddChange}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAdd}>Cancel</Button>
                        <Button onClick={handleAddEmployee} color="primary">Add</Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Employee Dialog */}
                <Dialog open={openEdit} onClose={handleCloseEdit}>
                    <DialogTitle>Edit Employee</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    name="username"
                                    label="Username"
                                    fullWidth
                                    value={selectedEmployee?.username || ''}
                                    onChange={handleEditChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    value={selectedEmployee?.password || ''}
                                    onChange={handleEditChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="firstName"
                                    label="First Name"
                                    fullWidth
                                    value={selectedEmployee?.firstName || ''}
                                    onChange={handleEditChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="lastName"
                                    label="Last Name"
                                    fullWidth
                                    value={selectedEmployee?.lastName || ''}
                                    onChange={handleEditChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    name="email"
                                    label="Email"
                                    fullWidth
                                    value={selectedEmployee?.email || ''}
                                    onChange={handleEditChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    name="gender"
                                    label="Gender"
                                    fullWidth
                                    select
                                    value={selectedEmployee?.gender === 0 ? 'Male' : 'Female'}
                                    onChange={handleEditChange}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEdit}>Cancel</Button>
                        <Button onClick={handleUpdateEmployee} color="primary">Update</Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Employee Dialog */}
                <Dialog open={openDelete} onClose={handleCloseDelete}>
                    <DialogTitle>Delete Employee</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete {selectedEmployee?.firstName} {selectedEmployee?.lastName}?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDelete}>Cancel</Button>
                        <Button onClick={handleDeleteEmployee} color="error">Delete</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

export default EmployeeManagement;
