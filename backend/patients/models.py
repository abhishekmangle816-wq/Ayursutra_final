from django.db import models
from accounts.models import User

class PatientProfile(models.Model):
    PRAKRITI_CHOICES = (
        ('vata', 'Vata'),
        ('pitta', 'Pitta'),
        ('kapha', 'Kapha'),
        ('tridosha', 'Tridosha'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    date_of_birth = models.DateField(null=True, blank=True)
    blood_group = models.CharField(max_length=5, blank=True)
    prakriti = models.CharField(max_length=20, choices=PRAKRITI_CHOICES, blank=True)
    allergies = models.TextField(blank=True, help_text="List any known allergies")
    medical_history = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.email} Profile"
