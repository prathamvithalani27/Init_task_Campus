import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            localStorage.setItem('adminToken', data.token);
            navigate('/admin');
        } catch (err) {
            setError('Something went wrong. Try again.');
        }
    };

    return (
        <div className="event-details-container">
            <h1 className="page-title">Admin Login</h1>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    Log In
                </button>
            </form>
        </div>
    );
}

export default AdminLogin;