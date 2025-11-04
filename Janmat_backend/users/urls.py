# users/urls.py
from django.urls import path
from .views import RegisterView, user_profile

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', user_profile, name='user_profile'),
]
