import {use, useEffect, useState} from "react";
import api from "../api/api.ts";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Forgot password";
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const res = await api.post('auth/forgot-password', {
                email,
            });

            setMessage(res.data.message);
        } catch (err) {
            setMessage('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-wrapper m-auto">
            <form className="form-width" onSubmit={handleSubmit}>
                <h3 className="mb-3 fw-heavy text-center">Forgot Password</h3>

                <p className="text-muted text-center">
                    Enter your email and we'll send you a password reset link.
                </p>

                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="email">Email</label>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send reset link"}
                </button>

                {message && (
                    <div className="alert alert-info mt-3">
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}