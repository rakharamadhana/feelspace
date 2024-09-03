import React, { useEffect, useState } from 'react';
import api from '../api';  // Import the API instance
import SideNav from '../components/SideNav';
import DataTable from 'react-data-table-component'; // Import DataTable

const CasesResponse = () => {
    const [responses, setResponses] = useState([]);
    const [filteredResponses, setFilteredResponses] = useState([]);
    const [caseIdOptions, setCaseIdOptions] = useState([]);
    const [characterOptions, setCharacterOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [caseIdFilter, setCaseIdFilter] = useState('');
    const [characterIdFilter, setCharacterIdFilter] = useState(''); // Now filtering by character_id
    const [submittedByFilter, setSubmittedByFilter] = useState('');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchCasesResponse();
        fetchCaseOptions();  // Step 1: Fetch Case ID options
    }, [token]);

    // Step 1: Fetch Case ID options
    const fetchCaseOptions = () => {
        api.get('/cases/options', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => setCaseIdOptions(response.data))
            .catch(error => console.error('Error fetching case options:', error));
    };

    // Step 2: Fetch Character options based on selected Case ID
    const handleCaseChange = (e) => {
        const selectedCaseId = e.target.value;
        setCaseIdFilter(selectedCaseId);

        if (selectedCaseId) {
            api.get(`/cases/${selectedCaseId}/characters/options`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => setCharacterOptions(response.data))
                .catch(error => console.error('Error fetching character options:', error));

            // Clear previous character and user selections
            setCharacterIdFilter('');
            setUserOptions([]);
            setSubmittedByFilter('');
        } else {
            setCharacterOptions([]);
            setCharacterIdFilter('');
            setUserOptions([]);
            setSubmittedByFilter('');
        }
    };

    // Step 3: Fetch User options based on selected Character ID and Case ID
    const handleCharacterChange = (e) => {
        const selectedCharacterId = e.target.value;
        setCharacterIdFilter(selectedCharacterId);

        if (selectedCharacterId && caseIdFilter) {
            api.get(`/cases/${caseIdFilter}/characters/${selectedCharacterId}/users/options`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => setUserOptions(response.data))
                .catch(error => console.error('Error fetching user options:', error));

            setSubmittedByFilter('');
        } else {
            setUserOptions([]);
            setSubmittedByFilter('');
        }
    };

    // Fetch all responses initially
    const fetchCasesResponse = () => {
        api.get('/cases/details/all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setResponses(response.data);
                setFilteredResponses(response.data); // Initialize filtered responses
            })
            .catch(error => {
                console.error('There was an error fetching the responses!', error);
            });
    };

    // Apply filtering based on the selected options
    const handleFilter = () => {
        const filtered = responses.filter(item => {
            return (
                (caseIdFilter ? item.case_id.toString() === caseIdFilter : true) &&
                (characterIdFilter ? item.character_id.toString() === characterIdFilter : true) &&
                (submittedByFilter ? item.created_by_name === submittedByFilter : true)
            );
        });
        setFilteredResponses(filtered);
    };

    // Define columns for DataTable
    const columns = [
        {
            name: 'Case ID',
            selector: row => row.case_id,
            sortable: true,
            style: {
                justifyContent: 'center', // Center the content in the column
            },
            width: '100px',
        },
        {
            name: 'Character Name',
            selector: row => row.character_name, // Display the character's name
            sortable: true,
            style: {
                justifyContent: 'center', // Center the content in the column
            },
            width: '150px',
        },
        {
            name: 'Student Name',
            selector: row => row.created_by_name, // Display the user's name
            sortable: true,
            style: {
                justifyContent: 'center', // Center the content in the column
            },
        },
        {
            name: 'Emotion',
            selector: row => row.emotion,
            sortable: true,
            style: {
                justifyContent: 'center', // Center the content in the column
            },
            width: '120px',
        },
        {
            name: 'Reasoning',
            selector: row => row.reasoning.length > 10 ? `${row.reasoning.substring(0, 10)}...` : row.reasoning,
            sortable: true,
            style: {
                justifyContent: 'center', // Center the content in the column
            },
            wrap: true,
        },
        {
            name: 'Observe',
            selector: row => row.observe.length > 10 ? `${row.observe.substring(0, 10)}...` : row.observe,
            sortable: true,
            style: {
                justifyContent: 'center', // Center the content in the column
            },
            wrap: true,
        },
        {
            name: 'Feeling',
            selector: row => row.feeling.length > 10 ? `${row.feeling.substring(0, 10)}...` : row.feeling,
            sortable: true,
            style: {
                justifyContent: 'center', // Center the content in the column
            },
            wrap: true,
        },
        {
            name: 'Need',
            selector: row => row.need.length > 10 ? `${row.need.substring(0, 10)}...` : row.need,
            sortable: true,
            style: {
                justifyContent: 'center', // Center the content in the column
            },
            wrap: true,
        },
        {
            name: 'Request',
            selector: row => row.request > 10 ? `${row.request.substring(0, 10)}...` : row.request,
            sortable: true,
            style: {
                justifyContent: 'center', // Center the content in the column
            },
            wrap: true,
        },
        {
            name: 'Conclusion',
            selector: row => row.conclusion > 10 ? `${row.conclusion.substring(0, 10)}...` : row.conclusion,
            sortable: true,
            style: {
                justifyContent: 'center', // Center the content in the column
            },
            wrap: true,
        },
        {
            name: 'Created At',
            selector: row => new Date(row.created_at).toLocaleString(),
            sortable: true,
            style: {
                justifyContent: 'center', // Center the content in the column
            },
        },
        {
            name: 'Updated At',
            selector: row => new Date(row.modified_at).toLocaleString(),
            sortable: true,
            center: true,
        },
    ];


    return (
        <div className="min-h-screen flex">
            <SideNav role={role} />
            <div className="flex-grow p-10 flex flex-col items-start" style={{ backgroundColor: '#fff4e3' }}>
                <h1 className="text-3xl font-bold mb-6">Cases Responses</h1>
                {/* Filter Inputs */}
                <div className="mb-4 flex space-x-4">
                    {/* Case ID Filter */}
                    <select
                        value={caseIdFilter}
                        onChange={handleCaseChange}
                        className="p-2 border rounded-2xl"
                    >
                        <option value="">Filter by Case ID</option>
                        {caseIdOptions.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    {/* Character Name Filter */}
                    <select
                        value={characterIdFilter}
                        onChange={handleCharacterChange}
                        className="p-2 border rounded-2xl"
                    >
                        <option value="">Filter by Character Name</option>
                        {characterOptions.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    {/* Submitted By Filter */}
                    <select
                        value={submittedByFilter}
                        onChange={(e) => setSubmittedByFilter(e.target.value)}
                        className="p-2 border rounded-2xl"
                    >
                        <option value="">Filter by Submitted By</option>
                        {userOptions.map(option => (
                            <option key={option.id} value={option.name}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleFilter}
                        className="bg-orange-500 text-white py-2 px-4 rounded-full"
                    >
                        Filter
                    </button>
                </div>
                <div className="w-full max-w-[50rem] xl:max-w-[100rem]">
                    <DataTable
                        columns={columns}
                        data={filteredResponses} // Use filtered responses
                        pagination
                        highlightOnHover
                        pointerOnHover
                        responsive={true} // Make the table responsive
                    />
                </div>
            </div>
        </div>
    );
};

export default CasesResponse;
