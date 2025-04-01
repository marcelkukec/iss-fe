import '../css/Navbar.css'
import {NavLink} from 'react-router-dom';
import {useAuth} from "../context/AuthContext.tsx";

const Navbar = () => {
    const { isLoggedIn, user, logout } = useAuth();

    const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
        `nav-link link-body-emphasis px-2${isActive ? ' active fw-bold' : ''}`;

    return (
        <nav className="navbar py-2">
            <div className="container-fluid d-flex flex-wrap justify-content-between">
                <ul className="nav me-auto">
                    <li className="nav-item">
                        <NavLink to="/" className={getNavLinkClass}>Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/explore" className={getNavLinkClass}>Explore</NavLink>
                    </li>
                </ul>

                {isLoggedIn ? (
                    <ul className="nav">
                        <li className="nav-item">
                            <NavLink to="/user" className={getNavLinkClass}>{user?.username}</NavLink>
                        </li>
                        <li className="nav-item">
                            <button onClick={logout} className="nav-link px-2 link-body-emphasis btn btn-link">Log out</button>
                        </li>
                    </ul>
                ) : (
                    <ul className="nav">
                        <li className="nav-item">
                            <NavLink to="/login" className={getNavLinkClass}>Log in</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/register" className={getNavLinkClass}>Sign up</NavLink>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar
