from django.contrib.auth.models import AbstractUser
from django.db import models
from django_countries.fields import CountryField
from article.models import Article


class User(AbstractUser):
    # Field used for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    email = models.EmailField(unique=True)
    username = models.CharField(blank=True, null=True, unique=False, max_length=100)
    country = CountryField()
    favorite_resources = models.ManyToManyField(to=Article)


    def __str__(self):
        return self.username