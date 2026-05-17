from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Model pentru marcă (brand) - reprezintă producătorul unui produs
class Brand(models.Model):
    # Numele brandului, unic în baza de date
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to="brands/logos/", blank=True, null=True)
    hero_image = models.ImageField(upload_to="brands/heroes/", blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    website_url = models.URLField(max_length=255, blank=True, null=True)
    
    # Returnează string-ul pentru reprezentarea obiectului în admin
    def __str__(self): 
        return self.name

# Model pentru categorie - clasifică produsele
class Category(models.Model):
    # Numele categoriei, trebuie să fie unic
    name = models.CharField(max_length=120, unique=True)
    
    # Returnează string-ul pentru reprezentarea obiectului în admin
    def __str__(self): 
        return self.name

# Model pentru produs - core al aplicației, conține informațiile despre articole
class Product(models.Model):
    # Denumirea produsului
    name = models.CharField(max_length=255)
    
    # Relație cu Brand: fiecare produs aparține unui brand. Dacă brandul se șterge, produsul se șterge și el (CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    
    # Relație many-to-many cu Category: un produs poate aparține mai multor categorii
    categories = models.ManyToManyField(Category, blank=True)
    
    # Prețul produsului cu până la 10 cifre și 2 zecimale (ex: 99999999.99)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Cantitatea în stoc, nu poate fi negativ, implicit 0
    stock = models.PositiveIntegerField(default=0)
    
    # Imaginea produsului, stocată în folder "products/", opțional
    image = models.ImageField(upload_to="products/", blank=True, null=True)

    # Detalii extinse
    description = models.TextField(blank=True, null=True, help_text="Descrierea completă a produsului.")
    specifications = models.TextField(blank=True, null=True, help_text="Specificații tehnice sub formă de text sau JSON.")

    # Returnează string-ul pentru reprezentarea obiectului în admin și API
    def __str__(self):
        return self.name

# Model pentru artiști care reprezintă un brand și folosesc anumite produse
class Artist(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True)
    brands = models.ManyToManyField(Brand, blank=True, related_name='artists')
    role = models.CharField(max_length=200, blank=True, null=True, help_text="Trupa și rolul, ex: 'Guns N Roses – Lead Guitar'")
    bio = models.TextField(blank=True, null=True)
    quote = models.TextField(blank=True, null=True, help_text="Citat celebru pentru design high-end")
    image = models.ImageField(upload_to="artists/", blank=True, null=True)
    hero_image = models.ImageField(upload_to="artists/heroes/", blank=True, null=True)
    products = models.ManyToManyField(Product, blank=True, related_name='artists')

    def __str__(self):
        return self.name

# Model pentru profilul utilizatorului (stil Steam)
class UserProfile(models.Model):
    # Relație OneToOne cu modelul de bază User din Django
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Statistici de gamification
    level = models.PositiveIntegerField(default=1)
    xp = models.PositiveIntegerField(default=0)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    title = models.CharField(max_length=100, default='Novice')

    def add_xp(self, amount):
        """
        Adaugă XP și actualizează nivelul utilizatorului.
        Fiecare prag de 1000 XP crește nivelul cu 1.
        """
        self.xp += amount
        
        # Nivelul este calculat în funcție de pragul de 1000 XP
        # Un utilizator nou începe cu 0 XP și Nivel 1
        # La 1000 XP: 1 + 1000 // 1000 = Nivel 2, etc.
        new_level = 1 + (self.xp // 1000)
        
        if new_level > self.level:
            self.level = new_level
            self.award_level_achievements()
            
        # Check for XP-based achievements
        if self.xp >= 10000:
            self.award_achievement("GabeN's Blessing")

        self.save()

    def award_level_achievements(self):
        """Acordă achievement-uri în funcție de noul nivel atins."""
        if self.level >= 2:
            self.award_achievement("Riff Apprentice")
        if self.level >= 3:
            self.award_achievement("Gear Enthusiast")
        if self.level >= 4:
            self.award_achievement("Tone Master")

    def award_achievement(self, ach_name):
        """Metodă helper pe care o pot folosi alte părți ale codului."""
        try:
            from .models import Achievement, UserAchievement
            achievement = Achievement.objects.get(name=ach_name)
            UserAchievement.objects.get_or_create(
                user_profile=self,
                achievement=achievement
            )
        except Achievement.DoesNotExist:
            pass

    def check_checkout_achievements(self, order):
        """Verifică și acordă achievement-uri bazate pe o comandă finalizată."""
        # 1. Big Spender (> 5000 RON/EUR depinde de monedă)
        if order.total >= 5000:
            self.award_achievement("Big Spender")
        
        # 2. Categorii specifice
        items = order.items.all()
        categories = set()
        for item in items:
            if item.product:
                for cat in item.product.categories.all():
                    categories.add(cat.name)
        
        if any(c in ["Chitare electrice", "Chitare acustice"] for c in categories):
            self.award_achievement("Guitar Hero")
        
        if any(c in ["Clape", "Synthesizers"] for c in categories):
            self.award_achievement("Keys Master")
            
        if "Amplificatoare" in categories:
            self.award_achievement("Amped Up")
            
        if any(c in ["Studio", "Mixere audio"] for c in categories):
            self.award_achievement("Studio Rat")

        # 3. Collector (3 categorii diferite cumpărate vreodată)
        all_orders = self.user.orders.all()
        all_bought_categories = set()
        for o in all_orders:
            for oi in o.items.all():
                if oi.product:
                    for cat in oi.product.categories.all():
                        all_bought_categories.add(cat.id)
        
        if len(all_bought_categories) >= 3:
            self.award_achievement("Collector")
            
        # 4. Platinum Ear (5+ categorii diferite)
        if len(all_bought_categories) >= 5:
            self.award_achievement("Platinum Ear")

    def check_loyalty(self):
        """Verifică dacă userul este loial (1 an sau mai mult)."""
        import datetime
        from django.utils import timezone
        delta = timezone.now() - self.user.date_joined
        if delta.days >= 365:
            self.award_achievement("Loyal Customer")

    def __str__(self):
        return f"{self.user.username} - Level {self.level} ({self.title})"

# Model pentru realizări (achievements)
class Achievement(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    icon_url = models.URLField(max_length=500, blank=True, null=True)
    discount_percentage = models.PositiveIntegerField(
        default=0, 
        help_text="Procent de reducere oferit de acest achievement (ex: 10 pentru 10%)"
    )
    
    # Listă de utilizatori (UserProfile) care au deblocat acest achievement
    users_unlocked = models.ManyToManyField(UserProfile, through='UserAchievement', related_name='achievements', blank=True)

    def __str__(self):
        return self.name

class UserAchievement(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    date_unlocked = models.DateTimeField(auto_now_add=True)
    is_redeemed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user_profile', 'achievement')

    def __str__(self):
        return f"{self.user_profile.user.username} - {self.achievement.name} (Redeemed: {self.is_redeemed})"

# Modele pentru comenzi (Orders)
class Order(models.Model):
    PAYMENT_CHOICES = [
        ('card', 'Card Online'),
        ('ramburs', 'Plată la livrare (Ramburs)'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    customer_name = models.CharField(max_length=255)
    email = models.EmailField()
    address = models.TextField()
    city = models.CharField(max_length=100)
    county = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=20)
    phone = models.CharField(max_length=20)
    STATUS_CHOICES = [
        ('pending',   'În așteptare'),
        ('confirmed', 'Confirmat'),
        ('shipped',   'Expediat'),
        ('delivered', 'Livrat'),
        ('cancelled', 'Anulat'),
    ]
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='ramburs')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    order_number = models.CharField(max_length=50, unique=True, editable=False, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    awb_number = models.CharField(max_length=60, blank=True, null=True)
    courier = models.CharField(max_length=50, blank=True, null=True, default='FBG Express')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()
        super().save(*args, **kwargs)

    def generate_order_number(self):
        import datetime
        import random
        import string
        
        # Format: FBG-YEAR-RANDOM (ex: FBG-2026-A1B2)
        year = datetime.datetime.now().year
        # Generăm 6 caractere aleatorii (litere mari + cifre)
        random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f"FBG-{year}-{random_suffix}"

    def __str__(self):
        return f"Order {self.order_number} - {self.customer_name} ({self.total} €)"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    qty = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2) # Prețul la momentul achiziției

    def __str__(self):
        return f"{self.qty} x {self.product.name} (Order #{self.order.id})"

# Semnale pentru crearea automată a profilului (Gamification)
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()

# Model pentru recenzii (Reviews)
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('product', 'user') # Un utilizator poate lăsa un singur review per produs.

    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.rating}/5)"

# Model pentru tracking activitate site (Analytics)
class SiteActivity(models.Model):
    EVENT_CHOICES = [
        ('page_view',    'Vizualizare Pagină'),
        ('product_view', 'Vizualizare Produs'),
        ('search',       'Căutare'),
        ('add_to_cart',  'Adăugare în Coș'),
        ('purchase',     'Achiziție'),
        ('register',     'Înregistrare'),
        ('login',        'Autentificare'),
    ]
    event      = models.CharField(max_length=50, choices=EVENT_CHOICES, db_index=True)
    user       = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='site_activities')
    session    = models.CharField(max_length=120, blank=True, null=True)
    ip         = models.GenericIPAddressField(null=True, blank=True)
    page       = models.CharField(max_length=500, blank=True, null=True)
    product    = models.ForeignKey('Product', on_delete=models.SET_NULL, null=True, blank=True, related_name='activities')
    query      = models.CharField(max_length=255, blank=True, null=True)
    extra      = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Activitate"
        verbose_name_plural = "Activitate Site"

    def __str__(self):
        user_str = self.user.username if self.user else f"anon({self.ip})"
        return f"[{self.event}] {user_str} @ {self.created_at:%Y-%m-%d %H:%M}"


# Model pentru imagini multiple per produs (Galerie)
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to="products/gallery/")
    alt_text = models.CharField(max_length=255, blank=True, null=True, help_text="Text alternativ pentru accesibilitate.")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Imagine Produs"
        verbose_name_plural = "Imagini Produs"

    def __str__(self):
        return f"Imagine pentru {self.product.name} ({self.id})"
