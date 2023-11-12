import React from "react";
import { Nav, NavLink, NavMenu }
	from "./NavbarElements";

const Navbar = () => {
	return (
		<>
			<Nav>
				<NavMenu>
					<NavLink to="/" >
						Scrape
					</NavLink>
					<NavLink to="/view" >
						View
					</NavLink>
					<NavLink to="/Evidence" >
						Evidence
					</NavLink>
					<NavLink to="/Report" >
						Report
					</NavLink>
				</NavMenu>
			</Nav>
		</>
	);
};

export default Navbar;
