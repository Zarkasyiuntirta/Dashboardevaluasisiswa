
import React, { useState } from 'react';

interface LoginComponentProps {
  onLogin: (username: string, password: string) => boolean;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
      <path fillRule="evenodd" d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.99 9.99 0 0010 12a9.99 9.99 0 00-6.535 2.493z" clipRule="evenodd" />
    </svg>
);

const LockClosedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
);


const LoginComponent: React.FC<LoginComponentProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(username, password);
    if (!success) {
      setError('Username atau password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-navy-900 to-navy-950">
      <div className="w-full max-w-md p-8 space-y-8 bg-navy-900/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-navy-950/50 border border-navy-800">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
                Dashboard Evaluasi
            </h1>
            <p className="mt-2 text-navy-300">VIIA SMP 6 Negeri Kota Serang</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="text-sm font-medium text-navy-300">Username</label>
            <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <UserIcon />
                </div>
                <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nama Murid / Mata Pelajaran"
                    className="w-full pl-10 pr-3 py-2 bg-navy-950 border border-navy-800 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>
          </div>
          <div>
            <label htmlFor="password-input" className="text-sm font-medium text-navy-300">Password</label>
            <div className="relative mt-2">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon />
                </div>
                <input
                    id="password-input"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="NIM / Password Admin"
                    className="w-full pl-10 pr-3 py-2 bg-navy-950 border border-navy-800 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-950 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
