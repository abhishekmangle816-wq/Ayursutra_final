from rest_framework import serializers
from .models import PatientProfile
from accounts.models import User
from accounts.serializers import UserSerializer

class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    first_name = serializers.CharField(write_only=True, required=True)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email = serializers.EmailField(write_only=True, required=True)

    class Meta:
        model = PatientProfile
        fields = '__all__'
        
    def create(self, validated_data):
        email = validated_data.pop('email')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name', '')
        
        # Determine if a request user is making this.
        # But we create a new user for the patient anyway.
        user, created = User.objects.get_or_create(email=email, defaults={
            'first_name': first_name,
            'last_name': last_name,
            'role': 'patient',
            'is_verified': True
        })
        if created:
            user.set_password('ayursutra123')
            user.save()
            
        patient_profile, _ = PatientProfile.objects.get_or_create(user=user, defaults=validated_data)
        return patient_profile

    def update(self, instance, validated_data):
        email = validated_data.pop('email', None)
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)
        
        if instance.user:
            if email: instance.user.email = email
            if first_name: instance.user.first_name = first_name
            if last_name is not None: instance.user.last_name = last_name
            instance.user.save()
            
        return super().update(instance, validated_data)
