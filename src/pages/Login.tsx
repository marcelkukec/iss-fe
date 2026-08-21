import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import '../css/Form.css';
import api from "../api/api.ts";
import { useAuth } from "../context/AuthContext.tsx";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post('/auth/login', { email, password, });

            const token = response.data.access_token;
            login(token);

            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    useEffect(() => {
        if(isLoggedIn) {
            navigate('/');
        }
        document.title = 'Log In';
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (!window.google) return;

        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

            callback: async (response: any) => {
                try {
                    const res = await api.post('/auth/google', {
                        credential: response.credential,
                    });

                    if (res.data.requires_registration) {
                        navigate('/register', {
                            state: {
                                googleSignupToken: res.data.signup_token,
                                googleUser: res.data.user,
                            },
                        });

                        return;
                    }

                    await login(res.data.access_token);
                    navigate('/');
                } catch (err: any) {
                    setError(
                        err.response?.data?.message ||
                        'Google login failed'
                    );
                }
            },
        });

        window.google.accounts.id.renderButton(
            document.getElementById('googleLogin'),
            {
                theme: 'outline',
                size: 'large',
                width: 300,
            }
        );
    }, [login, navigate]);

    return (
        <main className="form-wrapper m-auto">
            <form className="form-width" onSubmit={handleSubmit}>
                <h3 className="mb-3 fw-heavy text-center">Log in</h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="form-floating">
                    <input type="email" className="form-control mb-2" id="floatingInput" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <label htmlFor="floatingInput">Email</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control mb-2" id="floatingPassword" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="mb-3 text-center">
                    <Link to="/forgot-password">Forgot password?</Link>
                </div>
                <button className="btn btn-primary w-100 py-2" type="submit">Log in</button>
                <div id="googleLogin" className="d-flex justify-content-center mt-3" />
            </form>
        </main>
    );
}
