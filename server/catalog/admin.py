from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
from django.db.models import Avg, Count
from django.shortcuts import render
from .models import (
    Brand, Category, Product, Artist, ProductImage,
    UserProfile, Review, Order, OrderItem, Achievement, UserAchievement,
    SiteActivity,
)

# ── Titlu admin site ─────────────────────────────────────────────────────────
admin.site.site_header  = "Far Beyond Gear — Admin"
admin.site.site_title   = "FBG Admin"
admin.site.index_title  = "Panou de Administrare"


# ═══════════════════════════════════════════════════════════════════════════════
# PRODUSE
# ═══════════════════════════════════════════════════════════════════════════════

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'alt_text')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines       = [ProductImageInline]
    list_display  = ("id", "name", "brand", "price_display", "stock_display", "review_count", "avg_rating")
    list_display_links = ("id", "name")
    list_editable = ("price", "stock") if False else ()   # editat din form, nu inline
    search_fields = ("name", "brand__name")
    list_filter   = ("brand", "categories")
    filter_horizontal = ('categories',)
    ordering      = ("-id",)
    list_per_page = 30

    fieldsets = (
        ("Informații Produs", {
            "fields": ("name", "brand", "categories", "image")
        }),
        ("Preț & Stoc", {
            "fields": ("price", "stock"),
            "classes": ("wide",),
        }),
        ("Descriere & Specificații", {
            "fields": ("description", "specifications"),
            "classes": ("collapse",),
        }),
    )

    actions = ["set_stock_zero", "set_stock_ten"]

    def price_display(self, obj):
        return format_html("<b>{} €</b>", obj.price)
    price_display.short_description = "Preț"

    def stock_display(self, obj):
        color = "green" if obj.stock > 5 else ("orange" if obj.stock > 0 else "red")
        return format_html('<span style="color:{};font-weight:bold">{}</span>', color, obj.stock)
    stock_display.short_description = "Stoc"

    def review_count(self, obj):
        return obj.reviews.count()
    review_count.short_description = "Review-uri"

    def avg_rating(self, obj):
        avg = obj.reviews.aggregate(a=Avg('rating'))['a']
        return f"{avg:.1f} ★" if avg else "—"
    avg_rating.short_description = "Rating Mediu"

    @admin.action(description="Setează stoc = 0 (Epuizat)")
    def set_stock_zero(self, request, queryset):
        updated = queryset.update(stock=0)
        self.message_user(request, f"{updated} produse marcate ca epuizate.")

    @admin.action(description="Setează stoc = 10")
    def set_stock_ten(self, request, queryset):
        updated = queryset.update(stock=10)
        self.message_user(request, f"Stoc setat la 10 pentru {updated} produse.")


# ═══════════════════════════════════════════════════════════════════════════════
# UTILIZATORI
# ═══════════════════════════════════════════════════════════════════════════════

class UserProfileInline(admin.StackedInline):
    model  = UserProfile
    can_delete = False
    verbose_name_plural = "Profil & Gamification"
    fields = ("level", "xp", "balance", "title")
    extra  = 0


class CustomUserAdmin(BaseUserAdmin):
    inlines     = [UserProfileInline]
    list_display = ("id", "username", "email", "first_name", "last_name",
                    "is_staff", "is_active", "date_joined", "level_display")
    list_filter  = ("is_staff", "is_superuser", "is_active")
    search_fields = ("username", "email", "first_name", "last_name")
    ordering     = ("-date_joined",)
    list_per_page = 30
    actions      = ["deactivate_users", "activate_users"]

    def level_display(self, obj):
        try:
            return f"Lv {obj.profile.level} ({obj.profile.xp} XP)"
        except Exception:
            return "—"
    level_display.short_description = "Nivel"

    @admin.action(description="Dezactivează utilizatorii selectați")
    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f"{queryset.count()} utilizatori dezactivați.")

    @admin.action(description="Activează utilizatorii selectați")
    def activate_users(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f"{queryset.count()} utilizatori activați.")


# Înlocuim UserAdmin-ul default cu cel custom
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


