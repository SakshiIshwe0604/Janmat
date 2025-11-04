# issues/serializers.py
from rest_framework import serializers
from .models import Issue
from django.contrib.auth.models import User

class IssueSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Issue
        fields = '__all__'
        read_only_fields = ['created_at', 'created_by', 'upvotes']
