from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    country = serializers.CharField() 

    class Meta:
        model = User
        fields = ['email', 'username', 'country', 'first_name', 'last_name']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['country'] = instance.country.name  
        return representation

    def create(self, validated_data):
        return User.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        instance.country = validated_data.get('country', instance.country)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        return instance
