
import os
from flask import Flask, render_template, abort, request, redirect, url_for
import datetime
import markdown
import random
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Extra 1.5 page (alternate)
@app.route('/page-1-5')
def page_1_5_extra():
    return render_template('page_1_5.html')

# Route for 1.5 Offline Games (alternate)
@app.route('/1.5')
def page_1_5():
    return render_template('1_5.html')

# 1.4 Picture Galleries main page
@app.route('/pictures')
def pictures(): 
    return render_template('pictures.html', title='1.4 Picture Galleries')

# Route for Offline Games (page 1.5)
@app.route('/offline-games')
def offline_games():
    return render_template('offline_games.html')

# My Photos gallery
@app.route('/pictures/my-photos')
def my_photos():
    gallery_dir = os.path.join(os.path.dirname(__file__), 'static', 'images', 'gallery')
    try:
        files = [f for f in os.listdir(gallery_dir) if os.path.isfile(os.path.join(gallery_dir, f))]
    except FileNotFoundError:
        files = []
    random.shuffle(files)
    size_choices = ['small', 'medium', 'large']
    images = [{'filename': f, 'size': random.choice(size_choices)} for f in files]
    return render_template(
        'gallery.html',
        title='My Photos',
        images=images,
        image_folder='images/gallery/',
        upload_endpoint='upload_gallery',
        delete_endpoint='delete_gallery_image'
    )

# Random Photos gallery
@app.route('/pictures/random-photos')
def random_photos():
    gallery_dir = os.path.join(os.path.dirname(__file__), 'static', 'images', 'gallery', 'random')
    try:
        files = [f for f in os.listdir(gallery_dir) if os.path.isfile(os.path.join(gallery_dir, f))]
    except FileNotFoundError:
        files = []
    random.shuffle(files)
    size_choices = ['small', 'medium', 'large']
    images = [{'filename': f, 'size': random.choice(size_choices)} for f in files]
    return render_template(
        'gallery.html',
        title='Random Photos',
        images=images,
        image_folder='images/gallery/random/',
        upload_endpoint='upload_gallery_random',
        delete_endpoint='delete_gallery_random_image'
    )

# Dedicated galleries page
@app.route('/galleries')
def galleries():
    return render_template('galleries.html', title='Photo & Anime Galleries')

@app.context_processor

def inject_year():
    return {'year': datetime.datetime.now().year}

# simple blog loader
POSTS_DIR = os.path.join(os.path.dirname(__file__), 'posts')

def load_posts():
    posts = []
    for fname in os.listdir(POSTS_DIR):
        if not fname.endswith('.md'):
            continue
        slug = fname[:-3]
        path = os.path.join(POSTS_DIR, fname)
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
        # parse front matter
        meta = {}
        content = text
        if text.startswith('---'):
            parts = text.split('---', 2)
            if len(parts) >= 3:
                _, fm, rest = parts
                content = rest
                for line in fm.splitlines():
                    if ':' in line:
                        key, val = line.split(':', 1)
                        meta[key.strip()] = val.strip().strip('"')
        html = markdown.markdown(content)
        post = {
            'slug': slug,
            'title': meta.get('title', slug.replace('-', ' ').title()),
            'date': meta.get('date', ''),
            'content': html
        }
        posts.append(post)
    # sort by date descending if date present
    posts.sort(key=lambda p: p['date'], reverse=True)
    return posts

@app.route('/')

def index():
    # optionally specify images for each section (place them under static/images)
    return render_template('index.html', title='Home',
                           welcome_img='images/welcome.jpg',
                           hobbies_img='images/hobbies.jpg',
                           work_img='images/work.jpg',
                           contact_img='images/contact.jpg')

@app.route('/about')

def about():
    return render_template('about.html', title='About')

@app.route('/contact')

def contact():
    return render_template('contact.html', title='Contact')

@app.route('/richard')

def richard():
    return render_template('richard.html', title='Richard')

@app.route('/gallery')
def gallery():
    # list files in static/images/gallery
    gallery_dir = os.path.join(os.path.dirname(__file__), 'static', 'images', 'gallery')
    try:
        files = [f for f in os.listdir(gallery_dir) if os.path.isfile(os.path.join(gallery_dir, f))]
    except FileNotFoundError:
        files = []
    # shuffle and assign a random size class to create a Pinterest-like layout
    random.shuffle(files)
    size_choices = ['small', 'medium', 'large']
    images = [{'filename': f, 'size': random.choice(size_choices)} for f in files]
    return render_template(
        'gallery.html',
        title='Gallery',
        images=images,
        image_folder='images/gallery/',
        upload_endpoint='upload_gallery',
        delete_endpoint='delete_gallery_image'
    )


