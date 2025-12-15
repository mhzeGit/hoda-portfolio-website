# Hoda - 3D Character Artist Portfolio

A simple yet eye-catching dark-themed portfolio website for a 3D character artist.

## 🚀 Quick Start

### Hosting on GitHub Pages

1. **Create a GitHub repository** and push this code
2. **Go to Settings → Pages**
3. **Set Source** to "Deploy from a branch" → select `main` branch
4. **Your site will be live** at `https://yourusername.github.io/repository-name`

### Adding Your Portfolio

1. Open `admin.html` in your browser (locally)
2. Login with your credentials
3. Create your portfolio items with images
4. Click **"Download for Publishing"**
5. Replace `js/portfolio-data.js` with the downloaded file
6. Commit and push to GitHub

## ✨ Features

- **Dark Theme** - Modern dark mode design with purple accent colors
- **Responsive** - Works on all device sizes
- **Portfolio Gallery** - Beautiful card-based portfolio display
- **Image Switcher** - View different render passes (Final Render, Base Color, Normal, Wireframe, No Color)
- **Smooth Animations** - Subtle scroll animations and transitions
- **Admin Panel** - Easy content management with image uploads
- **No Backend Required** - Pure static hosting

## 📁 Project Structure

```
├── index.html              # Main portfolio website
├── admin.html              # Admin panel (for content management)
├── css/
│   ├── styles.css          # Main site styles
│   └── admin.css           # Admin panel styles
├── js/
│   ├── main.js             # Main site functionality
│   ├── portfolio-data.js   # Portfolio content (auto-generated)
│   ├── admin.js            # Admin panel functionality
│   └── admin-auth.js       # Admin authentication
└── images/
    └── portfolio/          # Portfolio images folder
```

## 🔐 Admin Access

**Default Credentials:**
- Username: `admin`
- Password: `Hoda@Portfolio2024!`

⚠️ **Change the password before going public!** See Security section below.

## 📝 Managing Content

### Adding New Portfolio Items

1. Open `admin.html` locally in your browser
2. Login with admin credentials
3. Click **"New Portfolio Item"**
4. Fill in the details:
   - Title, Category, Description
   - Software used, Date, Polygon count
   - Tags (comma-separated)
5. Upload images (drag & drop supported):
   - **Final Render** (required)
   - Base Color, Normal, Wireframe, No Color (optional)
6. Click **"Save & Publish"**

### Publishing Changes

1. After creating/editing items, click **"Download for Publishing"**
2. This downloads `portfolio-data.js` with your content
3. Replace the existing `js/portfolio-data.js` file
4. Commit and push to GitHub:
   ```bash
   git add js/portfolio-data.js
   git commit -m "Update portfolio content"
   git push
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

- Edit `index.html` directly for About, CV sections
- Use admin panel for portfolio items

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

© 2024 Hoda. All rights reserved.
