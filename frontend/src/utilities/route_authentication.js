import { Navigate, Outlet } from 'react-router-dom'
import { Component, useContext } from 'react'
import AuthContext from '../context/authentication'


const logged = (user) => {
    if (user === null){
        return false
    }
    else{return true}
}

/**
 * checks if logged in, else returns to login page
 * @return {Component} outlet
 * 
 */
export const LoggedinGeneric= () => {
    let {user} = useContext(AuthContext)
    let result = logged(user)
    if (result === false){
        return(
            <Navigate to="/login" state={window.location.pathname}/>
        ) }
    else{return (<Outlet/>)

    }
}

/**
 * checks if logged out, else returns to home
 * @return {Component} outlet
 * 
 */
export const LoggedOut= () => {
    let {user} = useContext(AuthContext)
    let result = logged(user)
    if (result === true){
        alert('Log out to use this function.')
        return(
            <Navigate to="/" /> 
        ) }
    else{return (<Outlet/>)

    }
}

/**
 * checks if logged in as the right account role, else returns to home or the login page if not logged in
 * @param  {String} account_role the account role you check for
 * @return {Component} outlet
 * 
 */
 const LoggedinRoute = ({account_role}) => {
    let {user} = useContext(AuthContext)
    let result = logged(user)
    if (result === false){
        return(
           <Navigate to="/login" state={window.location.pathname}/>
        ) 
    }else{
        if (user.account_role !== account_role){
            alert(`${user.account_role}s are not allowed to view this page`)
            return(<Navigate to="/" />)
        }else{return(
        <Outlet/>
        )
        }
        
    }

}

export default LoggedinRoute;