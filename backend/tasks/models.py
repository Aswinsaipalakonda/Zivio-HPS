from django.db import models
from django.conf import settings
import uuid

class TaskAssignment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='assigned_tasks'
    )
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_assignments'
    )
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=1000)
    assignment_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-assignment_date', '-created_at']
        indexes = [
            models.Index(fields=['assigned_to', 'assignment_date']),
        ]

    def __str__(self):
        return f"{self.title} -> {self.assigned_to.full_name}"

class TaskLog(models.Model):
    STATUS_CHOICES = [
        ('COMPLETED', 'Completed'),
        ('IN_PROGRESS', 'In Progress'),
        ('PENDING', 'Pending'),
        ('NOT_STARTED', 'Not Started'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assignment = models.OneToOneField(
        TaskAssignment,
        on_delete=models.CASCADE,
        related_name='log'
    )
    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='task_logs'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='NOT_STARTED'
    )
    notes = models.TextField(blank=True, null=True)
    logged_at = models.DateTimeField(auto_now=True)
    log_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Log for {self.assignment.title} ({self.status})"
