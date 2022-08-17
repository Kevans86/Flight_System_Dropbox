from ..models import Account_Role, Flight, Airline, Country
from django.db.models import Q
class BaseFuncade():
 
    def get_all_flights():
        """returns all flights"""
        return list(Flight.objects.all())

    def get_flight_by_id(id):
        """returns a flight based on id given"""
        return Flight.objects.get(pk=id)
        

    def get_flights_by_parameters(
        airline_id = 0, 
        origin_country_id= 0, 
        destination_country_id = 0, 
        departure_time = "0001-01-01 00:00:00", 
        landing_time = "0001-01-01 00:00:00",
        remaining_tickets = -1 
        ):
        """returns a flight based on parameters given"""
        flight_by_params = list(Flight.objects.filter(
            Q(airline = airline_id)|
            Q(origin_country_id = origin_country_id)|
            Q(destination_country_id = destination_country_id)|
            Q(departure_time = departure_time)|
            Q(landing_time = landing_time)|
            Q(remaining_tickets = remaining_tickets)
         ))

        
        return flight_by_params




    def get_all_airlines():
            "returns all airlines"
            return list(Airline.objects.all())

    def get_airline_by_id(id):   
            """returns airline by id"""
            return Airline.objects.get(pk=id)


    def get_airline_by_parameters(airline_name, country_id):
        """returns airline by airline_name and country_id"""

        airline_by_params = list(Airline.objects
        .filter(name = airline_name)
        .filter(country_id = Country.objects.get(country_name = country_id).id))   
        return airline_by_params



    def get_all_countries():
            """returns all countries"""
            country_list = list(Country.objects.all())
            return country_list

    def get_country_by_id(id):
            """takes country id, returns country"""
            return Country.objects.get(pk=id)


    
    def create_new_user(form):
        """takes form, makes new account"""
        user = form.save()
        user.set_password(user.password)
        role = Account_Role.objects.get(role_name="Customer")
        user.account_role= role
        user.is_customer = True
        user.save()
        return  user






