@import "tailwindcss";

@theme {
  --color-bg: #050505;
  --color-accent: #DDA0DD;
  --color-accent-dim: rgba(221, 160, 221, 0.15);
  --color-crimson: #B22222;
  --color-border: rgba(255, 255, 255, 0.1);
  --color-text-main: #E6E6FA;
  --color-text-dim: #808080;
  --color-gold: #FFD700;
  --font-serif: "Georgia", serif;
  --font-sans: "Helvetica Neue", Arial, sans-serif;
}

@layer base {
  body {
    @apply font-sans bg-bg text-text-main overflow-hidden min-h-screen selection:bg-accent/30;
  }

  h1, h2, h3 {
    @apply font-serif tracking-wide;
  }
}

@layer utilities {
  .nav-rail {
    @apply fixed md:relative top-0 left-0 h-screen bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-border flex flex-col items-center py-8 gap-10 z-[100] transition-transform duration-500 ease-in-out;
  }

  .nav-rail-closed {
    @apply -translate-x-full md:-translate-x-0 md:w-0 md:opacity-0 md:pointer-events-none;
  }

  .nav-rail-open {
    @apply translate-x-0 md:w-20 md:opacity-100;
  }

  .nav-mobile {
    @apply md:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-lg border-t border-border flex justify-around items-center py-3 z-50 px-2;
  }
}

@utility glass-panel {
  @apply bg-white/5 backdrop-blur-md border border-white/10 shadow-xl;
}

@utility rpg-card {
  @apply glass-panel p-5 relative overflow-hidden transition-all duration-500 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(221,160,221,0.15)] hover:-translate-y-1;
}

@utility gallery-grid {
  @apply grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4;
}

@utility gallery-card {
  @apply relative aspect-square overflow-hidden rounded-lg border border-border cursor-pointer;
}

@keyframes bounce-in {
  0% { opacity: 0; transform: scale(0.3); }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}

@utility parallax-bg {
  @apply absolute inset-0 -z-10;
  transform: translateY(var(--parallax-offset, 0px));
  transition: transform 0.1s linear;
}

@utility carousel-track {
  @apply flex gap-4;
}

@utility modal-overlay {
  @apply fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4;
}

@utility modal-content {
  @apply glass-panel max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 rounded-2xl relative;
}

@layer utilities {
  .gallery-card img {
    @apply w-full h-full object-cover transition-transform duration-700 group-hover:scale-110;
  }

  .gallery-card::after {
    content: "";
    @apply absolute inset-0 bg-accent/0 transition-colors duration-500 group-hover:bg-accent/10;
  }

  .gallery-card:hover {
    @apply shadow-[0_0_15px_#DDA0DD] border-accent;
  }

  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-250px * 10)); }
  }

  .animate-scroll {
    animation: scroll 40s linear infinite;
  }

  .animate-scroll:hover {
    animation-play-state: paused;
  }
}

@utility floating {
  animation: floating 4s ease-in-out infinite;
}

@keyframes floating {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
