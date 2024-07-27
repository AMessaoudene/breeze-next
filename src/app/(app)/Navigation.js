import ApplicationLogo from '@/components/ApplicationLogo';
import Dropdown from '@/components/Dropdown';
import Link from 'next/link';
import NavLink from '@/components/NavLink';
import ResponsiveNavLink, { ResponsiveNavButton } from '@/components/ResponsiveNavLink';
import { DropdownButton } from '@/components/DropdownLink';
import { useAuth } from '@/hooks/auth';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import useEcho from '@/hooks/echo';
import { Badge, Button, Popover, PopoverTrigger, PopoverContent, Image } from '@nextui-org/react';
import { axios } from '@/lib/axios';

const Navigation = ({ user }) => {
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [messages, setMessages] = useState([]);
    const echo = useEcho();

    const handleEchoCallback = useCallback(() => {
        setUnreadMessages(prevUnread => prevUnread + 1);
        sound.play();
    }, []);

    useEffect(() => {
        if (echo) {
            const channel = echo.private(`chat.${user?.id}`);
            channel.listen('MessageSent', event => {
                if (event.receiver.id === user?.id) {
                    console.log('Real-time event received: ', event);
                    handleEchoCallback();
                }
            });
            return () => {
                channel.stopListening('MessageSent');
            };
        }
    }, [user, echo, handleEchoCallback]);

    useEffect(() => {
        axios.post('/api/get-unread-messages', {
            user_id: user?.id,
        }).then(res => {
            setUnreadMessages(res.data.length);
            setMessages(res.data);
        });
    }, [user]);

    const fetchMessages = () => {
        // Fetch messages
    };

    return (
        <nav className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/dashboard">
                                <ApplicationLogo className="block h-10 w-auto fill-current text-gray-600" />
                            </Link>
                        </div>
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink
                                href="/dashboard"
                                active={usePathname() === '/dashboard'}>
                                Dashboard
                            </NavLink>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <Popover placement="bottom-end" showArrow="true">
                            <Badge
                                content={unreadMessages}
                                shape="circle"
                                size="lg"
                                color="danger"
                                isInvisible={unreadMessages === 0}>
                                <PopoverTrigger>
                                    <Button
                                        radius="full"
                                        size="sm"
                                        variant="solid"
                                        color="primary"
                                        isIconOnly
                                        aria-label={`There are ${unreadMessages} unread messages.`}
                                        onClick={fetchMessages}>
                                    </Button>
                                </PopoverTrigger>
                            </Badge>

                            <PopoverContent className="flex">
                                <div className="flex w-full flex-col divide-y divide-gray-300 p-2">
                                    {messages.map(msg => (
                                        <div
                                            key={msg.id}
                                            className="flex max-w-96 gap-2 py-2">
                                            <Image
                                                alt="Profile pic"
                                                className="w-full object-cover"
                                                height={24}
                                                src={`https://ui-avatars.com/api/?size=256&name=${msg.from.name}`}
                                                width={24}
                                                radius="full"
                                            />
                                            <div className="flex w-full flex-col">
                                                <span className="text-sm">
                                                    {msg.message}
                                                </span>
                                                <span className="text-right text-[10px] text-gray-400">
                                                    {msg.from.name}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        <Dropdown
                            align="right"
                            width="48"
                            trigger={
                                <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                    <div>{user?.name}</div>
                                    <div className="ml-1">
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 111.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </button>
                            }>
                            <DropdownButton onClick={logout}>
                                Logout
                            </DropdownButton>
                        </Dropdown>
                    </div>

                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setOpen(open => !open)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24">
                                {open ? (
                                    <path
                                        className="inline-flex"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        className="inline-flex"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {open && (
                <div className="block sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href="/dashboard"
                            active={usePathname() === '/dashboard'}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-10 w-10 fill-current text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>

                            <div className="ml-3">
                                <div className="font-medium text-base text-gray-800">
                                    {user?.name}
                                </div>
                                <div className="font-medium text-sm text-gray-500">
                                    {user?.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavButton onClick={logout}>
                                Logout
                            </ResponsiveNavButton>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
