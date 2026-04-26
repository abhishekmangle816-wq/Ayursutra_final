import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ayursutra.settings')
django.setup()
from appointments.models import Appointment
for a in Appointment.objects.all():
    print(f"ID: {a.id}, Patient: {a.patient.user.first_name}, Status: {a.status}, Doctor: {a.doctor.user.email}")
