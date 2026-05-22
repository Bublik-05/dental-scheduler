from django.contrib.auth import login, logout, authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import User


def serialize_user(user):
    return {
        'id': user.id,
        'username': user.username,
        'name': user.display_name(),
        'role': user.role,
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    if not username or not password:
        return Response(
            {'error': 'Username and password are required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(request, username=username, password=password)
    if user and user.is_active:
        login(request, user)
        return Response(serialize_user(user))

    return Response(
        {'error': 'Invalid username or password.'},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'ok': True})


@api_view(['GET'])
def me_view(request):
    return Response(serialize_user(request.user))


@api_view(['GET'])
def dentists_view(request):
    """Return list of dentists for dropdowns. Available to all authenticated users."""
    dentists = (
        User.objects
        .filter(role='dentist', is_active=True)
        .order_by('first_name', 'last_name')
        .values('id', 'first_name', 'last_name', 'username')
    )
    return Response([
        {
            'id': d['id'],
            'name': f"{d['first_name']} {d['last_name']}".strip() or d['username'],
        }
        for d in dentists
    ])
