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
├── milk-vote.html          # Weekly milk voting application
├── info.php                # PHP info file
├── api.php                 # PHP backend API for milk vote app
├── css/
│   ├── styles.css          # Main stylesheet
│   ├── milk-vote.css       # Milk vote app styles
│   ├── font-awesome.css    # Font Awesome styles
│   └── font-awesome.min.css
├── js/
│   ├── page.js             # Main JavaScript file
│   ├── milk-vote.js        # Milk vote app logic
│   ├── skrollr.min.js      # Skrollr library
│   ├── skrollr.menu.min.js # Skrollr menu extension
│   └── skrollr.ie.min.js   # IE support for Skrollr
├── img/
│   ├── Bridge.jpg          # Hero background image
│   └── Paul.jpg            # Profile photo
├── fonts/                  # Font Awesome font files
├── data/                   # JSON data storage (gitignored)
│   ├── votes.json          # Current week's milk votes
│   ├── history.json        # Weekly history (last 12 weeks)
│   └── lastReset.json      # Last reset timestamp
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

### PHP Configuration (for Milk Vote Application)

The milk vote application requires PHP to be installed and configured on the server. Follow these steps:

#### 1. Install PHP 7.0 and Required Modules

```bash
sudo apt update
sudo apt install php7.0 php7.0-fpm php7.0-cli php7.0-json php7.0-mbstring -y
```

#### 2. Install Apache PHP Module

```bash
sudo apt install libapache2-mod-php7.0 -y
```

#### 3. Enable PHP Module in Apache

```bash
sudo a2enmod php7.0
```

#### 4. Restart Apache

```bash
sudo systemctl restart apache2
```

#### 5. Verify PHP Installation

Create a test file to verify PHP is working:

```bash
echo "<?php phpinfo(); ?>" | sudo tee /var/www/html/info.php
```

Then visit `http://your-domain.com/info.php` in your browser. You should see the PHP info page.

#### 6. Create Data Directory for JSON Storage

The milk vote application stores data in JSON files. Create the data directory with proper permissions:

```bash
sudo mkdir -p /var/www/html/data
sudo chmod 755 /var/www/html/data
sudo chown www-data:www-data /var/www/html/data
```

**Note**: The `/data` directory is excluded from version control via `.gitignore` to prevent committing user data.

## Maintenance

### Updating Content

- Edit `index.html` to update text content and structure
- Modify `css/styles.css` for styling changes
- Update `js/page.js` for functionality changes

### Future Changes

- Add HTTPS
