import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { AiOutlineUser } from "react-icons/ai";
import { GrLogout } from "react-icons/gr";
import React, { useContext } from 'react';
import AuthContext from '../../context/authentication'
import { BsPlusCircleFill } from "react-icons/bs";
import { MdFlight } from "react-icons/md";
import "./Navbar.css"



const UserLinks = () => {
    const {logout} = useContext(AuthContext)
    let {user} = useContext(AuthContext)
    let loggedUser = 
        <div id="user-container"> 
            <div id='user-icon'> <AiOutlineUser/ >  </div>  
            <div id='user-name'> {user.username} </div> 
        </div> 


    return (
        <>
            <NavDropdown 
                title= { loggedUser } 
                align="end"
                id="collasible-nav-dropdown" 
                className="custom-style"
            >

            <NavDropdown.Item href="/update">
                <AiOutlineUser/ > Update
            </NavDropdown.Item>
            <NavDropdown.Item href="/" onClick={logout}>
            <GrLogout /> Logout 
                </NavDropdown.Item>         
            </NavDropdown>
       </>
    )
}



 const ContextMenu = () => {
    let {user} = useContext(AuthContext)

    switch (user?.account_role)
    {
        case 'Admin':
            return ( 
            <>

                <Nav.Link href="/admin">All Customers</Nav.Link>
                <Nav.Link href="/admin/make_country">Add country</Nav.Link>
                <Nav.Link href="/admin/view_admins">View All Admins</Nav.Link>
                <Nav.Link href="/admin/view_airlines">View All Airlines</Nav.Link>
                <Nav.Link href="/admin/view_specific">Search For Users</Nav.Link>
                <UserLinks />               
            </>
            )


        case 'Customer':
           return (    
            <>    
            <Nav.Link href="/customer">Home</Nav.Link>
            <Nav.Link href="/Home">Add Tickets</Nav.Link>
                <UserLinks /> 
            </>
            )
        case 'Airline':
        return (   
            <>

<       Nav.Link href="/airline">Home</Nav.Link>

        <NavDropdown 
        title='Airline Options'
        id="collasible-nav-dropdown" 
        className="custom-style"
        >
        <NavDropdown.Item href="/airline/add_flight">
            <BsPlusCircleFill/ >  Add Flight

        </NavDropdown.Item>
            <NavDropdown.Item href="/airline" >
                <MdFlight /> View My Flights
            </NavDropdown.Item>         
        </NavDropdown>


                <UserLinks /> 
            </> 
          )
        default: 
        return (  
        <>
          <Nav.Link href="/">Home </Nav.Link>
          <div id='login-container'>
            <Nav.Link id='login-register' href="/login">Login / Sign In</Nav.Link>
        </div>
        </>
        )
    
    
      }
}

export default ContextMenu