
from rest_framework import status
from rest_framework.response import Response
from ..DAL.airline_facade import Airline_Facade
from ..serializers import FlightSerializer
from datetime import datetime
import pytz
utc=pytz.UTC
from ..models import Country, Flight, Account_Role, Airline


class Airline_API_Actions:
    def does_flight_exist_is_it_yours(airline, id):
        """checks if if flight exists and belongs to logged in airline, returns {'result':True, 'flight':flight} if all is fine, returns {'result':False, 'response':401 response}"""
        try:
            flight = Flight.objects.get(pk = id)
        except Flight.DoesNotExist:
            return {'result':False, 'response': Response(data="Flight does not exist", status=status.HTTP_404_NOT_FOUND)}
        if airline != flight.airline:
            return {'result':False, 'response': Response(data="This is not your flight!", status=status.HTTP_401_UNAUTHORIZED)}
        return {'result':True, 'flight':flight}

    def are_you_an_airline(request):
        """checks if user is logged in and an airline, returns {'result':True, 'airline':airline} , returns {'result':False, 'response':401 response}"""
        if request.user.is_authenticated == False:
            return {'result':False, 'response': Response(data='You are not logged in!', status=status.HTTP_401_UNAUTHORIZED)}
        if request.user.account_role != Account_Role.objects.get(role_name = 'Airline'):
            return {'result':False, 'response': Response(data='Must be an airline to use this!', status=status.HTTP_401_UNAUTHORIZED)}
        airline = Airline.objects.get(account=request.user)
        return {'result':True, 'airline':airline}

    def get_all_my_flights(airline):
        """takes an airline, returns all flights by said airline"""
        flights =  Flight.objects.filter(airline=airline).order_by('departure_time')
        seralizer = FlightSerializer(flights, many = True)
        return Response(seralizer.data)


    def create_flight_airline_api(request, airline):
        """takes request data and an airline, creates a flight after validating variables"""
        serializer = FlightSerializer(data=request.data, many = False)
        if serializer.is_valid():
                if request.data['origin_country']  == request.data['destination_country']:
                    return Response(data='Destination and origin countries must not be the same!', status=status.HTTP_400_BAD_REQUEST)
                data= request.data
                departure_time = utc.localize(datetime.strptime(request.data['departure_time'].replace('T', ' '), '%Y-%m-%d %H:%M'))
                landing_time = utc.localize(datetime.strptime(request.data['landing_time'].replace('T', ' '), '%Y-%m-%d %H:%M'))
                if departure_time < utc.localize(datetime.strptime(utc.localize(datetime.now()).strftime("%Y-%m-%d %H:%M"), '%Y-%m-%d %H:%M')):
                    return Response(data='You cannot choose a date in the past', status=status.HTTP_400_BAD_REQUEST)
                if landing_time <= departure_time:
                    return Response(data='A landing must be after a departure', status=status.HTTP_400_BAD_REQUEST)
                data['departure_time'] = departure_time
                data['landing_time'] = landing_time
                data['origin_country'] = Country.objects.get(pk=data['origin_country'])
                data['destination_country'] = Country.objects.get(pk=data['destination_country'])
                flight=Flight()
                Airline_Facade.add_flight(airline=airline, form=data, flight=flight)
                return Response(f'Successfully made new flight by {request.user}')

        else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def update_flight_airline_api(request, airline, flight):
        """takes request data, a flight and an airline, updates said flight after validating variables"""
        serializer = FlightSerializer(data=request.data, many = False)
        if serializer.is_valid():
                if request.data['origin_country']  == request.data['destination_country']:
                    return Response(data='Destination and origin countries must not be the same!', status=status.HTTP_400_BAD_REQUEST)
                data= request.data
                departure_time = utc.localize(datetime.strptime(request.data['departure_time'].replace('T', ' '), '%Y-%m-%d %H:%M'))
                landing_time = utc.localize(datetime.strptime(request.data['landing_time'].replace('T', ' '), '%Y-%m-%d %H:%M'))
                if departure_time < utc.localize(datetime.strptime(utc.localize(datetime.now()).strftime("%Y-%m-%d %H:%M"), '%Y-%m-%d %H:%M')):
                    return Response(data='You cannot choose a date in the past', status=status.HTTP_400_BAD_REQUEST)
                if landing_time <= departure_time:
                    return Response(data='A landing must be after a departure', status=status.HTTP_400_BAD_REQUEST)
                data['departure_time'] = departure_time
                data['landing_time'] = landing_time
                data['origin_country'] = Country.objects.get(pk=data['origin_country'])
                data['destination_country'] = Country.objects.get(pk=data['destination_country'])
                Airline_Facade.update_flight(airline=airline, form=data, flight=flight)
                return Response(f'Successfully updated flight {flight.id} by {request.user}')

        else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_specific_flight_airline_api(flight):
        """takes a flight, returns it as a serialized response"""
        serializer = FlightSerializer(data=flight, many = False)
        return Response(serializer.data)

    def remove_flight_airline_api(id, airline):
        """takes flight id and airline, removes flight"""
        Airline_Facade.remove_flight(id, airline)
        return Response(data=f"Flight #{id} deleted successfully")