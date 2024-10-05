from django.urls import path

from .views import RegistrationView, ValidationView, PasswordResetView, PasswordResetValidationView

urlpatterns = [
    path('registration/', RegistrationView.as_view(), name='auth_register'),
    path('registration/validation/', ValidationView.as_view(), name='auth_validate'),
    path('password-reset/', PasswordResetView.as_view(), name='auth_password_reset'),
    path('password-reset/validation/', PasswordResetValidationView.as_view(), name='auth_password_reset_validation'),
]