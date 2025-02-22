from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError

from django.core.mail import send_mail

from .serializers import RegistrationSerializer, ValidationSerializer, PasswordResetSerializer, \
    PasswordResetValidationSerializer

from .models import RegistrationProfile, code_generator
from rest_framework.response import Response
from rest_framework.views import APIView

from project.settings import DEFAULT_FROM_EMAIL

User = get_user_model()


class RegistrationView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': 'This email is already registered.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer.save()
        to_email = serializer.data.get('email')
        new_user = User.objects.get(email=to_email)
        if not new_user:
            return Response({'error': 'Registration code not found.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        reg_code = RegistrationProfile.objects.get(user=new_user).code
        send_mail(
            'Cosmic Classroom registration code',
            f'Your activation code is: {reg_code} ',
            DEFAULT_FROM_EMAIL,
            [to_email],
            fail_silently=False,
        )
        return Response({'message': 'Registration code sent.'}, status=status.HTTP_201_CREATED)

class ValidationView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            serializer = ValidationSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            email = serializer.validated_data.get('email')
            code = serializer.validated_data.get('code')

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {'error': 'No account found with this email address.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            try:
                registration_profile = RegistrationProfile.objects.get(user=user)
                if registration_profile.code != code:
                    return Response(
                        {'error': 'Invalid activation code'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except RegistrationProfile.DoesNotExist:
                return Response(
                    {'error': 'Registration profile not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Save the user data
            serializer.save()
            return Response(
                {'message': 'Registration successful.'},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            print(f"Validation error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PasswordResetView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            to_email = serializer.data.get('email')
            user = User.objects.get(email=to_email)
            if not user:
                return Response({'error': 'User not found.'}, status=status.HTTP_400_BAD_REQUEST)
            pv_code = code_generator()
            registration_profile, created = RegistrationProfile.objects.update_or_create(
                user=user,
                defaults={'code': pv_code}
            )

            send_mail(
                'Cosmic Classroom reset code',
                f'Your password reset code is: {pv_code} ',
                DEFAULT_FROM_EMAIL,
                [to_email],
                fail_silently=False,
            )

            return Response({'message': 'Password reset code sent.'}, status=status.HTTP_200_OK)




class PasswordResetValidationView(generics.CreateAPIView):
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetValidationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.data.get('email')
        code = serializer.data.get('code')
        new_password = serializer.data.get('new_password')
        new_password_repeat = serializer.data.get('new_password_repeat')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise ValidationError({'error': 'User not found.'})

        res_val_code = RegistrationProfile.objects.get(user=user).code
        if res_val_code != code:
            raise ValidationError({'error': 'Invalid code'})

        if new_password != new_password_repeat:
            raise ValidationError({'error': 'Passwords do not match.'})

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password reset successful.'}, status=status.HTTP_200_OK)
