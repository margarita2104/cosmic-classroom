import string
import random

from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.


User = get_user_model()


def code_generator(length=5):
    numbers = '0123456789'
    return ''.join(random.choice(numbers) for _ in range(length))

class RegistrationProfile(models.Model):
    code = models.CharField(max_length=15, default=code_generator)
    # .CASCADE delete registration profile when the user deletes its account
    user = models.OneToOneField(to=User, on_delete=models.CASCADE)
    code_options = models.CharField(
        max_length=2, 
        choices=(("RV", "registration_validation"), ("PR", "password_validation"))
        )


    @receiver(post_save, sender=User)
    # Whenever a used is being created or saved, we want to check if that user has a Registration Profile,
    # if not, we want to create one.
    def create_registration_profile(sender, instance, **kwargs):
        # get_or_create retrieves an object from the database if it exists,
        # or creates a new object with default values if it does not.
        profile, created = RegistrationProfile.objects.get_or_create(user=instance)
        if created:
            profile.save()
