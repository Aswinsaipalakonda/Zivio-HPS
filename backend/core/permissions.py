from rest_framework.permissions import BasePermission

class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'MANAGER'

class IsDirector(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'DIRECTOR'

class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ('EMPLOYEE', 'INTERN')

class IsManagerOrDirector(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ('MANAGER', 'DIRECTOR')

class IsOwnerOrManagerOrDirector(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
        
    def has_object_permission(self, request, view, obj):
        # Managers and Directors have access to all tasks
        if request.user.role in ('MANAGER', 'DIRECTOR'):
            return True
            
        # For TaskAssignment object
        if hasattr(obj, 'assigned_to'):
            return obj.assigned_to == request.user
            
        # For TaskLog object
        if hasattr(obj, 'submitted_by'):
            return obj.submitted_by == request.user
            
        return False
