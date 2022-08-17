from ..models import Flight, Flight_Ticket, Customer
from .base_facade import BaseFuncade

class CustomerFancade(BaseFuncade):

    def update_customer(account, form, emailform):
        """updates customer account and customer details based on emailform, form, and account"""
        customer = Customer.objects.get(account = account)
        customer.first_name = form['first_name']
        customer.last_name = form['last_name']
        customer.address = form['address']
        customer.phone_number = form['phone_number']
        customer.credit_card_no = form['credit_card_no']
        account.email = emailform['email']
        customer.save()
        account.save()


    def add_ticket(form , customer_id):
        """makes flight ticket based on form data and customer_id"""
        flight_Ticket = Flight_Ticket()
        flight_Ticket.customer_id = customer_id
        flight_Ticket.flight_id = form['flight']
        flight_Ticket.save()
        
        #Remove Ticket From Flight
        flight = Flight.objects.get(pk = form['flight'] )
        flight.remaining_tickets -= 1
        flight.save() 
        return 1

    def remove_ticket(form):
        """removes ticket based on ticket id in dictionary"""
        ticket_to_remove = Flight_Ticket.objects.get(pk= form['ticket'])
        ticket_to_remove.delete()
        
        # Add removed ticket to flight
        flight = Flight.objects.get(pk = form['flight'] )
        flight.remaining_tickets += 1
        flight.save() 
   



    def get_my_tickets(id):
        """gets all tickets for customer based on id given"""
        return Flight_Ticket.objects.filter(customer_id = id)


 