import React, { FC, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';

export const NavBar: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggle = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <Navbar expand="md">
      <NavbarBrand href="/">Planner</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse navbar isOpen={isExpanded}>
        <Nav navbar id="navbar" className="me-auto" pills>
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
