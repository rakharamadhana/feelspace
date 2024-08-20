import React, { useEffect, useState } from 'react';
import api from '../api'; // Import the api instance
import SideNav from '../components/SideNav';
import Modal from 'react-modal'; // Import Modal from react-modal
import DataTable from 'react-data-table-component';
import FadeIn from "./FadeIn"; // Import DataTable

Modal.setAppElement('#root'); // Set the app element

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]); // State to hold roles
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState(''); // State for filtering users by role
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
        fetchRoles(); // Fetch roles when the component mounts
    }, [token]);

    const fetchUsers = () => {
        api.get('/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });
    };

    const fetchRoles = () => {
        api.get('/roles', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setRoles(response.data); // Set roles from the API response
            })
            .catch(error => {
                console.error('There was an error fetching the roles!', error);
            });
    };

    const openModal = (user = {}) => {
        setIsEditing(!!user.id);
        setCurrentUser(user);
        setName(user.name || '');
        setEmail(user.email || '');
        setUserRole(user.role_name || '');
        setPassword('');
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setCurrentUser({});
        setName('');
        setEmail('');
        setUserRole('');
        setPassword('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = { name, email, role: userRole, password };

        if (isEditing) {
            api.put(`/users/${currentUser.id}`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    fetchUsers();
                    closeModal();
                })
                .catch(error => {
                    console.error('There was an error updating the user!', error);
                });
        } else {
            api.post('/register', userData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    fetchUsers();
                    closeModal();
                })
                .catch(error => {
                    console.error('There was an error creating the user!', error);
                });
        }
    };

    // Filter users based on the selected role
    const filteredUsers = selectedRole
        ? users.filter(user => user.role_name === selectedRole)
        : users;

    // Define columns for DataTable
    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
            center: true,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            center: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            center: true,
        },
        {
            name: 'Role',
            selector: row => row.role_name,
            sortable: true,
            center: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <button onClick={() => openModal(row)} className="mr-2 bg-yellow-500 text-white py-1 px-2 rounded">Edit</button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            center: true,
        },
    ];

    return (
        <div className="min-h-screen flex">
            <SideNav role={role} />
            <div className="flex-grow p-10 flex flex-col items-start" style={{ backgroundColor: '#fff4e3' }}>
                <h1 className="text-3xl font-bold mb-6">Manage Roles</h1>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Filter by Role</label>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="">All Roles</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.role_name}>{role.role_name}</option>
                        ))}
                    </select>
                </div>
                <button onClick={() => openModal()} className="mb-4 bg-orange-500 text-white py-2 px-4 rounded-full">Add New User</button>
                <div className="w-full">
                    <DataTable
                        columns={columns}
                        data={filteredUsers} // Pass filtered users to DataTable
                        pagination
                        highlightOnHover
                        pointerOnHover
                    />
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="User Modal"
                className="flex items-center justify-center min-h-screen" // Ensure the content is centered
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" // Center the content vertically and horizontally
            >
                <FadeIn>
                <div className="bg-white p-6 rounded shadow-lg w-96">
                    <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit User' : 'Add New User'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Role</label>
                            <select
                                value={userRole}
                                onChange={(e) => setUserRole(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select a role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.role_name}>{role.role_name}</option>
                                ))}
                            </select>
                        </div>
                        {!isEditing && (
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button type="button" onClick={closeModal} className="mr-4 bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
                            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">{isEditing ? 'Update' : 'Create'}</button>
                        </div>
                    </form>
                </div>
                </FadeIn>
            </Modal>
        </div>
    );
};

export default UsersManagement;
