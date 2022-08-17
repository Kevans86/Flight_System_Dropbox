/**
    * returns a display card for a user account
    * @param  {Dictionary} account The account
    * @param  buttons html buttons that you want to have in the card
    */  
export const AccountCard = ({account, buttons}) => {
    return (
        <div className="list-group-item list-group-item-action flex-column align-items-start">
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{account.username} {account.email}</h5>
                <small className="text-muted">Role: {account.account_role}. Superuser Status: {String(account.is_superuser)}</small><br/><br/>

            </div>
            {buttons}
        </div>
    )
}

/**
    * returns a display card for a customer
    * @param  {Dictionary} customer The customer
    * @param  buttons html buttons that you want to have in the card
    */  
const CustomerCard = ({customer, buttons}) => {
    return (
    <div>
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{customer.first_name} {customer.last_name}</h5>
                <small className="text-muted">Username: {customer.account}</small></div>
            <div className="d-flex w-100 justify-content-between">
            <p className="mb-1">Lives in {customer.address}</p></div>
            <div className="d-flex w-100 justify-content-between">
            <p className="mb-1">Phone Number: {customer.phone_number}</p>
            </div>
        {buttons}
    </div>
    )
}

/**
    * returns a display card for an airline
    * @param  {Dictionary} airline The airline
    * @param  {Dictionary} countries countries, in order to display the flag of the country the airline is from
    * @param  buttons html buttons that you want to have in the card

    */  
export const AirlineCard = ({airline, countries, buttons}) => {
    const country = countries.find(count=> count.country_name===airline.country)
    
    return (
        <div>
                <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{airline.name}</h5>
                    <small className="text-muted">Username: {airline.account}</small>          <br/><br/>
                    <p className="mb-1">From {airline.country}. <img src={country?.flag} height="15px" width="20px" alt={airline.country + ' flag'}/> </p>
                </div>
            {buttons}

        </div>
    )
}

/**
    * returns a display card for an admin
    * @param  {Dictionary} admin The admin
    * @param  buttons html buttons that you want to have in the card
    */  
export const AdminCard = ({admin, buttons}) => {
    return (
        <div>
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{admin.first_name} {admin.last_name}</h5>
                <small className="text-muted">Username: {admin.account}</small><br/><br/>
            </div>
            {buttons}
        </div>
    )
}



export default CustomerCard