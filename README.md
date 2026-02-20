# Personal Website (Flask)

This workspace contains a simple personal website for Richard Ma built with Flask.

## Features

- Home page with photo, hobbies, and work summary
- About page with background details
- Contact page with email and social links in the footer
- Blog section; write posts as markdown files
- Responsive, clean layout suitable for mobile devices

## Setup

```bash
python -m venv venv          # create virtual environment (optional)
source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
```

## Run

```bash
python app.py
```

Visit http://127.0.0.1:5050 in your browser.

## Structure

- `app.py` – Flask application with routes and blog loader
- `templates/` – Jinja2 HTML templates
- `static/css/style.css` – basic styling
- `static/images/` – place profile or hobby photos here
- `posts/` – markdown files for blog entries
- `requirements.txt` – dependencies

Feel free to edit the templates, CSS, and create new blog posts by adding `.md` files to `posts/`.  Each post supports a simple front matter section for title and date:

```markdown
---
title: "Post Title"
date: 2026-02-17
---
Content here...
```

You can update the footer links with your own social media profiles and drop a photo named `profile.jpg` into `static/images/`.  The layout is responsive and mobile-friendly—modify the CSS as desired.