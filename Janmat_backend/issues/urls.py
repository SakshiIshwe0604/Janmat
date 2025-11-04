# issues/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IssueViewSet,register_user
from .views import upvote_issue
from . import views

router = DefaultRouter()
router.register(r'issues', IssueViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
    path('<int:pk>/upvote/', upvote_issue, name='upvote-issue'),
    path('issues/<int:pk>/upvote/', views.upvote_issue, name='upvote_issue'),
]
