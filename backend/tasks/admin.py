from django.contrib import admin
from .models import TaskAssignment, TaskLog

@admin.register(TaskAssignment)
class TaskAssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'assigned_to', 'assigned_by', 'assignment_date', 'created_at')
    list_filter = ('assignment_date', 'assigned_to', 'assigned_by')
    search_fields = ('title', 'description', 'assigned_to__full_name', 'assigned_to__email')
    ordering = ('-assignment_date', '-created_at')

@admin.register(TaskLog)
class TaskLogAdmin(admin.ModelAdmin):
    list_display = ('assignment', 'submitted_by', 'status', 'logged_at')
    list_filter = ('status', 'logged_at', 'submitted_by')
    search_fields = ('assignment__title', 'submitted_by__full_name', 'notes')
    ordering = ('-logged_at',)
