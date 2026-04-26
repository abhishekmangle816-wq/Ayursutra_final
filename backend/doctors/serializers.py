from rest_framework import serializers
from .models import DoctorProfile
from accounts.serializers import UserSerializer

class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = DoctorProfile
        fields = '__all__'
        read_only_fields = ('is_approved',)
