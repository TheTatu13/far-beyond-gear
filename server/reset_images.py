import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from catalog.models import Product, Brand, Artist

def reset_images():
    print("Setting image paths to placeholder.jpg...")

    products = Product.objects.all()
    for p in products:
        p.image = "placeholder.jpg"
        p.save()

    brands = Brand.objects.all()
    for b in brands:
        b.logo = "placeholder.jpg"
        b.hero_image = "placeholder.jpg"
        b.save()

    artists = Artist.objects.all()
    for a in artists:
        a.image = "placeholder.jpg"
        a.hero_image = "placeholder.jpg"
        a.save()

if __name__ == "__main__":
    reset_images()
    print("Done.")
