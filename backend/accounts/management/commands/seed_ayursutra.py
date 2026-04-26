import random
from django.core.management.base import BaseCommand
from accounts.models import User
from doctors.models import DoctorProfile
from therapies.models import Therapy
from patients.models import PatientProfile

class Command(BaseCommand):
    help = 'Seeds the database with initial AyurSutra data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Therapies
        therapies_data = [
            ("Abhyanga", "Full body oil massage", 60, "Vata"),
            ("Shirodhara", "Continuous pouring of warm oil on forehead", 45, "Pitta, Vata"),
            ("Panchakarma", "Five-fold detoxification therapy", 120, "Tridoshic"),
            ("Nasya", "Nasal administration of medicated oils", 30, "Kapha"),
            ("Basti", "Medicated enema", 60, "Vata"),
            ("Udvartana", "Dry powder massage", 45, "Kapha"),
            ("Navarakizhi", "Massage with medicated rice boluses", 60, "Vata, Pitta"),
            ("Pizhichil", "Continuous pouring of warm medicated oil with massage", 75, "Vata"),
            ("Kati Basti", "Oil pooling on lower back", 45, "Vata"),
            ("Netra Tarpana", "Eye therapy with ghee", 30, "Pitta"),
            ("Janu Basti", "Oil pooling on knees", 45, "Vata"),
            ("Greeva Basti", "Oil pooling on neck", 45, "Vata")
        ]

        for name, desc, duration, dosha in therapies_data:
            Therapy.objects.get_or_create(
                name=name,
                defaults={
                    'description': desc,
                    'duration_minutes': duration,
                    'dosha_suitability': dosha
                }
            )

        # Doctors
        doctors_data = [
            ("Dr. Acharya", "Vaidyanath", "Panchakarma & Detox", "ayursutra_lic_01"),
            ("Dr. Mrinalini", "Kashyap", "Women's Health & Gynecology", "ayursutra_lic_02"),
            ("Dr. Harish", "Dhanvantari", "Neurological Disorders", "ayursutra_lic_03"),
            ("Dr. Savitri", "Kulkarni", "Skin & Dermatology", "ayursutra_lic_04"),
            ("Dr. Prakash", "Agnivesh", "Digestive & Gut Health", "ayursutra_lic_05"),
            ("Dr. Nalini", "Sushrutha", "Ortho & Joint Care", "ayursutra_lic_06"),
            ("Dr. Rajan", "Charaka", "Respiratory & Immunity", "ayursutra_lic_07"),
            ("Dr. Devaki", "Bhattacharya", "Paediatric Ayurveda", "ayursutra_lic_08")
        ]

        for first, last, spec, lic in doctors_data:
            email = f"{first.lower().replace('.', '').replace(' ', '_')}@ayursutra.com"
            user, created = User.objects.get_or_create(email=email, defaults={
                'first_name': first,
                'last_name': last,
                'role': 'doctor',
                'is_verified': True
            })
            if created:
                user.set_password('ayursutra123')
                user.save()
            DoctorProfile.objects.get_or_create(user=user, defaults={
                'specialization': spec,
                'license_no': lic,
                'experience_years': random.randint(5, 25),
                'is_approved': True
            })

        # Admin
        admin_user, created = User.objects.get_or_create(email='admin@ayursutra.com', defaults={
            'first_name': 'Super',
            'last_name': 'Admin',
            'role': 'admin',
            'is_staff': True,
            'is_superuser': True,
            'is_verified': True
        })
        if created:
            admin_user.set_password('admin123')
            admin_user.save()

        # Patients
        patient_data = [
            ("Priya", "Patel", "pitta", "B+", "priya@ayursutra.com"),
            ("Rahul", "Sharma", "vata", "O+", "rahul@ayursutra.com"),
            ("Amit", "Singh", "kapha", "A-", "amit@ayursutra.com"),
            ("Sneha", "Reddy", "tridosha", "AB+", "sneha@ayursutra.com")
        ]
        
        patient_objs = []
        for first, last, prakriti, blood, email in patient_data:
            user, created = User.objects.get_or_create(email=email, defaults={
                'first_name': first,
                'last_name': last,
                'role': 'patient',
                'is_verified': True
            })
            if created:
                user.set_password('patient123')
                user.save()
            p, _ = PatientProfile.objects.get_or_create(user=user, defaults={
                'prakriti': prakriti,
                'blood_group': blood,
                'date_of_birth': '1990-01-01'
            })
            patient_objs.append(p)

        # Fallback patient for demo button
        user, created = User.objects.get_or_create(email='patient@ayursutra.com', defaults={
            'first_name': 'Demo',
            'last_name': 'Patient',
            'role': 'patient',
            'is_verified': True
        })
        if created:
            user.set_password('patient123')
            user.save()
            PatientProfile.objects.get_or_create(user=user, defaults={'prakriti': 'tridosha', 'blood_group': 'O+'})

        # Appointments
        from appointments.models import Appointment
        import datetime
        from django.utils import timezone
        
        today = timezone.now().date()
        doc1 = DoctorProfile.objects.first()
        ther1 = Therapy.objects.first()

        if doc1 and patient_objs:
            Appointment.objects.get_or_create(
                patient=patient_objs[0], doctor=doc1,
                defaults={
                    'therapy': ther1,
                    'date': today + datetime.timedelta(days=1),
                    'time_slot': '10:00:00',
                    'status': 'confirmed',
                    'notes': 'Initial follow up.'
                }
            )
            Appointment.objects.get_or_create(
                patient=patient_objs[1], doctor=doc1,
                defaults={
                    'date': today,
                    'time_slot': '09:00:00',
                    'status': 'pending',
                    'notes': 'Stomach pain.'
                }
            )

        # Pharmacy Account
        pharmacy_user, created = User.objects.get_or_create(email='pharmacy@ayursutra.com', defaults={
            'first_name': 'Pharmacy',
            'last_name': 'Admin',
            'role': 'pharmacy',
            'is_verified': True
        })
        if created:
            pharmacy_user.set_password('pharmacy123')
            pharmacy_user.save()

        # Pharmacy Items (Inventory)
        from pharmacy.models import PharmacyItem, Prescription
        
        items_data = [
            ("Triphala Churna", "powder", 50.0, "gm", 15.0, 150.00),
            ("Brahmi Vati", "medicine", 10.0, "tablets", 20.0, 85.00),
            ("Ashwagandha Arishta", "herb", 200.0, "ml", 50.0, 450.00),
            ("Mahanarayan Taila", "oil", 5.0, "bottles", 10.0, 320.00)
        ]
        
        pharmacy_items = []
        for name, category, qty, unit, reorder, price in items_data:
            item, _ = PharmacyItem.objects.get_or_create(name=name, defaults={
                'category': category,
                'quantity': qty,
                'unit': unit,
                'reorder_level': reorder,
                'price_per_unit': price
            })
            pharmacy_items.append(item)
            
        # Prescriptions
        appts = Appointment.objects.all()
        if len(appts) >= 2 and len(pharmacy_items) >= 2:
            p1, created1 = Prescription.objects.get_or_create(appointment=appts[0], defaults={
                'notes': 'Take with warm water twice a day after meals.'
            })
            if created1:
                p1.herbs.add(pharmacy_items[0], pharmacy_items[1])
                
            p2, created2 = Prescription.objects.get_or_create(appointment=appts[1], defaults={
                'notes': 'Apply oil strictly externally before sleep.'
            })
            if created2:
                p2.herbs.add(pharmacy_items[3])

        self.stdout.write(self.style.SUCCESS('Successfully seeded AyurSutra data (incl Pharmacy)!'))
