import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from catalog.models import UserProfile

def repair_achievements():
    print("Verificăm profilurile pentru achievement-uri lipsă...")
    profiles = UserProfile.objects.all()
    for profile in profiles:
        original_count = profile.achievements.count()
        profile.award_level_achievements()
        # Verificăm și XP-based
        if profile.xp >= 10000:
            profile.award_achievement("GabeN's Blessing")
        
        # Verificăm dacă a dat review-uri
        if profile.user.reviews.exists():
            profile.award_achievement("Reviewer")
            
        new_count = profile.achievements.count()
        if new_count > original_count:
            print(f"Utilizatorul {profile.user.username} (Lvl {profile.level}) a primit {new_count - original_count} achievement-uri noi.")

if __name__ == '__main__':
    repair_achievements()
