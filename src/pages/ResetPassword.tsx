import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/api";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = searchParams.get("token");

    useEffect(() => {
        document.title = "Reset Password";
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setMessage("Password reset token is missing.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            await api.post("/auth/reset-password", {
                token,
                password,
            });

            setSuccess(true);
            setMessage("Your password has been reset successfully.");
        } catch (err: any) {
            console.error(err);
            const responseMessage = err.response?.data?.message;

            setMessage(
                Array.isArray(responseMessage)
                    ? responseMessage.join(" ")
                    : responseMessage || "Failed to reset password."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="form-wrapper m-auto">
                <div className="form-width text-center">
                    <h3>Invalid reset link</h3>
                    <p>Password reset token is missing.</p>

                    <Link
                        to="/forgot-password"
                        className="btn btn-primary"
                    >
                        Request another link
                    </Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="form-wrapper m-auto">
                <div className="form-width text-center">
                    <h3>Password Reset</h3>

                    <p>{message}</p>

                    <Link
                        to="/login"
                        className="btn btn-primary"
                    >
                        Go to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="form-wrapper m-auto">
            <form className="form-width" onSubmit={handleSubmit}>
                <h3 className="mb-3 fw-heavy text-center">
                    Reset Password
                </h3>

                <div className="form-floating mb-2">
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <label htmlFor="password">
                        New Password
                    </label>
                </div>

                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <label htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>

                {message && (
                    <div className="alert alert-danger mt-3">
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}