# ═══════════════════════════════════════════════════════════════════════════════
# REVIEW-URI
# ═══════════════════════════════════════════════════════════════════════════════

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display  = ("id", "product_link", "user", "rating_display", "short_comment", "created_at")
    list_filter   = ("rating", "created_at")
    search_fields = ("product__name", "user__username", "comment")
    ordering      = ("-created_at",)
    list_per_page = 40
    actions       = ["delete_selected"]  # acțiunea default de ștergere e activă

    def product_link(self, obj):
        return format_html('<a href="/admin/catalog/product/{}/change/">{}</a>', obj.product.id, obj.product.name)
    product_link.short_description = "Produs"

    def rating_display(self, obj):
        stars = "★" * obj.rating + "☆" * (5 - obj.rating)
        color = "#f0c040" if obj.rating >= 4 else ("#ff8800" if obj.rating == 3 else "#ef4444")
        return format_html('<span style="color:{}">{}</span>', color, stars)
    rating_display.short_description = "Rating"

    def short_comment(self, obj):
        return obj.comment[:80] + "…" if len(obj.comment) > 80 else obj.comment
    short_comment.short_description = "Comentariu"


# ═══════════════════════════════════════════════════════════════════════════════
# COMENZI
# ═══════════════════════════════════════════════════════════════════════════════

class OrderItemInline(admin.TabularInline):
    model      = OrderItem
    extra      = 0
    readonly_fields = ("product", "qty", "price")
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines      = [OrderItemInline]
    list_display = ("order_number", "customer_name", "email", "total_display",
                    "payment_method", "status_badge", "awb_number", "created_at")
    list_filter  = ("status", "payment_method", "created_at")
    search_fields = ("order_number", "customer_name", "email", "awb_number")
    ordering     = ("-created_at",)
    readonly_fields = ("order_number", "created_at", "awb_number")
    list_per_page = 30
    actions = ["mark_shipped", "mark_delivered"]

    STATUS_COLORS = {
        'pending': '#f0c040', 'confirmed': '#66c0f4',
        'shipped': '#34d399', 'delivered': '#a78bfa', 'cancelled': '#ef4444',
    }

    def total_display(self, obj):
        return format_html("<b>{} €</b>", obj.total)
    total_display.short_description = "Total"

    def status_badge(self, obj):
        color = self.STATUS_COLORS.get(obj.status, '#888')
        return format_html(
            '<span style="background:{};color:#000;padding:2px 10px;border-radius:4px;font-size:0.75rem;font-weight:700">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = "Status"

    @admin.action(description="📦 Marchează ca Expediat + trimite email AWB")
    def mark_shipped(self, request, queryset):
        from django.core.mail import send_mail
        sent = 0
        for order in queryset.exclude(status__in=['shipped', 'delivered', 'cancelled']):
            order.status = 'shipped'
            order.save()
            try:
                send_mail(
                    subject=f"Comanda {order.order_number} a fost expediată! AWB: {order.awb_number}",
                    message=(
                        f"Buna, {order.customer_name}!\n\n"
                        f"Comanda ta {order.order_number} a fost expediata de {order.courier}.\n"
                        f"AWB tracking: {order.awb_number}\n\n"
                        f"Far Beyond Gear"
                    ),
                    from_email=None,
                    recipient_list=[order.email],
                    fail_silently=True,
                )
                sent += 1
            except Exception as e:
                pass
        self.message_user(request, f"{queryset.count()} comenzi expediate, {sent} emailuri trimise.")

    @admin.action(description="✅ Marchează ca Livrat")
    def mark_delivered(self, request, queryset):
        updated = queryset.update(status='delivered')
        self.message_user(request, f"{updated} comenzi marcate ca livrate.")


# ═══════════════════════════════════════════════════════════════════════════════
# BRANDURI & CATEGORII
# ═══════════════════════════════════════════════════════════════════════════════

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display  = ("id", "name", "country", "website_url", "product_count")
    search_fields = ("name", "country")
    prepopulated_fields = {'slug': ('name',)}
    list_per_page = 30

    def product_count(self, obj):
        return obj.product_set.count()
    product_count.short_description = "Produse"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ("id", "name", "product_count")
    search_fields = ("name",)

    def product_count(self, obj):
        return obj.product_set.count()
    product_count.short_description = "Produse"


# ═══════════════════════════════════════════════════════════════════════════════
# ARTIȘTI & IMAGINI
# ═══════════════════════════════════════════════════════════════════════════════

@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display  = ("id", "name", "role")
    list_filter   = ("brands",)
    search_fields = ("name", "role", "bio")
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('products', 'brands')


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "thumbnail", "created_at")
    list_filter  = ("product",)

    def thumbnail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:40px;border-radius:4px">', obj.image.url)
        return "—"
    thumbnail.short_description = "Preview"


