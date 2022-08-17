import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ContextMenu from './ContextMenu'
import  logo from "./icons/flight_app_logo.png";

import "./Navbar.css"

const  MainNavbar = () => {

    return (

      <Navbar collapseOnSelect  expand="md" bg="dark" variant="dark" fixed="top">
        
         <Navbar.Brand href="/home" >
          <div id='logo-container'>
            <img id='main-logo' src={logo} alt ="Flight App"/>  Flight App
          </div>   
          </Navbar.Brand>
         

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="justify-content-end flex-grow-1 pe-3">
            
            <ContextMenu />

            </Nav>
          </Navbar.Collapse>
      </Navbar>
    );
  }

export default MainNavbar;