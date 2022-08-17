from ..models import *
from ..DAL.admin_facade import AdministratorFuncade
from ..serializers import AccountSerializer, CustomerSerializer, AirlineSerializer, AdminSerializer
from rest_framework import status
from rest_framework.response import Response

class Admin_API_Actions:

    def are_you_an_admin(request):
        """checks if user is logged in and whether or not they're an admin, returns true if all is fine, returns 401 response if not"""
        if request.user.is_authenticated == False:
            return Response(data='You are not logged in!', status=status.HTTP_401_UNAUTHORIZED)
        if request.user.is_admin == False:
            return Response(data='Must be admin to use!', status=status.HTTP_401_UNAUTHORIZED)
        return True

    def get_users_admin(request):
            """returns what's requested (you request via the variable 'view'). if you request Accounts, all Accounts are given
            if you request Customers, all customers are given. Same for Airline and Admins. If you request specific, it will search for an account
            based on a variable 'username' and return details on said account"""
            if request.data['view']=='Accounts':
                accounts = AdministratorFuncade.get_all_accounts(request.user)
                serializer = AccountSerializer(accounts, many=True)
                return Response(serializer.data)
            if request.data['view']=='Customers': 
                customers = AdministratorFuncade.get_all_customers()
                serializer = CustomerSerializer(customers, many=True)
            elif request.data['view']=='Airlines':
                airlines = AdministratorFuncade.get_all_airlines()
                serializer = AirlineSerializer(airlines, many=True)
            elif request.data['view']=='Admins':
                admins = AdministratorFuncade.get_all_admins(request.user)
                serializer = AdminSerializer(admins, many=True)
            elif request.data['view']=='Specific':
                searched = AdministratorFuncade.get_by_username(request.data['username'])
                role = searched['account_role']
                user = searched['user']
                account = searched['account']
                acc_serializer = AccountSerializer(account, many=False)
                if role == 'Admin':
                    second_serializer = AdminSerializer(user, many=False)
                elif role == 'Airline':
                    second_serializer = AirlineSerializer(user, many=False)
                elif role == 'Customer':
                    second_serializer = CustomerSerializer(user, many=False)
                else: second_serializer = False
                if second_serializer == False:
                    return Response(acc_serializer.data)


                else: 
                    context = {}
                    for key in acc_serializer.data:
                        context[key] = acc_serializer.data[key]
                    for key in second_serializer.data:
                        context[key] = second_serializer.data[key]
                    return Response(context)

            else: 
                return Response(data='You must enter a view value.', status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data)

    def change_account_role(request):
            """this changes an account's role based on the variable 'make' (Admin, Airline, Customer), on a variable 'username' (the username of the account you wish to change) and on request data
            if the requested account is a superuser, no change is allowed, 400 is returned. If account is customer, it will check if the credit card number and phone numbers are unique, if not, 400.
            returns 200 if all is good. If you make an admin, it will also need the variable 'from' which, if 'from_search' is selected, it will make the new admin's first and last name the ones that already exist for this user (if they are a customer).
            """
            searched = AdministratorFuncade.get_by_username(username=request.data['username'])
            account = searched['account']
            form = {}
            if searched['account_role']=='Superuser':
                return Response(data='The superuser may not be changed!', status=status.HTTP_400_BAD_REQUEST)


            if request.data['make']=='Admin':
                if account.account_role == 'Admin':
                    return Response(data='Already an admin!', status=status.HTTP_400_BAD_REQUEST)
                
                if request.data['from'] == 'from_search':
                    form['first_name']=searched['user'].first_name
                    form['last_name']=searched['user'].last_name
                else:
                    form['first_name'] = request.data['first_name']
                    form['last_name'] = request.data['last_name']
                AdministratorFuncade.add_admin(account=account, form=form)


            elif request.data['make']=='Customer':
                if account.account_role == 'Customer':
                    return Response(data='Already a customer!', status=status.HTTP_400_BAD_REQUEST)

                try: 
                    phonetest = Customer.objects.get(phone_number=request.data['phone_number'])
                    return Response(data='Phone number already in use!', status=status.HTTP_400_BAD_REQUEST)
                except Customer.DoesNotExist: 
                    try:
                        cardtest = Customer.objects.get(credit_card_no=request.data['credit_card_no'])
                        return Response(data='Card number already in use!', status=status.HTTP_400_BAD_REQUEST)
                    except Customer.DoesNotExist:
                        form['first_name'] = request.data['first_name']
                        form['last_name'] = request.data['last_name']
                        form['address'] = request.data['address']
                        form['phone_number'] = request.data['phone_number']
                        form['credit_card_no'] = request.data['credit_card_no']
                        AdministratorFuncade.add_customer_admin_command(account=account, form=form)


            elif request.data['make']=='Airline':
                if account.account_role == 'Airline':
                    return Response(data='Already an Airline!', status=status.HTTP_400_BAD_REQUEST)
                
                
                try: 
                    airlinetest = Airline.objects.get(name=request.data['name'])
                    return Response(data='An Airline with this name already exists!', status=status.HTTP_400_BAD_REQUEST)
                except Airline.DoesNotExist: 
                    country = Country.objects.get(pk=request.data['country'])
                    form['name'] = request.data['name']
                    form['country'] =  country
                    AdministratorFuncade.add_airline(account=account, form=form)
            else: return Response(data='make must specify Admin, Customer, or Airline!', status=status.HTTP_400_BAD_REQUEST)


            return Response(data=f'successful update of {account} to {account.account_role}')

    def delete_full_account(request, username):
        """deletes an account and all details about it. takes username of said account to do so. Returns 400 if the delete request is for a superuser account.
        """
        searched = AdministratorFuncade.get_by_username(username=username)
        if searched['account_role']=='Customer':
                AdministratorFuncade.remove_customer(searched['user'])
        elif searched['account_role']=='Airline':
                AdministratorFuncade.remove_airline(searched['user'])
        elif searched['account_role']=='Admin':
                AdministratorFuncade.remove_admin(searched['user'])
        else: 
                return Response(data='Cannot delete the superuser!', status=status.HTTP_400_BAD_REQUEST)
        AdministratorFuncade.remove_account(searched['account'])
        return Response(data=f'successful deletion of {username}')