# helper/validators ---------------------------------------------------------
# common image extensions; include BMP, SVG, TIFF, ICO, HEIC etc
ALLOWED_IMAGE = {'png','jpg','jpeg','gif','webp','bmp','svg','tiff','tif','ico','heic'}
ALLOWED_PDF = {'pdf'}
ALLOWED_NOTE_CATEGORIES = {
    'science': ('physics', 'bio', 'chem'),
    'math': ('linear-quadratic-functions', 'radicals', 'systems-of-equations',
             'trigonometry', 'finance', 'rational-expressions-equations', 'inequalities')
}

def allowed_file(filename, allowed_set):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in allowed_set


def save_upload(file_storage, dst_folder):
    if file_storage and allowed_file(file_storage.filename, ALLOWED_IMAGE | ALLOWED_PDF):
        filename = secure_filename(file_storage.filename)
        os.makedirs(dst_folder, exist_ok=True)
        file_storage.save(os.path.join(dst_folder, filename))
        return filename
    return None


def delete_uploaded_file(dst_folder, filename, allowed_set):
    safe_name = secure_filename(filename)
    if not safe_name or safe_name != filename or not allowed_file(safe_name, allowed_set):
        return False
    target_path = os.path.abspath(os.path.join(dst_folder, safe_name))
    folder_path = os.path.abspath(dst_folder)
    if not target_path.startswith(folder_path + os.sep):
        return False
    if os.path.isfile(target_path):
        os.remove(target_path)
        return True
    return False


# upload endpoints ---------------------------------------------------------
@app.route('/upload/gallery', methods=['POST'])
def upload_gallery():
    file = request.files.get('file')
    if file and allowed_file(file.filename, ALLOWED_IMAGE):
        save_upload(file, os.path.join(os.path.dirname(__file__), 'static', 'images', 'gallery'))
    return redirect(request.referrer or url_for('gallery'))


@app.route('/upload/gallery/anime', methods=['POST'])
def upload_gallery_anime():
    file = request.files.get('file')
    if file and allowed_file(file.filename, ALLOWED_IMAGE):
        save_upload(file, os.path.join(os.path.dirname(__file__), 'static', 'images', 'gallery', 'anime'))
    return redirect(request.referrer or url_for('gallery_anime'))


@app.route('/upload/gallery/random', methods=['POST'])
def upload_gallery_random():
    file = request.files.get('file')
    if file and allowed_file(file.filename, ALLOWED_IMAGE):
        save_upload(file, os.path.join(os.path.dirname(__file__), 'static', 'images', 'gallery', 'random'))
    return redirect(request.referrer or url_for('random_photos'))


@app.route('/upload/notes/<category>/<subject>', methods=['POST'])
def upload_notes(category, subject):
    file = request.files.get('file')
    if category not in ALLOWED_NOTE_CATEGORIES or subject not in ALLOWED_NOTE_CATEGORIES[category]:
        abort(404)
    if file and allowed_file(file.filename, ALLOWED_IMAGE):
        dst = os.path.join(os.path.dirname(__file__), 'static', 'images', 'notes', category, subject)
        save_upload(file, dst)
    return redirect(request.referrer or url_for('science_gallery' if category=='science' else 'math_gallery', subject=subject))


@app.route('/upload/docs/<category>/<subject>', methods=['POST'])
def upload_docs(category, subject):
    file = request.files.get('file')
    if category not in ALLOWED_NOTE_CATEGORIES or subject not in ALLOWED_NOTE_CATEGORIES[category]:
        abort(404)
    if file and allowed_file(file.filename, ALLOWED_PDF):
        dst = os.path.join(os.path.dirname(__file__), 'static', 'docs', category, subject)
        save_upload(file, dst)
    # redirect back to same gallery view
    return redirect(request.referrer or url_for('science_gallery' if category=='science' else 'math_gallery', subject=subject))


@app.route('/delete/docs/<category>/<subject>/<filename>', methods=['POST'])
def delete_docs_file(category, subject, filename):
    if category not in ALLOWED_NOTE_CATEGORIES or subject not in ALLOWED_NOTE_CATEGORIES[category]:
        abort(404)
    delete_uploaded_file(
        os.path.join(os.path.dirname(__file__), 'static', 'docs', category, subject),
        filename,
        ALLOWED_PDF
    )
    return redirect(request.referrer or url_for('science_gallery' if category == 'science' else 'math_gallery', subject=subject))


@app.route('/delete/gallery/<filename>', methods=['POST'])
def delete_gallery_image(filename):
    delete_uploaded_file(
        os.path.join(os.path.dirname(__file__), 'static', 'images', 'gallery'),
        filename,
        ALLOWED_IMAGE
    )
    return redirect(request.referrer or url_for('gallery'))


