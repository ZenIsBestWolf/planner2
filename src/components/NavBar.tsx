import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { useApp, useUpdateApp } from '../providers';

export const NavBar: FC = () => {
  const { navbarCollapsed } = useApp();
  const updateApp = useUpdateApp();

  const toggle = useCallback(() => {
    updateApp('navbarCollapsed', !navbarCollapsed);
  }, [navbarCollapsed, updateApp]);

  return (
    <Navbar className="bg-danger border-bottom" dark expand="xs">
      <NavbarBrand href="/">Planner</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse navbar isOpen={navbarCollapsed}>
        <div className='ms-auto' />
        <Nav navbar id="navbar" pills>
          <NavbarButton destination="/courses" label="Courses" />
          <NavbarButton destination="/info" label="Info" />
          <NavbarButton destination="/times" label="Times" />
          <NavbarButton destination="/schedules" label="Schedules" />
        </Nav>
      </Collapse>
    </Navbar>
  );
};

interface NavbarButtonProps {
  readonly destination: string;
  readonly label: string;
}

const NavbarButton: FC<NavbarButtonProps> = ({ destination, label }) => {
  const navigate = useNavigate();

  const navHandler = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      void navigate(destination);
    },
    [destination, navigate],
  );

  return (
    <NavItem>
      <NavLink onClick={navHandler} href="#">
        {label}
      </NavLink>
    </NavItem>
  );
};
