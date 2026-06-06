from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction

class Command(BaseCommand):
    help = "Populează baza de date cu date demo"

    @transaction.atomic
    def handle(self, *args, **options):
        # import în interiorul handle => sigur că App Registry e inițializat
        from catalog.models import Brand, Category, Product

        engl, _ = Brand.objects.get_or_create(name="ENGL")
        marshall, _ = Brand.objects.get_or_create(name="Marshall")

        amps, _ = Category.objects.get_or_create(name="Amps")
        cabs, _ = Category.objects.get_or_create(name="Cabs")

        p1, _ = Product.objects.get_or_create(
            name="Fireball 25",
            defaults={"brand": engl, "price": Decimal("4999.00"), "stock": 5},
        )
        p1.categories.set([amps])

        p2, _ = Product.objects.get_or_create(
            name="DSL20HR",
            defaults={"brand": marshall, "price": Decimal("2099.00"), "stock": 8},
        )
        p2.categories.set([amps, cabs])

        self.stdout.write(self.style.SUCCESS("Seed completed"))
