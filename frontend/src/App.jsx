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

function navClass({ isActive }) {
    return [
        'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
            ? 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
    ].join(' ');
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
        <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
                <div className="absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-fuchsia-600/10 blur-3xl" />
            </div>

            <nav className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-sm font-bold text-white shadow-lg shadow-violet-500/25">
                            S
                        </span>
                        Stockroom
                    </Link>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <NavLink to="/" className={navClass} end>
                            Products
                        </NavLink>
                        {!authed ? (
                            <>
                                <NavLink to="/login" className={navClass}>
                                    Log in
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:brightness-110"
                                >
                                    Sign up
                                </NavLink>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={logout}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
                            >
                                Log out
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <main className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
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
