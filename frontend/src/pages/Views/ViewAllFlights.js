
import '../../components/FlightPage/FlightCard.css'
import'../../pages/PagesCss/Pages.css'
import {useState, useEffect, useContext, useRef} from "react";
import AuthContext from "../../context/authentication";
import { DeleteFlightAsAirline, ViewMyFlights, CheckIfFlightFormIsValid, UpdateMyFlight } from "../../methods/AirlineMethods";
import FlightCard from "../../components/FlightPage/FlightCard";
import Select from 'react-select'
import NewFlightForm from "../../forms/NewFlightForm";
import ReactPaginate from "react-paginate"
import { AllCountries } from "../../methods/CountriesMethods";
import FormTemplate from '../../forms/FormTemplate/FormTemplate';



const ViewAirlineFlights= () => {
    const [searched, setSearched] = useState(false);
    const [flightOptions, setFlightOptions] = useState([]);
    const [flights, setFlights] = useState([]);
    const [countries, setCountries] = useState([]);
    const [update, setUpdate] = useState(false)
    let {user, authToken} = useContext(AuthContext)
    let [message, setMessage] = useState()
    let [reset, setReset] = useState(false)
    const hiddenBack = useRef("hidden-back")
    const hiddenNext = useRef("")


    useEffect(()=>{
        getflights()
    },[])

    /**
    * sets all flights along with search options. also gets and sets all countries
    */  
    let getflights = async() =>{
        
        let result = await ViewMyFlights(authToken)
        let data =  result.data
        let status = result.status
        if (status ===200){
            setFlights(data)
            setFlightOptions(data.map((flight) => ({value:flight.id, label:`Flight #${flight.id}, from ${flight.origin_country} to ${flight.destination_country}. Departing at ${(new Date(flight.departure_time)).toUTCString()}. Tickets left: ${flight.remaining_tickets}.`})))
            let country_data = await AllCountries()
            if (country_data){
                setCountries(country_data)       
    
        }

        }
        else{
            alert(status, data)
        }
    }
    
    /**
    * deletes a flight. gets flights and resets search item after usage to show update
    * @param  {Dictionary} e The information (flight_id)
    */  
    let Delete= async(e) =>{
        let result = await DeleteFlightAsAirline(e, authToken)
        setMessage(result.data)
        getflights()
        setBack()

    }

    
    /**
    * sets the searched item to the searched flight
    * @param  {Dictionary} e The information (flight)
    */  
    let setsearchresults = (e)=>{
        e.preventDefault()
        setSearched(flights.find(flight=> flight.id===parseInt(e.target.flight.value)))
    }

    /**
    * resets searched item, resets to not show flight update page
    */
    let setBack = ()=>{
        setSearched(false)
        setUpdate(false)
    }

    /**
    * checks if flight update is valid, if so updates it and sets a message. if not, sets errors as message. then resets search, gets flights and goes back to main page
    * @param  {Dictionary} e The information (flight)
    */  
     let handleUpdate=async(e)=>{
        e.preventDefault()
         let is_form_valid = CheckIfFlightFormIsValid(e)
         if (is_form_valid!==true){
             setMessage(is_form_valid)
         }
         else{


             let result = await UpdateMyFlight(e,update.id, authToken)
             setMessage(null)
             setBack()
             getflights()
         }
    }

    const [pagenumber, setPageNumber] = useState(0)
    const flightsPerPage = 3
    const pagesSeen = pagenumber * flightsPerPage

    
    /**
    * returns all buttons to be displayed in cards
    */ 
    let Buttons = (flight)=>{
    return <div className="btn-group">
                <button onClick={()=>Delete(flight.id)} className="btn btn-danger btn-sm" >Delete</button>
                <button onClick={()=>setUpdate(flight)} className="btn btn-primary btn-sm" >Update</button>
            </div> 
    }

    /**
    * shows card for each flight, sets it up for the pagination
    */
    const displayFlights = flights.slice(pagesSeen, pagesSeen + flightsPerPage).map((flight)=>{
    return (

            <FlightCard key={flight.id} className flight={flight} countries={countries} custPage = {false} updateDeleteBtn = {Buttons(flight)}/>

    )})

    const pageCount = Math.ceil(flights.length / flightsPerPage)
    
    const changePage = ({selected})=>{
        selected === 0? hiddenBack.current = "hidden-back":hiddenBack.current = ""         
        selected === (pageCount -1)?hiddenNext.current = "hidden-next":hiddenNext.current = ""

        setPageNumber(selected)       
    }


    return (
    <>
        <div className="title-label-container"><div className="airline-flights-label">{user.username} Flights</div></div>

        {update? (
        <form onSubmit={(e)=>handleUpdate(e)} >
            <FormTemplate 
                formName= {`Update Flight  #${ update.id }`}
                btnDesc = { 'Update' }
                formFields = { <NewFlightForm flightData={update} resetProps = { {'reset' :reset,"setReset" :setReset}  } />}
                formErrors = {message? (<p className="alert alert-warning">{message}</p>):<></>}
                setReset = { setReset }
                additionalButtons = {<button id="setBack-button" onClick={()=>setBack()}>Back to Search</button>}

            />
        </form>
        
        )
        :<>

        <div className="airline-search-container">
            <form className="airline-search-form" onSubmit={(e)=>setsearchresults(e)}>
            
            <Select 
                required
                components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                name='flight'
                id='flight'
                className='airline-select'
                placeholder = 'Search for a flight'
                options ={flightOptions}
                isSearchable
                isClearable />

            <input id="airline-search-btn" type="submit" className="btn btn-primary btn-sm" value='search'/>
            </form>

            {searched?<button
                id="airline-clear-btn"
                className="btn btn-primary btn-sm" 
                onClick={()=>setBack()}>
                    Clear search and view all flights
                </button>
                :<></>}
        </div> 


        {searched?<>
        {
        <>
        <div id='searched-for-container'><label id='searched-for-label' >Searched for:</label> </div>
        <div id="center-flightcard">
            <FlightCard  flight={searched} countries={countries} custPage = {false} updateDeleteBtn = {Buttons(searched)} />
         </div>  
        </>
        }</>
        :<>
        
        
        
        <div className='flights-header'>
      <h2 className='flights-title'>  My Flights  </h2>
        </div>
        
        <div className="container">
              <div className="row">
               
        { 
                flights?.length > 0 
                ? (<>
                    {displayFlights}
                    <div className='pagination-container' >
                        <ReactPaginate
                        className= {"pagination"}
                        previousLabel = {'Back'}
                        nextLabel = {'Next'}
                        pageCount={pageCount > 1? pageCount: 0}
                        breakLabel=".."
                        pageRangeDisplayed={ 4 }
                        marginPagesDisplayed={ 1 }
                        renderOnZeroPageCount = {null}
                        nextClassName = { hiddenNext.current }
                        previousClassName = { hiddenBack.current }
                        onPageChange={changePage}
                        siblingCount = {0}
                        containerClassName={""}
                        previousLinkClassName={"btn btn-outline-info"}
                        nextLinkClassName={"btn btn-outline-info"}
                        />
                    </div>
                    </>
                ) : (
                        <h2>No Flights found</h2>
                )
            }
    </div></div></>}</>}

</>)
}

export default ViewAirlineFlights