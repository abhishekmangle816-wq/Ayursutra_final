import os, django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ayursutra.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

if not User.objects.filter(email='admin@ayursutra.com').exists():
    user = User.objects.create_superuser('admin@ayursutra.com', 'admin@ayursutra.com', 'admin123')
    user.role = 'admin'
    user.save()
    print("Admin user created!")
else:
    print("Admin already exists")
