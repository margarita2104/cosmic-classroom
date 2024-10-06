from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.generics import GenericAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .serializers import UserSerializer

User = get_user_model()


# Create your views here.

# User manages own account when logged in
class MeView(GenericAPIView):
    # View for retrieving, updating, or deleting the authenticated user's information.
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Return the currently authenticated user.
        return self.request.user

    def get(self, request, *args, **kwargs):
        # Handle GET request to retrieve user information
        user = self.get_object()
        if user is not None:
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, *args, **kwargs):
        # Handle PATCH request to partially update user information.
        user = self.get_object()
        data_updated = request.data.copy()
        serializer = self.get_serializer(user, data=data_updated, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        # Handle DELETE request to delete the user.
        user = self.get_object()
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# For admin use
class ListCreateUserView(ListCreateAPIView):
    # View for listing all users or creating a new user.
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class RetrieveUpdateDestroyUserView(RetrieveUpdateDestroyAPIView):
    # View for retrieving, updating, or deleting a specific user by ID.
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_url_kwarg = "user_id"
    permission_classes = [IsAdminUser]


