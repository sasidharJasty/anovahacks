# Generated by Django 4.2.11 on 2024-04-07 08:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_events_delete_event'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Events',
            new_name='Event',
        ),
    ]