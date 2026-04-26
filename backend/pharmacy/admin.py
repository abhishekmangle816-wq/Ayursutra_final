from django.contrib import admin
from .models import PharmacyItem, Prescription, Dispensing

@admin.register(PharmacyItem)
class PharmacyItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'quantity', 'unit', 'reorder_level', 'price_per_unit')
    list_filter = ('category',)
    search_fields = ('name',)

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('appointment', 'created_at')

@admin.register(Dispensing)
class DispensingAdmin(admin.ModelAdmin):
    list_display = ('prescription', 'item', 'quantity_dispensed', 'dispensed_at')
