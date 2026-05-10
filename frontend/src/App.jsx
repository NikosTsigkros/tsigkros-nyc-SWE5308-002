import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <nav style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <Link to='/'>Products</Link>
                <Link to='/login'>Login</Link>
                <Link to='/register'>Register</Link>
            </nav>

            <Routes>
                <Route path='/' element={<p>Products</p>} />
                <Route path='/login' element={<p>Login</p>} />
                <Route path='/register' element={<p>Register</p>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;