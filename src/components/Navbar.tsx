import '../css/Navbar.css'
import { Link } from 'react-router-dom';
import {useAuth} from "../context/AuthContext.tsx";

const Navbar = () => {
    const { isLoggedIn, user, logout } = useAuth();

    return (
        <nav className="navbar py-2">
            <div className="container-fluid d-flex flex-wrap justify-content-between">
                <ul className="nav me-auto">
                    <li className="nav-item">
                        <Link to="/" className="nav-link link-body-emphasis px-2 active">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/explore" className="nav-link link-body-emphasis px-2">Explore</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/pricing" className="nav-link link-body-emphasis px-2">Pricing</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/faqs" className="nav-link link-body-emphasis px-2">FAQs</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/about" className="nav-link link-body-emphasis px-2">About</Link>
                    </li>
                </ul>

                {isLoggedIn ? (
                    <ul className="nav">
                        <li className="nav-item">
                            <Link to="/user" className="nav-link link-body-emphasis px-2">{ user?.username }</Link>
                        </li>
                        <li className="nav-item">
                            <button onClick={logout} className="nav-link px-2 link-body-emphasis">Log out</button>
                        </li>
                    </ul>
                ): (
                    <ul className="nav">
                        <li className="nav-item">
                            <Link to="/login" className="nav-link link-body-emphasis px-2">Log in</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/register" className="nav-link link-body-emphasis px-2">Sign up</Link>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar
