import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import ProfileModal from '../components/ProfileModal'; // Import the ProfileModal component

const SideNav = ({ role }) => {
    const navigate = useNavigate();
    const name = localStorage.getItem('name');
    const [isProfileOpen, setIsProfileOpen] = useState(false); // State to control modal visibility

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        navigate('/login');
    };

    const dashboardPath = `/${role.toLowerCase()}-dashboard`;

    return (
        <>
            <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col justify-between p-6">
                <div>
                    <div className="text-center text-xl font-bold mb-6">{role} Dashboard</div>
                    <nav>
                        <ul>
                            <li className="mb-4">
                                <Link to={dashboardPath} className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
                            </li>
                            {role === 'Admin' && (
                                <>
                                    <li className="mb-4">
                                        <Link to="/users-database" className="block p-2 hover:bg-gray-700 rounded">Users Database</Link>
                                    </li>
                                    <li className="mb-4">
                                        <Link to="/roles-database" className="block p-2 hover:bg-gray-700 rounded">Roles Database</Link>
                                    </li>
                                </>
                            )}
                            {(role === 'Admin' || role === 'Teacher') && (
                                <>
                                    <li className="mb-4">
                                        <Link to="/cases-database" className="block p-2 hover:bg-gray-700 rounded">Cases
                                            Management</Link>
                                    </li>
                                    <li className="mb-4">
                                        <Link to="/cases-responses" className="block p-2 hover:bg-gray-700 rounded">Cases
                                            Responses</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
                <div className="relative">
                    <Menu as="div">
                        {({ open }) => (
                            <>
                                <div>
                                    <Menu.Button className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-700 rounded">
                                        <span>{name}</span>
                                        {open ? (
                                            <ChevronDownIcon className="w-5 h-5 ml-2" />
                                        ) : (
                                            <ChevronUpIcon className="w-5 h-5 ml-2" />
                                        )}
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute bottom-12 left-0 w-full mt-2 origin-bottom-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => setIsProfileOpen(true)} // Open the modal on click
                                                        className={`${
                                                            active ? 'bg-gray-100' : ''
                                                        } w-full text-left block px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        Profile
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleLogout}
                                                        className={`${
                                                            active ? 'bg-gray-100' : ''
                                                        } w-full text-left block px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        Logout
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </>
                        )}
                    </Menu>
                </div>
            </div>

            {/* Profile Modal */}
            {isProfileOpen && (
                <ProfileModal onClose={() => setIsProfileOpen(false)} />
            )}
        </>
    );
};

export default SideNav;
