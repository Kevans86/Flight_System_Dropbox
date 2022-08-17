from ..models import Airline, Flight, Flight_Ticket
from django.http import Http404
from .base_facade import BaseFuncade



class Airline_Facade(BaseFuncade):
 
    def add_flight(airline, form, flight):
            """takes form, a flight object and an airline id, makes a new flight."""
            airli = Airline.objects.get(pk = airline)
            flight.airline = airli
            flight.origin_country = form['origin_country']
            flight.destination_country =form['destination_country']
            flight.departure_time = form['departure_time']
            flight.landing_time = form['landing_time']
            flight.remaining_tickets = form['remaining_tickets']
            flight.save()

    def update_flight(airline, form, flight):
        """same as make flight, takes form, a flight object and an airline id, updates a flight."""
        Airline_Facade.add_flight(airline, form, flight)
        

    def remove_flight(flight, airline):
        """remove a flight.returns 1 if successful"""
        try:
            f = Flight.objects.get(pk = flight)
        except Flight.DoesNotExist:
            raise Http404("Flight does not exist")
        if airline != f.airline:
            raise Http404("This is not your flight! You may not delete it")
        tickets = Flight_Ticket.objects.filter(flight=flight)
        if tickets.count() > 0:
            for ticket in tickets: ticket.delete()
        f.delete()
        return 1


    def get_my_flights(id):
        """gets all flight for an airline"""
        return Flight.objects.filter(airline=id)

    def update_airline(form, account, emailform):
        """takes form and an existing account, updates the airline attached to it with form data"""
        airline = Airline.objects.get(account=account)
        airline.name = form['name']
        airline.country = form['country']
        account.email = emailform['email']
        airline.save()
        account.save()