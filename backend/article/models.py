from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


def get_image_upload_path(instance, filename):
    # Handle case when instance doesn't have ID yet
    if instance.id is None:
        return f'articles/temp/{filename}'
    return f'articles/{instance.id}/{filename}'


class Article(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.CharField(max_length=200, blank=True, null=True)
    link = models.URLField(max_length=200, blank=True, null=True)
    image = models.ImageField(upload_to=get_image_upload_path, null=True, blank=True)
    favourited_by = models.ManyToManyField(to=User, blank=True, related_name="favorite_resources")

    def __str__(self):
        return self.name or f"Article {self.id}"