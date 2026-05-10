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
        <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-2">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-white">
                        Create your account
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Start tracking products in one place
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="reg-username"
                            className="mb-1.5 block text-left text-xs font-medium uppercase tracking-wide text-slate-400"
                        >
                            Username
                        </label>
                        <input
                            id="reg-username"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-violet-500/40 transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2"
                            placeholder="jane"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="reg-email"
                            className="mb-1.5 block text-left text-xs font-medium uppercase tracking-wide text-slate-400"
                        >
                            Email
                        </label>
                        <input
                            id="reg-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-violet-500/40 transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="reg-password"
                            className="mb-1.5 block text-left text-xs font-medium uppercase tracking-wide text-slate-400"
                        >
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
                            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-violet-500/40 transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2"
                            placeholder="At least 8 characters"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="reg-password2"
                            className="mb-1.5 block text-left text-xs font-medium uppercase tracking-wide text-slate-400"
                        >
                            Confirm password
                        </label>
                        <input
                            id="reg-password2"
                            type="password"
                            autoComplete="new-password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-violet-500/40 transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2"
                            placeholder="Repeat password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Creating account…' : 'Create account'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-violet-400 hover:text-violet-300"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
