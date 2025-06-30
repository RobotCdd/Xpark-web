from rest_framework import serializers
from .models import User, Token, Game, UserGameStats
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'id', 'name', 'email', 'phone', 'city', 'role', 'is_suspended', 'is_active', 'password'
        ]
        read_only_fields = ['id', 'is_suspended', 'is_active']

    def create(self, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = '__all__'

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'

class UserGameStatsSerializer(serializers.ModelSerializer):
    game = GameSerializer(read_only=True)
    game_id = serializers.PrimaryKeyRelatedField(queryset=Game.objects.all(), source='game', write_only=True)

    class Meta:
        model = UserGameStats
        fields = ['id', 'user', 'game', 'game_id', 'completion', 'time_played']
        read_only_fields = ['user']