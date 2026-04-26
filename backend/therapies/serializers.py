from rest_framework import serializers
from .models import Therapy

class TherapySerializer(serializers.ModelSerializer):
    class Meta:
        model = Therapy
        fields = '__all__'
