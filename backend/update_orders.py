import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ayursutra.settings')
django.setup()
from pharmacy.models import Order
updated = Order.objects.filter(status='pending').update(status='booked')
print(f"Updated {updated} orders from 'pending' to 'booked'")
