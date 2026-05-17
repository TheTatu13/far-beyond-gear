import os
import django
import random
from faker import Faker

# Configurare mediu Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from catalog.models import Product, Review, UserProfile

fake = Faker('ro_RO') # Setăm regiunea pentru nume românești, deși muzicienii folosesc și engleză.

def create_fake_users(num_users=15):
    print("Se creează utilizatori falși...")
    users = []
    
    # Nume specifice de pasionați de chitară
    usernames = ["AlexGuitar", "MetalHead99", "ShredderRO", "RiffMaster", "ToneSeeker", 
                 "DropD_Hero", "AcousticVibes", "BassSlapper", "PedalNerd", "StudioCat",
                 "LiveSound", "GheorgheFuzz", "IonutzVHT", "MihaiTubular", "ZoltanGear"]
                 
    for i in range(num_users):
        username = usernames[i] if i < len(usernames) else fake.user_name()
        
        # Sări peste dacă există
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
        else:
            email = f"{username.lower()}@example.com"
            user = User.objects.create_user(username=username, email=email, password="password123")
            
            # Adaugă un nivel/XP la întâmplare
            if hasattr(user, 'profile'):
                user.profile.add_xp(random.randint(500, 5000))
                
        users.append(user)
    print(f"S-au obținut {len(users)} utilizatori.")
    return users

def seed_reviews():
    users = create_fake_users()
    products = list(Product.objects.all())
    
    if not products:
        print("Nu există produse în baza de date la care să le adăugăm recenzii!")
        return

    # Texte hardcodate pentru realism
    awesome_comments = [
        "Sunt absolut uimit de calitatea acestui echipament. Sunetul este cristal, iar construcția impecabilă. 10/10!",
        "Cel mai bun raport calitate-preț pe care l-am găsit. Livrare super rapidă de la Far Beyond Gear.",
        "Inițial am ezitat, dar acum nu mă mai pot dezlipi de el. Riff-urile sună mult mai strâns și agresiv.",
        "Perfect pentru studio, zero zgomot de fundal și un headroom foarte mare.",
        "Exact tonul de care aveam nevoie! Acum trupa e complet mulțumită la repetiții.",
        "Recomand cu căldură tuturor pasionaților din domeniu."
    ]
    
    good_comments = [
        "Un produs foarte solid, singurul minus ar fi greutatea ceva mai mare, dar la prețul ăsta nu comentez. Sună bine.",
        "Bun pentru gig-uri mici și repetiții. Potențiometrele au un feel premium.",
        "Își face treaba excelent, deși prospectul putea fi un pic mai detaliat.",
        "Surprinzător de calitativ. Finisajul este destul de bun, iar acțiunea e setată perfect din fabrică.",
    ]
    
    neutral_comments = [
        "E ok, își merită banii dar nu e ceva revoluționar. O achiziție de bun simț.",
        "Livrarea a durat un pic mai mult, dar echipamentul, în sine, sună decent."
    ]
    
    print(f"Se generează recenzii pentru {len(products)} produse...")
    
    reviews_created = 0
    
    for product in products:
        # Nu fiecare produs are nevoie de același număr de review-uri (randomizare 0-6 review-uri per produs)
        num_reviews = random.randint(2, 6)
        
        # Alegem utilizatori la întâmplare pentru acest produs, fară a repeta userul la același produs
        selected_users = random.sample(users, min(num_reviews, len(users)))
        
        for user in selected_users:
            if Review.objects.filter(product=product, user=user).exists():
                continue # Evităm duplicarea
            
            # 80% șanse pentru rating 5, 15% pentru 4, 5% pentru 3
            chance = random.random()
            if chance < 0.8:
                rating = 5
                comment = random.choice(awesome_comments)
            elif chance < 0.95:
                rating = 4
                comment = random.choice(good_comments)
            else:
                rating = 3
                comment = random.choice(neutral_comments)
                
            Review.objects.create(
                product=product,
                user=user,
                rating=rating,
                comment=comment
            )
            reviews_created += 1

    print(f"Succes! Au fost adăugate {reviews_created} recenzii în baza de date.")

if __name__ == '__main__':
    seed_reviews()
