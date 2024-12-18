import React, { useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTableList, faUser } from '@fortawesome/free-solid-svg-icons';
import ProfileModal from '../components/ProfileModal'; // Import your Profile component as a modal

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem('role');
    const userName = localStorage.getItem('name');
    const [isTouched, setIsTouched] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // State to control modal visibility

    const studentRole = role.toLowerCase().includes('student') ? 'student' : role.toLowerCase();

    const navigation = [
        {
            name: 'Home',
            href: `/${studentRole}-dashboard`,
            current: location.pathname === `/${studentRole}-dashboard`,
            color: 'bg-orange-500 text-white hover:bg-orange-700',
            target: '_self' // Same tab
        },
        {
            name: '問卷表單',
            href: role === 'Student-Exp'
                ? 'https://docs.google.com/forms/d/e/1FAIpQLSfv1vMbaM-SEUzB6qQeAbVxkOgmyrducT5Q5tPi2b963L7dRw/viewform?usp=sharing'
                : role === 'Student-Ctrl'
                    ? 'https://docs.google.com/forms/d/e/1FAIpQLSfv1vMbaM-SEUzB6qQeAbVxkOgmyrducT5Q5tPi2b963L7dRw/viewform?usp=sharing'
                    : '#', // Default URL
            current: false, // Not linked to the current location
            color: 'bg-blue-500 text-white hover:bg-blue-700', // Unique color for this button
            target: '_blank' // Opens in a new tab
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        navigate('/login');
    };

    return (
        <Disclosure as="nav">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                target={item.target} // Open in new tab
                                                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined} // Add security for new tab links
                                                className={classNames(
                                                    item.current
                                                        ? 'bg-orange-700 text-white'
                                                        : `${item.color} ${
                                                            isTouched ? 'scale-95' : 'hover:scale-110'
                                                        } active:scale-95 transition duration-300 ease-in-out`,
                                                    item.name === 'Home' || item.name === '問卷表單'
                                                        ? 'rounded-full px-6 py-3 flex items-center space-x-2 text-md font-bold'
                                                        : 'rounded-md px-3 py-2 text-sm font-medium'
                                                )}
                                                aria-current={item.current ? 'page' : undefined}
                                                onTouchStart={() => setIsTouched(true)}
                                                onTouchEnd={() => setIsTouched(false)}
                                            >
                                                {item.name === 'Home' && (
                                                    <FontAwesomeIcon icon={faHome} className="mr-2 text-xl"/>
                                                )}
                                                {item.name === '問卷表單' && (
                                                    <FontAwesomeIcon icon={faTableList} className="mr-2 text-xl"/>
                                                )}
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div
                                className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div className="flex items-center">
                                        <Menu.Button
                                            className="flex items-center rounded-full bg-orange-500 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-800">
                                            <span className="sr-only">Open user menu</span>
                                            <FontAwesomeIcon
                                                icon={faUser}
                                                className="h-6 w-6 text-white rounded-xl p-2"
                                            />
                                        </Menu.Button>
                                        {/* Display user's name next to the button */}
                                        <span
                                            className="ml-2 text-black font-medium">{userName}</span> {/* Name in black */}
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
                                        <Menu.Items
                                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => setIsProfileOpen(true)} // Open the modal on click
                                                        className={classNames(
                                                            active ? 'bg-gray-100' : '',
                                                            'block w-full text-left px-4 py-2 text-sm text-gray-700'
                                                        )}
                                                    >
                                                        Profile
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleLogout}
                                                        className={classNames(
                                                            active ? 'bg-gray-100' : '',
                                                            'block w-full text-left px-4 py-2 text-sm text-gray-700'
                                                        )}
                                                    >
                                                        Logout
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as={Link}
                                    to={item.href}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>

                    {/* Profile Modal */}
                    {isProfileOpen && (
                        <ProfileModal onClose={() => setIsProfileOpen(false)} />
                    )}
                </>
            )}
        </Disclosure>
    );
};

export default Navbar;
