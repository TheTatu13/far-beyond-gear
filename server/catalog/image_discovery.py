from urllib.parse import quote_plus

MIN_PRODUCT_IMAGES = 3


def _product_terms(product):
    brand_name = getattr(product.brand, "name", "") or ""
    return [brand_name, product.name, "music", "gear"]


def build_image_candidates(product):
    terms = [t for t in _product_terms(product) if t]
    base = quote_plus(" ".join(terms))
    slug = quote_plus(f"{getattr(product.brand, 'name', 'brand')}-{product.name}-{product.id}")

    # First candidates come from the web using the product query.
    candidates = [
        f"https://loremflickr.com/1200/900/{base}",
        f"https://source.unsplash.com/1200x900/?{base}",
        f"https://source.unsplash.com/1200x900/?{base},product",
    ]

    # Guaranteed stable fallback seeds.
    candidates.extend(
        [
            f"https://picsum.photos/seed/{slug}-1/1200/900",
            f"https://picsum.photos/seed/{slug}-2/1200/900",
            f"https://picsum.photos/seed/{slug}-3/1200/900",
        ]
    )
    return candidates


def get_product_image_urls(product, primary_url="", minimum=MIN_PRODUCT_IMAGES):
    urls = []
    if primary_url:
        urls.append(primary_url)
    for url in build_image_candidates(product):
        if url not in urls:
            urls.append(url)
        if len(urls) >= minimum:
            break
    return urls[:minimum]
