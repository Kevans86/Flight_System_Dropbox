const AdminForm = (userData)=>{
    userData = userData.userData
    let set = null
    if (userData!==undefined){
        set = true
    }
    return(
        <>
        <input className="form-input" type="text" name="first_name" placeholder="  First Name" defaultValue = {set?userData.first_name:null} required />
        <input className="form-input" type="text" name="last_name" placeholder="  Last Name" defaultValue = {set?userData.last_name:null} required />
        </>
    )
}


export default AdminForm