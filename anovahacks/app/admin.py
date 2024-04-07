from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import HourRecord, Event, Organization
User = get_user_model()
# Register your models here.
admin.site.register(User)
admin.site.register(HourRecord)
admin.site.register(Event)
admin.site.register(Organization)