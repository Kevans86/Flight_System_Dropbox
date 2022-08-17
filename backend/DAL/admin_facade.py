from backend.DAL.airline_facade import Airline_Facade
from ..models import Account, Account_Role, Customer, Administrator, Airline, Flight, Flight_Ticket
from django.http import Http404
from .base_facade import BaseFuncade
from .customer_facade import CustomerFancade

class AdministratorFuncade(BaseFuncade):
    
    def get_all_customers():
        """returns all customer objects"""
        cus = Customer.objects.all()
        return cus

    def get_all_accounts(account):
        """returns all account objects"""
        account = Account.objects.exclude(pk=account.id)
        return account

    def get_all_admins(account):
        """returns all admin objects but the one in use"""
        admins = Administrator.objects.exclude(account=account)
        return admins

    def remove_airline(airline):
        """receives an airline id, deletes said airline and their flights and tickets, returns the account"""
        flights =Flight.objects.filter(airline=airline)
        for flight in flights:
            Airline_Facade.remove_flight(flight.id)
        a = airline.account
        airline.delete()
        return a
 
    def remove_customer(customer):
        """receives a customer id, deletes said customer and their tickets, returns the account"""
        tickets =Flight_Ticket.objects.filter(customer=customer)
        form = {}
        for ticket in tickets:
            form['ticket'] = ticket.id
            form['flight'] = ticket.flight.id
            CustomerFancade.remove_ticket(form)
        a = customer.account
        customer.delete()
        return a

    def remove_account(account):
        """deletes an account"""
        account.delete()

    def remove_admin(admin):
        """receives a admin id, deletes said admin, returns the account"""
        a = admin.account
        admin.delete()
        return a

    def add_airline(form, account):
            """receives clean_data form, adds an airline based on that to the database and deletes old customer/admin details."""
            if account.account_role == Account_Role.objects.get(role_name='Admin'):
                admin = Administrator.objects.get(account=account)
                AdministratorFuncade.remove_admin(admin)
                account.is_admin = False
                account.is_staff = False
            else:
                customer = Customer.objects.get(account=account)
                AdministratorFuncade.remove_customer(customer)
                account.is_customer = False
            airline = Airline()
            airline.name = form['name']
            airline.country = form['country']
            airline.account = account
            account.account_role = Account_Role.objects.get(role_name='Airline')
            account.is_airline = True
            account.save()
            airline.save()

    def add_admin(account, form=None):
        """takes account and form (form can be left empty if its a customer account), makes an admin account and deletes old airline/customer details"""
        if account.account_role == Account_Role.objects.get(role_name='Customer'):
            customer = Customer.objects.get(account=account)
            first_name = customer.first_name
            last_name = customer.last_name
            AdministratorFuncade.remove_customer(customer)
            account.is_customer = False
        elif account.account_role == Account_Role.objects.get(role_name='Airline'):
                airline = Airline.objects.get(account = account)
                first_name = form['first_name']
                last_name = form['last_name']
                AdministratorFuncade.remove_airline(airline)
                account.is_airline = False
        else:
            raise Http404("This user either does not exist or is already an admin")

        admin = Administrator()
        admin.first_name = first_name
        admin.last_name = last_name
        admin.account = account
        account.account_role = Account_Role.objects.get(role_name='Admin')
        account.is_admin = True
        account.is_staff = True
        account.save()
        admin.save()
   
    def add_customer_admin_command(account, form):
        """takes account and form, makes a customer account and deletes old airline/admin details"""
        if account.account_role == Account_Role.objects.get(role_name='Admin'):
            admin = Administrator.objects.get(account=account)
            first_name = admin.first_name
            last_name = admin.last_name
            AdministratorFuncade.remove_admin(admin)
            account.is_admin = False
            account.is_staff = False
        elif account.account_role == Account_Role.objects.get(role_name='Airline'):
                airline = Airline.objects.get(account = account)
                first_name = form['first_name']
                last_name = form['last_name']
                AdministratorFuncade.remove_airline(airline)
                account.is_airline = False
        else:
            raise Http404("This user either does not exist or is already an admin")

        customer = Customer()
        customer.first_name = first_name
        customer.last_name = last_name
        customer.account = account
        customer.address = form['address']
        customer.phone_number = form['phone_number']
        customer.credit_card_no = form['credit_card_no']
        account.account_role = Account_Role.objects.get(role_name='Customer')
        account.is_customer = False
        account.save()
        customer.save()


    def get_by_username(username):
        """receives username, brings back the linked admin,airline or customer account in a touple where the third object is a string with the role name, along with the account as the second"""
        try:
            account = Account.objects.get(username=username)
        except:
            raise Http404("Account does not exist")
        if account.account_role == Account_Role.objects.get(role_name='Admin') and account.is_superuser ==False:
            user = Administrator.objects.get(account=account)
            role = "Admin"
        elif account.account_role == Account_Role.objects.get(role_name='Airline'):
            user = Airline.objects.get(account=account)
            role = "Airline"
        elif account.account_role == Account_Role.objects.get(role_name='Customer'):
            user = Customer.objects.get(account=account)
            role = "Customer"
        elif account.is_superuser == True:
            user = None
            role = 'Superuser'
        else:
            raise Http404("Account seems to not be linked to any profile. Please contact an administrator")
        
        return {'user':user, 'account':account, 'account_role':role}


    def update_admin(form, account, emailform):
        """takes form and an existing account, updates the admin attached to it with form data"""
        admin = Administrator.objects.get(account=account)
        admin.first_name = form['first_name']
        admin.last_name = form['last_name']
        account.email = emailform['email']
        admin.save()
        account.save()

    def update_account(account, form):
        """takes account and form with email data, updates email for user"""
        account.email = form['email']
        account.save()