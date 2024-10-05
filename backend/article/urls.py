from django.urls import path

from article.views import ListCreateArticlesView, RetrieveUpdateDeleteArticlesView

urlpatterns = [
    path('', ListCreateArticlesView.as_view()),
    path('<int:pk>/', RetrieveUpdateDeleteArticlesView.as_view()),
]
