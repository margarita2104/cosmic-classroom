from django.urls import path

from .views import LessonCreateListView, LessonDetailView, DebugView

urlpatterns = [
    path('', LessonCreateListView.as_view()),
    path('<int:pk>/', LessonDetailView.as_view()),
    path('debug/', DebugView.as_view(), name='lesson-debug')
]