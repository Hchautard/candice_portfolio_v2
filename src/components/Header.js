import { Divider } from '@mui/material';
import '../styles/Header.css';

export default function Header() {
    return (
        <div className="Header">
            <nav className="navbar navbar-expand-lg">
                <div className="flex justify-center items-center gap-x-4 text-align-center">
                    <a
                        href="/"
                        className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900"
                    >
                        Accueil
                    </a>
                    <a
                        href="/contact"
                        className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900"
                    >
                        Contact
                    </a>
                    <a href="/" className="p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                            alt=""
                            src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                            className="h-8 w-auto"
                        />
                    </a>
                    <a
                        href="/tattoo"
                        className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900"
                    >
                        Tattoo
                    </a>
                    <a
                        href="/makeup"
                        className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900"
                    >
                        Makeup
                    </a>
                </div>
            </nav>
            <Divider variant='middle' />
        </div>
    );
}
