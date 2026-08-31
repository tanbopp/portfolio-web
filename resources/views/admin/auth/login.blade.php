<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>cPanel Login — Tanbopp</title>
    @vite(['resources/css/app.css'])
</head>
<body class="flex min-h-screen items-center justify-center bg-neutral-950 font-body text-white antialiased">

    <div class="w-full max-w-sm px-6">
        <div class="rounded-xl border border-neutral-800 bg-neutral-900/40 p-8">
            <h1 class="text-center text-2xl font-thin tracking-tight">
                Tanbopp <span class="text-neutral-500">cPanel</span>
            </h1>
            <p class="mt-1 text-center text-sm text-neutral-400">Masuk ke panel kontrol</p>

            @if ($errors->any())
                <div class="mt-6 rounded-md border border-red-800 bg-red-900/40 px-4 py-3 text-sm text-red-200">
                    @foreach ($errors->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif

            <form method="POST" action="{{ route('admin.login.attempt') }}" class="mt-8 space-y-5">
                @csrf

                <!-- Honeypot anti-bot -->
                <input type="text" name="website" value="" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true">

                <div>
                    <label class="mb-1 block text-sm text-neutral-300">Username</label>
                    <input type="text" name="username" value="{{ old('username') }}" required autofocus autocomplete="username"
                           class="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-white outline-none focus:border-neutral-500">
                </div>

                <div>
                    <label class="mb-1 block text-sm text-neutral-300">Password</label>
                    <input type="password" name="password" required autocomplete="current-password"
                           class="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-white outline-none focus:border-neutral-500">
                </div>

                <div>
                    <label class="mb-1 block text-sm text-neutral-300">Kode Autentikasi</label>
                    <input type="password" name="auth_code" required autocomplete="off"
                           class="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-white outline-none focus:border-neutral-500">
                </div>

                <!-- Anti-robot: checkbox (tidak perlu diisi/diketik) -->
                <label class="flex cursor-pointer items-center gap-3 text-sm text-neutral-300">
                    <input type="checkbox" name="robot" value="1" required
                           class="h-4 w-4 rounded border-neutral-600 accent-emerald-600">
                    Saya bukan robot
                </label>

                <button type="submit" class="btn btn--primary w-full justify-center">
                    Masuk
                </button>
            </form>
        </div>
    </div>
</body>
</html>
