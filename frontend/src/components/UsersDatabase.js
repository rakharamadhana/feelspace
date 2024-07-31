import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideNav from '../components/SideNav';
import Modal from 'react-modal';

const UsersDatabase = () => {
    const [users, setUsers] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const [password, setPassword] = useState('');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = () => {
        axios.get('http://localhost:3001/users', {
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
            axios.put(`http://localhost:3001/users/${currentUser.id}`, userData, {
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
            axios.post('http://localhost:3001/register', userData, {
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

    return (
        <div className="min-h-screen flex">
            <SideNav role={role} />
            <div className="flex-grow p-10 flex flex-col items-center" style={{ backgroundColor: '#fff4e3' }}>
                <h1 className="text-3xl font-bold mb-6">Users Database</h1>
                <button onClick={() => openModal()} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded">Add New User</button>
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full bg-white mx-auto">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-300">ID</th>
                            <th className="py-2 px-4 border-b border-gray-300">Name</th>
                            <th className="py-2 px-4 border-b border-gray-300">Email</th>
                            <th className="py-2 px-4 border-b border-gray-300">Role</th>
                            <th className="py-2 px-4 border-b border-gray-300">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="py-2 px-4 border-b border-gray-300 text-center">{user.id}</td>
                                <td className="py-2 px-4 border-b border-gray-300 text-center">{user.name}</td>
                                <td className="py-2 px-4 border-b border-gray-300 text-center">{user.email}</td>
                                <td className="py-2 px-4 border-b border-gray-300 text-center">{user.role_name}</td>
                                <td className="py-2 px-4 border-b border-gray-300 text-center">
                                    <button onClick={() => openModal(user)} className="mr-2 bg-yellow-500 text-white py-1 px-2 rounded">Edit</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="User Modal"
                className="flex items-center justify-center"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
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
                            <input
                                type="text"
                                value={userRole}
                                onChange={(e) => setUserRole(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
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
            </Modal>
        </div>
    );
};

export default UsersDatabase;
