from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Brand, Category, Product, UserProfile, Achievement, UserAchievement, Artist, Order, OrderItem, Review, ProductImage


# Serializator pentru model Brand - convertește obiecte Brand în JSON și invers
class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        # Includ toate câmpurile modelului
        fields = "__all__"



# Serializator pentru model Category - convertește obiecte Category în JSON și invers
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        # Includ toate câmpurile modelului
        fields = "__all__"


# --- Product Serializer logic moved below ReviewSerializer ---
class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    user_id = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = Review
        fields = ['id', 'user_id', 'username', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user_id', 'username', 'created_at']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text']

# Serializator pentru model Product - cu câmpuri personalizate pentru citire și scriere
class ProductSerializer(serializers.ModelSerializer):
    brand_name = serializers.ReadOnlyField(source='brand.name')
    categories = CategorySerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'brand', 'brand_name', 'categories', 'price', 'stock', 'image', 'description', 'specifications', 'reviews', 'images']

class ArtistSerializer(serializers.ModelSerializer):
    brands = BrandSerializer(many=True, read_only=True)
    brand_ids = serializers.PrimaryKeyRelatedField(
        source="brands", queryset=Brand.objects.all(), many=True, write_only=True
    )
    products_detail = ProductSerializer(source="products", many=True, read_only=True)
    
    class Meta:
        model = Artist
        fields = "__all__"

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = '__all__'

class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)

    class Meta:
        model = UserAchievement
        fields = ['achievement', 'date_unlocked', 'is_redeemed']

class UserProfileSerializer(serializers.ModelSerializer):
    # Username for easy display on front-end
    username = serializers.CharField(source='user.username', read_only=True)
    
    # Custom calculated field: Percentage until next level (0-100)
    next_level_progress = serializers.SerializerMethodField()
    
    # Nested achievements
    user_achievements = UserAchievementSerializer(source='userachievement_set', many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'level', 'xp', 'balance', 'title', 'next_level_progress', 'user_achievements']
        read_only_fields = ['id', 'username', 'level', 'xp', 'next_level_progress', 'user_achievements']

    def get_next_level_progress(self, obj):
        """
        Calculează procentajul (0-100) de XP necesar pentru următorul nivel.
        Deoarece un nivel se face la fiecare 1000 XP:
        XP rămas în nivelul curent = xp % 1000
        Procentaj = (xp % 1000) / 1000 * 100
        """
        if not obj:
            return 0
        
        # XP progress within the current level
        current_level_xp = obj.xp % 1000
        progress_percentage = (current_level_xp / 1000.0) * 100
        
        
        # Rotunjit la întreg
        return int(progress_percentage)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        # Creează user-ul folosind create_user pentru a stoca parola hash-uită
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        # Profilul atașat (Gamification) se creează automat prin or_create, 
        # dar putem să-l forțăm aici preventiv
        UserProfile.objects.get_or_create(user=user)
        return user

class OrderItemSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_detail', 'qty', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'customer_name', 'email', 'address', 'city', 'county', 'zip_code', 'phone', 'payment_method', 'total', 'created_at', 'items']

