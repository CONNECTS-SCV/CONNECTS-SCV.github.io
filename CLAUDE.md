# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based website for CONNECTS, an AI-powered structural biology analysis platform. The site uses the Hydejack theme (v7.5.2) and is hosted on GitHub Pages at https://connects-scv.github.io/.

## Build and Development Commands

### Jekyll Site Commands
- `bundle exec jekyll serve --port=4000 --host=0.0.0.0` - Start local Jekyll server
- `bundle exec jekyll build` - Build the static site (output to _site/)
- `bundle install` - Install Ruby dependencies

### JavaScript/Asset Building
- `npm install` - Install Node.js dependencies
- `npm run build` - Build both JS and CSS assets
- `npm run build:js` - Build JavaScript with webpack
- `npm run build:css` - Build CSS from SCSS files
- `npm run dev` - Start development mode (watches files and serves site)
- `npm run watch` - Watch JS and CSS files for changes
- `npm run lint` - Run ESLint on JavaScript files in _js/src

### Development Workflow
- `npm run dev` - Primary development command (runs watch + serve concurrently)
- `npm run prepare` - Lint, test, clean, and build before committing

## Architecture

### Jekyll Structure
The site follows standard Jekyll conventions with Hydejack theme customizations:

- **_config.yml**: Main Jekyll configuration. Key settings include:
  - Site URL, title, descriptions in Korean
  - Hydejack theme configurations
  - Menu structure with Home, Analysis (Protein/Ligand), and Release sections
  - Plugin configurations for SEO, sitemap, feed, pagination

- **Content Organization**:
  - `_posts/`: Blog posts about tools and releases
  - `analysis/`: Analysis tool pages (protein and ligand subdirectories)
  - `release/`: Release notes and updates
  - `_layouts/`: HTML templates for different page types
  - `_includes/`: Reusable HTML components

### Asset Pipeline
The project uses a dual build system:

1. **JavaScript (webpack)**:
   - Entry point: `_js/src/index.js`
   - Output: `assets/js/hydejack-{version}.js`
   - Features: Babel transpilation, RxJS integration, module concatenation
   - Components include drawer navigation, push-state routing, FLIP animations

2. **CSS (SCSS)**:
   - Main files in `_sass/` directory
   - Split between `hydejack/` (theme styles) and `pooleparty/` (base styles)
   - Each component has `.pre.scss` files and `__inline/` + `__link/` variants
   - Custom styles in `my-style.scss`, `my-inline.scss`, `my-variables.scss`

### Key Technical Features
- **Progressive Enhancement**: Uses hy-push-state and hy-drawer for SPA-like navigation
- **Performance Optimizations**: 
  - Inline critical CSS option
  - JavaScript code splitting
  - Asset preloading capabilities
- **Responsive Design**: Mobile-first with drawer navigation
- **Internationalization**: Korean language support with configurable strings

### Deployment
The site is configured for GitHub Pages deployment:
- Branch: main
- URL: https://connects-scv.github.io/
- Automatic Jekyll build on push

## Important Notes
- The project mixes pre-compiled assets in `assets/` with source files
- Some CSS is generated dynamically from `.pre.scss` files
- The webpack config uses environment-based builds (dev vs prod)
- Korean language is the primary locale (lang: ko in _config.yml)