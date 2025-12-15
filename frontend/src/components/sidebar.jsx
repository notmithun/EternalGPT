import React from 'react';

export default function Sidebar({ chats, onSelectChats, onNewChat }) {
    return (
        <aside className="h-screen flex flex-col w-64 bg-gray-950 border-r border-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-800 text-lg font-semibold">
                EternalGPT
            </div>
            <button
                className="cursor-pointer rounded m-4 p-2 bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 transition"
                onClick={onNewChat}
            >
                + New Chat
            </button>
            <div className="flex-1 overflow-y-auto px-2 text-sm text-gray-400">
                {
                    chats.map(chat => (
                    <div
                        key={chat.id}
                        onClick={() => onSelectChats(chat.id)}
                        className="p-2 hover:bg-gray-900 rounded cursor-pointer"
                    >
                        Chat {chat.id}
                    </div>
                ))}
            </div>
        </aside>
    );
}

//