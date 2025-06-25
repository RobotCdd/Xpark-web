from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, TokenViewSet
from .views import SendVerificationEmail
from .views import SendVerificationEmailNonExisting
from .views import verify_code
from.views import update_password
from .views import login_view
from .views import suspend_user
from .views import admin_reset_password
from .views import current_user
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'tokens', TokenViewSet)

urlpatterns = [
    path('users/me/', current_user, name='current_user'),
    path('send-verification-email/', SendVerificationEmail.as_view(), name='send-verification-email'),
    path('send-verification-email-non-existing/', SendVerificationEmailNonExisting.as_view(), name='send-verification-email-non-existing'),
    path('verify-code/', verify_code, name='verify-code'),
    path('update-password/', update_password, name='update-password'),
    path('login/', login_view, name='login'),
    path('users/<int:user_id>/suspend/', suspend_user, name='suspend-user'),
    path('users/<int:user_id>/reset-password/', admin_reset_password, name='admin-reset-password'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]