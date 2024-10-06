from django.contrib.auth.models import AbstractUser
from django.db import models
from django_countries.fields import CountryField


class User(AbstractUser):
    # Field used for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    email = models.EmailField(unique=True)
    username = models.CharField(blank=True, null=True, unique=False, max_length=100)
    country = CountryField()


    def __str__(self):
        return f"user_id {self.id}: {self.username}"