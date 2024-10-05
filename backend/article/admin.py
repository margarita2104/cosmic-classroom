from django.contrib import admin

from article.models import Article

class ArticleAdmin(admin.ModelAdmin):
  list_display = ('id', 'name', 'description', 'link', 'image',)

  admin.site.register(Article, ArticleAdmin)