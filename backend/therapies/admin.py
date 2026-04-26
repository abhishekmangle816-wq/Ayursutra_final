from django.contrib import admin
from .models import Therapy

@admin.register(Therapy)
class TherapyAdmin(admin.ModelAdmin):
    list_display = ('name', 'duration_minutes', 'dosha_suitability', 'is_active')
    search_fields = ('name', 'dosha_suitability')
    list_filter = ('is_active',)
