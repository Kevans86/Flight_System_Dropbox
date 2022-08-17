from ..models import Customer
from .base_facade import BaseFuncade
from django.contrib.auth import authenticate, login


class AnonymusFancade(BaseFuncade):


    def login(request, form):
        """takes form with username and passwword, logs user in if they match"""
        username = form["username"]
        password = form["password"]
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            logged = True
         
        return logged
            

    def add_customer(form , created_account) :
        """takes form and created account, makes new customer for said new account"""
        form.save()
        created_customer = Customer.objects.get(phone_number =  form.data['phone_number'])
        created_customer.account_id = created_account.id
        created_customer.save()

