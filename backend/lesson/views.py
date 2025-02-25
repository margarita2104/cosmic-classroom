from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Lesson
from .serializers import LessonSerializer
import logging
import sys
import traceback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class DebugView(APIView):
    """
    A simple view to test the connection between LessonPlanGenerator and the lesson app
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Try importing the module
            logger.info("Testing LessonPlanGenerator import")
            from LessonPlanGenerator.app import create_lesson_plan_from_user_input

            # Check if function exists
            if callable(create_lesson_plan_from_user_input):
                logger.info("Successfully imported create_lesson_plan_from_user_input")

                # Try a simple test call
                test_input = "Test input for elementary school students about exoplanets"
                try:
                    logger.info(f"Testing function call with: {test_input}")
                    _, result = create_lesson_plan_from_user_input(test_input)

                    if result and isinstance(result, str):
                        logger.info(f"Function returned {len(result)} characters")
                        return Response({
                            "status": "success",
                            "message": "Function call successful",
                            "result_preview": result[:200] + "..."
                        })
                    else:
                        logger.error(f"Function returned unexpected result type: {type(result)}")
                        return Response({
                            "status": "error",
                            "message": f"Function returned unexpected result type: {type(result)}"
                        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                except Exception as e:
                    logger.error(f"Error calling function: {str(e)}")
                    logger.error(traceback.format_exc())
                    return Response({
                        "status": "error",
                        "message": f"Error calling function: {str(e)}",
                        "traceback": traceback.format_exc()
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                logger.error("create_lesson_plan_from_user_input is not callable")
                return Response({
                    "status": "error",
                    "message": "create_lesson_plan_from_user_input is not callable"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except ImportError as e:
            logger.error(f"Import error: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({
                "status": "error",
                "message": f"Import error: {str(e)}",
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({
                "status": "error",
                "message": f"Unexpected error: {str(e)}",
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LessonCreateListView(ListCreateAPIView):
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logger.info(f"Received POST request to create lesson: {request.data}")

        # Add the user to the data
        lesson_data = request.data.copy()
        lesson_data["user"] = request.user.id

        # Validate the data
        serializer = self.get_serializer(data=lesson_data)

        if not serializer.is_valid():
            logger.error(f"Serializer validation errors: {serializer.errors}")
            return Response({
                "status": "error",
                "message": "Invalid data",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Try to import the function
            try:
                from LessonPlanGenerator.app import create_lesson_plan_from_user_input
                logger.info("Successfully imported create_lesson_plan_from_user_input")
            except ImportError as e:
                logger.error(f"Import error: {str(e)}")
                return Response({
                    "status": "error",
                    "message": f"Could not import lesson plan generator: {str(e)}"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Extract validated data
            subject = serializer.validated_data.get('subject', '')
            grade_level = serializer.validated_data.get('grade_level', '')
            class_size = serializer.validated_data.get('class_size', '')
            technology_access = serializer.validated_data.get('technology_access', '')
            class_length = serializer.validated_data.get('class_length', '')
            learning_styles = serializer.validated_data.get('learning_styles', '')
            user_prompt = serializer.validated_data.get('user_prompt', '')

            # Get readable values
            subject_display = dict(Lesson.TOPICS_OF_INTEREST).get(subject, subject) if subject else ''
            grade_display = dict(Lesson.GRADE_LEVEL).get(grade_level, grade_level) if grade_level else ''
            tech_display = dict(Lesson.TECHNOLOGY_ACCESS).get(technology_access,
                                                              technology_access) if technology_access else ''
            style_display = dict(Lesson.PREFERRED_LEARNING_STYLES).get(learning_styles,
                                                                       learning_styles) if learning_styles else ''

            # Build the prompt
            structured_input = f"""
            I am a {grade_display} teacher.
            I have {class_size} students in my classroom.
            We are interested in {subject_display}.
            Our preferred learning style is {style_display}.
            The class lasts {class_length} minutes.
            We have {tech_display} technology access.
            Additional notes: {user_prompt}
            """

            logger.info(f"Calling create_lesson_plan_from_user_input with input: {structured_input[:100]}...")

            try:
                # Call the function to generate the lesson plan
                pdf_file_path, lesson_plan = create_lesson_plan_from_user_input(structured_input.strip())

                if not lesson_plan:
                    logger.error("No lesson plan was generated")
                    return Response({
                        "status": "error",
                        "message": "No lesson plan was generated"
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                logger.info(f"Generated lesson plan with {len(lesson_plan)} characters")

                # Save the lesson
                lesson = serializer.save(created_lesson=lesson_plan)
                logger.info(f"Saved lesson with ID: {lesson.id}")

                return Response(serializer.data, status=status.HTTP_201_CREATED)

            except Exception as e:
                logger.error(f"Error generating lesson plan: {str(e)}")
                logger.error(traceback.format_exc())
                return Response({
                    "status": "error",
                    "message": f"Error generating lesson plan: {str(e)}",
                    "traceback": traceback.format_exc()
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({
                "status": "error",
                "message": f"Unexpected error: {str(e)}",
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_queryset(self):
        return Lesson.objects.filter(user=self.request.user)

    def get(self, request, *args, **kwargs):
        logger.info("Received GET request for lessons")
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
        logger.info(f"Received GET request for lesson detail: {kwargs.get('pk')}")
        return super().get(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        logger.info(f"Received DELETE request for lesson: {kwargs.get('pk')}")
        lesson = self.get_object()
        self.perform_destroy(lesson)
        return Response(status=status.HTTP_204_NO_CONTENT)