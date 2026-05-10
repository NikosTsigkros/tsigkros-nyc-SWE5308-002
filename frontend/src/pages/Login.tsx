import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import api from '../api/axios';

function formatApiError(err: unknown): string {
    if (!isAxiosError(err)) return 'Something went wrong. Try again.';
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
        <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-2">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-white">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Sign in to manage your inventory
                    </p>
                </div>

                {error ? (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                    >
                        {error}
                    </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="login-username"
                            className="mb-1.5 block text-left text-xs font-medium uppercase tracking-wide text-slate-400"
                        >
                            Username
                        </label>
                        <input
                            id="login-username"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-violet-500/40 transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2"
                            placeholder="you"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="login-password"
                            className="mb-1.5 block text-left text-xs font-medium uppercase tracking-wide text-slate-400"
                        >
                            Password
                        </label>
                        <input
                            id="login-password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-violet-500/40 transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    No account?{' '}
                    <Link
                        to="/register"
                        className="font-medium text-violet-400 hover:text-violet-300"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
