import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import * as React from "react";
import api from "../api/api.ts";
import '../css/Form.css';
import {useAuth} from "../context/AuthContext.tsx";

export default function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const googleSignupToken = location.state?.googleSignupToken;
    const googleUser = location.state?.googleUser;
    const isGoogleRegistration = !!googleSignupToken;

    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        first_name: googleUser?.first_name || '',
        last_name: googleUser?.last_name || '',
        username: '',
        email: googleUser?.email || '',
        password: '',
        confirm_password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError('');

        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }

        try {
            setSubmitting(true);

            if (isGoogleRegistration) {
                const response = await api.post('/auth/google/register', {
                    signup_token: googleSignupToken,
                    username: formData.username,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    password: formData.password,
                });

                await login(response.data.access_token);
                navigate('/');

                return;
            }

            const response = await api.post('/auth/register', {
                email: formData.email,
                username: formData.username,
                first_name: formData.first_name,
                last_name: formData.last_name,
                password: formData.password,
            });

            alert(response.data.message);
            navigate('/login');
        } catch (err: any) {
            const message = err.response?.data?.message;

            setError(
                Array.isArray(message)
                    ? message.join(' ')
                    : message || 'Registration failed'
            );
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (isGoogleRegistration) return;
        if (!window.google) return;

        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

            callback: async (response: any) => {
                try {
                    setError('');

                    const res = await api.post('/auth/google', {
                        credential: response.credential,
                    });

                    // Brand-new Google user
                    if (res.data.requires_registration) {
                        navigate('/register', {
                            state: {
                                googleSignupToken: res.data.signup_token,
                                googleUser: res.data.user,
                            },
                            replace: true,
                        });

                        return;
                    }

                    // Google account is already registered
                    await login(res.data.access_token);
                    navigate('/');
                } catch (err: any) {
                    setError(
                        err.response?.data?.message ||
                        'Google registration failed'
                    );
                }
            },
        });

        window.google.accounts.id.renderButton(
            document.getElementById('googleRegister'),
            {
                theme: 'outline',
                size: 'large',
                width: 300,
            }
        );
    }, [isGoogleRegistration, login, navigate]);

    useEffect(() => {
        if (googleUser) {
            setFormData(prev => ({
                ...prev,
                first_name: googleUser.first_name || '',
                last_name: googleUser.last_name || '',
                email: googleUser.email || '',
            }));
        }
    }, [googleUser]);

    useEffect(() => {
        document.title = isGoogleRegistration ? 'Complete registration' : 'Sign up';
    }, [isGoogleRegistration]);

    return (
        <main className="form-wrapper m-auto">
            <form className="form-width" onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 fw-normal text-center">{isGoogleRegistration ? 'Complete registration' : 'Register'}</h1>
                {isGoogleRegistration && (
                    <p className="text-muted text-center">
                        Your Google account was verified. Choose a username and password to finish creating your account.
                    </p>
                )}

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="form-floating mb-2">
                    <input type="text" name="first_name" className="form-control" value={formData.first_name} onChange={handleChange} minLength={2} required />
                    <label>First Name</label>
                </div>

                <div className="form-floating mb-2">
                    <input type="text" name="last_name" className="form-control" value={formData.last_name} onChange={handleChange} minLength={2} required />
                    <label>Last Name</label>
                </div>

                <div className="form-floating mb-2">
                    <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} minLength={4} required />
                    <label>Username</label>
                </div>

                <div className="form-floating mb-2">
                    <input type="email" name="email" className="form-control" disabled={isGoogleRegistration} value={formData.email} onChange={handleChange} required />
                    <label>Email</label>
                </div>

                <div className="form-floating mb-2">
                    <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                    <label>Password</label>
                </div>

                <div className="form-floating mb-2">
                    <input type="password" name="confirm_password" className="form-control" value={formData.confirm_password} onChange={handleChange} required />
                    <label>Confirm Password</label>
                </div>

                <button className="btn btn-primary w-100 py-2" type="submit" disabled={submitting}>{isGoogleRegistration ? 'Complete registration' : 'Sign up'}</button>

                {!isGoogleRegistration && (
                    <>
                        <div className="text-center text-muted my-3"> or </div>
                        <div id="googleRegister" className="d-flex justify-content-center" />
                    </>
                )}
            </form>
        </main>
    )
}