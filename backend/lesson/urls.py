from django.urls import path

from lesson.views import LessonCreateListView, LessonDetailView

urlpatterns = [
    path('', LessonCreateListView.as_view()),
    path('<int:pk>/', LessonDetailView.as_view())
]