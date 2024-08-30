import React, { useEffect, useState } from 'react';
import api from '../api';  // Import the api instance
import SideNav from '../components/SideNav';
import DataTable from 'react-data-table-component'; // Import DataTable
import { useParams } from 'react-router-dom';

const CaseDetailsResponse = () => {
    const [responses, setResponses] = useState([]);
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    const { id } = useParams(); // Get the case ID from the URL params

    useEffect(() => {
        fetchResponses();
    }, [token]);

    const fetchResponses = () => {
        api.get(`/cases/details/all/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.data && Array.isArray(response.data)) {
                    setResponses(response.data);
                } else {
                    setResponses([]);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the responses!', error);
                setResponses([]); // Set to an empty array to avoid null errors
            });
    };

    // Define columns for DataTable
    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
            center: true,
            width: '70px',
        },
        {
            name: 'Character ID',
            selector: row => row.character_id,
            sortable: true,
            center: true,
            width: '120px',
        },
        {
            name: 'Emotion',
            selector: row => row.emotion || '',
            sortable: true,
            center: true,
            width: '120px',
        },
        {
            name: 'Reasoning',
            selector: row => row.reasoning || '',
            sortable: true,
            center: true,
            wrap: true,
        },
        {
            name: 'Observe',
            selector: row => row.observe || '',
            sortable: true,
            center: true,
            wrap: true,
        },
        {
            name: 'Feeling',
            selector: row => row.feeling || '',
            sortable: true,
            center: true,
            wrap: true,
        },
        {
            name: 'Need',
            selector: row => row.need || '',
            sortable: true,
            center: true,
            wrap: true,
        },
        {
            name: 'Request',
            selector: row => row.request || '',
            sortable: true,
            center: true,
            wrap: true,
        },
        {
            name: 'Conclusion',
            selector: row => row.conclusion || '',
            sortable: true,
            center: true,
            wrap: true,
        },
        {
            name: 'Submitted By',
            selector: row => row.created_by,
            sortable: true,
            center: true,
        },
        {
            name: 'Created At',
            selector: row => new Date(row.created_at).toLocaleString(),
            sortable: true,
            center: true,
        },
    ];

    return (
        <div className="min-h-screen flex">
            <SideNav role={role} />
            <div className="flex-grow p-10 flex flex-col items-center" style={{ backgroundColor: '#fff4e3' }}>
                <h1 className="text-3xl font-bold mb-6">Case Responses</h1>
                <div className="w-full max-w-7xl">
                    <DataTable
                        columns={columns}
                        data={responses}
                        pagination
                        highlightOnHover
                        pointerOnHover
                        responsive={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default CaseDetailsResponse;
