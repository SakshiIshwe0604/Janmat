"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
1. Add an import:  from my_app import views
2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
1. Add an import:  from other_app.views import Home
2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
1. Import the include() function: from django.urls import include, path
2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.http import JsonResponse   # 👈 import JsonResponse
from rest_framework_simplejwt.views import (
TokenObtainPairView,
TokenRefreshView,
)
from users.views import RegisterView  # 👈 Add this line
from users.views import me
from users.views import user_profile,update_profile

# 👇 define the 'home' function BEFORE urlpatterns
def home(request):
 return JsonResponse({"message": "Welcome to the Janmat API!"})

urlpatterns = [
path('', home),
path('admin/', admin.site.urls),
path('api/', include('issues.urls')),
path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
path('api/register/', RegisterView.as_view(), name='register'),
path('api/me/', me, name='me'),
path('api/', include('users.urls')),   # ✅ add this
path("api/user/", user_profile, name="user_profile"),
path('api/user/update/', update_profile, name='update_profile'),
path('api/issues/', include('issues.urls')),

]
