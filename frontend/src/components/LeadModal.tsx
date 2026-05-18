import React, { useState, useEffect } from 'react';
import type { Lead } from '../types';

interface LeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Lead>) => Promise<void>;
    initialData?: Lead | null;
}

export default function LeadModal({ isOpen, onClose, onSubmit, initialData }: LeadModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        status: 'New',
        source: 'Website',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Populate form if we are editing an existing lead
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                status: initialData.status,
                source: initialData.source,
            });
        } else {
            setFormData({ name: '', email: '', status: 'New', source: 'Website' });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await onSubmit(formData as Partial<Lead>);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {initialData ? 'Edit Lead' : 'Add New Lead'}
                </h2>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text" required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email" required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Lost">Lost</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })}
                        >
                            <option value="Website">Website</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Referral">Referral</option>
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
                            {loading ? 'Saving...' : 'Save Lead'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}