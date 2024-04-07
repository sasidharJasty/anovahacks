from django.contrib.auth import get_user_model, authenticate, login, logout
from django.contrib.auth.models import Group
from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import update_session_auth_hash
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status
from .models import Organization, HourRecord, Event
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, HoursSerializer, ChangePasswordSerializer, UserGroupCountSerializer, OrganizationSerializer, EventSerializer
from django.conf import settings

User = get_user_model()

EMAIL_HOST_USER = settings.EMAIL_HOST_USER

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    if request.method == 'POST':
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.data.get('old_password')):
                user.set_password(serializer.data.get('new_password'))
                user.save()
                update_session_auth_hash(request, user)
                return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
            return Response({'error': 'Incorrect old password.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserGroupCountViewSet(viewsets.ViewSet):
    def list(self, request, group_name=None):
        try:
            group = Group.objects.get(name=group_name)
            count = group.user_set.count()
            serializer = UserGroupCountSerializer({"count": count})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({"detail": "Group not found."}, status=status.HTTP_404_NOT_FOUND)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['email']


class HoursViewSet(viewsets.ModelViewSet):
    queryset = HourRecord.objects.all()
    serializer_class = HoursSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user_id']

class SignupView(APIView):
    permission_classes = [AllowAny]
    http_method_names = ['post']

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        userType = request.data.get('userType')
        
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
        elif User.objects.filter(email=email).exists():
            return Response({'error': 'Email already taken'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = User.objects.create_user(username=username, email=email, password=password, userType=userType)

            token, created = Token.objects.get_or_create(user=user)

            return Response({'User': username, 'Username': user.username, 'Id': user.id, 'type': userType, 'token': token.key})

class LoginView(APIView):
    permission_classes = [AllowAny]

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'User': username, 'Username': user.username, 'Id': user.id,'userType': user.userType, 'token': token.key})
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

def soon(request):
    return render(request, "soon.html")

def pagenotfound(request):
    return render(request, "pagenotfound.html")

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logout successful'})        

class Organization_View(APIView):
    permission_classes = [AllowAny]
    @csrf_exempt
    def post(self, request, *args, **kwargs):
        '''
        Create the Todo with given todo data
        '''
        data = {
            'user_id': request.data.get('user_id'), 
            'Organization_Name': request.data.get('name'), 
            'Organization_Email': request.data.get('email'),
            'Organization_Description':request.data.get('description'),
        }
        serializer = OrganizationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user_id']

class Event_View(APIView):
    permission_classes = [AllowAny]

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        '''
        Create an Event with given data
        '''
        serializer = EventSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user_id']

    
class Register_View(APIView):
    permission_classes = [AllowAny]

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        event_id = request.data.get('event_id')

        try:
            user = User.objects.get(id=user_id)
            event = Event.objects.get(id=event_id)

            if user in event.participants.all():
                return Response({'error': 'User is already registered for this event'}, status=status.HTTP_400_BAD_REQUEST)

            event.participants.add(user)
            event.save()

            return Response({'message': 'User registered successfully for the event'}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Event.DoesNotExist:
            return Response({'error': 'Event does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

@api_view(['GET'])
def get_user_events(request, user_id):
    user_events = Event.objects.filter(participants__id=user_id)
    serialized_events = [{'Event_Name': event.Event_Name, 'Event_Description': event.Event_Description, 'Event_Location': event.Event_Location, 'Organization_Name': event.Organization_Name} for event in user_events]
    return Response({'event': serialized_events}, status=status.HTTP_200_OK)

