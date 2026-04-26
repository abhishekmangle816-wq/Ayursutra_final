from django.db import models
from appointments.models import Appointment
from therapies.models import Therapy

class PharmacyItem(models.Model):
    CATEGORY_CHOICES = (
        ('herb', 'Herb'),
        ('medicine', 'Medicine'),
        ('oil', 'Oil'),
        ('powder', 'Powder'),
    )

    name = models.CharField(max_length=200, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    quantity = models.FloatField(default=0.0)
    unit = models.CharField(max_length=50, help_text="e.g., ml, mg, tablets")
    reorder_level = models.FloatField(default=10.0)
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"

class Prescription(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='prescription')
    herbs = models.ManyToManyField(PharmacyItem, related_name='prescriptions')
    therapies = models.ManyToManyField(Therapy, related_name='prescriptions')
    notes = models.TextField(blank=True, help_text="Dosage and instructions")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription for {self.appointment.patient.user.get_full_name()}"

class Dispensing(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='dispensings')
    item = models.ForeignKey(PharmacyItem, on_delete=models.CASCADE)
    quantity_dispensed = models.FloatField()
    dispensed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dispensed {self.quantity_dispensed} of {self.item.name}"

class Order(models.Model):
    STATUS_CHOICES = (
        ('booked', 'Booked'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('delivered', 'Delivered'),
    )
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='pharmacy_orders')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='booked')
    delivery_address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.email} - ₹{self.total_amount} ({self.status})"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    item = models.ForeignKey(PharmacyItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.item.name} for Order #{self.order.id}"
