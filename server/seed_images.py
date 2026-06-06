import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from catalog.models import Product, Brand, Artist, Achievement

def seed_images():
    print("Seeding missing images for products, brands, artists, achievements...")

    # Placeholder logic - using a generic placeholder for everything
    # We use a URL so it works regardless of local media setup during dev
    placeholder_url = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800"
    
    products = Product.objects.filter(image__isnull=True) | Product.objects.filter(image__exact='')
    for p in products:
        p.image = placeholder_url
        p.save()
    print(f"Updated {products.count()} products.")

    brands = Brand.objects.all()
    for b in brands:
        changed = False
        if not b.logo:
            b.logo = placeholder_url
            changed = True
        if not b.hero_image:
            b.hero_image = placeholder_url
            changed = True
        if changed:
            b.save()
    print("Updated brands.")

    artists = Artist.objects.all()
    for a in artists:
        changed = False
        if not a.image:
            a.image = placeholder_url
            changed = True
        if not a.hero_image:
            a.hero_image = placeholder_url
            changed = True
        if changed:
            a.save()
    print("Updated artists.")

if __name__ == "__main__":
    seed_images()
    print("Done.")
