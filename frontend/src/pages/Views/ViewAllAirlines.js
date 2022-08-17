
import React, {useState, useEffect, useContext, useRef} from "react";
import { AirlineCard } from "../../components/UserCards";
import AuthContext from "../../context/authentication";
import { Link } from "react-router-dom";
import GetUsers from "../../methods/AdminMethods";
import { DeleteUser } from "../../methods/AdminMethods";
import Select from 'react-select'
import ReactPaginate from "react-paginate"
import { AllCountries } from "../../methods/CountriesMethods";

const ViewAirlines = () => {
    const [airlines, setAirlines] = useState([]);
    const [searchOptions, setSearchOptions] = useState([]);
    const [searchedItem, setSearchedItem] = useState(null);
    const [countries, setCountries] = useState([]);
    let {user, authToken} = useContext(AuthContext)

    const message = useRef()
    const hiddenBack = useRef("hidden-back")
    const hiddenNext = useRef("")

    

    const [pagenumber, setPageNumber] = useState(0)
    const airlinesPerPage = 3
    const pagesSeen = pagenumber * airlinesPerPage

    /**
    * returns all buttons to be displayed in cards
    */  
         let Buttons = (user)=>{

            return <div>

                        <Link className="btn btn-primary btn-sm" to={`/admin/make_customer/${user.account}`} >Add as Customer</Link>
                        <Link className="btn btn-primary btn-sm" to={`/admin/make_admin/${user.account}`} >Add as Admin</Link>
                        <button onClick={()=>Delete(user.account)}className="btn btn-danger btn-sm" >Delete</button>

                </div>
        }

    /**
    * shows card for each airline, sets it up for the pagination
    */
    const displayAirlines = airlines.slice(pagesSeen, pagesSeen + airlinesPerPage).map((airline)=>{
    return (
    <div key={airline.account} className="list-group-item list-group-item-action flex-column align-items-start">
        <AirlineCard airline={airline} countries={countries} buttons={Buttons(airline)}/>

    </div>
    )})
    const pageCount = Math.ceil(airlines.length / airlinesPerPage)
    const changePage = ({selected})=>{
        selected === 0? hiddenBack.current = "hidden-back":hiddenBack.current = ""         
        selected === (pageCount -1)?hiddenNext.current = "hidden-next":hiddenNext.current = ""
        
        setPageNumber(selected)
    }


    /**
    * sets all airlines, along with search options and all countries
    */  
   
    let GetAirlines = async() =>{
        
        let result = await GetUsers("Airlines", authToken)
        let data =  result.data
        let status = result.status
        if (status ===200){
            setAirlines(data)
            setSearchOptions(data.map((account) => ({value:account.id, label:`${account.account}, ${account.name}, from ${account.country}`})))
            let country_data = await AllCountries()
            if (country_data){
                setCountries(country_data)        
        }}
        else{
            alert(status, data)
        }
    }

    useEffect(()=>{
        GetAirlines()
    },[])

    /**
    * deletes an airline. gets airline and resets search item after usage to show update
    * @param  {Dictionary} e The information (username)
    */  
    let Delete= async(e) =>{

        let result = await DeleteUser(e, authToken)
        message.current =result.data
        GetAirlines()
        setSearchedItem(false)

    }

    /**
    * sets the searched item to the searched airline
    * @param  {Dictionary} e The information (username)
    */  
    const searchforaccount = async(e)=>{
        e.preventDefault()
        setSearchedItem(airlines.find(account=> account.id===parseInt(e.target.username.value)))}


    return (
    <>
       <div className="title-label-container"><div className="admin-airline-label">Airlines</div></div>
        {message.current? (<p className="alert alert-secondary">{message.current}</p>):<></>}
        
        <div className="admin-search-container">
            <form className="admin-search-form" onSubmit={(e)=>searchforaccount(e)}>
                <Select 
                        required
                        name='username'
                        id='username'
                        className='admin-select'
                        placeholder = 'Search for a user'
                        options ={searchOptions}
                        components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                        isSearchable
                        isClearable />

                <input  type="submit" id="admin-search-btn"  className="btn btn-primary btn-sm" value='search'/>
            </form>

        {searchedItem?<button 
            id="admin-clear-btn"  
            className="btn btn-primary btn-sm" 
            onClick={()=>setSearchedItem(false)}>
                Clear search and view all airlines
            </button>
            :<></>}
        </div>



        {searchedItem?<>
        {
        <div key={searchedItem.id} className="list-group-item list-group-item-action flex-column align-items-start">
        <p>Searched for:</p>
        <AirlineCard airline={searchedItem} countries={countries}buttons={Buttons(searchedItem)}/>
        </div>
        }</>
        :<>

        {
                airlines?.length > 0 
                ? (<>
                    {displayAirlines}
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
                        <h2>No Airlines found</h2>
                )
            }</>}
    </>)
}

export default ViewAirlines