from django.contrib import admin
from .models import PatientProfile

@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'prakriti', 'blood_group')
    search_fields = ('user__email', 'prakriti')
