import React from 'react'
import { CreateTicket, RemoveTicket } from '../../methods/TicketMethods'



const TicketAddButton = (props) => {
    /**
* if user is logged in, adds a ticket for the flight selected for them
*/  
    let handleAddTicket = async (e) => {
        e.preventDefault()
        if (props.authToken){await CreateTicket(props.currentFlight, props.authToken)}
        window.location = "/customer/tickets"
        // navigate("/customer/tickets")
      }
    



    return (
            <>

                <input 
                    type="button" 
                    id='book-btn' 
                    value = "Book"
                    onClick={handleAddTicket}
                />
            </>
  )
}


const TicketRemoveButton = (props) => {

 /**
* removes the current ticket for the user
*/  
    let handleRemoveTicket = async (e) => {
        e.preventDefault()
    
        await RemoveTicket(props.currentTicket, props.authToken)
        window.location = "/customer/tickets"

    }

    return (
        <>
            <input 
                type="button" 
                id='remove-btn' 
                value = "Remove"
                onClick={handleRemoveTicket}
            />
            
        </>
            )

}

export  {TicketAddButton , TicketRemoveButton }