# ═══════════════════════════════════════════════════════════════════════════════
# ACHIEVEMENTS
# ═══════════════════════════════════════════════════════════════════════════════

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display  = ("id", "name", "discount_percentage", "unlocked_count")
    search_fields = ("name",)

    def unlocked_count(self, obj):
        return obj.userachievement_set.count()
    unlocked_count.short_description = "Deblocate"


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display  = ("id", "user_profile", "achievement", "date_unlocked", "is_redeemed")
    list_filter   = ("is_redeemed", "achievement")
    search_fields = ("user_profile__user__username", "achievement__name")


# ═══════════════════════════════════════════════════════════════════════════════
# ANALYTICS — Activitate site
# ═══════════════════════════════════════════════════════════════════════════════

@admin.register(SiteActivity)
class SiteActivityAdmin(admin.ModelAdmin):
    list_display  = ("id", "event_badge", "user", "ip", "short_page", "product", "short_query", "created_at")
    list_filter   = ("event", "created_at")
    search_fields = ("user__username", "ip", "page", "query")
    ordering      = ("-created_at",)
    list_per_page = 50
    readonly_fields = ("event", "user", "session", "ip", "page", "product", "query", "extra", "created_at")

    EVENT_COLORS = {
        'page_view': '#66c0f4', 'product_view': '#f0c040', 'search': '#34d399',
        'add_to_cart': '#a78bfa', 'purchase': '#fb923c', 'register': '#f472b6', 'login': '#22d3ee',
    }

    def event_badge(self, obj):
        color = self.EVENT_COLORS.get(obj.event, '#888')
        return format_html(
            '<span style="background:{};color:#000;padding:2px 8px;border-radius:4px;font-size:0.75rem;font-weight:700">{}</span>',
            color, obj.event
        )
    event_badge.short_description = "Eveniment"

    def short_page(self, obj):
        p = obj.page or "—"
        return p[:50] + "…" if len(p) > 50 else p
    short_page.short_description = "Pagină"

    def short_query(self, obj):
        return obj.query or "—"
    short_query.short_description = "Query"

    def has_add_permission(self, request): return False
    def has_change_permission(self, request, obj=None): return False


# ─── Dashboard statistici ─────────────────────────────────────────────────────

class SiteActivityProxy(SiteActivity):
    class Meta:
        proxy = True
        verbose_name = "📊 Dashboard Statistici"
        verbose_name_plural = "📊 Dashboard Statistici"


@admin.register(SiteActivityProxy)
class StatsDashboardAdmin(admin.ModelAdmin):
    change_list_template = "admin/catalog/stats_dashboard.html"

    def changelist_view(self, request, extra_context=None):
        from django.utils import timezone
        import datetime
        from django.db.models.functions import TruncDate

        days = int(request.GET.get('days', 30))
        since    = timezone.now() - datetime.timedelta(days=days)
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
        pv = totals['product_view']
        totals['conversion_rate'] = round(totals['purchase'] / pv * 100, 1) if pv else 0

        ctx = {
            **self.admin_site.each_context(request),
            'title': 'Dashboard Statistici',
            'period_days': days,
            'totals': totals,
            'daily_labels': [str(d['day']) for d in daily],
            'daily_data': [d['count'] for d in daily],
            'events_labels': [d['event'] for d in events_breakdown],
            'events_data': [d['count'] for d in events_breakdown],
            'top_products': top_products,
            'top_searches': top_searches,
        }
        return render(request, 'admin/catalog/stats_dashboard.html', ctx)

    def has_add_permission(self, request): return False
    def has_change_permission(self, request, obj=None): return False
    def has_delete_permission(self, request, obj=None): return False
