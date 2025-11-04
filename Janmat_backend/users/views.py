# users/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from issues.models import Issue
from issues.serializers import IssueSerializer


# ✅ RegisterView for user registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email", "")

        if not username or not password:
            return Response(
                {"error": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already taken."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(username=username, email=email, password=password)
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        return Response(
            {
                "message": "User registered successfully.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "refresh": str(refresh),
                "access": access,
            },
            status=status.HTTP_201_CREATED,
        )


# ✅ Logged-in user info (/api/me/)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response(
        {
            "username": user.username,
            "email": user.email,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        }
    )


# ✅ User Profile with list of issues (/api/user/)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    issues = Issue.objects.filter(created_by=user).order_by('-created_at')
    issue_data = IssueSerializer(issues, many=True).data

    return Response(
        {
            "username": user.username,
            "email": user.email,
            "is_staff": user.is_staff,
            "total_issues": issues.count(),
            "issues": issue_data,
        },
        status=status.HTTP_200_OK,
    )
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if username:
        user.username = username
    if email:
        user.email = email
    if password:
        user.password = make_password(password)

    user.save()
    return Response({
        "message": "Profile updated successfully",
        "username": user.username,
        "email": user.email,
    }, status=status.HTTP_200_OK)