# issues/models.py
from django.db import models
from django.contrib.auth.models import User

class Issue(models.Model):
    CATEGORY_CHOICES = [
        ('Road', 'Road Damage'),
        ('Waste', 'Waste Management'),
        ('Water', 'Water Supply'),
        ('Electricity', 'Electricity'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    location = models.CharField(max_length=200)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    assigned_to = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_issues'
    )
    upvotes = models.IntegerField(default=0)
    # New field for community upvotes
    upvotes = models.PositiveIntegerField(default=0)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    def __str__(self):
        return f"{self.title} - {self.status}"
