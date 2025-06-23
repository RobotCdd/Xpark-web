from django.db import models

class Token(models.Model):
    id = models.AutoField(primary_key=True)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField()
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    user = models.ForeignKey('User', on_delete=models.CASCADE)


class User(models.Model):
    id = models.AutoField(primary_key=True)
    role = models.CharField(max_length=63, default="user")
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=10, null=True)
    city = models.CharField(max_length=63)

    def __str__(self) -> str:
        return self.name