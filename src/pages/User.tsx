import {useAuth} from "../context/AuthContext.tsx";
import {Navigate} from "react-router-dom";
import '../css/User.css';

export default function User() {
    const { user, isLoggedIn } = useAuth();

    if(!isLoggedIn || !user) {
        <Navigate to= "/login" />
    }

    return (
        <>
            <main className="user-wrapper m-auto">
                <form className="user-form">
                    <h2 className="mb-4 text-center">Your Profile</h2>

                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            value={user?.first_name}
                            disabled
                        />
                        <label htmlFor="firstName">First Name</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            value={user?.last_name}
                            disabled
                        />
                        <label htmlFor="lastName">Last Name</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={user?.username}
                            disabled
                        />
                        <label htmlFor="username">Username</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={user?.email}
                            disabled
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                </form>
            </main>
        </>
    )
}