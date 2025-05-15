import { Divider } from '@mui/material';
import '../styles/Header.css';
import logo from '../assets/images/logo_anomalie_new.png';

export default function Header() {
    return (
        <div className="Header">
            <nav className="navbar navbar-expand-lg">
                <div className="flex justify-center items-center gap-x-4 text-align-center">
                    <a
                        href="/"
                        className="block header-link rounded-lg px-3 py-2 text-base"
                    >
                        Accueil
                    </a>
                    <a
                        href="/tattoo"
                        className="block header-link rounded-lg px-3 py-2 text-base"
                    >
                        Tattoo
                    </a>
                    <a
                        href="/makeup"
                        className="block header-link rounded-lg px-3 py-2 text-base"
                    >
                        Makeup
                    </a>
                    <a
                        href="/contact"
                        className="block header-link rounded-lg px-3 py-2 text-base"
                    >
                        Contact
                    </a>
                    {/* <a href="/" className="p-1.5 header-link">
                        <img
                            alt=""
                            src={logo}
                            className="h-8 w-auto"
                        />
                    </a> */}
                </div>
            </nav>
            {/* <Divider variant='middle' /> */}
        </div>
    );
}
