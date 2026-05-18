import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'Sales' | 'Admin'>('Sales'); // Default to Sales
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = isLogin ? '/users/login' : '/users/register';

            // If registering, include the name and the selected role
            const payload = isLogin
                ? { email, password }
                : { name, email, password, role };

            const { data } = await api.post(endpoint, payload);

            if (data.success) {
                login(data);
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">GigFlow</h1>
                    <h2 className="text-xl font-bold text-gray-900 mt-4">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </h2>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text" required placeholder="John Doe"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
                                value={name} onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email" required placeholder="you@company.com"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type="password" required minLength={6} placeholder="••••••••"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Role Selection - Only visible during Registration */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Account Role</label>
                            <select
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
                                value={role} onChange={(e) => setRole(e.target.value as 'Sales' | 'Admin')}
                            >
                                <option value="Sales">Sales User</option>
                                <option value="Admin">Administrator</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Admins can delete leads. Sales users can view and edit.</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-2"
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
}