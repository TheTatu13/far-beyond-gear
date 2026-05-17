from django.db.models import Q, Prefetch
from django.http import HttpResponse

from rest_framework import viewsets, filters, permissions, generics
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from .models import Product, Brand, Category, UserProfile, Achievement, Artist, Order, OrderItem
from .serializers import (
    ProductSerializer,
    BrandSerializer,
    CategorySerializer,
    UserProfileSerializer,
    AchievementSerializer,
    RegisterSerializer,
    ArtistSerializer,
    OrderSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework import status
from .models import UserAchievement, Review, SiteActivity
from .serializers import ReviewSerializer

class LogoutView(APIView):
    """
    Endpoint pentru delogare care invalidează token-ul de refresh.
    Accesibil tuturor pentru a permite curățarea token-urilor expirate de pe client.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)



# Funcție simplă pentru verificarea statusului serverului - healthcheck
def ping(request):
    """
    Endpoint simplu care verific dacă serverul API este activ și răspunde
    """
    return HttpResponse("Far Beyond Gear API is alive")


# Clasă de paginare pentru API - configurează cum sunt paginați rezultatele
class DefaultPagination(PageNumberPagination):
    # Implicit 12 produse pe pagină (similar cu Thomann.de)
    page_size = 12
    # Permite utilizatorilor să specifice dimensiune pagini via query param ?page_size=20
    page_size_query_param = "page_size"
    # Maxim 100 de articole per pagină (pentru prevenire abuzuri)
    max_page_size = 100


class BrandViewSet(viewsets.ModelViewSet):
    """
    ViewSet pentru gestionarea Brand-urilor (marcilor)
    Permite CRUD (Create, Read, Update, Delete) complet
    """
    # Toate brand-urile din baza de date, sortate alfabetic
    queryset = Brand.objects.all().order_by("name")
    serializer_class = BrandSerializer
    pagination_class = DefaultPagination
    # Filtru-uri: căutare și sortare
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    # Căutare full-text în câmpul 'name'
    search_fields = ["name"]
    # Permite sortare după 'name' și 'id'
    ordering_fields = ["name", "id"]
    # Sortare implicită: după nume
    ordering = ["name"]

    # Rută customizată: /api/brands/{id}/products/
    # Returnează produsele aparținând unui anumit brand
    @action(detail=True, methods=["get"])
    def products(self, request, pk=None):
        """
        Returnează lista produselor pentru un brand specific
        URL: GET /api/brands/{id}/products/
        """
        brand = self.get_object()  # Obține brandul curent
        qs = (
            Product.objects.filter(brand=brand)
            .select_related("brand")  # Optimizare: evită query-uri suplimentare
            .prefetch_related("categories")  # Optimizare: preîncarcă categoriile
            .order_by("name")
        )
        page = self.paginate_queryset(qs)
        serializer = ProductSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

class ArtistViewSet(viewsets.ModelViewSet):
    """
    ViewSet pentru gestionarea Artiștilor.
    """
    queryset = Artist.objects.all().order_by("name")
    serializer_class = ArtistSerializer
    pagination_class = DefaultPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ["brands", "slug"]
    search_fields = ["name", "role", "bio"]
    ordering_fields = ["name", "id"]
    ordering = ["name"]


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet pentru gestionarea Categoriilor
    Permite CRUD (Create, Read, Update, Delete) complet
    """
    # Toate categoriile din baza de date, sortate alfabetic
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    pagination_class = DefaultPagination
    # Filtru-uri: căutare și sortare
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    # Căutare full-text în câmpul 'name'
    search_fields = ["name"]
    # Permite sortare după 'name' și 'id'
    ordering_fields = ["name", "id"]
    # Sortare implicită: după nume
    ordering = ["name"]


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet pentru gestionarea Produselor - CORE AL API-ULUI
    Oferă CRUD complet și filtrare/căutare avansată
    """
    # Toate produsele din baza de date
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = DefaultPagination

    def get_queryset(self):
        """
        Suprascriem get_queryset pentru a adăuga filtrare dinamică
        Suportă: brand, min_price, max_price
        """
        qs = super().get_queryset()
        params = self.request.query_params

        # Extrage parametrii din query string (ex: ?brand=1&min=1000&max=5000)
        brand = params.get("brand")
        min_price = params.get("min")
        max_price = params.get("max")

        # ---- Filtrare după brand ----
        if brand:
            try:
                brand_id = int(brand)
                qs = qs.filter(brand_id=brand_id)
            except (TypeError, ValueError):
                # Dacă brand ID este invalid, ignorăm (nu aruncăm eroare)
                pass

        # ---- Funcție auxiliară pentru normalizarea prețurilor ----
        def clean_price(value):
            """
            Convertește un string într-un float valid
            Dacă nu e valid, returnează None
            """
            if value is None or value == "":
                return None
            try:
                v = float(value)
                # Prețul negativ nu are sens, forțăm 0
                if v < 0:
                    v = 0.0
                return v
            except ValueError:
                return None

        # Normalizează valorile minime și maxime de preț
        min_price = clean_price(min_price)
        max_price = clean_price(max_price)

        # Aplică filtrare de preț dacă valorile sunt valide
        if min_price is not None:
            qs = qs.filter(price__gte=min_price)  # Preț >= min_price

        if max_price is not None:
            qs = qs.filter(price__lte=max_price)  # Preț <= max_price

        # Sortare implicită: după preț crescător, apoi după ID
        return qs.order_by("price", "id")

    serializer_class = ProductSerializer
    pagination_class = DefaultPagination

    # Sisteme de filtrare, căutare și sortare disponibile
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    # Definește filtre exacte și intervale pentru câmpuri
    filterset_fields = {
        "brand": ["exact", "in"],                 # ?brand=1 sau ?brand__in=1,2
        "categories": ["exact", "in"],            # ?categories=3 sau ?categories__in=3,4
        "price": ["gte", "lte"],                  # ?price__gte=1000&price__lte=5000
    }

    # Full-text light: căutare în nume produs, brand și categorie
    search_fields = ["name", "brand__name", "categories__name"]

    # Permite sortare după: ?ordering=price sau ?ordering=-price (descrescător)
    ordering_fields = ["price", "name", "id"]
    # Sortare implicită: după nume
    ordering = ["name"]

    # Rută customizată: /api/products/{id}/related/
    # Returnează produse similare (din aceleași categorii)
    @action(detail=True, methods=["get"])
    def related(self, request, pk=None):
        """
        Returnează produse similare - produse din aceleași categorii
        URL: GET /api/products/{id}/related/
        """
        product = self.get_object()  # Obține produsul curent
        # Extrage ID-urile categoriilor la care aparține produsul
        cat_ids = product.categories.values_list("id", flat=True)
        qs = (
            Product.objects
            .exclude(id=product.id)  # Nu include produsul curent
            .filter(categories__in=cat_ids)  # Doar produse din aceleași categorii
            .select_related("brand")  # Optimizare: preîncarcă brandul
            .prefetch_related("categories")  # Optimizare: preîncarcă categoriile
            .distinct()  # Evită duplicate dacă un produs e în mai multe categorii
            .order_by("name")
        )
        page = self.paginate_queryset(qs)
        serializer = ProductSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pentru a expune lista globală de Achievement-uri 
    disponibile (pentru a fi afișate blocate/deblocate pe frontend).
    """
    queryset = Achievement.objects.all().order_by('discount_percentage')
    serializer_class = AchievementSerializer
    pagination_class = None  # Nu paginăm ca să avem toate pe o singură cerere 

class UserProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pentru profilul utilizatorului (Gamification / Steam style).
    Doar citire generală pentru a vizualiza profilele, dar cu o acțiune pentru `me`.
    """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """
        Returnează profilul pentru utilizatorul logat curent (request.user).
        URL: GET /api/profiles/me/
        """
        # Găsim sau creăm profilul în caz că userul abia s-a înregistrat și nu are unul
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        # Verificăm automat loialitatea când își vede profilul
        user_profile.check_loyalty()
        
        serializer = self.get_serializer(user_profile)
        return Response(serializer.data)

class RegisterView(generics.CreateAPIView):
    """
    Endpoint pentru înregistrarea unui utilizator nou.
    Acceptă POST cereri cu username, password, email.
    """
    queryset = UserProfile.objects.all() # queryset necesar pentru browsable API dar nu e rulat direct
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

from rest_framework.views import APIView
from rest_framework import status
from django.db import transaction
from .models import UserAchievement

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pentru gestionarea comenzilor utilizatorului curent
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

class CheckoutView(APIView):
    permission_classes = [permissions.AllowAny] # Permitem și vizitatori (guest checkout) dacă e cazul, dar logica de XP rămâne pt autentificați

    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        user_profile = getattr(user, 'profile', None) if user else None
        data = request.data
        cart_items = data.get('items', [])
        coupon_id = data.get('coupon_id')
        
        # Date client (din legacy)
        customer_data = data.get('customer', {})
        customer_name = customer_data.get('fullName', 'Anonim')
        email = customer_data.get('email', '')
        address = customer_data.get('address', '')
        city = customer_data.get('city', '')
        county = customer_data.get('county', '')
        zip_code = customer_data.get('zip', '')
        phone = customer_data.get('phone', '')
        payment_method = customer_data.get('paymentMethod', 'ramburs')

        if not cart_items:
            return Response({"error": "Coșul este gol."}, status=status.HTTP_400_BAD_REQUEST)

        total_price = 0
        order_items_to_create = []

        print(f"Checkout started for user: {request.user}")
        print(f"Data received: {data}")

        try:
            with transaction.atomic():
                # 1. Calculăm totalul folosind prețurile din Baza de Date (Securitate)
                for item in cart_items:
                    try:
                        pid = item.get('id')
                        product = Product.objects.get(id=pid)
                        qty = int(item.get('qty', 1))

                        if product.stock < qty:
                            return Response(
                                {"error": f"Stoc insuficient pentru '{product.name}'. Disponibil: {product.stock} buc."}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )

                        item_total = product.price * qty
                        total_price += item_total
                        
                        order_items_to_create.append({
                            'product': product,
                            'qty': qty,
                            'price': product.price
                        })
                        print(f"Added product {pid} x {qty} = {item_total}")
                    except Product.DoesNotExist:
                        print(f"Product {pid} not found")
                        continue
                    except Exception as e:
                        print(f"Error processing item {item}: {e}")
                        continue

                print(f"Subtotal calculated: {total_price}")
                subtotal = total_price

                if total_price <= 0:
                    return Response({"error": "Comanda nu are produse valide sau coșul este invalid."}, status=status.HTTP_400_BAD_REQUEST)

                # 2. Logică Cupon (Achievement)
                discount_amount = 0
                discount_percentage = 0
                applied_coupon_name = None

                if coupon_id and user_profile:
                    try:
                        user_achievement = UserAchievement.objects.get(
                            user_profile=user_profile, 
                            achievement_id=coupon_id,
                            is_redeemed=False
                        )
                        discount_percentage = user_achievement.achievement.discount_percentage
                        applied_coupon_name = user_achievement.achievement.name
                        
                        # Calculăm reducerea
                        discount_amount = (subtotal * discount_percentage) / 100
                        total_price = subtotal - discount_amount
                        
                        # Marcăm cuponul ca folosit
                        user_achievement.is_redeemed = True
                        user_achievement.save()
                        print(f"Applied coupon {applied_coupon_name}: {discount_percentage}% discount (-{discount_amount})")
                    except UserAchievement.DoesNotExist:
                        print(f"Coupon {coupon_id} not available or already used")
                        # Nu returnăm eroare, doar nu aplicăm reducerea (sau am putea returna 400 dacă e critic)

                # 3. Generăm AWB
                import random, string as _str
                awb = "FBG" + "".join(random.choices(_str.digits, k=10))
                courier_name = "FBG Express"

                # 4. Creăm Comanda (Order)
                order = Order.objects.create(
                    user=user,
                    customer_name=customer_name,
                    email=email,
                    address=address,
                    city=city,
                    county=county,
                    zip_code=zip_code,
                    phone=phone,
                    payment_method=payment_method,
                    total=total_price,
                    status='confirmed',
                    awb_number=awb,
                    courier=courier_name,
                )
                print(f"Order {order.order_number} created (ID: {order.id})")

                # 4. Salvăm itemele comenzii și reducem stocul
                for oi in order_items_to_create:
                    product = oi['product']
                    qty = oi['qty']
                    
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        qty=qty,
                        price=oi['price']
                    )
                    
                    # Scădem stocul
                    product.stock -= qty
                    product.save()

                # 5. GAMIFICATION LOGIC
                xp_gained = 0
                if user_profile:
                    xp_gained = int(total_price)
                    user_profile.add_xp(xp_gained)
                    # Verificăm toate noile achievement-uri de checkout
                    user_profile.check_checkout_achievements(order)
                    
                    print(f"XP awarded: {xp_gained}")

                # 6. Trimitem email confirmare
                try:
                    from django.core.mail import send_mail
                    from django.template.loader import render_to_string
                    pm_display = "Card Online" if payment_method == "card" else "Ramburs la livrare"
                    email_ctx = {
                        'customer_name': customer_name,
                        'order_number': order.order_number,
                        'awb_number': awb,
                        'courier': courier_name,
                        'order_date': order.created_at.strftime("%d %b %Y, %H:%M"),
                        'payment_method': pm_display,
                        'items': [
                            {
                                'name': oi['product'].name,
                                'qty': oi['qty'],
                                'total': f"{float(oi['price'] * oi['qty']):.2f}",
                            }
                            for oi in order_items_to_create
                        ],
                        'discount_amount': f"{float(discount_amount):.2f}" if discount_amount else None,
                        'total_paid': f"{float(total_price):.2f}",
                        'address': address, 'city': city,
                        'county': county, 'zip_code': zip_code, 'phone': phone,
                    }
                    html_body = render_to_string('emails/order_confirmation.html', email_ctx)
                    send_mail(
                        subject=f"Confirmare comandă {order.order_number} — Far Beyond Gear",
                        message=f"Comanda {order.order_number} confirmata. AWB: {awb}",
                        from_email=None,
                        recipient_list=[email],
                        html_message=html_body,
                        fail_silently=True,
                    )
                except Exception as mail_err:
                    print(f"Email error (non-fatal): {mail_err}")

            return Response({
                "message": "Comanda a fost procesată cu succes!",
                "order_id": order.id,
                "order_number": order.order_number,
                "awb_number": order.awb_number,
                "courier": order.courier,
                "xp_gained": xp_gained,
                "subtotal": float(subtotal),
                "discount_amount": float(discount_amount),
                "discount_percentage": discount_percentage,
                "total_paid": float(total_price),
                "customer": customer_name,
                "email": email,
                "date": order.created_at.strftime("%d %b %Y, %H:%M")
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            error_msg = str(e)
            print(f"FATAL ERROR during checkout: {error_msg}")
            return Response({"error": f"Eroare server: {error_msg}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProductReviewView(APIView):
    """
    Endpoint pentru recenzii pe produs.
    GET: Returnează toate recenziile unui produs.
    POST: Adaugă o recenzie nouă pentru un produs (necesită autentificare).
    """
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            reviews = product.reviews.all().order_by('-created_at')
            serializer = ReviewSerializer(reviews, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"error": "Produsul nu a fost găsit."}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            user = request.user
            
            # Verificăm dacă a lăsat deja review
            if Review.objects.filter(product=product, user=user).exists():
                return Response({"error": "Ai adăugat deja o recenzie pentru acest produs."}, status=status.HTTP_400_BAD_REQUEST)
                
            data = request.data.copy()
            serializer = ReviewSerializer(data=data)
            
            if serializer.is_valid():
                serializer.save(product=product, user=user)
                
                # Award "Reviewer" achievement
                if hasattr(user, 'profile'):
                    user.profile.award_achievement("Reviewer")
                    
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Product.DoesNotExist:
            return Response({"error": "Produsul nu a fost găsit."}, status=status.HTTP_404_NOT_FOUND)

class GrantAchievementView(APIView):
    """
    Endpoint pentru acordarea manuală a achievement-urilor din UI.
    Folosit pentru 'Window Shopper', 'Social Butterfly', 'Gear Head'.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        achievement_name = request.data.get("achievement_name")
        if not achievement_name:
            return Response({"error": "Nume achievement lipsă."}, status=status.HTTP_400_BAD_REQUEST)
        
        user_profile = request.user.profile
        user_profile.award_achievement(achievement_name)
        
        return Response({"status": "success", "message": f"Achievement '{achievement_name}' verificat/acordat."}, status=status.HTTP_200_OK)


# ═══════════════════════════════════════════════════════════════════════════════
# ANALYTICS — Tracking activitate site
# ═══════════════════════════════════════════════════════════════════════════════

class TrackActivityView(APIView):
    """
    Primeste evenimente de tracking de la frontend si le stocheaza in BD.
    AllowAny — atat useri logati cat si anonimi sunt trackati.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        event = request.data.get('event', '').strip()
        valid = {c[0] for c in SiteActivity.EVENT_CHOICES}
        if event not in valid:
            return Response({'error': 'event invalid'}, status=400)

        product = None
        pid = request.data.get('product_id')
        if pid:
            try:
                product = Product.objects.get(id=pid)
            except Product.DoesNotExist:
                pass

        forwarded = request.META.get('HTTP_X_FORWARDED_FOR', '')
        ip = forwarded.split(',')[0].strip() if forwarded else request.META.get('REMOTE_ADDR', '')

        SiteActivity.objects.create(
            event=event,
            user=request.user if request.user.is_authenticated else None,
            session=request.data.get('session', '')[:120],
            ip=ip[:45] if ip else None,
            page=request.data.get('page', '')[:500],
            product=product,
            query=request.data.get('query', '')[:255],
            extra=request.data.get('extra', {}),
        )
        return Response({'ok': True}, status=201)


class SiteStatsView(APIView):
    """
    Statistici agregate pentru admin/licenta. Doar staff.
    """
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        from django.utils import timezone
        import datetime
        from django.db.models import Count
        from django.db.models.functions import TruncDate

        days = int(request.query_params.get('days', 30))
        since = timezone.now() - datetime.timedelta(days=days)
        since_14 = timezone.now() - datetime.timedelta(days=14)

        daily = list(
            SiteActivity.objects
            .filter(created_at__gte=since_14, event='page_view')
            .annotate(day=TruncDate('created_at'))
            .values('day').annotate(count=Count('id')).order_by('day')
        )

        top_products = list(
            SiteActivity.objects
            .filter(event='product_view', product__isnull=False, created_at__gte=since)
            .values('product__name').annotate(views=Count('id')).order_by('-views')[:10]
        )

        top_searches = list(
            SiteActivity.objects
            .filter(event='search', created_at__gte=since)
            .exclude(query__isnull=True).exclude(query='')
            .values('query').annotate(count=Count('id')).order_by('-count')[:10]
        )

        events_breakdown = list(
            SiteActivity.objects
            .filter(created_at__gte=since)
            .values('event').annotate(count=Count('id')).order_by('-count')
        )

        totals = {}
        for ev in ['page_view', 'product_view', 'search', 'add_to_cart', 'purchase', 'register', 'login']:
            totals[ev] = SiteActivity.objects.filter(event=ev, created_at__gte=since).count()

        totals['unique_sessions'] = (
            SiteActivity.objects.filter(created_at__gte=since)
            .exclude(session='').values('session').distinct().count()
        )
        totals['total_all_time'] = SiteActivity.objects.count()

        pv = totals['product_view']
        totals['conversion_rate'] = round(totals['purchase'] / pv * 100, 2) if pv else 0

        return Response({
            'period_days': days,
            'totals': totals,
            'daily_views': [{'day': str(d['day']), 'count': d['count']} for d in daily],
            'top_products': top_products,
            'top_searches': top_searches,
            'events_breakdown': events_breakdown,
        })


# ═══════════════════════════════════════════════════════════════════════════════
# JWT CUSTOM — include is_staff în token payload
# ═══════════════════════════════════════════════════════════════════════════════

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username']     = user.username
        token['email']        = user.email
        token['is_staff']     = user.is_staff
        token['is_superuser'] = user.is_superuser
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# ═══════════════════════════════════════════════════════════════════════════════
# ADMIN PANEL API — endpoint-uri protejate IsAdminUser
# ═══════════════════════════════════════════════════════════════════════════════

from django.contrib.auth.models import User as DjangoUser
from django.db.models import Sum

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class AdminOverviewView(APIView):
    """Dashboard stats pentru admin panel React."""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get(self, request):
        from django.db.models import Sum
        total_products = Product.objects.count()
        total_orders   = Order.objects.count()
        total_users    = DjangoUser.objects.count()
        total_revenue  = Order.objects.filter(
            status__in=['confirmed','shipped','delivered']
        ).aggregate(r=Sum('total'))['r'] or 0
        pending_orders = Order.objects.filter(status='pending').count()
        total_reviews  = Review.objects.count()
        out_of_stock   = Product.objects.filter(stock=0).count()

        return Response({
            'total_products': total_products,
            'total_orders':   total_orders,
            'total_users':    total_users,
            'total_revenue':  float(total_revenue),
            'pending_orders': pending_orders,
            'total_reviews':  total_reviews,
            'out_of_stock':   out_of_stock,
        })


class AdminUserListView(APIView):
    """Lista tuturor utilizatorilor."""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get(self, request):
        users = DjangoUser.objects.all().order_by('-date_joined')
        data = [{
            'id':          u.id,
            'username':    u.username,
            'email':       u.email,
            'is_active':   u.is_active,
            'is_staff':    u.is_staff,
            'date_joined': u.date_joined.strftime('%d.%m.%Y'),
        } for u in users]
        return Response(data)


class AdminUserDetailView(APIView):
    """Modificare / ștergere utilizator."""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def patch(self, request, pk):
        try:
            user = DjangoUser.objects.get(pk=pk)
        except DjangoUser.DoesNotExist:
            return Response({'error': 'User negăsit'}, status=404)
        if user == request.user:
            return Response({'error': 'Nu poți modifica propriul cont'}, status=400)
        if 'is_active' in request.data:
            user.is_active = request.data['is_active']
        if 'is_staff' in request.data:
            user.is_staff = request.data['is_staff']
        user.save()
        return Response({'success': True})

    def delete(self, request, pk):
        try:
            user = DjangoUser.objects.get(pk=pk)
        except DjangoUser.DoesNotExist:
            return Response(status=404)
        if user == request.user:
            return Response({'error': 'Nu poți șterge propriul cont'}, status=400)
        user.delete()
        return Response(status=204)


class AdminReviewListView(APIView):
    """Lista tuturor review-urilor."""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get(self, request):
        reviews = Review.objects.select_related('product', 'user').order_by('-created_at')
        data = [{
            'id':           r.id,
            'product_id':   r.product.id,
            'product_name': r.product.name,
            'user':         r.user.username,
            'rating':       r.rating,
            'comment':      r.comment,
            'created_at':   r.created_at.strftime('%d.%m.%Y'),
        } for r in reviews]
        return Response(data)


class AdminReviewDetailView(APIView):
    """Ștergere review."""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def delete(self, request, pk):
        try:
            Review.objects.get(pk=pk).delete()
            return Response(status=204)
        except Review.DoesNotExist:
            return Response(status=404)


class AdminOrderListView(APIView):
    """Lista tuturor comenzilor."""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get(self, request):
        orders = Order.objects.prefetch_related('items__product').order_by('-created_at')
        data = [{
            'id':             o.id,
            'order_number':   o.order_number,
            'customer_name':  o.customer_name,
            'email':          o.email,
            'total':          float(o.total),
            'status':         o.status,
            'payment_method': o.payment_method,
            'awb_number':     o.awb_number,
            'courier':        getattr(o, 'courier', ''),
            'created_at':     o.created_at.strftime('%d.%m.%Y %H:%M'),
            'items': [{
                'name': i.product.name,
                'qty':  i.qty,
                'price': float(i.price),
            } for i in o.items.all()],
        } for o in orders]
        return Response(data)


class AdminOrderStatusView(APIView):
    """Actualizare status comandă."""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response(status=404)
        new_status = request.data.get('status')
        if new_status not in ['pending','confirmed','shipped','delivered','cancelled']:
            return Response({'error': 'Status invalid'}, status=400)
        order.status = new_status
        order.save()
        return Response({'success': True, 'status': order.status})
