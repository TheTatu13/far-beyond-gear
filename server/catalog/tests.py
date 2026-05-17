from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import UserProfile, Achievement, Product, Brand, Category

class GamificationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.profile = self.user.profile
        self.client.force_authenticate(user=self.user)

        # Creăm date de test pentru Checkout
        self.brand = Brand.objects.create(name="Test Brand")
        # Alocăm stoc pentru a trece de validarea obligatorie
        self.product = Product.objects.create(name="Test Product", price=100.00, brand=self.brand, stock=10)
        
        # Asigurăm existența achievement-ului "First Blood"
        Achievement.objects.get_or_create(name="First Blood", description="Prima ta comandă!")

    def test_add_xp_and_level_up(self):
        """Testăm că XP-ul se adaugă corect și nivelul crește la pragul de 1000."""
        # Initial: Level 1, XP 0
        self.assertEqual(self.profile.level, 1)
        self.assertEqual(self.profile.xp, 0)

        # Adăugăm 500 XP
        self.profile.add_xp(500)
        self.assertEqual(self.profile.xp, 500)
        self.assertEqual(self.profile.level, 1)

        # Adăugăm încă 600 XP (Total 1100) -> Nivel 2
        self.profile.add_xp(600)
        self.assertEqual(self.profile.xp, 1100)
        self.assertEqual(self.profile.level, 2)

        # Adăugăm încă 2000 XP (Total 3100) -> Nivel 4
        self.profile.add_xp(2000)
        self.assertEqual(self.profile.xp, 3100)
        self.assertEqual(self.profile.level, 4)

    def test_checkout_awards_xp(self):
        """Testăm că endpoint-ul de checkout acordă XP corect."""
        cart_data = {
            "customer": {
                "fullName": "Test User",
                "email": "test@example.com",
                "phone": "0700000000",
                "address": "Strada Test",
                "city": "Bucuresti",
                "zip": "123456",
                "paymentMethod": "card"
            },
            "items": [
                {"id": self.product.id, "qty": 2}
            ]
        }
        
        response = self.client.post('/api/checkout/', cart_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # 100 * 2 = 200 Euro -> 200 XP
        self.assertEqual(response.data['xp_gained'], 200)
        self.assertIn('order_id', response.data)
        
        # Verificăm în DB
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.xp, 200)

    def test_first_blood_achievement(self):
        """Testăm că achievement-ul First Blood este deblocat la prima comandă."""
        cart_data = {
            "customer": {"fullName": "Test", "email": "a@b.c", "phone": "0"},
            "items": [{"id": self.product.id, "qty": 1}]
        }
        
        # Înainte de comandă, userul nu are achievement-ul
        self.assertEqual(self.profile.achievements.count(), 0)
        
        response = self.client.post('/api/checkout/', cart_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # După comandă, ar trebui să aibă 1 achievement
        self.assertEqual(self.profile.achievements.filter(name="First Blood").count(), 1)

    def test_checkout_insufficient_stock(self):
        """Testăm că endpoint-ul de checkout respinge comanda dacă stocul e insuficient."""
        cart_data = {
            "customer": {"fullName": "Test Greed", "email": "greed@example.com"},
            "items": [{"id": self.product.id, "qty": 9999}] # Mult peste stocul de 10
        }
        
        response = self.client.post('/api/checkout/', cart_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Stoc insuficient", response.data['error'])
        
        # Verificăm că stocul nu s-a modificat
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 10)

class ApiEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.brand = Brand.objects.create(name="Test Brand")
        self.product = Product.objects.create(name="Test Guitar", price=500.00, brand=self.brand, stock=5)

    def test_products_endpoint(self):
        """Verificam ca API-ul de produse returneaza date valide (200 OK)"""
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('count' in response.data)
        
    def test_brands_endpoint(self):
        """Verificam ca API-ul de brand-uri returneaza date valide"""
        response = self.client.get('/api/brands/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
