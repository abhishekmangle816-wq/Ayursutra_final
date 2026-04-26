import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ayursutra.settings')
django.setup()

from pharmacy.models import PharmacyItem

def seed():
    products = [
        {"name": "Ashwagandha Churna", "category": "powder", "quantity": 100, "unit": "g", "price_per_unit": 15.00},
        {"name": "Triphala Churna", "category": "powder", "quantity": 150, "unit": "g", "price_per_unit": 12.50},
        {"name": "Brahmi Vati", "category": "medicine", "quantity": 500, "unit": "tablets", "price_per_unit": 2.00},
        {"name": "Anu Taila", "category": "oil", "quantity": 50, "unit": "ml", "price_per_unit": 8.00},
        {"name": "Dashamoola Kwatha", "category": "herb", "quantity": 200, "unit": "g", "price_per_unit": 20.00},
        {"name": "Shatavari Guda", "category": "medicine", "quantity": 300, "unit": "g", "price_per_unit": 25.00},
        {"name": "Mahanarayan Taila", "category": "oil", "quantity": 100, "unit": "ml", "price_per_unit": 30.00},
        {"name": "Chyawanprash", "category": "medicine", "quantity": 500, "unit": "g", "price_per_unit": 40.00},
        {"name": "Amritarishta", "category": "medicine", "quantity": 450, "unit": "ml", "price_per_unit": 18.00},
        {"name": "Kumkumadi Taila", "category": "oil", "quantity": 15, "unit": "ml", "price_per_unit": 50.00},
        {"name": "Haridra Khanda", "category": "powder", "quantity": 100, "unit": "g", "price_per_unit": 22.00},
        {"name": "Arjuna Churna", "category": "powder", "quantity": 150, "unit": "g", "price_per_unit": 14.00},
    ]

    PharmacyItem.objects.all().delete()
    print("Deleted all existing pharmacy items.")

    for prod in products:
        PharmacyItem.objects.create(**prod)
        print(f"Created: {prod['name']}")

    print("Seed complete! 12 products added.")

if __name__ == '__main__':
    seed()
