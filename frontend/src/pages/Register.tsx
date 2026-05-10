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
        const parts: string[] = [];
        for (const [key, val] of Object.entries(d)) {
            if (Array.isArray(val) && val.length)
                parts.push(`${key}: ${val.join(' ')}`);
            else if (typeof val === 'string') parts.push(val);
        }
        if (parts.length) return parts.join(' ');
    }
    return err.message || 'Registration failed.';
}

const inputClass =
    'mt-1 w-full border border-gray-400 rounded px-2 py-1.5 text-sm focus:border-blue-600 focus:outline-none';

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError('');
        if (password !== password2) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/register/', { username, email, password });
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
            <h1 className="mb-4 text-xl font-bold">Register</h1>

            <div className="border border-gray-300 bg-white p-6">
                {error ? (
                    <p className="mb-4 rounded border border-red-300 bg-red-50 px-2 py-2 text-sm text-red-800">
                        {error}
                    </p>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="reg-username" className="text-sm font-medium">
                            Username
                        </label>
                        <input
                            id="reg-username"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="reg-email" className="text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="reg-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="reg-password" className="text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="reg-password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="reg-password2" className="text-sm font-medium">
                            Confirm password
                        </label>
                        <input
                            id="reg-password2"
                            type="password"
                            autoComplete="new-password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                            className={inputClass}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Please wait...' : 'Create account'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-600">
                    Already registered? <Link to="/login" className="text-blue-600 underline">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
