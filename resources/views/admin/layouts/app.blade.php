<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin') — Tanbopp</title>
    @vite(['resources/css/app.css', 'resources/js/admin.js'])
</head>
<body class="min-h-screen bg-neutral-950 font-body text-white antialiased">
    <header class="border-b border-neutral-800">
        <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <a href="{{ route('admin.projects.index') }}" class="text-lg font-semibold tracking-tight">
                Tanbopp <span class="text-neutral-500">cPanel</span>
            </a>
            <nav class="flex items-center gap-5">
                <a href="{{ route('admin.projects.index') }}" class="text-sm text-neutral-300 hover:text-white">Projects</a>
                <a href="{{ route('admin.projects.create') }}" class="text-sm text-neutral-300 hover:text-white">+ New</a>
                <a href="{{ url('/') }}" class="text-sm text-neutral-300 hover:text-white" target="_blank">View site</a>
                <form method="POST" action="{{ route('admin.logout') }}">
                    @csrf
                    <button class="text-sm text-neutral-300 hover:text-white">Logout</button>
                </form>
            </nav>
        </div>
    </header>

    <main class="mx-auto w-full max-w-6xl px-6 py-8">
        @if (session('status'))
            <div class="mb-6 rounded-md border border-emerald-700 bg-emerald-900/40 px-4 py-3 text-sm text-emerald-200">
                {{ session('status') }}
            </div>
        @endif

        @if ($errors->any())
            <div class="mb-6 rounded-md border border-red-800 bg-red-900/40 px-4 py-3 text-sm text-red-200">
                <ul class="list-inside list-disc">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        @yield('content')
    </main>
</body>
</html>
