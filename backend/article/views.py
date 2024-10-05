from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from article.serializers import ArticleSerializer
from article.models import Article



class ListCreateArticlesView(ListCreateAPIView):
  queryset = Article.objects.all()
  serializer_class = ArticleSerializer
  
  
class RetrieveUpdateDeleteArticlesView(RetrieveUpdateDestroyAPIView):
  queryset = Article.objects.all()
  serializer_class = ArticleSerializer