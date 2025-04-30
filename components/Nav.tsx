import { useState } from "react";  // Import useState
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NavLinks = () => {
    return (
        <>
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/explore">Explore</NavLink>
        </>
    );
};

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <nav className="w-1/3 flex justify-end">
                <div className="hidden w-full justify-between md:flex">
                    <NavLinks />
                </div>
                <div className="md:hidden">
                    <button onClick={toggleNavbar}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>
            {isOpen && (
                <div className="flex basis-full flex-col items-center">
                    <NavLinks />
                </div>
            )}
        </>
    );
};

export default Nav;
