from django.db import models
from django.conf import settings
import uuid

class Attendance(models.Model):
    STATUS_CHOICES = [
        ('PRESENT', 'Present'),
        ('ABSENT', 'Absent'),
        ('HALF_DAY', 'Half Day'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    date = models.DateField()
    check_in_time = models.TimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PRESENT'
    )
    auto_recorded = models.BooleanField(default=True)

    class Meta:
        unique_together = [('user', 'date')]
        ordering = ['-date', 'user__full_name']

    def __str__(self):
        return f"{self.user.full_name} - {self.date} ({self.status})"
