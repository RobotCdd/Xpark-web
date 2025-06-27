from rest_framework import viewsets
from .models import User, Token, Game, UserGameStats
from .models import RegistrationToken
from .serializers import UserSerializer, TokenSerializer, GameSerializer, UserGameStatsSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
import random
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from django.template.exceptions import TemplateDoesNotExist
from django.views.generic import TemplateView
from django.db.models import Count

token_obtain_pair = csrf_exempt(TokenObtainPairView.as_view())

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TokenViewSet(viewsets.ModelViewSet):
    queryset = Token.objects.all()
    serializer_class = TokenSerializer

@method_decorator(csrf_exempt, name='dispatch')
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

@method_decorator(csrf_exempt, name='dispatch')
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

@csrf_exempt
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

@csrf_exempt
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

@csrf_exempt
@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, username=email, password=password)
    if user is not None:
        login(request, user)
        return Response({'success': True})
    else:
        return Response({'success': False, 'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
@csrf_exempt
@api_view(['POST'])
def suspend_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_suspended = request.data.get('is_suspended', False)
        user.save()
        return Response({'success': True})
    except User.DoesNotExist:
        return Response({'success': False, 'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@api_view(['POST'])
def admin_reset_password(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.password = make_password("Password123")
        user.save()
        return Response({'success': True})
    except User.DoesNotExist:
        return Response({'success': False, 'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    if request.method == 'PATCH':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def game_stats(request):
    # Count how many times each game was played by the user
    stats = (
        UserGameStats.objects.filter(user=request.user)
        .values('game__name')
        .annotate(value=Count('id'))
        .order_by('-value')
    )

    data = [{'name': s['game__name'], 'value': s['value']} for s in stats]
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bar_stats(request):
    stats = (
        UserGameStats.objects.filter(user=request.user)
        .values('game__name', 'completion')
    )

    colors = ["#a21caf", "#14b8a6", "#38bdf8", "#a3e635", "#f43f5e"]
    data = [
        {
            'name': s['game__name'],
            'percent': s['completion'],
            'color': colors[i % len(colors)]
        }
        for i, s in enumerate(stats)
    ]
    return Response(data)

class FrontendAppView(TemplateView):
    template_name = "index.html"

    def get(self, request, **kwargs):
        try:
            return super().get(request, **kwargs)
        except TemplateDoesNotExist:
            return HttpResponse(
                "index.html not found", status=501,
            )

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

class UserGameStatsViewSet(viewsets.ModelViewSet):
    queryset = UserGameStats.objects.all()
    serializer_class = UserGameStatsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserGameStats.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)