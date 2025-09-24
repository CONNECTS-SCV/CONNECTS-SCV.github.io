# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based website for CONNECTS, an AI-powered structural biology analysis platform. The site uses a customized Hydejack theme (v7.5.2) with significant navigation and styling modifications, hosted on GitHub Pages at https://connects-scv.github.io/.

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

### Port Management
- If port 4000 is already in use, find and kill processes: `lsof -i :4000` then `kill <PID>`

## Architecture

### Jekyll Structure
The site follows Jekyll conventions with extensive Hydejack theme customizations:

- **_config.yml**: Main Jekyll configuration. Key settings include:
  - Site URL, title, descriptions in Korean
  - Hydejack theme configurations
  - Menu structure with Home, Analysis (Protein/Ligand), and Release sections
  - Plugin configurations for SEO, sitemap, feed, pagination

- **Content Organization**:
  - `_posts/`: Blog posts about tools and releases
  - `products/`: Product pages (Curie, Twin, Pensive)
  - `labs/`: Lab sections (Protein, Ligand, Interaction, Docking, Prediction)
  - `updates/`: Update sections (Release Notes, Features, Announcements)
  - `about/`: About sections (History, Vision, Contact)
  - `_layouts/`: HTML templates for different page types
  - `_includes/`: Reusable HTML components

### Layout Architecture
The site uses a multi-layout system:

- **`main.html`**: Primary layout with custom navigation system and advanced dropdown functionality
- **`default.html`**: Secondary layout with identical navigation system for consistency
- **`compress.html`**: Base layout that compresses HTML output
- **Specialized layouts**: `blog.html`, `post.html`, `page.html`, etc.

### Custom Navigation System
**Critical Implementation Details:**

The navigation system (`_includes/header.html`) includes:
- **Fixed header** with glassmorphism effects and backdrop blur
- **Animated navigation line** that moves on hover using `animateLineTo()` function
- **Individual dropdown menus** for each main navigation item (Products, Labs, Updates, About us)
- **Advanced hover management** with timeout-based state tracking to prevent premature hiding
- **Connection areas** using CSS pseudo-elements to maintain dropdown visibility during mouse movement

**JavaScript Architecture (in `main.html` and `default.html`):**
- `showDropdown()` / `hideDropdown()` functions manage visibility
- `checkMenuArea()` function tracks hover state across menu items and dropdowns
- Timeout management with 150ms delays and 50ms state checking intervals
- Event listeners for `mouseenter` and `mouseleave` with sophisticated timing logic

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
  - JavaScript code splitting with webpack
  - Asset preloading capabilities
  - HTML compression via jekyll-compress-html
- **Custom JavaScript Components**:
  - RxJS-based reactive programming patterns
  - FLIP animations for smooth transitions
  - Modern ES6+ with Babel transpilation
- **Responsive Design**: Mobile-first with custom dropdown navigation on desktop, hamburger menu on mobile
- **Styling Architecture**: SCSS with component-based organization and CSS-in-JS style effects

### SCSS Architecture
**Critical Understanding:**
- **`_sass/hydejack/`**: Theme-specific styles with `.pre.scss` files that generate `__inline/` and `__link/` variants
- **`_sass/pooleparty/`**: Base framework styles following same pattern
- **`_sass/my-*.scss`**: Custom site-specific overrides
- **Build process**: `npm run build:css` processes all SCSS and generates final stylesheets

### Development Patterns
**Navigation System Modifications:**
- When modifying navigation, update both `main.html` and `default.html` layouts identically
- Navigation JavaScript must be loaded before header include to avoid timing issues
- Dropdown positioning uses `calc(100% + 5px)` with connection areas via `::before` pseudo-elements
- Hover state management requires careful timeout coordination (150ms/50ms intervals)

**Layout Inheritance:**
- Most pages inherit from `main.html` (homepage, landing pages)
- Content pages use `default.html` (blog posts, documentation)
- Both layouts include identical navigation JavaScript for consistency

### Deployment
The site is configured for GitHub Pages deployment:
- Branch: main_ver3 (currently active development branch)  
- Main branch: main (for production deployments)
- URL: https://connects-scv.github.io/
- Automatic Jekyll build on push

## Important Notes
- The project mixes pre-compiled assets in `assets/` with source files in `_sass/` and `_js/`
- CSS is generated dynamically from `.pre.scss` files using custom build scripts
- Webpack config (`webpack.config.js`) uses environment-based builds (dev vs prod)
- Korean language is the primary locale (`lang: ko` in `_config.yml`)
- Port conflicts are common - always check for running processes on port 4000
- Navigation system requires both CSS and JavaScript coordination - test thoroughly after changes