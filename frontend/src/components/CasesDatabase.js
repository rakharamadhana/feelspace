import React, { useEffect, useState } from 'react';
import api from '../api';  // Import the api instance
import SideNav from '../components/SideNav';
import DataTable from 'react-data-table-component'; // Import DataTable
import Modal from 'react-modal'; // Import Modal

Modal.setAppElement('#root'); // Set the app element for accessibility

const CasesDatabase = () => {
    const [cases, setCases] = useState([]);
    const [newCase, setNewCase] = useState({ title: '', borderColor: '', textColor: '', story: '' }); // State for new case input
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCaseId, setCurrentCaseId] = useState(null);
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchCases();
    }, [token]);

    const fetchCases = () => {
        api.get('/cases', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setCases(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the cases!', error);
            });
    };

    const handleCreateOrUpdateCase = (e) => {
        e.preventDefault();

        const caseData = {
            title: newCase.title,
            borderColor: newCase.borderColor,
            textColor: newCase.textColor,
            story: newCase.story,
        };

        if (isEditing && currentCaseId) {
            // Update existing case
            api.put(`/cases/${currentCaseId}`, caseData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(() => {
                    fetchCases();
                    closeModal();
                })
                .catch(error => {
                    console.error('There was an error updating the case!', error);
                });
        } else {
            // Create new case
            api.post('/cases', caseData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(() => {
                    fetchCases();
                    closeModal();
                })
                .catch(error => {
                    console.error('There was an error creating the case!', error);
                });
        }
    };

    const openModal = (caseItem = null) => {
        if (caseItem) {
            setIsEditing(true);
            setCurrentCaseId(caseItem.id);
            setNewCase({
                title: caseItem.title,
                borderColor: caseItem.borderColor,
                textColor: caseItem.textColor,
                story: caseItem.story,
            });
        } else {
            setIsEditing(false);
            setNewCase({ title: '', borderColor: '', textColor: '', story: '' });
        }
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setNewCase({ title: '', borderColor: '', textColor: '', story: '' });
        setCurrentCaseId(null);
    };

    // Define columns for DataTable (only ID, Title, and Story)
    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
            center: true,
            width: '100px', // Adjust column width as necessary
        },
        {
            name: 'Title',
            selector: row => row.title,
            sortable: true,
            center: true,
            wrap: true, // Allow text wrapping if needed
        },
        {
            name: 'Story',
            selector: row => row.story,
            sortable: true,
            center: true,
            wrap: true, // Allow text wrapping if needed
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
            <div className="flex-grow p-10 flex flex-col items-center" style={{ backgroundColor: '#fff4e3' }}>
                <h1 className="text-3xl font-bold mb-6">Cases Database</h1>

                {/* Case creation form */}
                <button onClick={() => openModal()} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded">Add New Case</button>

                <div className="w-full max-w-5xl"> {/* Restrict the width to fit well with the SideNav */}
                    <DataTable
                        columns={columns}
                        data={cases}
                        pagination
                        highlightOnHover
                        pointerOnHover
                        responsive={true} // Make the table responsive
                        customStyles={{
                            table: {
                                style: {
                                    width: '100%', // Make sure the table takes the full width of the container
                                },
                            },
                            header: {
                                style: {
                                    minHeight: '56px',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Case Modal"
                className="flex items-center justify-center"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="bg-white p-6 rounded shadow-lg w-96">
                    <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Case' : 'Add New Case'}</h2>
                    <form onSubmit={handleCreateOrUpdateCase}>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Title</label>
                            <input
                                type="text"
                                value={newCase.title}
                                onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Border Color</label>
                            <input
                                type="text"
                                value={newCase.borderColor}
                                onChange={(e) => setNewCase({ ...newCase, borderColor: e.target.value })}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Text Color</label>
                            <input
                                type="text"
                                value={newCase.textColor}
                                onChange={(e) => setNewCase({ ...newCase, textColor: e.target.value })}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Story</label>
                            <textarea
                                value={newCase.story}
                                onChange={(e) => setNewCase({ ...newCase, story: e.target.value })}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                                required
                            />
                        </div>
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

export default CasesDatabase;
