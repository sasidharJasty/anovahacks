# Generated by Django 4.2.11 on 2024-04-07 08:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_event'),
    ]

    operations = [
        migrations.CreateModel(
            name='Events',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.CharField(default=0, max_length=5000)),
                ('Organization_Name', models.CharField(max_length=500)),
                ('Event_Name', models.CharField(max_length=500)),
                ('Event_Description', models.CharField(max_length=2000)),
                ('Event_Restrictions', models.CharField(max_length=2000)),
                ('Event_Location', models.CharField(max_length=2000)),
                ('Event_Time', models.CharField(max_length=2000)),
            ],
        ),
        migrations.DeleteModel(
            name='Event',
        ),
    ]
