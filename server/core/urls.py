"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.views.static import serve
from django.urls import re_path


from catalog.views import (
    ping, BrandViewSet, CategoryViewSet, ProductViewSet, UserProfileViewSet,
    RegisterView, AchievementViewSet, CheckoutView, ArtistViewSet, OrderViewSet,
    LogoutView, ProductReviewView, GrantAchievementView, TrackActivityView, SiteStatsView,
    CustomTokenObtainPairView,
    AdminOverviewView, AdminUserListView, AdminUserDetailView,
    AdminReviewListView, AdminReviewDetailView,
    AdminOrderListView, AdminOrderStatusView,
)

# routerul REST principal
router = DefaultRouter()
router.register(r'brands', BrandViewSet)
router.register(r'artists', ArtistViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'profiles', UserProfileViewSet)
router.register(r'achievements', AchievementViewSet)
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/ping/', ping),          # verificare rapidă API
    path('api/register/', RegisterView.as_view(), name='auth_register'),
    path('api/logout/', LogoutView.as_view(), name='auth_logout'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/', include(router.urls)), # conectăm toate endpoint-urile REST
    path('api/checkout/', CheckoutView.as_view(), name='api_checkout'),
    path('api/products/<int:pk>/reviews/', ProductReviewView.as_view(), name='product-reviews'),
    path('api/achievements/grant/', GrantAchievementView.as_view(), name='achievement-grant'),
    path('api/track/', TrackActivityView.as_view(), name='track-activity'),
    path('api/stats/', SiteStatsView.as_view(), name='site-stats'),

    # ── Admin Panel API ───────────────────────────────────────────────────────
    path('api/admin/overview/',         AdminOverviewView.as_view(),    name='admin-overview'),
    path('api/admin/users/',            AdminUserListView.as_view(),    name='admin-users'),
    path('api/admin/users/<int:pk>/',   AdminUserDetailView.as_view(),  name='admin-user-detail'),
    path('api/admin/reviews/',          AdminReviewListView.as_view(),  name='admin-reviews'),
    path('api/admin/reviews/<int:pk>/', AdminReviewDetailView.as_view(),name='admin-review-detail'),
    path('api/admin/orders/',           AdminOrderListView.as_view(),   name='admin-orders'),
    path('api/admin/orders/<int:pk>/status/', AdminOrderStatusView.as_view(), name='admin-order-status'),
]

if settings.DEBUG:
    urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
