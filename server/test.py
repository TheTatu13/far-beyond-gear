from catalog.models import Achievement
import json
with open('achievements.json', 'w') as f: json.dump(list(Achievement.objects.values('name', 'description', 'discount_percentage')), f)
