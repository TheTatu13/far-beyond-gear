# Far Beyond Gear – Platformă E-Commerce pentru Echipamente Muzicale Profesionale

> **Lucrare de Licență**  
> Specializarea: Informatică / Calculatoare și Tehnologia Informației  
> Aplicație web full-stack cu arhitectură REST API, autentificare JWT și sistem de gamification

---

## Cuprins

1. [Descriere și Obiective](#1-descriere-și-obiective)
2. [Arhitectura Aplicației](#2-arhitectura-aplicației)
3. [Tehnologii Utilizate](#3-tehnologii-utilizate)
4. [Structura Proiectului](#4-structura-proiectului)
5. [Modelul de Date](#5-modelul-de-date)
6. [API REST](#6-api-rest)
7. [Autentificare JWT](#7-autentificare-jwt)
8. [Sistem de Gamification](#8-sistem-de-gamification)
9. [Panou de Administrare](#9-panou-de-administrare)
10. [Securitate](#10-securitate)
11. [Testare Automată](#11-testare-automată)
12. [Instalare și Configurare](#12-instalare-și-configurare)
13. [Deployment](#13-deployment)
14. [Decizii Arhitecturale](#14-decizii-arhitecturale)

---

## 1. Descriere și Obiective

**Far Beyond Gear** este o aplicație web de tip e-commerce specializată în echipamente muzicale profesionale (instrumente, amplificatoare, pedale de efect, accesorii). Proiectul a fost conceput ca o demonstrație practică a principiilor ingineriei software moderne, integrând concepte din cursurile de baze de date, rețele și proiectare software.

### Obiective tehnice principale

- Proiectarea și implementarea unui **API REST** complet cu Django REST Framework, urmând principiile arhitecturii REST (resurse, reprezentări, metode HTTP standard)
- Construirea unui **Single Page Application (SPA)** cu React 18, cu navigare client-side și gestionare de stare fără librării externe de tip Redux
- Implementarea **autentificării stateless** prin JSON Web Tokens, eliminând dependența de sesiuni server-side
- Modelarea **relațiilor complexe** între entități (ManyToMany, ForeignKey, OneToOne) și gestionarea lor prin Django ORM
- Aplicarea unui **sistem de permisiuni pe roluri** (utilizator standard vs. administrator) atât la nivel de API, cât și la nivel de interfață
- Implementarea **validării server-side** a tranzacțiilor pentru prevenirea manipulării prețurilor din client
- Integrarea unui **sistem de gamification** (puncte de experiență, niveluri, realizări deblocabile) ca element de diferențiere al platformei

---

## 2. Arhitectura Aplicației

Aplicația urmează o arhitectură **client-server cu separare completă** a responsabilităților, comunicarea realizându-se exclusiv prin API REST (JSON over HTTP).

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│                                                          │
│   React 18 SPA (Vite)                                   │
│   ├── React Router  (navigare client-side)              │
│   ├── AuthContext   (gestionare stare autentificare)    │
│   ├── Axios         (comunicare cu API-ul REST)         │
│   └── React Three Fiber  (scenă 3D interactivă - WebGL) │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTP / JSON
                  │ Toate cererile la /api/*
┌─────────────────▼───────────────────────────────────────┐
│              Django Backend (Python)                     │
│                                                          │
│   Django REST Framework                                  │
│   ├── ViewSets     (generare automată CRUD)             │
│   ├── Serializers  (validare + transformare JSON)       │
│   ├── FilterBackend (filtrare, căutare, ordonare)       │
│   ├── SimpleJWT    (emitere și verificare token-uri)    │
│   └── Permissions  (IsAuthenticated, IsAdminUser)       │
│                                                          │
│   Django ORM → SQLite (development)                     │
└─────────────────────────────────────────────────────────┘
```

### Fluxul unei tranzacții tipice

1. Utilizatorul selectează produse și inițiază comanda din interfața React
2. Frontend-ul trimite `POST /api/checkout/` cu lista de produse și token-ul JWT în header
3. Backend-ul verifică autenticitatea token-ului, validează stocul și recalculează prețurile din baza de date (nu din cerere)
4. La validare reușită, comanda e salvată, stocul e decrementat și se acordă XP utilizatorului
5. Backend-ul returnează numărul de comandă; frontend-ul afișează confirmarea

---

## 3. Tehnologii Utilizate

### Backend

| Tehnologie | Versiune | Rol în proiect |
|---|---|---|
| Python | 3.11+ | Limbajul de implementare |
| Django | 5.2 | Framework web, ORM, sistem de migrații |
| Django REST Framework | 3.x | Construirea API-ului REST |
| djangorestframework-simplejwt | 5.x | Emitere și validare token-uri JWT |
| django-filter | 24.x | Filtrare avansată pe query string |
| django-cors-headers | 4.x | Gestionare politici CORS |
| Pillow | 10.x | Procesare și stocare imagini produse |
| Whitenoise | 6.x | Servire fișiere statice în producție |
| Gunicorn | 23.x | Server WSGI pentru producție |
| SQLite | built-in | Baza de date relațională (development) |

### Frontend

| Tehnologie | Versiune | Rol în proiect |
|---|---|---|
| React | 18.x | Biblioteca UI, componente, hooks |
| Vite | 5.x | Build tool, server de dezvoltare cu HMR |
| React Router | 6.x | Navigare SPA, rute protejate |
| React Three Fiber | 8.x | Randare 3D declarativă (Three.js în React) |
| Three.js | 0.x | Motor grafic WebGL |
| Axios | 1.x | Client HTTP cu interceptori pentru JWT |
| Bootstrap | 5.x | Sistem de grid, componente de bază |

---

## 4. Structura Proiectului

```
far-beyond-gear/
│
├── client/                          # Frontend React + Vite
│   ├── src/
│   │   ├── pages/                   # Componentele de pagină
│   │   │   ├── Home.jsx             # Pagina principală cu hero 3D
│   │   │   ├── Products.jsx         # Catalog produse cu filtrare
│   │   │   ├── ProductDetails.jsx   # Detalii produs + recenzii
│   │   │   ├── Cart.jsx             # Coș de cumpărături
│   │   │   ├── Checkout.jsx         # Finalizare comandă + cupoane
│   │   │   ├── UserProfile.jsx      # Profil utilizator + gamification
│   │   │   ├── AdminPanel.jsx       # Panou de administrare custom
│   │   │   ├── GearConstellation.jsx # Scenă 3D interactivă (hero)
│   │   │   ├── Login.jsx / Register.jsx
│   │   │   ├── Brands.jsx / BrandDetails.jsx
│   │   │   ├── ArtistDetails.jsx
│   │   │   └── Faq.jsx              # Întrebări frecvente + formular suport
│   │   │
│   │   ├── layout/
│   │   │   └── Layout.jsx           # Navbar adaptiv + Footer
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Stare globală autentificare (JWT)
│   │   │
│   │   ├── lib/
│   │   │   ├── api.js               # Funcții Axios pentru fiecare endpoint
│   │   │   ├── cart.js              # Persistență coș (localStorage + events)
│   │   │   └── analytics.js         # Tracking activitate utilizator
│   │   │
│   │   └── assets/
│   │       └── theme.css            # Variabile CSS, tema vizuală globală
│   │
│   ├── vite.config.js               # Proxy /api → localhost:8000 (dev)
│   └── package.json
│
├── server/                          # Backend Django
│   ├── catalog/                     # Aplicația principală
│   │   ├── models.py                # Modele de date (Product, Brand, Order...)
│   │   ├── serializers.py           # Serializatoare DRF cu validare
│   │   ├── views.py                 # ViewSets + Views custom + Admin API
│   │   ├── admin.py                 # Configurare Django Admin
│   │   ├── tests.py                 # Suite de teste automate
│   │   ├── migrations/              # Istoricul migrațiilor bazei de date
│   │   └── templates/emails/
│   │       └── order_confirmation.html  # Șablon email confirmare comandă
│   │
│   ├── core/
│   │   ├── settings.py              # Configurare Django (env-based)
│   │   └── urls.py                  # Rutare URL principală
│   │
│   ├── media/                       # Fișiere uploadate (imagini produse)
│   ├── db.sqlite3                   # Baza de date cu date demonstrative
│   └── requirements.txt             # Dependențe Python
│
├── render.yaml                      # Configurare deployment Render.com
├── start_all.ps1                    # Script pornire automată (Windows)
└── README.md
```

---

## 5. Modelul de Date

### Diagrama relațiilor dintre entități

```
Brand ──────────────────── Product ──────── Category
  │                           │               (M2M)
  │                           │
  └── Artist (M2M) ───────────┘
                              │
                       ProductImage (FK)
                       Review (FK User, FK Product)
                              │
                           Order ──── OrderItem (FK Product)
                              │
                           User ──── UserProfile ──── UserAchievement
                                                            │
                                                       Achievement
```

### Modelele principale

**Product** — entitatea centrală a platformei
```python
class Product(models.Model):
    name           = CharField(max_length=255)
    brand          = ForeignKey(Brand, on_delete=CASCADE)
    categories     = ManyToManyField(Category, blank=True)
    price          = DecimalField(max_digits=10, decimal_places=2)
    stock          = PositiveIntegerField(default=0)
    image          = ImageField(upload_to="products/")
    description    = TextField()
    specifications = TextField()
```

**UserProfile** — extensie One-to-One pentru sistemul de gamification
```python
class UserProfile(models.Model):
    user        = OneToOneField(User, on_delete=CASCADE)
    xp          = PositiveIntegerField(default=0)
    level       = PositiveIntegerField(default=1)
    avatar_seed = CharField(max_length=64)
    # Formula nivel: XP_necesar = nivel_curent x 500
```

**Order** — înregistrarea tranzacțiilor
```python
class Order(models.Model):
    STATUS = [
        ('pending',   'În procesare'),
        ('shipped',   'Expediat'),
        ('delivered', 'Livrat'),
        ('cancelled', 'Anulat'),
    ]
    order_number  = CharField(max_length=20, unique=True)
    customer_name = CharField(max_length=200)
    email         = EmailField()
    total         = DecimalField(max_digits=10, decimal_places=2)
    status        = CharField(choices=STATUS, default='pending')
    awb_number    = CharField(max_length=100, blank=True)
```

---

## 6. API REST

### Resurse publice (fără autentificare)

| Endpoint | Metodă | Descriere |
|---|---|---|
| `/api/products/` | GET | Lista produse cu paginare (10/pagină) |
| `/api/products/?categories=24` | GET | Filtrare după categorie |
| `/api/products/?brand=38&min=500&max=2000` | GET | Filtrare combinată preț + brand |
| `/api/products/?search=gibson` | GET | Căutare în nume și descriere |
| `/api/products/{id}/` | GET | Detalii produs individual |
| `/api/products/{id}/reviews/` | GET | Recenziile unui produs |
| `/api/brands/` | GET | Lista branduri |
| `/api/categories/` | GET | Lista categorii |
| `/api/artists/` | GET | Lista artiști |
| `/api/achievements/` | GET | Toate realizările disponibile |
| `/api/register/` | POST | Înregistrare cont nou |
| `/api/token/` | POST | Autentificare — returnează access + refresh JWT |
| `/api/token/refresh/` | POST | Reînnoire token de acces expirat |

### Resurse autentificate (Bearer Token JWT)

| Endpoint | Metodă | Descriere |
|---|---|---|
| `/api/products/{id}/reviews/` | POST | Adăugare recenzie (utilizator autentificat) |
| `/api/checkout/` | POST | Plasare comandă cu validare server-side |
| `/api/orders/` | GET | Comenzile utilizatorului curent |
| `/api/profiles/me/` | GET | Profilul de gamification al utilizatorului |
| `/api/logout/` | POST | Invalidare refresh token (blacklist) |

### Resurse administrative (is_staff = True)

| Endpoint | Metodă | Descriere |
|---|---|---|
| `/api/admin/overview/` | GET | Statistici agregate platformă |
| `/api/admin/users/` | GET | Lista tuturor utilizatorilor |
| `/api/admin/users/{id}/` | PATCH / DELETE | Modificare / Ștergere utilizator |
| `/api/admin/reviews/` | GET | Toate recenziile pentru moderare |
| `/api/admin/reviews/{id}/` | DELETE | Eliminare recenzie |
| `/api/admin/orders/` | GET | Toate comenzile platformei |
| `/api/admin/orders/{id}/status/` | PATCH | Actualizare status comandă |

### Exemplu răspuns paginat `/api/products/`

```json
{
  "count": 102,
  "next": "http://localhost:8000/api/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 138,
      "name": "ESP LTD EC-1000",
      "brand": 42,
      "brand_name": "ESP",
      "categories": [{"id": 24, "name": "Chitare electrice"}],
      "price": "1299.00",
      "stock": 5,
      "image": "/media/products/product_138.jpg"
    }
  ]
}
```

---

## 7. Autentificare JWT

Autentificarea este implementată prin biblioteca `djangorestframework-simplejwt`, folosind perechea de token-uri access/refresh conform standardului RFC 7519.

### Fluxul de autentificare

```
1. POST /api/token/  { "username": "...", "password": "..." }
           ↓
2. Server returnează:
   {
     "access":   "eyJhbGc...",   ← valid 60 de minute
     "refresh":  "eyJhbGc...",   ← valid 7 zile
     "username": "...",
     "is_staff": false
   }
           ↓
3. Frontend stochează token-urile în localStorage
4. Fiecare cerere autentificată include:
   Authorization: Bearer eyJhbGc...
           ↓
5. La expirarea token-ului de acces, frontend-ul apelează
   POST /api/token/refresh/ cu refresh token-ul pentru a
   obține un nou access token fără reautentificare
           ↓
6. La deconectare: POST /api/logout/ adaugă refresh token-ul
   în blacklist (invalidare permanentă)
```

### Token personalizat cu informații suplimentare

Serializatorul JWT implicit a fost extins pentru a include date utile direct în payload-ul token-ului, eliminând cereri HTTP suplimentare:

```python
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username']     = user.username
        token['email']        = user.email
        token['is_staff']     = user.is_staff
        token['is_superuser'] = user.is_superuser
        return token
```

### Decodare client-side (fără librărie externă)

```javascript
function parseJwt(token) {
    const base64 = token.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    return JSON.parse(atob(base64));
}
// Câmpul is_staff din payload controlează vizibilitatea link-ului Admin
```

---

## 8. Sistem de Gamification

Platforma integrează un sistem de gamification inspirat din platformele de distribuție de jocuri video, cu scopul de a crește implicarea utilizatorilor și de a recompensa fidelitatea.

### Puncte de experiență și niveluri

- La fiecare comandă finalizată, utilizatorul primește XP egal cu valoarea comenzii (în lei)
- Formula de avansare la nivel: `XP_necesar = nivel_curent × 500`
- Calculul și avansarea sunt gestionate automat de metoda `add_xp`:

```python
def add_xp(self, amount):
    self.xp += amount
    while self.xp >= self.level * 500:
        self.xp -= self.level * 500
        self.level += 1
    self.save()
```

### Realizări (Achievements)

Sistemul include 18 realizări deblocate automat la îndeplinirea unor condiții specifice:

| Realizare | Condiție | Beneficiu |
|---|---|---|
| First Blood | Prima comandă plasată | Reducere 5% |
| High Roller | Comandă cu valoare > 1000 lei | Reducere 10% |
| Collector | 5 sau mai multe comenzi | Reducere 8% |
| Reviewer | Prima recenzie publicată | Reducere 3% |
| Social Butterfly | Distribuire produs | Reducere 2% |
| Gear Addict | 10+ produse achiziționate | Reducere 15% |

### Cupoane de reducere

Realizările care includ reduceri pot fi activate la finalizarea unei comenzi. Validarea se face exclusiv server-side: backend-ul verifică că realizarea aparține utilizatorului autentificat și că nu a mai fost utilizată anterior.

---

## 9. Panou de Administrare

Pe lângă interfața de administrare Django (`/admin/`), platforma include un **panou de administrare custom** implementat în React, disponibil la `/admin-panel`, accesibil exclusiv utilizatorilor cu `is_staff = True`.

### Funcționalități

- **Statistici generale** — 7 indicatori cheie în timp real: total produse, comenzi active, utilizatori înregistrați, venit total, produse cu stoc epuizat
- **Gestionare produse** — tabel cu căutare, editare prin modal, ștergere cu confirmare
- **Gestionare comenzi** — filtrare după status, actualizare status direct din tabel
- **Gestionare utilizatori** — activare/dezactivare cont, modificare nivel de acces, ștergere
- **Moderare recenzii** — vizualizare și eliminare recenzii neconforme

### Protecția rutelor

Accesul la pagina de administrare este protejat atât client-side, cât și server-side:

```jsx
// Redirecționare automată dacă utilizatorul nu are drepturi de administrare
useEffect(() => {
    if (!user) navigate("/login");
    else if (!user.is_staff) navigate("/");
}, [user]);
```

Toate endpoint-urile `/api/admin/*` verifică `is_staff` la nivel de permisiune Django, astfel că protecția client-side reprezintă doar un al doilea nivel de siguranță.

---

## 10. Securitate

### Validare server-side la checkout

Prețurile și disponibilitatea stocului sunt **întotdeauna recalculate pe server**, indiferent de datele trimise din client. Aceasta previne atacuri de tip price manipulation:

```python
# views.py – CheckoutView
for item in items:
    product = Product.objects.get(id=item['productId'])

    # Verificare stoc în baza de date, nu în cerere
    if product.stock < item['quantity']:
        return Response({'error': 'Stoc insuficient'}, status=400)

    # Prețul este preluat din baza de date, nu din request body
    server_price = product.price * item['quantity']
    total += server_price
```

### Sistem de permisiuni pe roluri

```python
class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)

class AdminOverviewView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
```

### Configurare CORS

```python
# Producție: doar originile autorizate explicit
CORS_ALLOWED_ORIGINS = ['https://far-beyond-gear.vercel.app']

# Development: toate originile (variabilă de mediu nesetată)
CORS_ALLOW_ALL_ORIGINS = True
```

### Invalidare token la deconectare

La deconectare, refresh token-ul este adăugat în baza de date de blacklist (`rest_framework_simplejwt.token_blacklist`), prevenind reutilizarea sa chiar dacă token-ul nu a expirat.

---

## 11. Testare Automată

```bash
cd server
python manage.py test catalog --verbosity=2
```

### Suite de teste implementate

| Test | Comportament verificat |
|---|---|
| `test_xp_gain` | Adăugarea XP și avansarea automată la nivel următor |
| `test_checkout_grants_xp` | XP acordat corect la plasarea unei comenzi |
| `test_first_blood_achievement` | Realizarea deblocată la prima comandă |
| `test_checkout_insufficient_stock` | Răspuns 400 la comandă cu stoc insuficient |
| `test_products_endpoint` | `GET /api/products/` returnează 200 OK |
| `test_brands_endpoint` | `GET /api/brands/` returnează 200 OK |

---

## 12. Instalare și Configurare

### Cerințe de sistem

- Python 3.11 sau mai recent
- Node.js 18 sau mai recent

### Pornire automată (Windows)

```powershell
# În PowerShell, din directorul rădăcină al proiectului:
Set-ExecutionPolicy -Scope CurrentUser Bypass -Force
.\start_all.ps1
```

Scriptul creează automat mediul virtual Python, instalează toate dependențele și pornește ambele servicii.

### Pornire manuală

```bash
# Terminal 1 – Backend Django
cd server
python -m venv ../.venv
../.venv/Scripts/activate        # Windows
# source ../.venv/bin/activate   # Linux / macOS
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Terminal 2 – Frontend React
cd client
npm install
npm run dev
```

### Adrese de acces

| URL | Serviciu |
|---|---|
| `http://localhost:5173` | Aplicația React |
| `http://localhost:8000/api/` | API Django (interfață browsable) |
| `http://localhost:8000/admin/` | Django Admin |
| `http://localhost:5173/admin-panel` | Panou de administrare custom |

---

## 13. Deployment

### Backend – Render.com

Configurat prin `render.yaml`:

```yaml
services:
  - type: web
    name: far-beyond-gear-api
    runtime: python
    rootDir: server
    buildCommand: >
      pip install -r requirements.txt &&
      python manage.py collectstatic --no-input &&
      python manage.py migrate
    startCommand: gunicorn core.wsgi:application
```

### Frontend – Vercel

```bash
# Din directorul client/
vercel --prod
# Variabilă de mediu necesară:
# VITE_API_BASE_URL = https://far-beyond-gear-api.onrender.com
```

### Variabile de mediu (Backend)

| Variabilă | Descriere |
|---|---|
| `SECRET_KEY` | Cheia criptografică Django |
| `DEBUG` | `False` în producție |
| `ALLOWED_HOSTS` | Domenii acceptate (ex: `.onrender.com`) |
| `CORS_ALLOWED_ORIGINS` | URL-ul frontend-ului în producție |
| `EMAIL_HOST_USER` | Adresa Gmail pentru trimitere emailuri |
| `EMAIL_HOST_PASSWORD` | App Password Gmail (2FA activ) |

---

## 14. Decizii Arhitecturale

### Separarea frontend / backend

Alegerea unei arhitecturi cu API REST separat față de o abordare monolitică Django (cu template-uri server-side) aduce câteva avantaje concrete: frontend-ul și backend-ul pot fi dezvoltate, testate și deployate independent; API-ul poate fi consumat în viitor de aplicații mobile sau alte servicii; iar scalarea orizontală a backend-ului devine posibilă fără a afecta frontend-ul.

### JWT față de autentificarea prin sesiuni

Autentificarea prin sesiuni presupune că serverul menține o structură de date pentru fiecare utilizator activ. JWT este **stateless** — serverul nu stochează nimic legat de sesiune; token-ul conține toate informațiile necesare și este semnat criptografic pentru a preveni falsificarea. Aceasta simplifică scalarea și permite consumarea API-ului din orice tip de client.

### SPA față de server-side rendering

Un Single Page Application oferă o experiență de navigare fluidă, similară unei aplicații native, fără reîncărcări complete de pagină. React Router gestionează navigarea client-side, iar starea aplicației se păstrează între pagini. Compromisul față de SSR (Server-Side Rendering) este că aplicația necesită JavaScript activ în browser.

### SQLite pentru development

SQLite elimină complexitatea unui server de baze de date separat în fazele de dezvoltare și demonstrare. Django ORM abstractizează motorul de baze de date, astfel că migrarea la PostgreSQL pentru producție necesită modificarea unui singur parametru de configurare în `settings.py`.

### Sistem de events pentru coș (fără Redux)

Coșul de cumpărături este sincronizat între componente printr-un sistem de publish/subscribe implementat manual, fără a introduce o librărie de gestionare a stării globale. Această decizie reduce complexitatea dependențelor și demonstrează că soluțiile simple sunt de preferat atunci când cerințele nu justifică un instrument mai complex.

---

*Far Beyond Gear – Proiect de Licență*
