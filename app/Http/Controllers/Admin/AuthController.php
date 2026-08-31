<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Session;
use Illuminate\View\View;

class AuthController extends Controller
{
    public function showLogin(): View
    {
        // Record when the login page was shown so instant bot submissions can be rejected.
        Session::put('login_start', now()->getTimestamp());

        return view('admin.auth.login');
    }

    public function login(Request $request): RedirectResponse
    {
        $request->validate([
            'username'  => 'required|string',
            'password'  => 'required|string',
            'auth_code' => 'required|string',
            'website'   => 'prohibited', // honeypot field — must stay empty (anti-bot)
        ]);

        // Rate limit: 5 attempts per minute per IP.
        $key = 'admin-login:'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return back()->withErrors([
                'login' => 'Terlalu banyak percobaan login. Coba lagi dalam '.RateLimiter::availableIn($key).' detik.',
            ]);
        }

        // Anti-robot: the "I'm not a robot" checkbox must be checked.
        if (! $request->boolean('robot')) {
            RateLimiter::hit($key, 60);

            return back()->withInput()->withErrors(['robot' => 'Centang kotak "Saya bukan robot" untuk melanjutkan.']);
        }

        // Anti-robot: reject forms submitted too quickly (or without visiting the page).
        $start = (int) Session::pull('login_start', 0);
        if ($start === 0 || (now()->getTimestamp() - $start) < 2) {
            RateLimiter::hit($key, 60);

            return back()->withInput()->withErrors(['robot' => 'Tunggu sejenak sebelum mengirim formulir.']);
        }

        // Verify username + password + the secret authentication code.
        $admin = Admin::where('username', $request->username)->first();
        $valid = $admin
            && Hash::check($request->password, $admin->password)
            && Hash::check($request->auth_code, $admin->auth_code);

        if (! $valid) {
            RateLimiter::hit($key, 60);

            return back()->withInput()->withErrors(['login' => 'Username, password, atau kode autentikasi salah.']);
        }

        RateLimiter::clear($key);

        // Establish a secure, fresh session.
        Session::regenerate(true);
        Session::put('admin_id', $admin->id);
        Session::put('admin_login_at', now()->toIso8601String());

        return redirect()->intended(route('admin.projects.index'));
    }

    public function logout(Request $request): RedirectResponse
    {
        Session::flush();
        Session::regenerate(true);

        return redirect()->route('admin.login');
    }
}
