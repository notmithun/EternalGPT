import { React, useState } from 'react';

export default function LoginComponent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = (e) => {
        e.preventDefault();
        console.log(username, password);
        const res = fetch('http://localhost:8000/login', {})
    }
    return (
        <div className="bg-gray-900 p-8 rounded-lg shadow-md w-80 flex flex-col gap-4">
      <h2 className="text-white text-2xl font-bold text-center">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
        >
          Login
        </button>
      </form>
      <p className="text-gray-400 text-sm text-center">
        Don’t have an account? <span className="text-blue-500 cursor-pointer">Sign up</span>
      </p>
    </div>
    );
}