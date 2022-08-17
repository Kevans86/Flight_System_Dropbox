from django_filters import FilterSet, IsoDateTimeFilter , NumberFilter
from .models import *
from  datetime import datetime , timezone
import pytz
utc=pytz.UTC


class FlightfilterCountries(FilterSet):
    from_departure_time = IsoDateTimeFilter(field_name='departure_time',lookup_expr='gte')
    to_arrival_time = IsoDateTimeFilter(field_name='landing_time', lookup_expr='lte')

    class Meta:
        model = Flight
        fields = {
            "id": ["exact", "in"],
            "airline": ["exact"],
            "origin_country": ["exact"], 
            "destination_country": ["exact"],
            "departure_time": ["exact"],
            "landing_time": ["exact"],
            "remaining_tickets":["exact"],
        }

class FlightfilterDate(FilterSet):

    from_departure_time = IsoDateTimeFilter(field_name='departure_time__date', method="filter_departure")
    to_landing_time = IsoDateTimeFilter(field_name='landing_time__date', method="filter_landing")

    def filter_departure(self, quaryset , field_name , search_param):
        # will not show flights that already left
        self.from_departure_time = search_param
        now = utc.localize(datetime.now()).replace(tzinfo=timezone.utc)
        now = now.isoformat()
        return quaryset.filter(departure_time__date=search_param).exclude(departure_time__lt=now)
        
    def filter_landing(self, quaryset , field_name , search_param):
        self.to_landing_time = search_param
        return quaryset.filter(departure_time__date=self.from_departure_time).filter(landing_time__date=search_param)


    class Meta:
        model = Flight
        fields = {
            "id": ["exact", "in"],
            "airline": ["exact"],
            "origin_country": ["exact"], 
            "destination_country": ["exact"],
            "departure_time": ["exact"],
            "landing_time": ["exact"],
            "remaining_tickets":["exact"],
        }


class Countryfilter(FilterSet):
    class Meta:
        model = Country
        fields = ['country_name']
