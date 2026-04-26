from django.db import models
from accounts.models import User

class DoctorProfile(models.fields.related.OneToOneField):
    pass # Re-import below to avoid cyclic issues, usually handled by string reference

class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization = models.CharField(max_length=200)
    license_no = models.CharField(max_length=100, unique=True)
    experience_years = models.IntegerField(default=0)
    bio = models.TextField(blank=True, null=True)
    profile_photo = models.ImageField(upload_to='doctor_photos/', blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    available_days = models.CharField(max_length=100, default='Mon,Tue,Wed,Thu,Fri')
    slot_duration = models.IntegerField(default=30) # in minutes

    def __str__(self):
        return f"Dr. {self.user.get_full_name() or self.user.email} - {self.specialization}"
