import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ayursutra.settings')
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
User = get_user_model()
c = Client()
user = User.objects.get(email='dr_acharya@ayursutra.com')
c.force_login(user)

r = c.post('/api/pharmacy/prescriptions/', {
    'appointment': 3, 
    'herbs': [1], 
    'therapies': [], 
    'notes': 'Test'
}, content_type='application/json')

print(r.status_code, r.content)
