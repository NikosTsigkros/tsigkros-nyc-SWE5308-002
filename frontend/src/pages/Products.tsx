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
    if (Number.isNaN(n)) return String(value);
    return n.toFixed(2);
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

const inputClass =
    'mt-1 w-full border border-gray-400 rounded px-2 py-1.5 text-sm focus:border-blue-600 focus:outline-none';

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
        if (!window.confirm('Delete this product?')) return;
        try {
            await api.delete(`/products/${id}/`);
            await load();
        } catch (err) {
            setError(formatApiError(err));
        }
    };

    if (!authed) {
        return (
            <div>
                <h1 className="mb-2 text-xl font-bold">Products</h1>
                <p className="mb-4 text-sm text-gray-700">You need to login to see your products.</p>
                <p className="text-sm">
                    <Link to="/login" className="text-blue-600 underline">Login</Link>
                    {' '}|{' '}
                    <Link to="/register" className="text-blue-600 underline">Register</Link>
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
                <h1 className="text-xl font-bold">Products</h1>
                <button
                    type="button"
                    onClick={() => void load()}
                    className="rounded border border-gray-400 bg-white px-3 py-1 text-sm hover:bg-gray-50"
                >
                    Refresh list
                </button>
            </div>

            {error ? (
                <p className="mb-4 rounded border border-red-300 bg-red-50 px-2 py-2 text-sm text-red-800">
                    {error}
                </p>
            ) : null}

            <section className="mb-8 border border-gray-300 bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold">Add new product</h2>
                {formError ? (
                    <p className="mb-3 text-sm text-red-700">{formError}</p>
                ) : null}
                <form onSubmit={handleCreate} className="max-w-md space-y-3">
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Description (optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className={inputClass}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="w-24">
                            <label className="text-sm font-medium">Qty</label>
                            <input
                                type="number"
                                min={0}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium">Price</label>
                            <input
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                className={inputClass}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Add product'}
                    </button>
                </form>
            </section>

            <section>
                <h2 className="mb-2 text-lg font-semibold">My product list</h2>

                {loading ? (
                    <p className="text-sm text-gray-600">Loading...</p>
                ) : products.length === 0 ? (
                    <p className="text-sm text-gray-600">No products yet. Add one above.</p>
                ) : (
                    <div className="overflow-x-auto border border-gray-300 bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-gray-300 bg-gray-50">
                                <tr>
                                    <th className="px-2 py-2 font-semibold">Name</th>
                                    <th className="px-2 py-2 font-semibold">Description</th>
                                    <th className="px-2 py-2 font-semibold">Qty</th>
                                    <th className="px-2 py-2 font-semibold">Price</th>
                                    <th className="px-2 py-2 font-semibold">Date</th>
                                    <th className="px-2 py-2 font-semibold"> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.id} className="border-b border-gray-200">
                                        <td className="px-2 py-2">{p.name}</td>
                                        <td className="max-w-xs truncate px-2 py-2 text-gray-700">
                                            {p.description || '—'}
                                        </td>
                                        <td className="px-2 py-2">{p.quantity}</td>
                                        <td className="px-2 py-2">{formatMoney(p.price)}</td>
                                        <td className="px-2 py-2 text-gray-600">
                                            {new Date(p.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-2 py-2">
                                            <button
                                                type="button"
                                                onClick={() => void handleDelete(p.id)}
                                                className="text-red-600 underline hover:text-red-800"
                                            >
                                                delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Products;
