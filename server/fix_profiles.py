from django.contrib.auth.models import User
from catalog.models import UserProfile

for u in User.objects.all():
    up, created = UserProfile.objects.get_or_create(user=u)
    if created:
        print(f"Created profile for {u.username}")
    else:
        print(f"Profile already exists for {u.username}")
