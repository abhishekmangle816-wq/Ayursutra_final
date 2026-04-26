from rest_framework import viewsets, permissions
from .models import PatientProfile
from .serializers import PatientProfileSerializer
from core.permissions import IsAdmin, IsDoctor, IsPatient

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientProfileSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin' or user.role == 'doctor' or user.role == 'pharmacy':
            return PatientProfile.objects.all()
        elif user.role == 'patient':
            return PatientProfile.objects.filter(user=user)
        return PatientProfile.objects.none()

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'patient':
            # Patient creating their own profile
            serializer.save(user=user)
        else:
            # Doctor/Admin creating a patient, relies on serializer's custom create handling the nested user.
            serializer.save()
