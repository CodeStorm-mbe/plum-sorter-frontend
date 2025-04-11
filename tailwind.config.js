/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        // Couleurs personnalisées pour le projet de tri des prunes
        background: {
          DEFAULT: '#1a1a2e', // Violet foncé
          light: '#2d2d44',   // Violet un peu plus clair
          card: 'rgba(46, 51, 69, 0.8)', // #2E3345 avec opacité 80%
        },
        accent: {
          gold: '#ffd700', // Or
          emerald: '#50c878', // Émeraude
        },
        gradient: {
          start: '#1a1a2e', // Violet foncé
          end: '#a267ac',   // Violet rosé
        },
        // Couleurs pour les catégories de prunes
        plum: {
          good: '#50c878',     // Bonne qualité - vert émeraude
          unripe: '#ffd700',   // Non mûre - or
          spotted: '#ff7f50',  // Tachetée - corail
          cracked: '#ff4500',  // Fissurée - rouge-orangé
          bruised: '#9932cc',  // Meurtrie - violet
          rotten: '#8b0000',   // Pourrie - rouge foncé
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      fontFamily: {
        title: ['Orbitron', 'Exo 2', 'sans-serif'],
        body: ['Montserrat', 'Poppins', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
