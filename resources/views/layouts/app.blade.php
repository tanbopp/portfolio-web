<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    @include('partials.head')
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-black min-h-[200vh] text-white font-body antialiased">
    @include('partials.navbar')
    @yield('content')
    @include('partials.footer')
</body>
</html>
