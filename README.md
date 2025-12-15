# Hoda - 3D Character Artist Portfolio

A simple yet eye-catching dark-themed portfolio website for a 3D character artist.

## 🚀 Quick Start

### Hosting on GitHub Pages

1. **Create a GitHub repository** and push this code
2. **Go to Settings → Pages**
3. **Set Source** to "Deploy from a branch" → select `main` branch
4. **Your site will be live** at `https://yourusername.github.io/repository-name`


### Adding Your Portfolio

1. Open `js/portfolio-data.js` in a text editor.
2. Add your portfolio items as objects in the array (see the file for an example format).
3. Place your images in the `images/` folder and reference them in each item.
4. Save, commit, and push to GitHub.

## ✨ Features

- **Dark Theme** - Modern dark mode design with purple accent colors
- **Responsive** - Works on all device sizes
- **Portfolio Gallery** - Beautiful card-based portfolio display
- **Image Switcher** - View different render passes (Final Render, Base Color, Normal, Wireframe, No Color)
- **Smooth Animations** - Subtle scroll animations and transitions

// ...existing code...

## 📁 Project Structure

```
├── index.html              # Main portfolio website
├── css/
│   └── styles.css          # Main site styles
├── js/
│   ├── main.js             # Main site functionality
│   ├── portfolio-data.js   # Portfolio content (auto-generated)
// ...existing code...
└── images/
    └── portfolio/          # Portfolio images folder
```

// ...existing code...
   ```

## 🔒 Security

### Changing Admin Password

1. Open browser console on `admin.html`
2. Run: `generatePasswordHash('YourNewPassword')`
3. Copy the hash
4. Edit `js/admin-auth.js` and update the hash
5. Commit the change

### Security Features

- Password hashing with salt
- Session expiration (30 minutes)
- Brute force protection (5 attempts, 15-minute lockout)
- No search engine indexing for admin page

## 🎨 Customization

### Colors

Edit CSS variables in `css/styles.css`:

```css
:root {
    --accent-primary: #8b5cf6;    /* Main accent color */
    --accent-secondary: #a78bfa;  /* Secondary accent */
    --bg-primary: #0a0a0b;        /* Background color */
}
```

### Content


Edit `index.html` directly for About, CV sections.
Edit `js/portfolio-data.js` directly for portfolio items.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

© 2024 Hoda. All rights reserved.
