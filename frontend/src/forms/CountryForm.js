import React, {useState  } from 'react';
import { BsFillCameraFill } from 'react-icons/bs';


const CountryForm = (country)=>{
    const [selectedFile, setSelectedFile] = useState(null);

    const changeHandler = (event) => {setSelectedFile(event.target.files[0]);}
    const clearSelected = () => {setSelectedFile(null);}

    country = country.country
    let set = null
    if (country!==undefined){
        set = true
    }
    return(
        <>

        <input className="form-input" type="text" name="country_name"  placeholder="Country Name" defaultValue = {set?country.country_name:null} required />
        
        <label  id="file-upload-label">
            <i id="photo-icon" ><BsFillCameraFill /></i>
            <span id="selected-file" > {!selectedFile? 'Select File' :selectedFile.name }</span>
            <input id="file-input" type="file" name="flag" accept="image/*"  required onChange={changeHandler} />     
            </label>
        <label id='clear-label' hidden={!selectedFile?.name}  onClick={clearSelected}> Clear </label>

        </>
    )
}

export default CountryForm
