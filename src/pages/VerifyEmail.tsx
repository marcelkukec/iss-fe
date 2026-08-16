import {Link, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../api/api.ts";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('Verifying email...');

    useEffect(() => {
        document.title = "Verify email";

        const token = searchParams.get('token');

        if (!token) {
            setStatus('Verification token is missing');
            return;
        }

        const verify = async () => {
            try {
                await api.post('auth/verify-email', { token });

                setStatus('Email verified successfully.');
            } catch (err: any) {
                console.error(err);

                setStatus(err.response?.data?.message || 'Email verification failed');
            }
        };

        verify();
    }, [searchParams]);

    return (
        <div className="mt-5 text-center">
            <h2>Email verification</h2>

            <p>{status}</p>

            <Link to="/login" className="btn btn-primary">
                Go to login
            </Link>
        </div>
    )
}