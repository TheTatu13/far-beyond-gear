"""
generate_activity.py
Generează activitate realistă pe site pentru demonstrație statistici licență.
Rulează cu: python generate_activity.py
"""
import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

import random
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import User
from catalog.models import Product, SiteActivity

# ── Date de intrare ───────────────────────────────────────────────────────────
products = list(Product.objects.all())
users    = list(User.objects.all())
now      = timezone.now()

PAGES = [
    "/", "/products", "/brands", "/categories", "/artists",
    "/cart", "/profile", "/about", "/blog", "/faq",
    "/guitar-guide", "/products?category=guitare",
    "/products?category=amplificatoare", "/products?category=pedale",
]

SEARCHES = [
    "marshall", "gibson", "fender", "dean ml", "dimebag",
    "pedale distorsie", "amplificator tube", "chitara electrica",
    "jackson", "solar guitars", "overdrive", "reverb",
    "metallica gear", "floyd rose", "emg pickup",
    "studio recording", "interface audio", "tobe", "bass",
]

IPS = [
    "89.122.45.10", "86.125.33.91", "79.113.22.54", "188.26.14.77",
    "5.2.139.200", "109.166.20.11", "82.79.1.55", "37.221.10.30",
    "91.199.87.44", "185.220.101.12", "46.97.63.201", "94.177.245.3",
]

def rand_session():
    return "ses_" + "".join(random.choices("abcdefghijklmnopqrstuvwxyz0123456789", k=16))

def rand_time(days_back_max=30):
    delta = timedelta(
        days=random.randint(0, days_back_max),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59),
        seconds=random.randint(0, 59),
    )
    return now - delta

# ── Generator de sesiuni realiste ─────────────────────────────────────────────
def make_session(user=None, ip=None, days_back=None):
    """
    Simulează o sesiune: page_view → product_views → opțional search/cart/purchase
    """
    session  = rand_session()
    ip       = ip or random.choice(IPS)
    db       = days_back if days_back is not None else random.randint(0, 29)
    base_t   = now - timedelta(days=db, hours=random.randint(0, 23), minutes=random.randint(0, 59))
    records  = []
    t_offset = 0

    def ev(event, page="", product=None, query="", extra=None, delay_min=10, delay_max=120):
        nonlocal t_offset
        t_offset += random.randint(delay_min, delay_max)
        records.append(SiteActivity(
            event=event,
            user=user,
            session=session,
            ip=ip,
            page=page,
            product=product,
            query=query,
            extra=extra or {},
            created_at=base_t + timedelta(seconds=t_offset),
        ))

    # 1. Aterizare pe o pagina oarecare
    landing = random.choice(PAGES)
    ev("page_view", page=landing)

    # 2. Navighează 1-4 pagini suplimentare
    for _ in range(random.randint(1, 4)):
        ev("page_view", page=random.choice(PAGES))

    # 3. Poate cauta ceva (50% sanse)
    if random.random() < 0.50:
        q = random.choice(SEARCHES)
        ev("search", page="/products", query=q)
        ev("page_view", page=f"/products?search={q.replace(' ','+')}")

    # 4. Vizualizeaza 1-5 produse
    viewed = random.sample(products, k=min(random.randint(1, 5), len(products)))
    for p in viewed:
        ev("product_view", page=f"/product/{p.id}", product=p, extra={"name": p.name})

    # 5. Adauga in cos (40% din produsele vizualizate)
    added = [p for p in viewed if random.random() < 0.40]
    for p in added:
        ev("add_to_cart", page=f"/product/{p.id}", product=p,
           extra={"name": p.name, "price": str(p.price)})

    # 6. Cumpara (60% din sesiunile cu cos, dar doar daca e user logat)
    if added and user and random.random() < 0.60:
        order_no = "FBG-2026-" + "".join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", k=6))
        total    = sum(float(p.price) for p in added)
        ev("purchase", page="/checkout", extra={"order_number": order_no, "total": str(round(total, 2))})

    return records

# ── Generare bulk ─────────────────────────────────────────────────────────────
print("Generez activitate...")
all_records = []

# A) Sesiuni autentificate (useri reali) — 120 sesiuni distribuite pe 30 zile
for u in users:
    n_sessions = random.randint(3, 10)
    for _ in range(n_sessions):
        all_records.extend(make_session(user=u, days_back=random.randint(0, 29)))

# B) Sesiuni anonime — 200 sesiuni
for _ in range(200):
    all_records.extend(make_session(user=None))

# C) Spike de trafic în weekend-uri (zilele 5, 6, 12, 13, 19, 20, 26, 27)
spike_days = [5, 6, 12, 13, 19, 20, 26, 27]
for day in spike_days:
    for _ in range(random.randint(8, 18)):
        u = random.choice(users + [None, None])  # mai multi anonimi
        all_records.extend(make_session(user=u, days_back=day))

# D) Înregistrări noi (15 useri noi în 30 zile)
for i in range(15):
    day = random.randint(0, 29)
    base_t = now - timedelta(days=day, hours=random.randint(8, 22))
    ip = random.choice(IPS)
    ses = rand_session()
    all_records.append(SiteActivity(
        event="register", user=None, session=ses, ip=ip,
        page="/register", extra={},
        created_at=base_t,
    ))

# E) Login-uri (useri existenți)
for _ in range(80):
    u = random.choice(users)
    day = random.randint(0, 29)
    base_t = now - timedelta(days=day, hours=random.randint(7, 23))
    all_records.append(SiteActivity(
        event="login", user=u, session=rand_session(), ip=random.choice(IPS),
        page="/login", extra={},
        created_at=base_t,
    ))

# ── Salvare în BD ─────────────────────────────────────────────────────────────
random.shuffle(all_records)
SiteActivity.objects.bulk_create(all_records, batch_size=500)

print(f"\nInserate {len(all_records)} evenimente.")

# ── Sumar ─────────────────────────────────────────────────────────────────────
from django.db.models import Count
print("\nDistributie evenimente:")
for row in SiteActivity.objects.values("event").annotate(n=Count("id")).order_by("-n"):
    print(f"  {row['event']:15} {row['n']:>5}")

print(f"\nTotal evenimente în BD: {SiteActivity.objects.count()}")
