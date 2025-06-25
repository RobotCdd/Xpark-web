from rest_framework import viewsets
from .models import User, Token
from .models import RegistrationToken
from .serializers import UserSerializer, TokenSerializer

from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
import random
from django.contrib.auth.hashers import make_password, check_password

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TokenViewSet(viewsets.ModelViewSet):
    queryset = Token.objects.all()
    serializer_class = TokenSerializer

class SendVerificationEmail(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not User.objects.filter(email=email).exists():
            return Response({'error': 'Email not found in database.'}, status=status.HTTP_404_NOT_FOUND)

        code = str(random.randint(100000, 999999))
        user = User.objects.get(email=email)
        Token.objects.create(
            token=code,
            user=user,
            created_at=timezone.now(),
            expires_at=timezone.now() + timedelta(minutes=10),
            is_used=False,
        )
        
        send_mail(
            'Your Verification Code',
            f'Your code is: {code}',
            'robotcd3@gmail.com',
            [email],
            fail_silently=False,
        )
        return Response({'message': 'Verification email sent!', 'code': code})
    
class SendVerificationEmailNonExisting(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists.'}, status=status.HTTP_404_NOT_FOUND)
        
        code = str(random.randint(100000, 999999))
        RegistrationToken.objects.create(
            email=email,
            token=code,
            created_at=timezone.now(),
            expires_at=timezone.now() + timedelta(minutes=10),
            is_used=False,
        )
        
        send_mail(
            'Your Verification Code',
            f'Your code is: {code}',
            'robotcd3@gmail.com',
            [email],
            fail_silently=False,
        )
        return Response({'message': 'Verification email sent!', 'code': code})

@api_view(['POST'])
def verify_code(request):
    email = request.data.get('email')
    code = request.data.get('code')

    token = Token.objects.filter(token=code, user__email=email, is_used=False).first()
    if token:
        token.is_used = True
        token.save()
        return Response({'success': True})
    
    reg_token = RegistrationToken.objects.filter(token=code, email=email, is_used=False).first()
    if reg_token:
        reg_token.is_used = True
        reg_token.save()
        return Response({'success': True})
    return Response({'success': False, 'error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def update_password(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        user = User.objects.get(email=email)
        user.password = make_password(password)
        user.save()
        return Response({'success': True})
    except User.DoesNotExist:
        return Response({'success': False, 'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        user = User.objects.get(email=email)
        if check_password(password, user.password):
            return Response({'success': True})
        else:
            return Response({'success': False, 'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({'success': False, 'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['POST'])
def suspend_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_suspended = request.data.get('is_suspended', False)
        user.save()
        return Response({'success': True})
    except User.DoesNotExist:
        return Response({'success': False, 'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def admin_reset_password(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.password = make_password("Password123")
        user.save()
        return Response({'success': True})
    except User.DoesNotExist:
        return Response({'success': False, 'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)