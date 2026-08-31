@extends('layouts.app')

@section('content')

    <x-hero />

    <section class="w-full py-20">
        <x-container class="grid grid-cols-1 md:grid-cols-5 gap-16">
            <div class="col-span-3 flex flex-col sm:justify-between">
                <p class="text-2xl sm:text-4xl max-w-2xl leading-[130%]">I build AI automation and custom software that cut manual work and help businesses run more efficiently—systems that solve real problems, not just look impressive.</p>
                <div class="flex flex-wrap gap-x-10 sm:gap-x-12 gap-y-8 mt-12 sm:mt-16">
                    <x-stat value="3+" label="Years of experience" />
                    <x-stat value="4" label="Companies" />
                    <x-stat :value="($projects->count()).'+'" label="Projects" />
                </div>
            </div>
            <div class="col-span-2">
                <img src="{{ asset('images/tanbopp-photo.png') }}" class="w-full grayscale">
            </div>
        </x-container>
    </section>

    <section class="w-full bg-black py-20">
        <x-container>
            <x-section-heading class="text-4xl sm:text-5xl mb-16">Where I've worked</x-section-heading>

            <x-work-item
                company="Otoproject Group"
                role="Graphic Designer"
                description1="Responsible for end-to-end vehicle catalog production—from product photography (DSLR & studio lighting) and photo editing to layout design and visual design for automotive marketplace platforms aligned with brand identity, including 3D product modeling for design presentation."
                description2="Designed packaging from product measurement, dieline creation, and layout to mockups, while coordinating with production teams and printing vendors to ensure print results matched the final design." />

            <x-work-item
                company="Centrova"
                role="Founder & Software Developer"
                description1="My role at Centrova focuses on building and growing the business, designing strategy, directing products and services, and ensuring technology solutions deliver real impact for customers." />
        </x-container>
    </section>

    <!-- Projects Carousel -->
    <section id="projects" class="w-full bg-black py-20 overflow-hidden">
        <x-container class="mb-12">
            <div class="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <x-section-heading class="text-3xl sm:text-5xl">Featured Work</x-section-heading>
                </div>
                <div class="flex items-center gap-3">
                    <x-icon-button id="project-prev" aria-label="Sebelumnya" icon="chevron_left" />
                    <x-icon-button id="project-next" aria-label="Berikutnya" icon="chevron_right" />
                </div>
            </div>
        </x-container>

        <div class="overflow-hidden">
            <div id="project-track" style="padding-left: max(2rem, calc((100vw - 72rem) / 2 + 1.5rem)); padding-right: max(2rem, calc((100vw - 72rem) / 2 + 1.5rem));" class="flex gap-6 transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform">
                @forelse ($projects as $project)
                    <x-project-card
                        :href="route('projects.show', $project)"
                        :title="$project->title"
                        :year="$project->year ?? ''"
                        :image="$project->card_image ? asset('storage/'.$project->card_image) : ($project->hero_image ? asset('storage/'.$project->hero_image) : 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop')"
                        :alt="$project->title" />
                @empty
                    <p class="px-8 text-neutral-400">Belum ada project untuk ditampilkan.</p>
                @endforelse
            </div>
        </div>
    </section>

    <!-- Feature Banner (full-bleed) -->
    <section class="relative w-full min-h-[70vh] flex items-center overflow-hidden border-t border-neutral-800/80">
        <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop" alt="Futuristic facility" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/10"></div>

        <div class="relative z-10 w-full max-w-6xl mx-auto px-8 flex justify-end">
            <div class="max-w-xl text-right">
                <x-section-heading class="text-4xl sm:text-5xl md:text-6xl leading-[110%]">
                    A system built for
                    <br />
                    scale and orbit
                </x-section-heading>
                <p class="mt-6 text-base sm:text-lg text-neutral-200/90 leading-relaxed">
                    Combining logic, automation, and seamless integration — all under one roof.
                </p>
                <x-button href="#" variant="primary" icon="chevron_right" class="mt-10">Learn More</x-button>
            </div>
        </div>
    </section>

    <!-- Product Showcase -->
    <section class="w-full bg-black py-20">
        <x-container>
            <x-section-heading class="text-3xl sm:text-5xl leading-[130%] mb-12 max-w-xl">
                Producing chips for use on Earth and in space
            </x-section-heading>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-y-8">
                <x-product-panel
                    name="AI5"
                    image="https://terafab.ai/assets/chips/Chip_AI5.png"
                    caption="Powering FSD &amp; Tesla Optimus" />

                <x-product-panel
                    name="AI6"
                    image="https://terafab.ai/assets/chips/Chip_AI6.png"
                    caption="Powering Tesla Optimus" />

                <x-product-panel
                    name="D3"
                    image="https://terafab.ai/assets/chips/Chip_D3.jpg"
                    caption="Powering Space" />

                <x-product-panel
                    name="...and Beyond"
                    image="https://terafab.ai/assets/chips/Chip_Beyond.png"
                    :bordered="false" />
            </div>
        </x-container>
    </section>

    <style>
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>

@endsection
