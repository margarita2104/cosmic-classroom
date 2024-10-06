from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Lesson
from .serializers import LessonSerializer
from LessonPlanGenerator.app import create_lesson_plan_from_user_input

# Create your views here.

class LessonCreateListView(ListCreateAPIView):
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        lesson_data = request.data
        serializer = self.get_serializer(data = lesson_data)
        serializer.is_valid(raise_exception=True)
        
        subject = serializer.validated_data.get('subject')
        grade_level = serializer.validated_data.get('grade_level')
        class_size = serializer.validated_data.get('class_size')
        technology_access = serializer.validated_data.get('technology_access')
        class_length = serializer.validated_data.get('class_length')
        learning_styles = serializer.validated_data.get('learning_styles')
        user_input = f"""
        I am a {grade_level} teacher.
        I have {class_size} students in my classroom.
        We are interested in {subject}.
        Our preferred learning style is {learning_styles}.
        The class lasts {class_length} minutes.
        We have {technology_access} technology access.
        """
        pdf_file_path, lesson_plan = create_lesson_plan_from_user_input(user_input)
        serializer.save(created_lesson=lesson_plan)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        return Lesson.objects.filter(user=self.request.user)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
class LessonDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'  

    def get_queryset(self):
        return Lesson.objects.filter(user=self.request.user)

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)  
    
    def delete(self, request, *args, **kwargs):
        lesson = self.get_object()  
        self.perform_destroy(lesson)  
        return Response(status=status.HTTP_204_NO_CONTENT)  