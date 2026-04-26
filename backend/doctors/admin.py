from django.contrib import admin
from .models import DoctorProfile

@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'is_approved', 'experience_years')
    list_filter = ('is_approved', 'specialization')
    search_fields = ('user__email', 'user__first_name', 'license_no')
