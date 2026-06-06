import os
import django
import sys

# Configurăm mediul Django pentru a rula scriptul standalone
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from catalog.models import Achievement

def run():
    print("Stergem vechile achievements (daca exista) pentru a incepe curat...")
    Achievement.objects.all().delete()

    achievements_data = [
        # Nivel entry - reduceri mici (5%)
        {
            "name": "First Blood",
            "description": "Ai creat contul și te-ai logat prima oară! (-5%)",
            "icon_url": "https://api.dicebear.com/7.x/bottts/svg?seed=FirstBlood&backgroundColor=66c0f4",
            "discount_percentage": 5
        },
        {
            "name": "Window Shopper",
            "description": "Ai adăugat primul produs în coș. E un început! (-5%)",
            "icon_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Shopper&backgroundColor=171a21",
            "discount_percentage": 5
        },
        # Level-based Achievements (Automatic on level up)
        {
            "name": "Riff Apprentice",
            "description": "Ai atins Nivelul 2! Începător cu potențial. (-5%)",
            "icon_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Level2&backgroundColor=5cb85c",
            "discount_percentage": 5
        },
        {
            "name": "Gear Enthusiast",
            "description": "Ai atins Nivelul 3! Deja știi ce cauți. (-10%)",
            "icon_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Level3&backgroundColor=f0ad4e",
            "discount_percentage": 10
        },
        {
            "name": "Tone Master",
            "description": "Ai atins Nivelul 4! Urechea ta e formată. (-15%)",
            "icon_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Level4&backgroundColor=d9534f",
            "discount_percentage": 15
        },
        {
            "name": "Social Butterfly",
            "description": "Ai dat share primului produs către prieteni. (-5%)",
            "icon_url": "https://api.dicebear.com/7.x/icons/svg?seed=Social&backgroundColor=2a475e",
            "discount_percentage": 5
        },

        # Nivel mediocru - reduceri medii (10%)
        {
            "name": "Gear Head",
            "description": "Ai vizitat de 5 ori secțiunea de Branduri. Știi ce cauți! (-10%)",
            "icon_url": "https://api.dicebear.com/7.x/shapes/svg?seed=GearHead&backgroundColor=66c0f4",
            "discount_percentage": 10
        },
        {
            "name": "Reviewer",
            "description": "Ne-ai ajutat comunitatea lăsând primul tău review. Multumim! (-10%)",
            "icon_url": "https://api.dicebear.com/7.x/icons/svg?seed=Reviewer&backgroundColor=ff9900",
            "discount_percentage": 10
        },
        {
            "name": "Collector",
            "description": "Ai cumpărat echipament din 3 categorii diferite. (-10%)",
            "icon_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Collector&backgroundColor=171a21",
            "discount_percentage": 10
        },
        {
            "name": "Guitar Hero",
            "description": "Ai adăugat prima chitară la colecția ta. Let it rock! (-10%)",
            "icon_url": "https://api.dicebear.com/7.x/icons/svg?seed=Guitar&backgroundColor=d9534f",
            "discount_percentage": 10
        },
        {
            "name": "Keys Master",
            "description": "Te-ai axat pe clape. Synth-urile sunt prietenii tăi. (-10%)",
            "icon_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Synth&backgroundColor=5cb85c",
            "discount_percentage": 10
        },

        # Nivel Avansat - reduceri mari (15%-20%)
        {
            "name": "Amped Up",
            "description": "Ai achiziționat primul tău amplificator serios. Vecinii vor ști! (-15%)",
            "icon_url": "https://api.dicebear.com/7.x/shapes/svg?seed=Amp&backgroundColor=f0ad4e",
            "discount_percentage": 15
        },
        {
            "name": "Studio Rat",
            "description": "Echipamentele de studio se adună în coșul tău... (-15%)",
            "icon_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Studio&backgroundColor=337ab7",
            "discount_percentage": 15
        },
        {
            "name": "Loyal Customer",
            "description": "Ai petrecut 1 an pe platforma noastră! (-15%)",
            "icon_url": "https://api.dicebear.com/7.x/icons/svg?seed=Loyal&backgroundColor=66c0f4",
            "discount_percentage": 15
        },
        {
            "name": "Big Spender",
            "description": "Ai plasat prima ta comandă de peste 5.000 RON. Woohoo! (-20%)",
            "icon_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Spender&backgroundColor=ffcc00",
            "discount_percentage": 20
        },
        {
            "name": "Band Manager",
            "description": "Ai adus în echipă încă 3 prieteni folosind link-ul de referință. (-20%)",
            "icon_url": "https://api.dicebear.com/7.x/shapes/svg?seed=BandManager&backgroundColor=d9534f",
            "discount_percentage": 20
        },

        # God Tier Nivel - mega reduceri (25%-30%)
        {
            "name": "GabeN's Blessing",
            "description": "Ai strans 10.000 XP in Gamification System! Lord of the Gear! (-25%)",
            "icon_url": "https://api.dicebear.com/7.x/icons/svg?seed=Gaben&backgroundColor=000000",
            "discount_percentage": 25
        },
        {
            "name": "Platinum Ear",
            "description": "Ai deblocat absolut toate categoriile posibile de pe Far Beyond Gear! (-30%)",
            "icon_url": "https://api.dicebear.com/7.x/bottts/svg?seed=PlatinumEar&backgroundColor=e5e4e2",
            "discount_percentage": 30
        }
    ]

    for data in achievements_data:
        Achievement.objects.create(**data)
        print(f"Creat Achievement: {data['name']} (-{data['discount_percentage']}%)")

    print("\nTotal 15 Achievements au fost adaugate in baza de date cu succes!")

if __name__ == '__main__':
    run()
