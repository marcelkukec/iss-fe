import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Login.css';
import api from "../api/api.ts";
import { useAuth } from "../context/AuthContext.tsx"; // ← Import context

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth(); // ← Use login from context
    const navigate = useNavigate(); // ← Better than window.location

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });

            const token = response.data.access_token;
            login(token);

            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };
    return (
        <main className="login-wrapper m-auto">
            <form className="form-signin" onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 fw-normal text-center">Log in</h1>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="form-floating">
                    <input type="email" className="form-control" id="floatingInput" value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="floatingInput">Email</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="floatingPassword" value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <button className="btn btn-primary w-100 py-2" type="submit">Log in</button>
            </form>
        </main>
    );
}
