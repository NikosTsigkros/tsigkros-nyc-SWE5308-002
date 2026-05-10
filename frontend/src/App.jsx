import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';

function App() {
    return (
        <BrowserRouter>
            <nav style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <Link to='/'>Products</Link>
                <Link to='/login'>Login</Link>
                <Link to='/register'>Register</Link>
            </nav>

            <Routes>
                <Route path='/' element={<Products />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;