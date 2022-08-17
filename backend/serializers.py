from rest_framework.serializers import ModelSerializer , SlugRelatedField
from .models import *




#helper function to connect forigin key and pull the name instead of id
def foreign_key_link(field):
        return SlugRelatedField(many=False,read_only=True,slug_field=field)


class FlightSerializer(ModelSerializer):

    destination_country = foreign_key_link("country_name")
    origin_country = foreign_key_link("country_name")
    airline = foreign_key_link("name")

    class Meta:
        model = Flight
        fields = '__all__'


class TicketSerializer(ModelSerializer):
    customer = foreign_key_link("first_name")
    flight = FlightSerializer(read_only=True)

    class Meta:
        model = Flight_Ticket
        fields = '__all__'

class AirlineSerializer(ModelSerializer):

    country = foreign_key_link("country_name")
    account = foreign_key_link("username")
    
    class Meta:
        model = Airline
        fields = '__all__'

class CountrySerializer(ModelSerializer):
    class Meta:
        model = Country
        # fields = ['country_name']
        fields = '__all__' 

class AllAccount_rolesSerializer(ModelSerializer):

    class Meta:
        model = Account_Role
        fields = '__all__'

class AccountSerializer(ModelSerializer):
    account_role = foreign_key_link("role_name")


    class Meta:
        model = Account
        fields = '__all__'

class CustomerSerializer(ModelSerializer):
    account = foreign_key_link("username")

    class Meta:
        model = Customer
        fields = '__all__'

class AdminSerializer(ModelSerializer):
    account = foreign_key_link("username")

    class Meta:
        model = Administrator
        fields = '__all__'





