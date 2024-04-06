from django.contrib.auth.models import AbstractUser, Group, Permission
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.apps import apps
from django.core.mail import send_mail
from django.contrib.auth.models import Group, User
from anovahacks.settings import EMAIL_HOST_USER

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, group="Student" , **extra_fields):

        if not email:
            raise ValueError(_("The Email must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        # group = Group.objects.get(name=group)
        # user.groups.add(group) 
        return user

    def create_superuser(self, email, password, **extra_fields):

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        return self.create_user(email, password, group="Admin",**extra_fields)

class CustomUser(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)
    date_joined=models.DateTimeField(default=timezone.now)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    
class HourRecord(models.Model):
    user_id = models.CharField(max_length=5000, default=0)
    hours = models.IntegerField()
    work_description = models.CharField(max_length=500)
    Organizer_Email = models.EmailField(_("email address"))
    approved = models.BooleanField(default=False)
    denied = models.BooleanField(default=False)
    date = models.DateField()

    def __str__(self):
        return f"{self.id} {self.ymp_id} {self.date}"

    def save(self, *args, **kwargs):
        is_new_record = not self.pk

        super().save(*args, **kwargs) 

        if is_new_record:
            user = CustomUser.objects.filter(ymp_id=self.ymp_id).first()

            if user:
                subject = f"Hour Request for {user.username} from Youth Mentorship Project on {self.date}"
                message = f"Hi {self.teamlead_email},\n\n{user.username} has just requested {self.hours} hour(s) for the week of {self.date}.\n\nWork description for the week: {self.work_description}\n{user.username}'s plans for next week: {self.next_week_plans}\n\nPlease approve or decline now!\nHere is the id to find to approve the hours: \"{self.id} {self.ymp_id} {user.username} {self.date}\"\n\nThank You!"
                from_email = EMAIL_HOST_USER
                recipient_list = [self.teamlead_email]
                send_mail(subject, message, from_email, recipient_list, fail_silently=False)