from rest_framework import viewsets, permissions
from .models import Therapy
from .serializers import TherapySerializer
from core.permissions import IsAdmin

class TherapyViewSet(viewsets.ModelViewSet):
    queryset = Therapy.objects.filter(is_active=True)
    serializer_class = TherapySerializer

    def get_permissions(self):
        # List is allowed for all authenticated users; CRUD only for Admins
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny] # Can also be IsAuthenticated
        else:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]
