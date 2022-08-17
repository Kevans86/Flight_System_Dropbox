import pytest
from rest_framework import status
from rest_framework.test import APIClient

print('hello im testing stuff')

class Test_backend:
    def test_flight_app_home(self):
        client = APIClient()
        response = client.get('backend/flights/')
        print(response.status_code)
        assert response.status_code == status.HTTP_200_OK


    def test_this_will(self):
        print('Test')