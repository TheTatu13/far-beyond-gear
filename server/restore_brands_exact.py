import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from catalog.models import Brand

def exact_brand_mapping():
    # Mapping Format: Brand Name -> (hero_image_file, logo_file)
    mapping = {
        "BC Rich": ("BC_Rich_Guitars_Logo.png", "BC_Rich_Guitars_Logo.png"),
        "Dunlop": ("dunlop.jpg", "dunlop.jpg"),
        "Ernie Ball": ("eb2.jpg", "eb1.jpg"),
        "Elixir": ("elixir.png", "elixir.png"),
        "ENGL": ("engl2.jpg", "engl1.jpg"),
        "Fender": ("fender3684.jpg", "fender3684.jpg"),
        "Gibson": ("gibson.jpg", "gibson.jpg"),
        "Jackson": ("stickers-jackson-guitar.jpg", "jackson-guitars-vector-logo.png"),
        "Mesa Boogie": ("mesa2.jpg", "mesa.jpg"),
        "Marshall": ("mrsh1.jpg", "mrsh1.jpg"),
        "MXR": ("mxr.jpg", "mxr.jpg"),
        "Orange": ("org2.jpg", "orangeampsb.jpg"),
        "Peavey": ("peavey1.jpg", "peavey1.jpg"),
        "Solar": ("solar2.png", "Logo_Solar_white.png"),
        "Washburn": ("wash.jpg", "wash.jpg"),
    }

    print("--- Applying Exact Brand Mappings ---")
    for b_name, (hero_file, logo_file) in mapping.items():
        try:
            brand = Brand.objects.get(name__icontains=b_name.split()[0])
            brand.hero_image = f"brands/heroes/{hero_file}"
            brand.logo = f"brands/logos/{logo_file}"
            brand.save()
            print(f"Successfully mapped {brand.name}")
        except Brand.DoesNotExist:
            print(f"Warning: Could not find brand for '{b_name}'")
        except Brand.MultipleObjectsReturned:
            print(f"Warning: Multiple brands found for '{b_name}'")

if __name__ == "__main__":
    exact_brand_mapping()
    print("Done.")
