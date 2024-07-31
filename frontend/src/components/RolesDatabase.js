import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideNav from '../components/SideNav';

const RolesDatabase = () => {
    const [roles, setRoles] = useState([]);
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://localhost:3001/roles', {
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
    }, [token]);

    return (
        <div className="min-h-screen flex">
            <SideNav role={role} />
            <div className="flex-grow p-10 flex flex-col items-center" style={{ backgroundColor: '#fff4e3' }}>
                <h1 className="text-3xl font-bold mb-6">Roles Database</h1>
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full bg-white mx-auto">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-300">ID</th>
                            <th className="py-2 px-4 border-b border-gray-300">Role Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {roles.map((role) => (
                            <tr key={role.id}>
                                <td className="py-2 px-4 border-b border-gray-300 text-center">{role.id}</td>
                                <td className="py-2 px-4 border-b border-gray-300 text-center">{role.role_name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RolesDatabase;
