import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ayursutra.settings')

app = Celery('ayursutra')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

# Schedule the periodic tasks
app.conf.beat_schedule = {
    'send_appointment_reminders_every_hour': {
        'task': 'core.tasks.send_appointment_reminder',
        'schedule': crontab(minute='0'), # Every hour on the hour
    },
    'weekly_summary_report': {
        'task': 'core.tasks.weekly_summary_report',
        'schedule': crontab(hour='8', minute='0', day_of_week='mon'), # Every Monday at 8 AM
    },
}
