from django.db import models
from project import settings
from django.contrib.auth import get_user_model

User = get_user_model()

def get_image_upload_path(instance, filename):
    return f'{instance.id}/article_images/{filename}'

class Article(models.Model):
  name = models.CharField(max_length=100, blank=True, null=True)
  description = models.CharField(max_length=200, blank=True, null=True)
  link = models.URLField(max_length=200, blank=True, null=True)
  image = image = models.ImageField(upload_to=get_image_upload_path, null=True, blank=True)
  favourited_by = models.ManyToManyField(to=User, blank=True, null=True)