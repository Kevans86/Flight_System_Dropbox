import React , {useContext , useEffect , useState } from 'react';
import AuthContext from "../context/authentication";
import { getUserInfo } from '../methods/UserMethods';
import { ViewMyTickets } from "../methods/TicketMethods";
import { AllCountries } from '../methods/CountriesMethods';
import  Pagination from "../components/Pagination";



const CustomerPage = () => {


    let [userData, setUserData] = useState();
    let {user, authToken} = useContext(AuthContext)
    let [myFlights, setMyFlights] = useState();
    const [noData, setNoData] = useState();
    const [countries, setCountries] = useState([]);
    
  

    useEffect(() => {
        getUserData() 
        getMyTickets()
            
        }, [])

    /**
    * gets and sets userdata
    */ 
    let getUserData = async () => {
            let result = await getUserInfo(authToken)
            if(result.status === 200){
            setUserData(result.data)
        }
    }


    /**
    * gets and sets user tickets, along with countries. alerts if it doesn't work, sets no data if no data
    */  
    let getMyTickets = async () => {

        let result = await ViewMyTickets(authToken)
        let data =  result.data
        let status = result.status

        if (status ===200)
        {
            if (data.length === 0){
                setNoData(true) 
                return
            } 
                setMyFlights(data)

                let country_data = await AllCountries()
                if (country_data){setCountries(country_data)}
                else{alert(status, data)}
        }
        else{alert(status, data)}
    }



    return (
        (myFlights!==undefined && !noData)?
        <Pagination 
            sourcePage = {"customerPage"} 
            myFlights = {myFlights} 
            countries={countries} 
            userData = { userData } 
            />
        :
        <div className='flights-header'>
            <h2 className='flights-title'>  No Tickets for {userData?.first_name} {userData?.last_name}  </h2>
        </div>

    )


}




export default CustomerPage