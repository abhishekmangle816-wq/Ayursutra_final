from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import DoctorProfile
from .serializers import DoctorProfileSerializer
from core.permissions import IsAdmin

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action == 'approve':
            permission_classes = [IsAdmin]
        else:
            # Creation implicitly happens when user role is created, or maybe admin does it. Let's say admin only for now.
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def approve(self, request, pk=None):
        doctor = self.get_object()
        doctor.is_approved = True
        doctor.save()
        return Response({'status': 'Doctor approved successfully'})
