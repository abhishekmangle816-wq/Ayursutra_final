import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ayursutra.settings')
django.setup()

from doctors.models import DoctorProfile
from patients.models import PatientProfile
from accounts.models import User

print("--- DOCTORS ---")
for d in DoctorProfile.objects.all():
    print(f"ID: {d.id}, User: {d.user.email}, Name: Dr. {d.user.first_name} {d.user.last_name}")

print("--- PATIENTS ---")
for p in PatientProfile.objects.all():
    print(f"ID: {p.id}, User: {p.user.email}, Name: {p.user.first_name} {p.user.last_name}")

