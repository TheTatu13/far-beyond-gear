import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from catalog.models import Brand, Artist, Product

def restore_images():
    media_dir = os.path.join(os.path.dirname(__file__), 'media')
    
    # 1. Restore Brands
    brands_heroes_dir = os.path.join(media_dir, 'brands', 'heroes')
    brands_logos_dir = os.path.join(media_dir, 'brands', 'logos')
    
    print("--- Restoring Brands ---")
    for brand in Brand.objects.all():
        name_lower = brand.name.lower().replace(" ", "").replace("-", "")
        # Hero Image Match
        if os.path.exists(brands_heroes_dir):
            for file in os.listdir(brands_heroes_dir):
                if file.lower().startswith(name_lower[:4]):
                    brand.hero_image = f"brands/heroes/{file}"
                    brand.save()
                    print(f"Matched {brand.name} hero to {file}")
                    break
                    
        # Logo Match
        if os.path.exists(brands_logos_dir):
            for file in os.listdir(brands_logos_dir):
                if file.lower().startswith(name_lower[:4]):
                    brand.logo = f"brands/logos/{file}"
                    brand.save()
                    print(f"Matched {brand.name} logo to {file}")
                    break

    # 2. Restore Artists
    artists_heroes_dir = os.path.join(media_dir, 'artists', 'heroes')
    artists_dir = os.path.join(media_dir, 'artists')
    
    print("--- Restoring Artists ---")
    for artist in Artist.objects.all():
        # First name or last name
        names = artist.name.lower().split()
        if not names: continue
        
        # Hero Image Match
        if os.path.exists(artists_heroes_dir):
            for file in os.listdir(artists_heroes_dir):
                if any(n in file.lower() for n in names):
                    artist.hero_image = f"artists/heroes/{file}"
                    artist.save()
                    print(f"Matched {artist.name} hero to {file}")
                    break
                    
        # Normal Image Match
        if os.path.exists(artists_dir):
            for file in os.listdir(artists_dir):
                if os.path.isfile(os.path.join(artists_dir, file)) and any(n in file.lower() for n in names):
                    artist.image = f"artists/{file}"
                    artist.save()
                    print(f"Matched {artist.name} image to {file}")
                    break

    # 3. Restore Products
    products_dir = os.path.join(media_dir, 'products')
    
    print("--- Restoring Products ---")
    if os.path.exists(products_dir):
        for product in Product.objects.all():
            name_parts = product.name.lower().split()
            # Try to match the first long word in product name (like 'Mockingbird' or 'Warlock')
            key_word = next((w for w in name_parts if len(w) > 3 and w not in ['extreme', 'bass', 'with']), name_parts[0])
            
            for file in os.listdir(products_dir):
                if key_word in file.lower() or file.lower().startswith(product.name.lower()[:6].replace(" ", "")):
                    product.image = f"products/{file}"
                    product.save()
                    print(f"Matched {product.name} to {file}")
                    break

if __name__ == "__main__":
    restore_images()
    print("Done.")
