from celery import shared_task
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

@shared_task
def send_appointment_reminder():
    from appointments.models import Appointment
    now = timezone.now()
    tomorrow = now + timedelta(days=1)
    
    # Very generic, finds appointments next day
    upcoming = Appointment.objects.filter(
        date=tomorrow.date(), 
        status='confirmed'
    )
    
    for appt in upcoming:
        logger.info(f"Reminder: You have an appointment tomorrow at {appt.time_slot} with Dr. {appt.doctor.user.get_full_name()}")
        # Here we would integrate email sending module like django.core.mail

@shared_task
def send_low_stock_alert():
    from pharmacy.models import PharmacyItem
    low_items = PharmacyItem.objects.filter(quantity__lte=models.F('reorder_level'))
    for item in low_items:
        logger.warning(f"Low Stock Alert: {item.name}. Remaining: {item.quantity}")

@shared_task
def weekly_summary_report():
    logger.info("Generating weekly summary report for Admin.")
