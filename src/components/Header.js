import { Divider } from '@mui/material';
import { Link } from 'react-router-dom'; 
import '../styles/Header.css';
import logo from '../assets/images/logo_anomalie_new.png';

export default function Header() {
    return (
        <div className="Header">
            <nav className="navbar navbar-expand-lg">
                <div className="flex justify-center items-center gap-x-4 text-align-center">
                    <Link
                        to="/"
                        className="block header-link rounded-lg px-3 py-2 text-base"
                    >
                        Accueil
                    </Link>
                    <Link
                        to="/tattoo"
                        className="block header-link rounded-lg px-3 py-2 text-base"
                    >
                        Tattoo
                    </Link>
                    <Link
                        to="/makeup"
                        className="block header-link rounded-lg px-3 py-2 text-base"
                    >
                        Makeup
                    </Link>
                    <Link
                        to="/contact"
                        className="block header-link rounded-lg px-3 py-2 text-base"
                    >
                        Contact
                    </Link>
                </div>
            </nav>
            {/* <Divider variant='middle' /> */}
        </div>
    );
}