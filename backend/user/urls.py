from django.urls import path
from .views import MeView, ListCreateUserView, RetrieveUpdateDestroyUserView

urlpatterns = [
    path('me/', MeView.as_view()),
    path('', ListCreateUserView.as_view()),
    path('<int:user_id>/', RetrieveUpdateDestroyUserView.as_view())
    ]