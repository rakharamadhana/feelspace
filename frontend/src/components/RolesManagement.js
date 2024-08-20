import React, { useEffect, useState } from 'react';
import api from '../api';  // Import the api instance
import SideNav from '../components/SideNav';
import DataTable from 'react-data-table-component'; // Import DataTable

const RolesManagement = () => {
    const [roles, setRoles] = useState([]);
    const [newRoleName, setNewRoleName] = useState(''); // State for new role input
    const [message, setMessage] = useState(''); // State for success/error messages
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchRoles();
    }, [token]);

    const fetchRoles = () => {
        api.get('/roles', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setRoles(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the roles!', error);
            });
    };

    const handleCreateRole = (e) => {
        e.preventDefault();
        const newRole = { role_name: newRoleName };

        api.post('/roles', newRole, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                fetchRoles(); // Refresh the roles list after adding a new role
                setNewRoleName(''); // Clear the input field
                setMessage('Role created successfully!');
            })
            .catch(error => {
                console.error('There was an error creating the role!', error);
                setMessage('Error creating role. Please try again.');
            });
    };

    // Define columns for DataTable
    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
            center: true,
        },
        {
            name: 'Role Name',
            selector: row => row.role_name,
            sortable: true,
            center: true,
        },
    ];

    return (
        <div className="min-h-screen flex">
            <SideNav role={role} />
            <div className="flex-grow p-10 flex flex-col items-start" style={{ backgroundColor: '#fff4e3' }}>
                <h1 className="text-3xl font-bold mb-6">Manage Roles</h1>

                {/* Role creation form */}
                <form onSubmit={handleCreateRole} className="mb-4 w-full max-w-md">
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            placeholder="Enter new role name"
                            className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                        <button
                            type="submit"
                            className="ml-4 w-[10rem] h-[3rem] bg-orange-500 text-white py-2 px-4 rounded-full"
                        >
                            Add Role
                        </button>
                    </div>
                </form>

                {message && <p className="text-center mt-4 text-green-500">{message}</p>}

                <div className="w-full">
                    <DataTable
                        columns={columns}
                        data={roles}
                        pagination
                        highlightOnHover
                        pointerOnHover
                    />
                </div>
            </div>
        </div>
    );
};

export default RolesManagement;
