from django.urls import path , include
from .views import *
from django.shortcuts import redirect
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
  
    
    ############## backend #########################
    path ('flights/country_range_filter/',FlightfilterCountries.as_view()),
    path ('flights/',FlightfilterCountries.as_view()),
    path ('flights/date_range_filter/',FlightfilterDate.as_view()),
    
    path('api/country/', Countryfilterget.as_view()),
    
    path('api/customer_api', tickets_api),

    path ('countries', country_api),
    path ('country/<str:id>/', specific_country_api),



    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user_api', user_api),
    path('api/admin_api', admin_api),
    path('api/admin_api/<str:username>', admin_delete),
    path('api/airline_api', airline_api),
    path('api/airline_api/<int:id>', airline_delete_update),

]

