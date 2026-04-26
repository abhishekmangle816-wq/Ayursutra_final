from rest_framework import serializers
from .models import Appointment
from patients.serializers import PatientProfileSerializer
from doctors.serializers import DoctorProfileSerializer
from therapies.serializers import TherapySerializer

class AppointmentSerializer(serializers.ModelSerializer):
    patient_details = PatientProfileSerializer(source='patient', read_only=True)
    doctor_details = DoctorProfileSerializer(source='doctor', read_only=True)
    therapy_details = TherapySerializer(source='therapy', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('status', 'created_at')

class AppointmentCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        # Allow status change if serializer is used for updating.
