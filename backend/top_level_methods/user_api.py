
from rest_framework import status
from rest_framework.response import Response
from ..serializers import AccountSerializer, CustomerSerializer, AirlineSerializer, AdminSerializer
from ..DAL.base_facade import BaseFuncade
from ..DAL.anony_facade import AnonymusFancade
from ..models import *
from ..DAL.admin_facade import AdministratorFuncade
from ..DAL.airline_facade import Airline_Facade
from ..DAL.customer_facade import CustomerFancade
from django.contrib.auth.hashers import check_password


class User_API_Actions:

    def are_you_logged_in(request):
        """checks if user is logged in, returns true if all is fine, returns 401 response if not"""
        if request.user.is_authenticated == False:
            return Response(data='You are not logged in!', status=status.HTTP_401_UNAUTHORIZED)
        return True

    def register_user(request):
                """registers a user based on form data, returns 400 if anything is missing, if password, email, credit card, username or phone num issues.
                """
                try: 
                    account_role = Account_Role.objects.get(role_name='Customer')
                    acc_form = {}
                    cus_form = {}
                    acc_form['username'] = request.data['username']
                    acc_form['email'] = request.data['email']
                    acc_form['password'] = request.data['password']
                    acc_form['account_role'] = account_role.pk
                    cus_form['first_name'] = request.data['first_name']
                    cus_form['last_name'] = request.data['last_name']
                    cus_form['address'] = request.data['address']
                    cus_form['phone_number'] = request.data['phone_number']
                    cus_form['credit_card_no'] = request.data['credit_card_no']
                except: return Response(data='ERROR Json parameters not entered correctly.', status=status.HTTP_400_BAD_REQUEST)

                acc_serializer = AccountSerializer(data=acc_form, many = False)
                cus_serializer = CustomerSerializer(data=cus_form, many = False)

                if acc_serializer.is_valid() and cus_serializer.is_valid():
                    created_account = BaseFuncade.create_new_user(acc_serializer)
                    AnonymusFancade.add_customer(cus_serializer , created_account)
                    context = {'data':{'username':acc_serializer.data['username'], 'email':acc_serializer.data['email'], 'first_name':cus_serializer.data['first_name'], 'last_name':cus_serializer.data['last_name']}}
                    return Response(context)
                else:
                    acc_serializer.is_valid()
                    cus_serializer.is_valid()
                    context = []
                    for key in acc_serializer.errors:
                        context.append(acc_serializer.errors[key][0])
                    for key in cus_serializer.errors:
                        context.append(cus_serializer.errors[key][0])
                    return Response(data=context ,status=status.HTTP_400_BAD_REQUEST)

    def get_user(request):
            """gets details for logged in user based on their account role
            """
            user=AdministratorFuncade.get_by_username(request.user.username)
            role = user['account_role']
            account = user['account']
            user=user['user']
            context = {}
            if role == 'Admin':
                    second_serializer = AdminSerializer(user, many=False)
            elif role == 'Airline':
                    second_serializer = AirlineSerializer(user, many=False)
            elif role == 'Customer':
                    second_serializer = CustomerSerializer(user, many=False)
            else: second_serializer = False

            if not second_serializer == False:
                return Response(second_serializer.data)
            else: return Response(['superuser'])


    def update_user_user_api(request):
                """update an account based on a request. checks if updated email is already in use and throws 400 if yes. checks phonenumber and credit card and does the same if cust.
                else, updates account based on data and account role and returns 200.
                """
                try:
                    account = Account.objects.exclude(pk=request.user.pk).get(email=request.data['email'])
                    return Response(data='This email is already in use!', status=status.HTTP_400_BAD_REQUEST)
                except Account.DoesNotExist:
                    form = {}
                    emailform={}
                    emailform['email'] = request.data['email']
                if request.user.account_role == Account_Role.objects.get(role_name='Customer'):
                    try: 
                        phonetest = Customer.objects.exclude(account=request.user).get(phone_number=request.data['phone_number'])
                        return Response(data='Phone number already in use!', status=status.HTTP_400_BAD_REQUEST)
                    except Customer.DoesNotExist: 
                        try:
                            cardtest = Customer.objects.exclude(account=request.user).get(credit_card_no=request.data['credit_card_no'])
                            return Response(data='Card number already in use!', status=status.HTTP_400_BAD_REQUEST)
                        except Customer.DoesNotExist:
                            form['credit_card_no'] = request.data['credit_card_no']
                    form['first_name'] = request.data['first_name']
                    form['last_name'] = request.data['last_name']
                    form['address'] = request.data['address']
                    form['phone_number'] = request.data['phone_number']
                    CustomerFancade.update_customer(account=request.user, form=form, emailform=emailform)

                elif request.user.account_role == Account_Role.objects.get(role_name='Airline'):
                    country = Country.objects.get(pk=request.data['country'])
                    form['country'] =  country
                    form['name'] = request.data['name']
                    Airline_Facade.update_airline(account=request.user, form=form, emailform=emailform)
                elif request.user.is_superuser == True:
                    AdministratorFuncade.update_account(account=request.user, form=emailform)
                elif request.user.is_admin == True:
                    form['first_name'] = request.data['first_name']
                    form['last_name'] = request.data['last_name']
                    AdministratorFuncade.update_admin(account=request.user, form=form, emailform=emailform)
                else: 
                    return Response(data='This account seems to not be any user type. Please contact an admin.', status=status.HTTP_400_BAD_REQUEST)

                return Response(f'Account for {request.user.account_role} {request.user.username} updated successfully')


    def change_password(request):
        """takes form data, changes logged in user password
        if old password does not match what entered, returns 400
        """
        if not check_password(request.data['old_password'], request.user.password):
            return Response("Old Password does not match what was typed", status=status.HTTP_400_BAD_REQUEST)
        else:
            user = request.user
            user.set_password(request.data['password'])
            user.save()
            return Response('Your Password has been changed!')