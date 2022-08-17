from pickle import TRUE
from django.db.models import *
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from .dropbox_storage import DropboxStorage

DROPBOX_STORAGE = DropboxStorage()

class Account_Role(Model):
    role_name = CharField(max_length=30, unique=True, null=False)
    def __str__(self):
        return self.role_name
    class Meta:
        ordering = ['role_name']
        
class MyAccountManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("User must have an email")
        if not username:
            raise ValueError("User must have an username")

        account = self.model(
            email = self.normalize_email(email),
            username = username,
        )

        account.set_password(password)
        account.save(using=self._db)
        return account

    def create_superuser(self, email,username, password):
        account = self.create_user(
        email=self.normalize_email(email),
        password=password,
        username=username,
        )
        account.is_admin = True
        account.is_staff = True
        account.is_superuser = True
        account.save(using=self._db)
        return account

class Account(AbstractBaseUser):
    email = EmailField(verbose_name='email', max_length=60, unique=True)
    username = CharField(max_length=30, unique=True)
    date_joined = DateTimeField(verbose_name='date joined', auto_now_add=True)
    last_login = DateTimeField(verbose_name='last login', auto_now=True)
    is_admin = BooleanField(default=False)
    is_active = BooleanField(default=True)
    is_staff = BooleanField(default=False)
    is_superuser = BooleanField(default=False)
    account_role = ForeignKey(Account_Role, null=True, on_delete=PROTECT)
    is_airline = BooleanField(default=False)
    is_customer = BooleanField(default=False) 

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', ]

    objects = MyAccountManager()

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_admin
    def has_module_perms(self, app_label):
        return True

class Country(Model):
    link = "Edit"
    country_name = TextField(max_length=100, null=False, unique=True)
    # flag = ImageField(upload_to="static\\flags")
    flag = ImageField(storage=DROPBOX_STORAGE)
    # flag_url = URLField(default="none")

    class Meta:
        ordering = ['country_name']

        verbose_name_plural = 'countries'
    def __str__(self) -> str:
        return self.country_name



class Airline(Model):
    name = TextField(max_length=255, null=False, unique=True)
    country = ForeignKey(Country, null=False, on_delete=PROTECT)
    account = OneToOneField(Account, null=False, on_delete=PROTECT)
    class Meta:
        ordering = ['name']
    def __str__(self) -> str:
        return self.name

class Customer(Model):
    first_name = TextField(max_length=100, null=False)
    last_name = TextField(max_length=100, null=False)
    address = TextField(max_length=100, null=False)
    phone_number = TextField(max_length=16, null=False, unique=True)
    credit_card_no = TextField(max_length=16, null=False, unique=True)
    account = OneToOneField(Account, null=True, on_delete=PROTECT)
    class Meta:
        ordering = ['last_name']
    def __str__(self) -> str:
        return (self.first_name + ' ' + self.last_name)

class Flight(Model):
    airline = ForeignKey(Airline, null=False, on_delete=PROTECT)
    origin_country = ForeignKey(Country, null=False,related_name="origin", on_delete=PROTECT)
    destination_country = ForeignKey(Country, null=False,related_name="destination", on_delete=PROTECT)
    departure_time = DateTimeField(null=False)
    landing_time = DateTimeField(null=False)
    remaining_tickets = IntegerField(null=False)
    class Meta:
        ordering = ['departure_time']
    def __str__(self) -> str:
        return (f"flight from {self.origin_country} to {self.destination_country}, by {self.airline}, at {self.departure_time}")

class Flight_Ticket(Model):
    customer = ForeignKey(Customer, null=False, on_delete=PROTECT)
    flight = ForeignKey(Flight, null=False, on_delete=PROTECT)
    
    class Meta:
        ordering = ['flight']
    def __str__(self) -> str:
        return (f'Ticket for {self.customer} on the {self.flight}')


class Administrator(Model):
    first_name = TextField(max_length=50, null=False)
    last_name = TextField(max_length=50, null=False)
    account = OneToOneField(Account, null=False, on_delete=PROTECT)
    class Meta:
        ordering = ['last_name']
    def __str__(self) -> str:
        return (self.first_name + ' ' + self.last_name)

