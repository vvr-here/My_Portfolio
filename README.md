# Vineet — Personal Portfolio Website

A professional, responsive, single-page portfolio website built with semantic HTML5, modern CSS3, and vanilla JavaScript. Designed for recruiters, hiring managers, and potential collaborators.

## 🚀 Quick Start

### View Locally
Simply open `index.html` in any modern web browser:
- Double-click `index.html` in File Explorer, or
- Right-click → "Open with" → your preferred browser

### Using a Local Server (Optional)
For the best development experience:
```bash
# If you have Python installed
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

## 📁 Project Structure

```
MyPortfolio/
├── index.html          # Main single-page website (all sections)
├── css/
│   └── style.css       # Complete design system, themes & responsive rules
├── js/
│   └── script.js       # Theme toggle, mobile nav, copy-email, scroll animations
└── README.md           # This file
```

## ✏️ How to Update Content

### Update Skills
In `index.html`, find the `<!-- ===== SKILLS SECTION ===== -->` comment. Each skill category is a `<div class="skill-category">` block. Add or remove `<span class="skill-tag">` elements inside the `.skill-tags` div.

**Tag variants:**
- `<span class="skill-tag">Normal Skill</span>` — cyan/blue technical skill
- `<span class="skill-tag learning">Docker (Learning)</span>` — amber "currently learning" skill
- `<span class="skill-tag soft">Teamwork</span>` — purple soft/professional skill

### Add a New Project
Copy one of the existing `<article class="project-card">` blocks inside the projects section and update the title, description, badge, highlights, and tech tags.

### Add a New Certification
Copy one of the existing `<div class="cert-card">` blocks inside the certifications section and update the title, issuer, date, and focus description.

### Add a Resume Download Button
1. Create a `resume/` folder inside `MyPortfolio/`.
2. Place your resume PDF there (e.g., `resume/Vineet_Resume.pdf`).
3. In `index.html`, add this button in the hero section CTA area:
```html
<a href="resume/Vineet_Resume.pdf" download class="btn btn-secondary">
    Download Resume
</a>
```

### Add a Profile Photo
1. Place your photo in an `assets/images/` folder (e.g., `assets/images/profile.jpg`).
2. Add an `<img>` tag in the hero section or about section:
```html
<img src="assets/images/profile.jpg" alt="Vineet Vikram Rao" class="profile-photo">
```
3. Add appropriate CSS styling for the image in `css/style.css`.

### Update Contact Information
- **Email:** Search for `vineetvikramrao9369@gmail.com` in `index.html` and replace all occurrences.
- **LinkedIn:** Search for `linkedin.com/in/vvrao13` and replace.
- **GitHub:** Search for `github.com/galac01389` and replace.

## 🎨 Theme Customization

The color system is controlled by CSS custom properties in `css/style.css`. To change the accent color, modify these variables in the `:root` (dark) and `[data-theme="light"]` blocks:

```css
/* Change accent from sky-blue to another color */
--accent: #38BDF8;       /* Main accent color */
--accent-hover: #7DD3FC; /* Hover state */
--accent-glow: rgba(56, 189, 248, 0.12); /* Subtle background glow */
```

## 🌐 Deployment Options

### GitHub Pages (Free)
1. Create a GitHub repository named `yourusername.github.io` (or any name).
2. Push all files to the `main` branch.
3. Go to **Settings → Pages → Source** → select `main` branch.
4. Your site will be live at `https://yourusername.github.io/`.

### Netlify (Free)
1. Go to [netlify.com](https://www.netlify.com/) and sign up.
2. Drag and drop the `MyPortfolio` folder onto the Netlify dashboard.
3. Your site is instantly live with a free `.netlify.app` subdomain.

### Vercel (Free)
1. Go to [vercel.com](https://vercel.com/) and sign up.
2. Import your GitHub repository or drag and drop the folder.
3. Your site is live with a free `.vercel.app` subdomain.

## 🛠️ Technical Details

- **Zero external dependencies** — no CDNs, frameworks, or build tools required.
- **Dark/Light theme** with `localStorage` persistence and system preference detection.
- **Fully responsive** across mobile (320px), tablet (768px), and desktop (1920px+).
- **Accessible** with semantic HTML5, ARIA labels, keyboard navigation, and visible focus indicators.
- **Performance optimized** with system font stack (0KB font downloads) and hardware-accelerated CSS transitions.
- **Respects `prefers-reduced-motion`** for users who prefer minimal animation.

## 📄 License

This portfolio is a personal project. Feel free to use the code structure as inspiration for your own portfolio.

---

*Built by Vineet Vikram Rao — Aspiring Cloud Engineer*
