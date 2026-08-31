<title>Sultan Rahmatulloh — Tanbopp | AI Automation &amp; Custom Software Developer</title>
<meta name="description" content="Sultan Rahmatulloh (Tanbopp) — Software Engineer, AI Automation & ERP Developer. Membangun sistem otomasi AI, ERP Odoo, dan custom software yang membuat bisnis lebih efisien. 3+ tahun pengalaman, 20+ proyek." />
<meta name="keywords" content="sultan rahmahtulloh, sultan rahmatulloh, tanbopp, sultan rahmatulloh tanbopp, software engineer indonesia, AI automation, ERP Odoo developer, custom software, developer portfolio, web developer indonesia" />
<meta name="author" content="Sultan Rahmatulloh" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
<meta name="googlebot" content="index, follow" />
<meta name="rating" content="general" />
<meta name="theme-color" content="#000000" />
<link rel="canonical" href="{{ url('/') }}" />

<!-- Favicon / Icons -->
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='black'/%3E%3Ctext x='50' y='68' font-size='52' font-family='Arial' font-weight='bold' text-anchor='middle' fill='white'%3ET%3C/text%3E%3C/svg%3E" />
<link rel="apple-touch-icon" href="{{ asset('images/hero-background.png') }}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Tanbopp" />
<meta property="og:title" content="Sultan Rahmatulloh — Tanbopp | AI Automation &amp; Custom Software Developer" />
<meta property="og:description" content="Software Engineer & AI Automation developer. Membangun sistem otomasi AI, ERP Odoo, dan custom software yang membuat bisnis lebih efisien." />
<meta property="og:url" content="{{ url('/') }}" />
<meta property="og:locale" content="id_ID" />
<meta property="og:image" content="{{ asset('images/hero-background.png') }}" />
<meta property="og:image:alt" content="Sultan Rahmatulloh (Tanbopp) — Portfolio" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Sultan Rahmatulloh — Tanbopp | AI Automation &amp; Custom Software Developer" />
<meta name="twitter:description" content="Software Engineer & AI Automation developer. Membangun sistem otomasi AI, ERP Odoo, dan custom software yang membuat bisnis lebih efisien." />
<meta name="twitter:image" content="{{ asset('images/hero-background.png') }}" />

<!-- Geo / Organization -->
<meta name="geo.region" content="ID" />
<meta name="geo.country" content="ID" />

<!-- Structured Data (JSON-LD) -->
@php
    $siteUrl = url('/');
    $heroUrl = asset('images/hero-background.png');

    $personJson = json_encode([
        '@context' => 'https://schema.org',
        '@type' => 'Person',
        'name' => 'Sultan Rahmatulloh',
        'alternateName' => ['Tanbopp', 'Sultan Rahmahtulloh', 'Sultan Rahmatulloh Tanbopp'],
        'url' => $siteUrl,
        'image' => $heroUrl,
        'jobTitle' => 'Software Engineer & AI Automation Developer',
        'description' => 'Software Engineer, AI Automation & ERP Developer. Membangun sistem otomasi AI, ERP Odoo, dan custom software untuk bisnis.',
        'knowsAbout' => ['AI Automation', 'ERP Odoo', 'Python', 'PostgreSQL', 'Custom Software', 'Web Development'],
        'nationality' => 'Indonesia',
        'address' => ['@type' => 'PostalAddress', 'addressCountry' => 'ID'],
        'sameAs' => [$siteUrl, 'https://otoproject.co.id'],
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    $websiteJson = json_encode([
        '@context' => 'https://schema.org',
        '@type' => 'WebSite',
        'name' => 'Tanbopp',
        'alternateName' => 'Sultan Rahmatulloh',
        'url' => $siteUrl,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
@endphp
<script type="application/ld+json">
{!! $personJson !!}
</script>

<script type="application/ld+json">
{!! $websiteJson !!}
</script>
