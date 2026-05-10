import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import api from '../api/axios';

function formatApiError(err: unknown): string {
    if (!isAxiosError(err)) return 'Something went wrong.';
    const d = err.response?.data;
    if (typeof d === 'string') return d;
    if (d && typeof d === 'object') {
        if ('detail' in d && typeof d.detail === 'string') return d.detail;
        const first = Object.values(d)[0];
        if (Array.isArray(first) && typeof first[0] === 'string') return first[0];
        if (typeof first === 'string') return first;
    }
    return err.message || 'Login failed.';
}

const inputClass =
    'mt-1 w-full border border-gray-400 rounded px-2 py-1.5 text-sm focus:border-blue-600 focus:outline-none';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/login/', { username, password });
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            navigate('/');
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md">
            <h1 className="mb-4 text-xl font-bold">Login</h1>

            <div className="border border-gray-300 bg-white p-6">
                {error ? (
                    <p className="mb-4 rounded border border-red-300 bg-red-50 px-2 py-2 text-sm text-red-800">
                        {error}
                    </p>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="login-username" className="text-sm font-medium">
                            Username
                        </label>
                        <input
                            id="login-username"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="login-password" className="text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="login-password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={inputClass}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Please wait...' : 'Login'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-600">
                    No account? <Link to="/register" className="text-blue-600 underline">Register here</Link>
                </p>
                <p className="mt-3 border-t border-gray-200 pt-3 text-xs text-gray-500">
                    Demo user:{' '}
                    <code className="rounded bg-gray-100 px-1 py-0.5 text-gray-800">nikos</code>{' '}
                    /{' '}
                    <code className="rounded bg-gray-100 px-1 py-0.5 text-gray-800">asdf1234</code>
                </p>
            </div>
        </div>
    );
}

export default Login;
