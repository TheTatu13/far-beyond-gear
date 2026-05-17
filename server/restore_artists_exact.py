import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from catalog.models import Artist

def exact_artist_mapping():
    # Mapping Format: Artist Name -> (hero_image_file, normal_image_file)
    mapping = {
        "Slash": (
            "Slash-November-Rain-Guns-N-Roses-1991-Far-Out-Magazine-F-.jpg", 
            "Slash_live_in_London_2022_Cropped_-_upright.jpg"
        ),
        "Chuck Schuldiner": (
            "Chuck-Schuldiner2.jpg", 
            "Chuck-Schuldiner2.jpg"
        ),
        "Kerry King": (
            "Slayer_München_2016_3_von_6.jpg", 
            "Slayer_München_2016_3_von_6.jpg"
        ),
        "Dimebag Darrell": (
            "3bf5b8ec-ede7-4e66-9e4e-1baee657c6e2.jpg", 
            "dime.jpg"
        ),
        "Max Cavalera": (
            "cavalera.jpg", 
            "gettyimages-467330087-1024x1024.jpg"
        ),
    }

    print("--- Applying Exact Artist Mappings ---")
    for a_name, (hero_file, img_file) in mapping.items():
        try:
            # Găsim la fix artistul
            artist = Artist.objects.get(name__icontains=a_name)
            artist.hero_image = f"artists/heroes/{hero_file}"
            artist.image = f"artists/{img_file}"
            artist.save()
            print(f"Successfully mapped {artist.name}")
        except Artist.DoesNotExist:
            print(f"Warning: Could not find artist for '{a_name}'")
        except Artist.MultipleObjectsReturned:
            print(f"Warning: Multiple artists found for '{a_name}'")

if __name__ == "__main__":
    exact_artist_mapping()
    print("Done.")
