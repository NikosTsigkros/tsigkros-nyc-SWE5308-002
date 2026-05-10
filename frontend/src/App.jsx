import {
    BrowserRouter,
    Link,
    NavLink,
    Route,
    Routes,
    useLocation,
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';

function navLinkClass({ isActive }) {
    return isActive ? 'font-semibold text-blue-700 underline' : 'text-blue-600 hover:underline';
}

function Shell() {
    useLocation();
    const authed = Boolean(localStorage.getItem('accessToken'));

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.assign('/login');
    };

    return (
        <div className="flex min-h-screen flex-col font-sans">
            <nav className="border-b border-gray-300 bg-white">
                <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-4 py-3">
                    <Link
                        to="/"
                        className="flex flex-col items-start gap-0.5 no-underline hover:opacity-90"
                    >
                        <span className="text-lg font-bold leading-tight text-gray-800">
                            Smart Inventory Manager
                        </span>
                        <span className="text-[11px] font-normal text-gray-500">
                            Nikos Tsigkros - SWE5308 - New York College of Athens 2025-2026
                        </span>
                    </Link>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <NavLink to="/" className={navLinkClass} end>
                            Products
                        </NavLink>
                        {!authed ? (
                            <>
                                <NavLink to="/login" className={navLinkClass}>
                                    Login
                                </NavLink>
                                <NavLink to="/register" className={navLinkClass}>
                                    Register
                                </NavLink>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={logout}
                                className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
                <Routes>
                    <Route path="/" element={<Products />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </main>

            <footer className="mt-auto border-t border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
                <p className="font-semibold text-gray-800">Smart Inventory Manager</p>
                <p className="mt-1 text-xs text-gray-500">
                    SWE5308 — Cloud Technologies · New York College of Athens ·
                    2025–2026
                </p>
                <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-gray-500">
                    Course assessment: a cloud-ready full stack app (React, Django REST
                    Framework, JWT, MySQL) for inventory and product management.
                </p>
                <p className="mt-4 text-xs text-gray-500">
                    Developed by{' '}
                    <span className="font-medium text-gray-800">Nikos Tsigkros</span>
                </p>
            </footer>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Shell />
        </BrowserRouter>
    );
}

export default App;
