const PasswordForm = ()=>{

    return(
        <>
        <input className="form-input" type="password" name="old_password" placeholder="Old Password" required/><br/>
        <input className="form-input" type="password" name="password" minLength="8" maxLength='8' placeholder="New Password" required/><br/>
        <input className="form-input" type="password" name="password2" placeholder="Confirm New Password" required/>
        </>
    )
}


export default PasswordForm