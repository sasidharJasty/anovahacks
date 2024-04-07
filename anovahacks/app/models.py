from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)
    date_joined = models.DateTimeField(default=timezone.now)
    userType = models.CharField(max_length=500, default="Volunteer")
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    
class HourRecord(models.Model):
    user_id = models.CharField(max_length=5000, default=0)
    hours = models.IntegerField()
    work_description = models.CharField(max_length=500)
    Organizer_Email = models.EmailField(_("email address"))
    approved = models.BooleanField(default=False)
    denied = models.BooleanField(default=False)
    date = models.CharField(max_length=5000, default=0)

    def __str__(self):
        return f"{self.id} {self.user_id} {self.date}"
        
class Organization(models.Model):
    user_id = models.CharField(max_length=5000, default=0)
    Organization_Name = models.CharField(max_length=500)
    Organization_Email = models.EmailField(_("email address"))
    Organization_Description = models.CharField(max_length=500)

    def __str__(self):
        return self.Organization_Name

from django.contrib.auth import get_user_model

User = get_user_model()

class Event(models.Model):
    user_id = models.CharField(max_length=5000, default=0)
    Organization_Name = models.CharField(max_length=500)
    Event_Name = models.CharField(max_length=500)
    Event_Description = models.CharField(max_length=2000)
    Event_Restrictions = models.CharField(max_length=2000)
    Event_Location = models.CharField(max_length=2000)
    Event_Time = models.CharField(max_length=2000)
    participants = models.ManyToManyField(User, related_name='events_participated', blank=True)

    def __str__(self):
        return self.Organization_Name + self.Event_Name
