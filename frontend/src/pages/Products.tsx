import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import api from '../api/axios';

type Product = {
    id: number;
    user: number;
    name: string;
    description: string;
    quantity: number;
    price: string;
    created_at: string;
};

function formatMoney(value: string | number) {
    const n = typeof value === 'string' ? parseFloat(value) : value;
    if (Number.isNaN(n)) return value;
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
    }).format(n);
}

function formatApiError(err: unknown): string {
    if (!isAxiosError(err)) return 'Request failed.';
    const d = err.response?.data;
    if (typeof d === 'string') return d;
    if (d && typeof d === 'object') {
        if ('detail' in d && typeof d.detail === 'string') return d.detail;
        const parts: string[] = [];
        for (const [, val] of Object.entries(d)) {
            if (Array.isArray(val) && val.length) parts.push(val.join(' '));
            else if (typeof val === 'string') parts.push(val);
        }
        if (parts.length) return parts.join(' ');
    }
    return err.message || 'Error';
}

function Products() {
    const authed = Boolean(localStorage.getItem('accessToken'));
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('0');
    const [price, setPrice] = useState('');

    const load = useCallback(async () => {
        if (!authed) {
            setLoading(false);
            setProducts([]);
            return;
        }
        setError('');
        setLoading(true);
        try {
            const { data } = await api.get<Product[]>('/products/');
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            if (isAxiosError(err) && err.response?.status === 401) return;
            setError(formatApiError(err));
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [authed]);

    useEffect(() => {
        void load();
    }, [load]);

    const handleCreate = async (event: FormEvent) => {
        event.preventDefault();
        setFormError('');
        setSaving(true);
        try {
            await api.post('/products/', {
                name,
                description,
                quantity: Number(quantity) || 0,
                price: price || '0',
            });
            setName('');
            setDescription('');
            setQuantity('0');
            setPrice('');
            await load();
        } catch (err) {
            setFormError(formatApiError(err));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Remove this product from your inventory?')) return;
        try {
            await api.delete(`/products/${id}/`);
            await load();
        } catch (err) {
            setError(formatApiError(err));
        }
    };

    if (!authed) {
        return (
            <div className="mx-auto max-w-lg rounded-2xl border border-slate-800/80 bg-slate-900/50 p-10 text-center shadow-xl backdrop-blur-sm">
                <h1 className="text-2xl font-semibold text-white">Your inventory</h1>
                <p className="mt-3 text-slate-400">
                    Sign in to view and manage products synced with your Django API.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                        to="/login"
                        className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:brightness-110"
                    >
                        Log in
                    </Link>
                    <Link
                        to="/register"
                        className="rounded-xl border border-slate-600 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                    >
                        Register
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Inventory
                    </h1>
                    <p className="mt-2 max-w-xl text-slate-400">
                        Add products, track quantity and price, and keep everything scoped to
                        your account.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => void load()}
                    className="self-start rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                >
                    Refresh
                </button>
            </header>

            {error ? (
                <div
                    role="alert"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                >
                    {error}
                </div>
            ) : null}

            <div className="grid gap-8 lg:grid-cols-5">
                <section className="lg:col-span-2">
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-xl backdrop-blur-sm">
                        <h2 className="text-lg font-semibold text-white">Add product</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Creates a row via{' '}
                            <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-violet-300">
                                POST /api/products/
                            </code>
                        </p>

                        {formError ? (
                            <div
                                role="alert"
                                className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                            >
                                {formError}
                            </div>
                        ) : null}

                        <form onSubmit={handleCreate} className="mt-6 space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Name
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-slate-100 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                                    placeholder="e.g. Ceramic mug"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-slate-100 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                                    placeholder="Optional notes"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Qty
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-slate-100 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Price (USD)
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-slate-100 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                                        placeholder="19.99"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:brightness-110 disabled:opacity-60"
                            >
                                {saving ? 'Saving…' : 'Save product'}
                            </button>
                        </form>
                    </div>
                </section>

                <section className="lg:col-span-3">
                    <h2 className="mb-4 text-lg font-semibold text-white">Your products</h2>

                    {loading ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-40 animate-pulse rounded-2xl bg-slate-800/60"
                                />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 px-6 py-16 text-center">
                            <p className="text-slate-400">No products yet.</p>
                            <p className="mt-2 text-sm text-slate-500">
                                Use the form to add your first item.
                            </p>
                        </div>
                    ) : (
                        <ul className="grid gap-4 sm:grid-cols-2">
                            {products.map((p) => (
                                <li
                                    key={p.id}
                                    className="group relative flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-lg transition hover:border-violet-500/30 hover:shadow-violet-500/5"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-white">{p.name}</h3>
                                        <button
                                            type="button"
                                            onClick={() => void handleDelete(p.id)}
                                            className="shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-red-500/15 hover:text-red-400"
                                            title="Delete"
                                        >
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                                aria-hidden
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    {p.description ? (
                                        <p className="mt-2 line-clamp-3 text-sm text-slate-400">
                                            {p.description}
                                        </p>
                                    ) : (
                                        <p className="mt-2 text-sm italic text-slate-600">
                                            No description
                                        </p>
                                    )}
                                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4">
                                        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                                            Qty {p.quantity}
                                        </span>
                                        <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs font-semibold text-violet-300">
                                            {formatMoney(p.price)}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-xs text-slate-600">
                                        Added{' '}
                                        {new Date(p.created_at).toLocaleString(undefined, {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Products;
