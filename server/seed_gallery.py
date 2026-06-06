import os
import django
from urllib.request import urlopen, Request
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from catalog.models import Product, ProductImage

def seed_gallery(product_id):
    try:
        product = Product.objects.get(id=product_id)
        print(f"Adăugăm imagini pentru: {product.name}")
        
        # Stergem imaginile vechi daca exista (pentru test)
        ProductImage.objects.filter(product=product).delete()
        
        # Reliable placeholders
        urls = [
            "https://picsum.photos/id/1/800/600",
            "https://picsum.photos/id/10/800/600",
            "https://picsum.photos/id/20/800/600",
        ]
        
        for i, url in enumerate(urls):
            try:
                # Add User-Agent to avoid blocks
                req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urlopen(req) as response:
                    img_name = f"gallery_{product_id}_{i}.jpg"
                    p_img = ProductImage(product=product, alt_text=f"Detaliu {i+1}")
                    p_img.image.save(img_name, ContentFile(response.read()), save=True)
                    print(f"Salvată imaginea {i+1}")
            except Exception as e:
                print(f"Eroare la descărcare {url}: {e}")
                
    except Product.DoesNotExist:
        print(f"Produsul {product_id} nu a fost găsit.")

if __name__ == "__main__":
    seed_gallery(139)
