import React from 'react';
import Sidebar from '../components/sidebar.jsx';

export default function Chat() {
    return (
        <div className="flex h-screen text-white bg-gray-950">
            <Sidebar />
            <div className="flex-1 flex flex-col border-l border-gray-800 max-w-full">
                <div className="flex-1 overflow-y-auto p-4">

                </div>
                <form className="border-t border-gray-800 p-4 flex justify-center">
                        <input
                            type="text"
                            placeholder="Ask anything..."
                            className="w-full max-w-2xl bg-gray-900 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus ring-blue-500"
                        />
                        <button className="ml-2 rounded-2xl ">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                 className="size-6">
                                <path
                                    d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"/>
                            </svg>
                        </button>
                </form>
            </div>
        </div>
    );
}