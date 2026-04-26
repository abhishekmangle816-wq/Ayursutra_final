from rest_framework import viewsets, permissions
from .models import Appointment
from .serializers import AppointmentSerializer, AppointmentCreateUpdateSerializer
from core.permissions import IsAdmin, IsDoctor, IsPatient

class AppointmentViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Appointment.objects.all()
        elif user.role == 'doctor':
            return Appointment.objects.filter(doctor__user=user)
        elif user.role == 'patient':
            return Appointment.objects.filter(patient__user=user)
        return Appointment.objects.none()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AppointmentCreateUpdateSerializer
        return AppointmentSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        # Additional validation can be done here to ensure doctor is available
        serializer.save()
