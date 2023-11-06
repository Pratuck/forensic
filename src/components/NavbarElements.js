import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
  background-color: blue;
  height: 65px;
  display: flex;
  align-items: center;
  padding-left: 1rem; /* Adjust this padding to control the space from the left edge of the screen */
`;

export const NavLink = styled(Link)`
  color: #ffffff;
  padding: 0 1rem; /* Spacing between links */
  text-decoration: none;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;

  &.active {
    color: #15cdfc;
  }

  &:hover {
    color: #15cdfc;
    text-decoration: underline;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

// Assuming Bars is for a responsive menu icon, which is usually on the right
export const Bars = styled(FaBars)`
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
    margin-left: auto; /* Pushes the icon to the right */
    color: #ffffff;
  }
`;


