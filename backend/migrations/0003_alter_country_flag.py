# Generated by Django 4.0.4 on 2022-08-17 14:37

import backend.dropbox_storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_account_is_airline_account_is_customer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='country',
            name='flag',
            field=models.ImageField(storage=backend.dropbox_storage.DropboxStorage(), upload_to=''),
        ),
    ]
