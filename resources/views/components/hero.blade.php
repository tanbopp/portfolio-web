<section class="bg-neutral-800 tracking-tight w-full py-8 flex justify-center items-center relative overflow-hidden">
    <img id="hero-bg" src="{{ asset('images/hero-background-2.png') }}" alt="" class="absolute top-0 left-0 w-full h-[120%] object-cover pointer-events-none will-change-transform">
    <div class="absolute z-10 w-full h-full bg-gradient-to-r from-black/70 via-transparent to-transparent"></div>
    <div class="absolute z-10 w-full h-[150px] bottom-0 bg-gradient-to-b from-transparent to-black/80"></div>

    <div class="w-full max-w-6xl p-8 flex flex-col justify-center z-50">
        <div class="py-20">
            <h1 class="text-4xl sm:text-7xl font-thin tracking-[-3.5%] mb-2 sm:mb-3">Sultan <br> Rahmatulloh</h1>
            <h3 class="text-neutral-100/70 text-xl sm:text-2xl">I help your business run more <br>efficiently</h3>
            <div class="flex items-center gap-x-2.5 mt-8 sm:mt-10">
                <x-button href="#" variant="primary" icon="chevron_right">View Projects</x-button>
                <x-button href="#" variant="secondary" icon="chevron_right">View CV</x-button>
            </div>
        </div>

        <div class="w-full border-t border-neutral-500/50 pt-10">
            <div class="flex gap-x-12">
                <x-brand-logo />
            </div>
        </div>
    </div>
</section>
