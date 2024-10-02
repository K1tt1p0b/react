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
    CircularProgress,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CssBaseline,
    Button,
    Grid,
    MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';

const drawerWidth = 240;

function CustomerManagement() {
    const [customers, setCustomers] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [error, setError] = useState('');
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}api/customer`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (Array.isArray(response.data)) {
                setCustomers(response.data);
                setError('');
            } else {
                setCustomers([]);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setCustomers([]);
            setError('An error occurred while fetching customers.');
            setOpenErrorDialog(true);
        } finally {
            setLoading(false);
        }
    };

    const handleClickOpenEdit = (customer) => {
        setSelectedCustomer(customer);
        setSelectedFile(null);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => setOpenEdit(false);

    const handleClickOpenDelete = (customer) => {
        setSelectedCustomer(customer);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => setOpenDelete(false);

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setSelectedCustomer({ ...selectedCustomer, [name]: value });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpdateCustomer = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            formData.append('username', selectedCustomer.username);
            formData.append('firstName', selectedCustomer.firstName);
            formData.append('lastName', selectedCustomer.lastName);
            formData.append('email', selectedCustomer.email);
            formData.append('gender', selectedCustomer.gender);

            if (selectedCustomer.password) {
                formData.append('password', selectedCustomer.password);
            }

            if (selectedFile) {
                formData.append('imageFile', selectedFile);
            }

            const response = await axios.put(`${process.env.REACT_APP_API_URL}api/customer/${selectedCustomer.custID}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                fetchCustomers();
                handleCloseEdit();
                setError('');
            } else {
                setError('Failed to update customer.');
                setOpenErrorDialog(true);
            }
        } catch (error) {
            setError('An error occurred while updating the customer. Please try again.');
            setOpenErrorDialog(true);
        }
    };

    const handleDeleteCustomer = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}api/customer/${selectedCustomer.custID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data) {
                fetchCustomers();
                handleCloseDelete();
                setError('');
            } else {
                setError('Failed to delete customer.');
                setOpenErrorDialog(true);
            }
        } catch (error) {
            setError('An error occurred while deleting the customer. Please try again.');
            setOpenErrorDialog(true);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Customer Management
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
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>First Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {customers.map((customer) => (
                                    <TableRow key={customer.custID}>
                                        <TableCell>{customer.custID}</TableCell>
                                        <TableCell>
                                            <img
                                                src={`${process.env.REACT_APP_API_URL}api/customer/image/${customer.imageFile}`}
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    borderRadius: "50%",
                                                }}
                                                alt="Customer"
                                            />
                                        </TableCell>
                                        <TableCell>{customer.username}</TableCell>
                                        <TableCell>{customer.firstName}</TableCell>
                                        <TableCell>{customer.lastName}</TableCell>
                                        <TableCell>{customer.gender === 0 ? 'Male' : 'Female'}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleClickOpenEdit(customer)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleClickOpenDelete(customer)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)}>
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent>
                        <Typography color="error">{error}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenErrorDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openEdit} onClose={handleCloseEdit}>
                    <DialogTitle>Edit Customer</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    name="username"
                                    label="Username"
                                    fullWidth
                                    value={selectedCustomer?.username || ''}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="firstName"
                                    label="First Name"
                                    fullWidth
                                    value={selectedCustomer?.firstName || ''}
                                    onChange={handleEditChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="lastName"
                                    label="Last Name"
                                    fullWidth
                                    value={selectedCustomer?.lastName || ''}
                                    onChange={handleEditChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    margin="dense"
                                    name="gender"
                                    label="Gender"
                                    fullWidth
                                    value={selectedCustomer?.gender || ''}
                                    onChange={handleEditChange}
                                >
                                    <MenuItem value={0}>Male</MenuItem>
                                    <MenuItem value={1}>Female</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="email"
                                    label="Email"
                                    fullWidth
                                    value={selectedCustomer?.email || ''}
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
                                    value={selectedCustomer?.password || ''}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <input type="file" onChange={handleFileChange} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEdit}>Cancel</Button>
                        <Button onClick={handleUpdateCustomer} color="primary">Update</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openDelete} onClose={handleCloseDelete}>
                    <DialogTitle>Delete Customer</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete {selectedCustomer?.firstName} {selectedCustomer?.lastName}?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDelete}>Cancel</Button>
                        <Button onClick={handleDeleteCustomer} color="error">Delete</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

export default CustomerManagement;
