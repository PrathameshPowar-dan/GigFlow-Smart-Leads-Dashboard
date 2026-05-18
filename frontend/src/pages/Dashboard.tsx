import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Welcome to GigFlow, {user?.name}!</h1>
            <p className="mt-2 text-gray-600">Your role is: <span className="font-semibold">{user?.role}</span></p>

            <button
                onClick={logout}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    );
}