@app.route('/delete/gallery/anime/<filename>', methods=['POST'])
def delete_gallery_anime_image(filename):
    delete_uploaded_file(
        os.path.join(os.path.dirname(__file__), 'static', 'images', 'gallery', 'anime'),
        filename,
        ALLOWED_IMAGE
    )
    return redirect(request.referrer or url_for('gallery_anime'))


@app.route('/delete/gallery/random/<filename>', methods=['POST'])
def delete_gallery_random_image(filename):
    delete_uploaded_file(
        os.path.join(os.path.dirname(__file__), 'static', 'images', 'gallery', 'random'),
        filename,
        ALLOWED_IMAGE
    )
    return redirect(request.referrer or url_for('random_photos'))


@app.route('/delete/notes/<category>/<subject>/<filename>', methods=['POST'])
def delete_notes_image(category, subject, filename):
    if category not in ALLOWED_NOTE_CATEGORIES or subject not in ALLOWED_NOTE_CATEGORIES[category]:
        abort(404)
    delete_uploaded_file(
        os.path.join(os.path.dirname(__file__), 'static', 'images', 'notes', category, subject),
        filename,
        ALLOWED_IMAGE
    )
    return redirect(request.referrer or url_for('science_gallery' if category == 'science' else 'math_gallery', subject=subject))


@app.route('/gallery/anime')
def gallery_anime():
    # list files in static/images/gallery/anime
    gallery_dir = os.path.join(os.path.dirname(__file__), 'static', 'images', 'gallery', 'anime')
    try:
        files = [f for f in os.listdir(gallery_dir) if os.path.isfile(os.path.join(gallery_dir, f))]
    except FileNotFoundError:
        files = []
    random.shuffle(files)
    size_choices = ['small', 'medium', 'large']
    images = [{'filename': f, 'size': random.choice(size_choices)} for f in files]
    return render_template(
        'gallery_anime.html',
        title="Richard Ma's Anime Gallery",
        images=images,
        delete_endpoint='delete_gallery_anime_image'
    )


# science notes overview
@app.route('/science')
def science():
    return render_template('science.html', title='Science Notes')


# per-subject gallery
@app.route('/science/<subject>')
def science_gallery(subject):
    # allowed subjects
    if subject not in ('physics', 'bio', 'chem'):
        abort(404)
    gallery_dir = os.path.join(os.path.dirname(__file__), 'static', 'images', 'notes', 'science', subject)
    try:
        files = [f for f in os.listdir(gallery_dir) if os.path.isfile(os.path.join(gallery_dir, f))]
    except FileNotFoundError:
        files = []
    random.shuffle(files)
    size_choices = ['small', 'medium', 'large']
    images = [{'filename': f, 'size': random.choice(size_choices)} for f in files]
    # teacher PDFs
    docs_dir = os.path.join(os.path.dirname(__file__), 'static', 'docs', 'science', subject)
    try:
        teacher_pdfs = [f for f in os.listdir(docs_dir) if f.lower().endswith('.pdf')]
    except FileNotFoundError:
        teacher_pdfs = []
    return render_template('science_gallery.html', title=f"{subject.capitalize()} Notes", subject=subject, category='science', images=images, teacher_pdfs=teacher_pdfs)


# math notes overview
@app.route('/math')
def math():
    return render_template('math.html', title='Math Notes')


# per-topic math gallery
@app.route('/math/<subject>')
def math_gallery(subject):
    allowed = ('linear-quadratic-functions','radicals','systems-of-equations',
               'trigonometry','finance','rational-expressions-equations','inequalities')
    if subject not in allowed:
        abort(404)
    gallery_dir = os.path.join(os.path.dirname(__file__), 'static', 'images', 'notes', 'math', subject)
    try:
        files = [f for f in os.listdir(gallery_dir) if os.path.isfile(os.path.join(gallery_dir, f))]
    except FileNotFoundError:
        files = []
    random.shuffle(files)
    size_choices = ['small', 'medium', 'large']
    images = [{'filename': f, 'size': random.choice(size_choices)} for f in files]
    # teacher PDFs for math
    docs_dir = os.path.join(os.path.dirname(__file__), 'static', 'docs', 'math', subject)
    try:
        teacher_pdfs = [f for f in os.listdir(docs_dir) if f.lower().endswith('.pdf')]
    except FileNotFoundError:
        teacher_pdfs = []
    return render_template('science_gallery.html', title=f"{subject.replace('-', ' ').capitalize()} Notes", subject=subject, category='math', images=images, teacher_pdfs=teacher_pdfs)

@app.route('/blog')

def blog_index():
    posts = load_posts()
    return render_template('blog_index.html', title='Blog', posts=posts)

@app.route('/blog/<slug>')

def blog_post(slug):
    posts = load_posts()
    for post in posts:
        if post['slug'] == slug:
            return render_template('blog_post.html', title=post['title'], post=post)
    abort(404)

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5050))
    app.run(debug=False, host='0.0.0.0', port=port)