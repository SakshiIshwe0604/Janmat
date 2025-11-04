from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, action, permission_classes
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Issue
from .serializers import IssueSerializer


@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)

    # Automatically log them in by creating JWT tokens
    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "User created successfully",
        "refresh": str(refresh),
        "access": str(refresh.access_token)
    }, status=status.HTTP_201_CREATED)


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all().order_by('-created_at')
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticatedOrReadOnly])
    def upvote(self, request, pk=None):
        """Allow any logged-in user to upvote an issue"""
        issue = self.get_object()
        issue.upvotes += 1
        issue.save()
        return Response({'upvotes': issue.upvotes}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def status(self, request, pk=None):
        """
        PATCH /api/issues/<id>/status/
        Body: {"status": "resolved"} 
        Only admin/staff can call this
        """
        issue = self.get_object()
        new_status = request.data.get('status')

        valid_statuses = [choice[0] for choice in Issue.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({'error': 'Invalid status value'}, status=status.HTTP_400_BAD_REQUEST)

        issue.status = new_status
        issue.save()
        return Response({'message': f'Status updated to {new_status}'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upvote_issue(request, pk):
    try:
        issue = Issue.objects.get(pk=pk)
        issue.upvotes += 1
        issue.save()
        return Response({"message": "Upvoted successfully!", "upvotes": issue.upvotes})
    except Issue.DoesNotExist:
        return Response({"error": "Issue not found"}, status=status.HTTP_404_NOT_FOUND)