from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


def email_does_not_exist(email):
    try:
        User.objects.get(email=email)
        raise ValidationError('This email is taken')
    except User.DoesNotExist:
        return email


class RegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, validators=[email_does_not_exist])

    class Meta:
        model = User
        fields = ['email']

    def save(self, **kwargs):
        email = self.validated_data['email']
        new_user = User.objects.create_user(email=email, username=email, is_active=False)
        new_user.save()
        return new_user


class ValidationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
    )
    username = serializers.CharField(
        required=True,
    )
    code = serializers.CharField(required=True)

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_repeat = serializers.CharField(write_only=True, required=True)

    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('username', 'code', 'password', 'password_repeat', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }


    def validate(self, attrs):
        if attrs['password'] != attrs['password_repeat']:
            raise serializers.ValidationError({"password": "Password fields do not match."})
        return attrs

    def save(self, **kwargs):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        user.username = self.validated_data['username']
        user.first_name = self.validated_data['first_name']
        user.last_name = self.validated_data['last_name']
        user.set_password(self.validated_data['password'])
        user.is_active = True
        user.save()
        return user


def email_does_exist(email):
    if not User.objects.filter(email=email).exists():
        raise ValidationError('User does not exist!')
    return email


class PasswordResetSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, validators=[email_does_exist])

    class Meta:
        model = User
        fields = ['email']


class PasswordResetValidationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    code = serializers.CharField(required=True)
    new_password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    new_password_repeat = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('code', 'new_password', 'new_password_repeat', 'email')
