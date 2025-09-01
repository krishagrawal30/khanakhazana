# KhanaKhazana .tech Domain Deployment Guide

## Overview
This guide will help you deploy the KhanaKhazana restaurant website to a .tech domain using GitHub Pages.

## Prerequisites
- GitHub repository with the website files
- A .tech domain purchased from a domain registrar
- Access to your domain's DNS settings

## Step-by-Step Deployment

### 1. Repository Setup
✅ Your repository already contains:
- `CNAME` file with your .tech domain
- `package.json` for project configuration
- All website files (restaurant.html, order.html, etc.)

### 2. GitHub Pages Configuration

1. **Go to your repository settings**:
   - Navigate to https://github.com/krishagrawal30/khanakhazana/settings
   - Scroll down to the "Pages" section

2. **Configure GitHub Pages**:
   - Source: "Deploy from a branch"
   - Branch: "main" (or "master")
   - Folder: "/ (root)"
   - Custom domain: `khanakhazana.tech`

3. **Save the configuration**

### 3. Domain DNS Configuration

Configure your .tech domain's DNS settings with these records:

#### For root domain (khanakhazana.tech):
```
Type: A
Name: @
TTL: 3600
Values:
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

#### For www subdomain (www.khanakhazana.tech):
```
Type: CNAME
Name: www
TTL: 3600
Value: krishagrawal30.github.io
```

### 4. Verify Configuration

1. **Check DNS propagation** (may take 24-48 hours):
   ```bash
   nslookup khanakhazana.tech
   nslookup www.khanakhazana.tech
   ```

2. **Test the website**:
   - Visit https://khanakhazana.tech
   - Verify all pages load correctly
   - Test the ordering system

### 5. SSL Certificate
GitHub automatically provides SSL certificates for custom domains. After DNS propagation, your site will be accessible via HTTPS.

## Troubleshooting

### Common Issues:

1. **Domain not working after 24 hours**:
   - Check DNS configuration
   - Verify CNAME file contains correct domain
   - Ensure GitHub Pages is enabled

2. **SSL certificate issues**:
   - Wait for DNS propagation to complete
   - Check GitHub Pages settings
   - Try accessing via HTTPS

3. **404 errors**:
   - Ensure main branch contains all files
   - Check that restaurant.html is in the root directory
   - Verify GitHub Pages deployment status

### Testing Locally:

```bash
# Start local development server
npm start
# or
python3 -m http.server 8000

# Visit http://localhost:8000/restaurant.html
```

## File Structure for .tech Domain

```
khanakhazana/
├── CNAME                 # Contains: khanakhazana.tech
├── restaurant.html       # Main homepage (GitHub Pages default)
├── order.html           # Ordering page
├── style.css            # Stylesheet
├── script.js            # JavaScript functionality
├── package.json         # Project configuration
├── README.md            # Documentation
├── images/              # Image assets
│   ├── paneer.jpg
│   ├── dosa.jpg
│   ├── biryani.jpg
│   └── ... (other food images)
└── culture.mp4          # Video content
```

## Important Notes

1. **Main Page**: GitHub Pages serves `index.html` by default. Since your main file is `restaurant.html`, visitors should go to `khanakhazana.tech/restaurant.html` or you can rename it to `index.html`.

2. **SSL**: Always use HTTPS once SSL is configured.

3. **Caching**: DNS changes can take up to 48 hours to propagate globally.

4. **Monitoring**: Check GitHub repository's "Actions" tab to monitor deployment status.

## Support

For technical support:
- GitHub Pages: https://docs.github.com/en/pages
- .tech Domain: Contact your domain registrar
- Website Issues: Create an issue in the GitHub repository

---

**Your KhanaKhazana website will be live at https://khanakhazana.tech! 🍛**