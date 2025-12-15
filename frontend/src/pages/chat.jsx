import React, {useEffect, useRef, useState} from 'react';
import Sidebar from '../components/sidebar.jsx';
import ErrPage from '../components/errPage.jsx';
import ReactMarkdown from 'react-markdown';

export default function Chat() {
    const [input, setInput] = useState('');
    const [chats, setChats] = useState([]);
    const [currentChatID, setCurrentChatID] = useState(null);
    const [messages, setMessages] = useState([]);
    const textareaRef = useRef(null);
    const scrollRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      async function loadChats() {
        try {
          const res = await fetch("http://localhost:8000/api/chats/");
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          setChats(data);
        } catch (err) {
          console.error(err);
          setError(err);
        }
      }

      loadChats().then(r => console.log(r));
    }, []);

    async function selectChat(chatId) {
        try {
            setCurrentChatID(chatId);

            const res = await fetch(`http://localhost:8000/api/chats/${chatId}/`);
            const data = await res.json();
            const normalized = data.map(m => ({
                role: m.role,
                text: m.content,
            }))
            setMessages(normalized);
        } catch (err) {
            console.error(err);
            setError(err)
        }
    }

    async function createNewChat() {
        try {
            const res = await fetch(`http://localhost:8000/api/chats/`, {
                method: 'POST',
            })
            const chat = await res.json();
            setChats(prevState => [chat, ...prevState]);
            setCurrentChatID(chat.id);
            setMessages([])
        } catch (err) {
            console.error(err);
            setError(err);
        }

    }

    async function sendRequest(e) {
        try {
            e.preventDefault();
            if (!input.trim()) return;
            setMessages(prev => [...prev, {role: "user", text: input}])
            setInput("");
            const res = await fetch(`http://localhost:8000/api/chats/${currentChatID}/message/`, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({message: input})
            })
            const data = await res.json();
            setMessages(prev => [...prev, {role: "assistant", text: data.reply}])
        } catch (err) {
            console.error(err);
            setError(err)
        }
    }

    if (error) {
        return (
            <ErrPage err={error} />
        )
    }

    return (
        <div className="flex h-screen text-white bg-gray-950">
            <Sidebar
                chats={chats}
                onSelectChats={selectChat}
                onNewChat={createNewChat}
            />
            <div className="flex-1 flex flex-col border-l border-gray-800 max-w-full">
                <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg, i) => (
                            msg.role === "user" ? (
                                <div
                                    key={i}
                                    className="ml-auto max-w-xl bg-blue-600 px-4 py-2 rounded-2xl rounded-br-md"
                                >
                                    {msg.text}
                                </div>
                            ) : (
                                <div
                                    key={i}
                                    className="mr-auto max-w-xl text-gray-200 leading-relaxed"
                                >
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            )
                        ))}
                    </div>
                </div>
                <form className="border-t border-gray-800 p-4 flex justify-center" onSubmit={sendRequest}>
                        <textarea
                            onChange={e => {
                                setInput(e.target.value)
                                e.target.style.height = "auto";                // reset
                                e.target.style.height = e.target.scrollHeight + "px";
                            }}
                            ref={textareaRef}
                            value={input}
                            onKeyDown={e => {
                                if (e.key === "Enter" && e.shiftKey) {
                                    e.preventDefault()
                                    setInput(prevState => prevState + "\n")
                                } else if (e.key === "Enter") {
                                    sendRequest(e).then(r => console.log(r))
                                }
                            }}
                            placeholder="Ask anything..."
                            className="w-full max-w-2xl bg-gray-900 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus ring-blue-500 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-900 min-h-12 h-12 max-h-30 resize-none"
                            rows={2}
                        />
                        <button className="ml-2 rounded-2xl cursor-pointer" type="submit">
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