# Paul Benoit's Personal Portfolio Website

This repository contains the source code for my personal portfolio website, showcasing my skills and experience as a DevOps Engineer and Developer.

## Project Overview

This is a responsive, modern personal portfolio website built with HTML, CSS, and JavaScript. The site is hosted on a Digital Ocean Droplet using a LAMP stack (Linux, Apache, MySQL, PHP) and the domain name is registered through NameCheap.

## Features

- **Responsive Design**: Fully responsive layout that works on all device sizes
- **Modern UI**: Clean, professional design with animations and transitions
- **Accessibility**: Includes skip links, ARIA attributes, and screen reader support
- **Performance Optimized**: Uses resource preloading, efficient animations, and optimized assets
- **SEO Ready**: Includes meta tags for search engines and social media sharing

## Technology Stack

### Frontend
- HTML5
- CSS3 (with responsive design using media queries)
- Vanilla JavaScript (with performance optimizations)
- Font Awesome for icons
- Google Fonts (Raleway)

### Backend/Hosting
- LAMP Stack (Linux, Apache, MySQL, PHP)
- Digital Ocean Droplet for hosting
- NameCheap for domain registration

### JavaScript Libraries
- Skrollr.js for parallax scrolling effects

## Project Structure

```
├── index.html              # Main HTML file
├── info.php                # PHP info file
├── css/
│   ├── styles.css          # Main stylesheet
│   ├── font-awesome.css    # Font Awesome styles
│   └── font-awesome.min.css
├── js/
│   ├── page.js             # Main JavaScript file
│   ├── skrollr.min.js      # Skrollr library
│   ├── skrollr.menu.min.js # Skrollr menu extension
│   └── skrollr.ie.min.js   # IE support for Skrollr
├── img/
│   ├── Bridge.jpg          # Hero background image
│   └── Paul.jpg            # Profile photo
├── fonts/                  # Font Awesome font files
└── files/
    └── resume1.pdf         # Downloadable resume
```

## Setup and Installation

### Local Development

1. Clone this repository:
   ```
   git clone [repository-url]
   ```

2. Navigate to the project directory:
   ```
   cd [project-directory]
   ```

3. Open `index.html` in your browser to view the site locally.

### Deployment

The site is currently deployed on a Digital Ocean Droplet using a LAMP stack:

1. Set up a LAMP stack on your server
2. Upload the files to your web server's document root (e.g., `/var/www/html/`)
3. Configure Apache to serve the site (if using a custom domain)
4. Set appropriate file permissions

## Maintenance

### Updating Content

- Edit `index.html` to update text content and structure
- Modify `css/styles.css` for styling changes
- Update `js/page.js` for functionality changes

### Future Changes

- Add HTTPS
