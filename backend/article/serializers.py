from rest_framework import serializers
from article.models import Article


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

    def validate_link(self, value):
        """
        Check that the link is a valid URL format if provided.
        """
        if value and not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("Please enter a valid URL starting with http:// or https://")
        return value