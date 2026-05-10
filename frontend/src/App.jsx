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
        <div className="min-h-screen font-sans">
            <nav className="border-b border-gray-300 bg-white">
                <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-4 py-3">
                    <Link to="/" className="text-lg font-bold text-gray-800">
                        Inventory app
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

            <main className="mx-auto max-w-4xl px-4 py-6">
                <Routes>
                    <Route path="/" element={<Products />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </main>
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
