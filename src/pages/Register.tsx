import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as React from "react";
import api from "../api/api.ts";
import '../css/Form.css';

export default function Register() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        confirm_password: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match");
            return;
        }

        try {
            await api.post('/auth/register', formData);
            alert('User successfully signed up, you can now log in!');
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.errors || 'Registration failed');
        }
    };

    useEffect(() => {
        document.title = 'Sign Up'
    }, []);

    return (
        <main className="form-wrapper m-auto">
            <form className="form-width" onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 fw-normal text-center">Register</h1>

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
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
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

                <button className="btn btn-primary w-100 py-2" type="submit">Sign Up</button>
            </form>
        </main>
    )
}