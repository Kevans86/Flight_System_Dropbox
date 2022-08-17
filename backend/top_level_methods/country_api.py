from ..serializers import CountrySerializer
from ..models import Country
from rest_framework import status
from rest_framework.response import Response
from ..DAL.base_facade import BaseFuncade

class Country_API_Actions:
    def __check_if_exists(id):
        """checks if country exists, returns it if true, returns 404 if not"""
        try:
            country = Country.objects.get(pk = id)
            return country
        except Country.DoesNotExist:
            return 404

    def __check_if_admin(request):
        """checks if logged in user is admin, returns 400 if not and True if user is"""
        if request.user.is_admin == False:
            return 400
        else: return True



    def all_countries_api():
        """returns all countries"""
        countries =  Country.objects.all()
        seralizer = CountrySerializer(countries, many = True)
        return Response(seralizer.data)

    def get_country_api(id):
        """takes id, returns 200 and country with said id
        returns 404 if country does not exist."""
        country = Country_API_Actions.__check_if_exists(id)
        if country == 404:
            return Response(data='Country does not exist', status=status.HTTP_404_NOT_FOUND)
        seralizer = CountrySerializer(country, many = False)
        return Response(seralizer.data)

    def update_country_api(request, id):
        """takes request and id, updates country with said id using request data and returns 200
        returns 400 if not admin, 404 if country does not exist. returns 400 and errors if form was not filled properly"""
        if Country_API_Actions.__check_if_admin(request) == 400:
            return Response(data='Only admins may do this', status=status.HTTP_400_BAD_REQUEST)
        data = request.data
        country = Country_API_Actions.__check_if_exists(id)
        if country == 404:
            return Response(data='Country does not exist', status=status.HTTP_404_NOT_FOUND)

        seralizer = CountrySerializer(instance=country, data=data)
        
        if seralizer.is_valid():
            seralizer.save()
            return Response(seralizer.data)
        else:
            return Response(data=seralizer.errors ,status=status.HTTP_400_BAD_REQUEST)

    def delete_country_api(request, id):
        """takes request and id, deletes country with said id and returns 200
        returns 400 if not admin, 404 if country does not exist"""
        if Country_API_Actions.__check_if_admin(request) == 400:
            return Response(data='Only admins may do this', status=status.HTTP_400_BAD_REQUEST)
        data = request.data
        country = Country_API_Actions.__check_if_exists(id)
        if country == 404:
            return Response(data='Country does not exist', status=status.HTTP_404_NOT_FOUND)

        country = BaseFuncade.get_country_by_id(id)
        country.delete()
        return Response("Deleted")

    def create_country_api(request):
        """takes request, creates a new country from data and returns 200
        returns 400 if not admin
        returns 400 with errors if the form has issues (such as the name being used already)"""
        if Country_API_Actions.__check_if_admin(request) == 400:
            return Response(data='Only admins may do this', status=status.HTTP_400_BAD_REQUEST)
        data = request.data

        seralizer = CountrySerializer(data=data, many = False)
        if seralizer.is_valid():
            seralizer.save()
            return Response('country made successfully')
        else:
            return Response(data=seralizer.errors ,status=status.HTTP_400_BAD_REQUEST)