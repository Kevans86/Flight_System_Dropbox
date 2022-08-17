
import {useState, useEffect, useContext, useRef} from "react";
import { AdminCard} from "../../components/UserCards";
import AuthContext from "../../context/authentication";
import { Link } from "react-router-dom";
import GetUsers from "../../methods/AdminMethods";
import { DeleteUser } from "../../methods/AdminMethods";
import Select from 'react-select'
import ReactPaginate from "react-paginate"
import "../PagesCss/Pages.css"


const ViewAdmins= () => {
    const [admins, setAdmins] = useState([]);
    const [searchedItem, setSearchedItem] = useState(null);
    const [searchOptions, setSearchOptions] = useState([]);
    let {user, authToken} = useContext(AuthContext)
    const message = useRef()
    const hiddenBack = useRef("hidden-back")
    const hiddenNext = useRef("")

    useEffect(()=>{
        GetAdmins()
    },[])

    /**
    * sets all admins along with search options
    */  
    let GetAdmins = async() =>{
        
        let result = await GetUsers("Admins", authToken)
        let data =  result.data
        let status = result.status
        if (status ===200){
            setAdmins(data)
            setSearchOptions(data.map((account) => ({value:account.id, label:`${account.account}, ${account.first_name} ${account.last_name}`})))
        }
        else{
            alert(status, data)
        }
    }

    /**
    * returns all buttons to be displayed in cards
    */  
    let Buttons = (user)=>{

        return <div>
                    <Link className="btn btn-primary btn-sm" to={`/admin/make_customer/${user.account}`} >Add as Customer</Link>
                    <Link className="btn btn-primary btn-sm" to={`/admin/make_airline/${user.account}`} >Add as Airline</Link>
                    <button onClick={()=>Delete(user.account)}className="btn btn-danger btn-sm" >Delete</button>
            </div>
    }

    /**
    * deletes an admin. gets admins and resets search item after usage to show update
    * @param  {Dictionary} e The information (username)
    */  
    let Delete= async(e) =>{

        let result = await DeleteUser(e, authToken)

        message.current =result.data
        GetAdmins()
        setSearchedItem(false)

    }

    /**
    * sets the searched item to the searched admin
    * @param  {Dictionary} e The information (username)
    */  
    const searchforaccount = async(e)=>{
        e.preventDefault()
        setSearchedItem(admins.find(account=> account.id===parseInt(e.target.username.value)))}

    const [pagenumber, setPageNumber] = useState(0)
    const adminPerPage = 3
    const pagesSeen = pagenumber * adminPerPage
    
    /**
    * shows card for each admin, sets it up for the pagination
    */
    const displayAdmins = admins.slice(pagesSeen, pagesSeen + adminPerPage).map((admin)=>{
    return (
        <div key={admin.account} className="list-group-item list-group-item-action flex-column align-items-start">
        <AdminCard admin={admin} buttons={Buttons(admin)}/>

    </div>
    )})
    const pageCount = Math.ceil(admins.length / adminPerPage)
    const changePage = ({selected})=>{
        selected === 0? hiddenBack.current = "hidden-back":hiddenBack.current = ""         
        selected === (pageCount -1)?hiddenNext.current = "hidden-next":hiddenNext.current = ""

        setPageNumber(selected)
    }


    return (
    <>
        <div className="title-label-container"><div className="admins-label">Admins</div></div>

        {/* <div className="admin-label-center"><label className="admin-label-display" >Admin: {user.username}</label></div> */}
        {/* <div className="card text-center"> */}
        {/* <button className="btn btn-primary btn-sm" onClick={()=>setSearchedItem(false)}>Clear search and view all admins</button> */}
        {/* </div> */}
        {/* <div className="card text-center">All Admins</div> */}
        <div className="admin-search-container">
            <form  className="admin-search-form" onSubmit={(e)=>searchforaccount(e)}>
            <Select 
                required
                components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                name='username'
                id='username'
                className='admin-select'
                placeholder = 'Search for a user'
                options ={searchOptions}
                isSearchable = {true}
                isClearable = {true}  />
            
                <input id="admin-search-btn" type="submit" className="btn btn-primary btn-sm" value='search'/>
            </form>

        {searchedItem?<button id="admin-clear-btn" 
        className="btn btn-primary btn-sm" 
        onClick={()=>setSearchedItem(false)}>
            Clear search and view all admins
            </button>
            :<></>}
        </div>



        {searchedItem?<>
        {
        <div key={searchedItem.id} className="list-group-item list-group-item-action flex-column align-items-start">
        <p>Searched for:</p>
        <AdminCard admin={searchedItem} buttons={Buttons(searchedItem)}/>
        </div>
        }</>
        :<>


        {message.current? (<p className="alert alert-secondary">{message.current}</p>):<></>}
        
        {
                admins?.length > 0
                ? (<>
                    {displayAdmins}
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
                        <h2>No Admins found</h2>
                )
            }</>}
    </>)
}

export default ViewAdmins