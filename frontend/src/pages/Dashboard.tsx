import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import type { Lead, PaginatedResponse } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { Search, Download, LogOut, Plus, Edit2, Trash2 } from 'lucide-react';
import LeadModal from '../components/LeadModal';

export default function Dashboard() {
  const { user, logout } = useAuth();

  // Data & UI State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500); // 500ms debounce
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter && { status: statusFilter }),
        ...(sourceFilter && { source: sourceFilter }),
      });

      const { data } = await api.get<PaginatedResponse<Lead>>(`/leads?${queryParams}`);
      setLeads(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError('Failed to load leads from the server.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, sourceFilter, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // CSV Export Action
  const handleExport = async () => {
    try {
      const response = await api.get('/leads/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export CSV');
    }
  };

  // Create / Update API Call
  const handleAddOrEditLead = async (leadData: Partial<Lead>) => {
    if (selectedLead) {
      await api.put(`/leads/${selectedLead._id}`, leadData);
    } else {
      await api.post('/leads', leadData);
    }
    fetchLeads(); // Refresh the table
  };

  // Delete API Call
  const handleDelete = async (id: string) => {
    // Native browser popup for deletion confirmation
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads(); // Refresh the table
      } catch (err) {
        alert('Failed to delete lead. Make sure you have Admin permissions.');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Navbar */}
      <div className="flex justify-center items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GigFlow Leads</h1>
          <p className="text-gray-500 text-sm mt-1">Logged in as {user?.name} <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-semibold ml-2">{user?.role}</span></p>
        </div>
        <button onClick={logout} className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-center mb-6">
        <div className="flex flex-col md:flex-row w-full xl:w-auto gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text" placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full"
            />
          </div>

          <select
            value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-auto"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>

          <select
            value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-auto"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
        </div>

        <div className="flex gap-3 w-full xl:w-auto">
          <button onClick={handleExport} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={18} /> Export
          </button>
          <button onClick={() => { setSelectedLead(null); setIsModalOpen(true); }} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={18} /> Add Lead
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[400px]">
            <thead>
              <tr className="border border-gray-200">
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Name</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Email</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Source</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Added On</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading leads...</td></tr>
              ) : error ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-red-500">{error}</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No leads found matching your criteria.</td></tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{lead.source}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setSelectedLead(lead); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Lead">
                          <Edit2 size={18} />
                        </button>
                        {/* Only Admin users can see and click the delete button */}
                        {user?.role === 'Admin' && (
                          <button onClick={() => handleDelete(lead._id)} className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete Lead">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {!loading && leads.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600 font-medium">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Popup Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddOrEditLead}
        initialData={selectedLead}
      />
    </div>
  );
}