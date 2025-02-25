from rest_framework import serializers
from .models import Lesson


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            'id',
            'subject',
            'grade_level',
            'class_size',
            'technology_access',
            'class_length',
            'learning_styles',
            'user_prompt',
            'created_at',
            'created_lesson',
            'user'
        ]
        read_only_fields = ['id', 'created_at', 'created_lesson']

    def validate(self, data):
        """
        Check that at least the required fields are provided.
        """
        # Ensure essential fields are provided
        essential_fields = ['subject', 'grade_level']
        missing_fields = [field for field in essential_fields if not data.get(field)]

        if missing_fields:
            raise serializers.ValidationError(
                f"The following fields are required: {', '.join(missing_fields)}"
            )

        return data