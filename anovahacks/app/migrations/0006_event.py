# Generated by Django 4.2.11 on 2024-04-07 06:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_alter_customuser_managers_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.CharField(default=0, max_length=5000)),
                ('Organization_Name', models.CharField(max_length=500)),
                ('Event_Name', models.CharField(max_length=500)),
                ('Event_Description', models.CharField(max_length=2000)),
                ('Event_Restrictions', models.CharField(max_length=2000)),
                ('Event_Location', models.CharField(max_length=2000)),
                ('Event_Time', models.DateTimeField()),
            ],
        ),
    ]
