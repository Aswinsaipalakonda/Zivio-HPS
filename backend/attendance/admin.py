from django.contrib import admin
from .models import Attendance

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'check_in_time', 'status', 'auto_recorded')
    list_filter = ('date', 'status', 'auto_recorded')
    search_fields = ('user__full_name', 'user__email')
    ordering = ('-date', 'user__full_name')
