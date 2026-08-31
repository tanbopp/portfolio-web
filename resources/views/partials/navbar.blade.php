<nav id="site-nav" class="fixed top-0 left-0 right-0 z-[1000]">
    <div id="site-nav-bg" class="pointer-events-none absolute inset-0"></div>
    <div class="relative mx-auto flex max-w-[100rem] items-center justify-between px-6 py-6 sm:px-8">
        <a href="{{ url('/') }}" class="text-xl font-semibold tracking-tight text-white">
            Tanbopp
        </a>
        <div class="flex items-center gap-6">
            <a href="{{ url('/').'#projects' }}" class="text-sm text-neutral-300 transition-colors hover:text-white">Projects</a>
            <a href="{{ url('/').'#contact' }}" class="text-sm text-neutral-300 transition-colors hover:text-white">Contact Me</a>
        </div>
    </div>
</nav>
