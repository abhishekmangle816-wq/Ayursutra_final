from django.db import models

class Therapy(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField()
    duration_minutes = models.IntegerField(default=60)
    dosha_suitability = models.CharField(max_length=200, help_text="e.g., Vata, Pitta, Kapha, Tridoshic")
    contraindications = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
