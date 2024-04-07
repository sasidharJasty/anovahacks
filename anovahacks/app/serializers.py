from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import HourRecord, Organization, Event
User = get_user_model()

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class HoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = HourRecord
        fields = '__all__'

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'
    


class ResetPasswordEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
class UserGroupCountSerializer(serializers.Serializer):
    count = serializers.IntegerField()