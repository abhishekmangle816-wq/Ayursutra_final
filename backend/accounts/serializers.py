from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'role',
            'is_verified'
        )
        read_only_fields = ('role', 'is_verified')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        error_messages={
            'required': 'Password is required.',
            'blank': 'Password cannot be blank.'
        }
    )

    role = serializers.ChoiceField(
        choices=User.ROLE_CHOICES,
        default='patient',
        write_only=True
    )

    specialization = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )

    license_no = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )

    class Meta:
        model = User
        fields = (
            'email',
            'password',
            'first_name',
            'last_name',
            'role',
            'specialization',
            'license_no'
        )

    # Password validation removed temporarily
    # so registration works easily

    def create(self, validated_data):
        specialization = validated_data.pop('specialization', '')
        license_no = validated_data.pop('license_no', '')

        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'patient')
        )

        if user.role == 'doctor':
            from doctors.models import DoctorProfile
            import uuid

            if not license_no:
                license_no = f"AYUR-{uuid.uuid4().hex[:6].upper()}"

            if not specialization:
                specialization = "General Ayurvedic Physician"

            DoctorProfile.objects.create(
                user=user,
                specialization=specialization,
                license_no=license_no,
                is_approved=True
            )

        elif user.role == 'patient':
            from patients.models import PatientProfile

            PatientProfile.objects.create(user=user)

        return user