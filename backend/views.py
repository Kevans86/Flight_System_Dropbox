from .models import Flight, Country
from .DAL.admin_facade import AdministratorFuncade
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view
import pytz
from .top_level_methods.user_api import *
from .top_level_methods.admin_api import *
from .top_level_methods.airline_api import *
from .top_level_methods.customer_api import *
from .top_level_methods.country_api import *
from .serializers import FlightSerializer, CountrySerializer
from rest_framework.generics import ListAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .filters import *



utc=pytz.UTC



#######JWT CUSTOM CLAIM#######
########THIS IS WHERE WE SET WHAT INFO THE TOKENS WILL GRAB ON THE FRONT END
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        #sets up account_role type and main name for superusers
        #as superusers might lack both a role and an admin account
        if user.is_superuser == True:
            role_name = 'Admin'
            main_name = f'superuser {user.username}'
        #sets up account role and main name by the type of account a user is
        else:
            account_role = user.account_role
            role_name = account_role.role_name
            main_name=AdministratorFuncade.get_by_username(user.username)
            main_name = main_name['user']
            if role_name == 'Admin' or role_name == 'Customer':
                main_name = f'{main_name.first_name} {main_name.last_name}'
            else: main_name = main_name.name
        # Add custom claims
        token['username'] = user.username
        token['account_role'] = role_name
        token['email'] = user.email
        token['main_name'] = main_name
        token['is_superuser'] = user.is_superuser

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



##################################################
############### Filters ##########################

class FlightfilterDate(ListAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filterset_class = FlightfilterDate



class FlightfilterCountries(ListAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filterset_class = FlightfilterCountries

class Countryfilterget(ListAPIView):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_class = Countryfilter
    search_fields = ['country_name']
    

#########################################################
#################### Tickets ############################



@api_view(['GET', 'POST', 'DELETE'])
def tickets_api(request):
    result = Customer_API_Actions.are_you_a_customer(request)
    if result['result'] == False:
        return result
    else:
        customer = result['customer']
    
    if request.method == 'GET':
        mytickets = Customer_API_Actions.get_all_my_tickets(customer)
        return mytickets
    
    if request.method == 'POST':
        mytickets = Customer_API_Actions.add_ticket_api(request, customer)
        return mytickets

    if request.method == 'DELETE':
        mytickets = Customer_API_Actions.remove_ticket_api(request)    
        return mytickets
    




####################################################
##################Airline###########################



@api_view(['GET', 'POST'])
def airline_api(request):

    result = Airline_API_Actions.are_you_an_airline(request)
    if result['result'] == False:
        return result
    else:
        airline = (result['airline']).id

    if request.method == 'GET':
        respon = Airline_API_Actions.get_all_my_flights(airline)
        return respon
    
    if request.method == 'POST':
        respon = Airline_API_Actions.create_flight_airline_api(request, airline)
        return respon


@api_view(['PATCH','DELETE', 'GET'])
def airline_delete_update(request, id): 

    result = Airline_API_Actions.are_you_an_airline(request)
    if result['result'] == False:
        return result
    airline = result['airline']

    result = Airline_API_Actions.does_flight_exist_is_it_yours(airline,id)
    if result['result'] == False:
        return result['response']
    flight = result['flight']
        
    if request.method == 'GET':
        respon = Airline_API_Actions.get_specific_flight_airline_api(flight)
        return respon

    if request.method == 'PATCH':
        respon = Airline_API_Actions.update_flight_airline_api(request=request, airline=airline.id, flight=flight)
        return respon
    
    if request.method=='DELETE':
        respon = Airline_API_Actions.remove_flight_airline_api(id, airline)
        return respon

###################Country#########################


@api_view(['GET', 'POST'])
def country_api(request):
    if request.method == 'GET':
        return Country_API_Actions.all_countries_api()
    Admin_API_Actions
    result = Admin_API_Actions.are_you_an_admin(request)
    if result != True:
        return result
    else:
        if request.method == 'POST':
            result = Country_API_Actions.create_country_api(request)
            return result




@api_view(['GET', 'PATCH', 'DELETE'])
def specific_country_api(request, id):
    if request.method == 'GET':
        result = Country_API_Actions.get_country_api(id)
        return result

    
    result = Admin_API_Actions.are_you_an_admin(request)
    if result != True:
        return result
    else:
        if request.method == 'PATCH':
            result = Country_API_Actions.update_country_api(request, id)
            return result 

        if request.method == 'DELETE':
            result = Country_API_Actions.delete_country_api
            return result 


##################### ACCOUNT ACTIONS ############################

@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
def user_api(request):
    
    if request.method == 'POST':   
        respon = User_API_Actions.register_user(request)
        return respon

    result = User_API_Actions.are_you_logged_in(request)
    if result != True:
        return result

    else:

        if request.method=='GET':
            respon = User_API_Actions.get_user(request)
            return respon

        if request.method == 'PUT':
            res = User_API_Actions.update_user_user_api(request)
            return res

        if request.method == 'PATCH':
            res = User_API_Actions.change_password(request)
            return res


        if request.method == 'DELETE':  
            return Response('Extra feature! it may not be in use by the final product but if we want to, its here for us to implement.')

##################### ADMIN ACTIONS ############################

@api_view(['POST', 'PATCH'])
def admin_api(request):
    result = Admin_API_Actions.are_you_an_admin(request)
    if result != True:
        return result
    
    if request.method == 'POST':
        res = Admin_API_Actions.get_users_admin(request)
        return res

    if request.method == 'PATCH':   
        res = Admin_API_Actions.change_account_role(request)
        return res


@api_view(['DELETE'])
def admin_delete(request, username):
    result = Admin_API_Actions.are_you_an_admin(request)
    if result != True:
        return result

    if request.method == 'DELETE':
        res = Admin_API_Actions.delete_full_account(request, username)
        return res

##################################################
##################################################