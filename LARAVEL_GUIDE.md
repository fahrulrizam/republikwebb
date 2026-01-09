# Panduan Lengkap: Website Republikweb.net dengan Laravel

## Daftar Isi
1. [Persiapan & Instalasi](#persiapan--instalasi)
2. [Setup Project Laravel](#setup-project-laravel)
3. [Konfigurasi Database](#konfigurasi-database)
4. [Membuat Database Migrations](#membuat-database-migrations)
5. [Membuat Models](#membuat-models)
6. [Membuat Controllers](#membuat-controllers)
7. [Membuat Routes](#membuat-routes)
8. [Membuat Views (Blade Templates)](#membuat-views-blade-templates)
9. [Authentication & Admin](#authentication--admin)
10. [File Upload](#file-upload)
11. [Seeding Data](#seeding-data)
12. [Testing](#testing)
13. [Deployment](#deployment)

---

## Persiapan & Instalasi

### Requirements
- PHP 8.1 atau lebih tinggi
- Composer
- MySQL/PostgreSQL
- Node.js & NPM (untuk Tailwind CSS)

### Install Laravel
```bash
composer create-project laravel/laravel republikweb-internship
cd republikweb-internship
```

### Install Dependencies
```bash
# Install Laravel Breeze untuk authentication
composer require laravel/breeze --dev
php artisan breeze:install blade
npm install
npm run build

# Install package tambahan
composer require intervention/image
```

---

## Setup Project Laravel

### Struktur Folder Yang Akan Dibuat
```
republikweb-internship/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── HomeController.php
│   │   │   ├── PositionController.php
│   │   │   ├── ApplicationController.php
│   │   │   └── Admin/
│   │   │       ├── DashboardController.php
│   │   │       ├── ApplicationController.php
│   │   │       ├── PositionController.php
│   │   │       ├── TestimonialController.php
│   │   │       └── GalleryController.php
│   │   └── Middleware/
│   │       └── AdminMiddleware.php
│   ├── Models/
│   │   ├── Position.php
│   │   ├── Application.php
│   │   ├── Testimonial.php
│   │   ├── GalleryItem.php
│   │   └── BlogPost.php
│   └── Mail/
│       └── NewApplicationNotification.php
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   └── views/
│       ├── layouts/
│       ├── home/
│       ├── admin/
│       └── emails/
└── routes/
    ├── web.php
    └── admin.php
```

---

## Konfigurasi Database

### Edit `.env`
```env
APP_NAME="Republikweb Internship"
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=republikweb_internship
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info@republikweb.net
MAIL_FROM_NAME="${APP_NAME}"
```

### Buat Database
```bash
mysql -u root -p
CREATE DATABASE republikweb_internship CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

## Membuat Database Migrations

### 1. Migration: Positions Table
```bash
php artisan make:migration create_positions_table
```

**File: `database/migrations/xxxx_create_positions_table.php`**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('positions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('requirements');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('positions');
    }
};
```

### 2. Migration: Applications Table
```bash
php artisan make:migration create_applications_table
```

**File: `database/migrations/xxxx_create_applications_table.php`**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('position_id')->constrained()->onDelete('cascade');
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->string('school_university');
            $table->string('major');
            $table->string('cv_url');
            $table->text('motivation');
            $table->enum('status', ['pending', 'reviewed', 'accepted', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
```

### 3. Migration: Testimonials Table
```bash
php artisan make:migration create_testimonials_table
```

**File: `database/migrations/xxxx_create_testimonials_table.php`**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('position');
            $table->string('photo_url')->nullable();
            $table->text('content');
            $table->tinyInteger('rating')->default(5);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
```

### 4. Migration: Gallery Items Table
```bash
php artisan make:migration create_gallery_items_table
```

**File: `database/migrations/xxxx_create_gallery_items_table.php`**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('media_url');
            $table->enum('media_type', ['image', 'video'])->default('image');
            $table->text('caption')->nullable();
            $table->boolean('is_published')->default(false);
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_items');
    }
};
```

### 5. Migration: Blog Posts Table
```bash
php artisan make:migration create_blog_posts_table
```

**File: `database/migrations/xxxx_create_blog_posts_table.php`**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->text('excerpt')->nullable();
            $table->string('cover_image_url')->nullable();
            $table->string('author')->default('Republikweb Team');
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
```

### 6. Migration: Add Admin Role to Users
```bash
php artisan make:migration add_admin_fields_to_users_table
```

**File: `database/migrations/xxxx_add_admin_fields_to_users_table.php`**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['user', 'admin', 'super_admin'])->default('user')->after('email');
            $table->boolean('is_active')->default(true)->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'is_active']);
        });
    }
};
```

### Jalankan Migrations
```bash
php artisan migrate
```

---

## Membuat Models

### 1. Model: Position
```bash
php artisan make:model Position
```

**File: `app/Models/Position.php`**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Position extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'requirements',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Automatically generate slug from title
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($position) {
            if (empty($position->slug)) {
                $position->slug = Str::slug($position->title);
            }
        });
    }

    // Relationships
    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
```

### 2. Model: Application
```bash
php artisan make:model Application
```

**File: `app/Models/Application.php`**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'position_id',
        'full_name',
        'email',
        'phone',
        'school_university',
        'major',
        'cv_url',
        'motivation',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    // Relationships
    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeReviewed($query)
    {
        return $query->where('status', 'reviewed');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    // Accessors
    public function getStatusBadgeColorAttribute()
    {
        return match($this->status) {
            'pending' => 'yellow',
            'reviewed' => 'blue',
            'accepted' => 'green',
            'rejected' => 'red',
            default => 'gray',
        };
    }
}
```

### 3. Model: Testimonial
```bash
php artisan make:model Testimonial
```

**File: `app/Models/Testimonial.php`**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'position',
        'photo_url',
        'content',
        'rating',
        'is_published',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_published' => 'boolean',
    ];

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
```

### 4. Model: GalleryItem
```bash
php artisan make:model GalleryItem
```

**File: `app/Models/GalleryItem.php`**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GalleryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'media_url',
        'media_type',
        'caption',
        'is_published',
        'display_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'display_order' => 'integer',
    ];

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                    ->orderBy('display_order');
    }
}
```

### 5. Model: BlogPost
```bash
php artisan make:model BlogPost
```

**File: `app/Models/BlogPost.php`**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BlogPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'cover_image_url',
        'author',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    // Auto-generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }
        });
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                    ->whereNotNull('published_at')
                    ->orderBy('published_at', 'desc');
    }
}
```

---

## Membuat Controllers

### 1. Controller: HomeController
```bash
php artisan make:controller HomeController
```

**File: `app/Http/Controllers/HomeController.php`**
```php
<?php

namespace App\Http\Controllers;

use App\Models\Position;
use App\Models\Testimonial;
use App\Models\GalleryItem;
use App\Models\BlogPost;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $positions = Position::active()->get();
        $testimonials = Testimonial::published()->take(6)->get();
        $galleryItems = GalleryItem::published()->take(8)->get();
        $blogPosts = BlogPost::published()->take(3)->get();

        return view('home.index', compact('positions', 'testimonials', 'galleryItems', 'blogPosts'));
    }
}
```

### 2. Controller: ApplicationController
```bash
php artisan make:controller ApplicationController
```

**File: `app/Http/Controllers/ApplicationController.php`**
```php
<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Position;
use App\Mail\NewApplicationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'position_id' => 'required|exists:positions,id',
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'school_university' => 'required|string|max:255',
            'major' => 'required|string|max:255',
            'cv_url' => 'required|url',
            'motivation' => 'required|string|min:50',
        ], [
            'position_id.required' => 'Silakan pilih posisi yang dilamar',
            'position_id.exists' => 'Posisi yang dipilih tidak valid',
            'full_name.required' => 'Nama lengkap wajib diisi',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'phone.required' => 'Nomor WhatsApp wajib diisi',
            'school_university.required' => 'Sekolah/Universitas wajib diisi',
            'major.required' => 'Jurusan wajib diisi',
            'cv_url.required' => 'Link CV/Portfolio wajib diisi',
            'cv_url.url' => 'Format URL tidak valid',
            'motivation.required' => 'Motivasi wajib diisi',
            'motivation.min' => 'Motivasi minimal 50 karakter',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $application = Application::create($validator->validated());

        // Send email notification
        try {
            Mail::to(config('mail.admin_email', 'info@republikweb.net'))
                ->send(new NewApplicationNotification($application));
        } catch (\Exception $e) {
            \Log::error('Failed to send application email: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Aplikasi Anda telah berhasil dikirim! Kami akan menghubungi Anda segera.');
    }
}
```

### 3. Admin Controllers

#### AdminDashboardController
```bash
php artisan make:controller Admin/DashboardController
```

**File: `app/Http/Controllers/Admin/DashboardController.php`**
```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Position;
use App\Models\Testimonial;
use App\Models\GalleryItem;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_applications' => Application::count(),
            'pending_applications' => Application::pending()->count(),
            'reviewed_applications' => Application::reviewed()->count(),
            'accepted_applications' => Application::accepted()->count(),
            'rejected_applications' => Application::rejected()->count(),
            'active_positions' => Position::active()->count(),
            'total_testimonials' => Testimonial::count(),
            'total_gallery_items' => GalleryItem::count(),
        ];

        $recent_applications = Application::with('position')
            ->latest()
            ->take(10)
            ->get();

        return view('admin.dashboard', compact('stats', 'recent_applications'));
    }
}
```

#### AdminApplicationController
```bash
php artisan make:controller Admin/ApplicationController
```

**File: `app/Http/Controllers/Admin/ApplicationController.php`**
```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $query = Application::with('position')->latest();

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $applications = $query->paginate(20);

        return view('admin.applications.index', compact('applications'));
    }

    public function show(Application $application)
    {
        $application->load('position');
        return view('admin.applications.show', compact('application'));
    }

    public function updateStatus(Request $request, Application $application)
    {
        $request->validate([
            'status' => 'required|in:pending,reviewed,accepted,rejected',
        ]);

        $application->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status aplikasi berhasil diupdate');
    }

    public function destroy(Application $application)
    {
        $application->delete();
        return redirect()->route('admin.applications.index')->with('success', 'Aplikasi berhasil dihapus');
    }
}
```

#### AdminPositionController
```bash
php artisan make:controller Admin/PositionController --resource
```

**File: `app/Http/Controllers/Admin/PositionController.php`**
```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PositionController extends Controller
{
    public function index()
    {
        $positions = Position::withCount('applications')->latest()->get();
        return view('admin.positions.index', compact('positions'));
    }

    public function create()
    {
        return view('admin.positions.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['is_active'] = $request->has('is_active');

        Position::create($validated);

        return redirect()->route('admin.positions.index')->with('success', 'Posisi berhasil ditambahkan');
    }

    public function edit(Position $position)
    {
        return view('admin.positions.edit', compact('position'));
    }

    public function update(Request $request, Position $position)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['is_active'] = $request->has('is_active');

        $position->update($validated);

        return redirect()->route('admin.positions.index')->with('success', 'Posisi berhasil diupdate');
    }

    public function destroy(Position $position)
    {
        $position->delete();
        return redirect()->route('admin.positions.index')->with('success', 'Posisi berhasil dihapus');
    }
}
```

#### AdminTestimonialController
```bash
php artisan make:controller Admin/TestimonialController --resource
```

**File: `app/Http/Controllers/Admin/TestimonialController.php`**
```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::latest()->get();
        return view('admin.testimonials.index', compact('testimonials'));
    }

    public function create()
    {
        return view('admin.testimonials.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'photo_url' => 'nullable|url',
            'content' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'is_published' => 'boolean',
        ]);

        $validated['is_published'] = $request->has('is_published');

        Testimonial::create($validated);

        return redirect()->route('admin.testimonials.index')->with('success', 'Testimonial berhasil ditambahkan');
    }

    public function edit(Testimonial $testimonial)
    {
        return view('admin.testimonials.edit', compact('testimonial'));
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'photo_url' => 'nullable|url',
            'content' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'is_published' => 'boolean',
        ]);

        $validated['is_published'] = $request->has('is_published');

        $testimonial->update($validated);

        return redirect()->route('admin.testimonials.index')->with('success', 'Testimonial berhasil diupdate');
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return redirect()->route('admin.testimonials.index')->with('success', 'Testimonial berhasil dihapus');
    }
}
```

#### AdminGalleryController
```bash
php artisan make:controller Admin/GalleryController --resource
```

**File: `app/Http/Controllers/Admin/GalleryController.php`**
```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
    {
        $items = GalleryItem::orderBy('display_order')->get();
        return view('admin.gallery.index', compact('items'));
    }

    public function create()
    {
        return view('admin.gallery.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'media_url' => 'required|url',
            'media_type' => 'required|in:image,video',
            'caption' => 'nullable|string',
            'display_order' => 'nullable|integer',
            'is_published' => 'boolean',
        ]);

        $validated['is_published'] = $request->has('is_published');
        $validated['display_order'] = $validated['display_order'] ?? GalleryItem::max('display_order') + 1;

        GalleryItem::create($validated);

        return redirect()->route('admin.gallery.index')->with('success', 'Gallery item berhasil ditambahkan');
    }

    public function edit(GalleryItem $gallery)
    {
        return view('admin.gallery.edit', compact('gallery'));
    }

    public function update(Request $request, GalleryItem $gallery)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'media_url' => 'required|url',
            'media_type' => 'required|in:image,video',
            'caption' => 'nullable|string',
            'display_order' => 'nullable|integer',
            'is_published' => 'boolean',
        ]);

        $validated['is_published'] = $request->has('is_published');

        $gallery->update($validated);

        return redirect()->route('admin.gallery.index')->with('success', 'Gallery item berhasil diupdate');
    }

    public function destroy(GalleryItem $gallery)
    {
        $gallery->delete();
        return redirect()->route('admin.gallery.index')->with('success', 'Gallery item berhasil dihapus');
    }
}
```

---

## Membuat Middleware Admin

```bash
php artisan make:middleware AdminMiddleware
```

**File: `app/Http/Middleware/AdminMiddleware.php`**
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        if (!in_array(auth()->user()->role, ['admin', 'super_admin'])) {
            abort(403, 'Unauthorized access');
        }

        return $next($request);
    }
}
```

**Daftarkan di `app/Http/Kernel.php` atau `bootstrap/app.php` (Laravel 11)**
```php
// Laravel 10 - app/Http/Kernel.php
protected $middlewareAliases = [
    // ... existing middlewares
    'admin' => \App\Http\Middleware\AdminMiddleware::class,
];

// Laravel 11 - bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\AdminMiddleware::class,
    ]);
})
```

---

## Membuat Routes

### File: `routes/web.php`
```php
<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::post('/applications', [ApplicationController::class, 'store'])->name('applications.store');

// Auth Routes (from Breeze)
require __DIR__.'/auth.php';

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    require __DIR__.'/admin.php';
});
```

### File: `routes/admin.php` (buat file baru)
```php
<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ApplicationController;
use App\Http\Controllers\Admin\PositionController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\GalleryController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// Applications Management
Route::prefix('applications')->name('applications.')->group(function () {
    Route::get('/', [ApplicationController::class, 'index'])->name('index');
    Route::get('/{application}', [ApplicationController::class, 'show'])->name('show');
    Route::patch('/{application}/status', [ApplicationController::class, 'updateStatus'])->name('update-status');
    Route::delete('/{application}', [ApplicationController::class, 'destroy'])->name('destroy');
});

// Positions Management
Route::resource('positions', PositionController::class);

// Testimonials Management
Route::resource('testimonials', TestimonialController::class);

// Gallery Management
Route::resource('gallery', GalleryController::class);
```

---

## Membuat Views (Blade Templates)

### 1. Layout Utama

**File: `resources/views/layouts/app.blade.php`**
```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel') }} - @yield('title', 'Home')</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        html {
            scroll-behavior: smooth;
        }
    </style>
</head>
<body class="antialiased">
    @include('layouts.navbar')

    <main>
        @yield('content')
    </main>

    @include('layouts.footer')

    @stack('scripts')
</body>
</html>
```

**File: `resources/views/layouts/navbar.blade.php`**
```blade
<nav id="navbar" class="fixed w-full z-50 transition-all duration-300 py-6 bg-transparent">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
            <a href="{{ route('home') }}" class="flex items-center gap-2">
                <svg class="w-8 h-8 navbar-icon text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span class="text-2xl font-bold navbar-text text-white">Republikweb</span>
            </a>

            <div class="hidden lg:flex items-center gap-8">
                <a href="#about" class="navbar-link font-semibold text-white hover:text-orange-500 transition-colors">Tentang</a>
                <a href="#positions" class="navbar-link font-semibold text-white hover:text-orange-500 transition-colors">Posisi</a>
                <a href="#gallery" class="navbar-link font-semibold text-white hover:text-orange-500 transition-colors">Galeri</a>
                <a href="#testimonials" class="navbar-link font-semibold text-white hover:text-orange-500 transition-colors">Testimoni</a>
                <a href="#faq" class="navbar-link font-semibold text-white hover:text-orange-500 transition-colors">FAQ</a>
                <a href="#contact" class="navbar-link font-semibold text-white hover:text-orange-500 transition-colors">Kontak</a>
                <a href="#application-form" class="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105">
                    Daftar Sekarang
                </a>
            </div>

            <button id="mobile-menu-btn" class="lg:hidden navbar-text text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>

        <div id="mobile-menu" class="hidden lg:hidden mt-4">
            <div class="flex flex-col gap-4 bg-white rounded-2xl p-6 shadow-xl">
                <a href="#about" class="text-blue-900 hover:text-orange-500 font-semibold py-2">Tentang</a>
                <a href="#positions" class="text-blue-900 hover:text-orange-500 font-semibold py-2">Posisi</a>
                <a href="#gallery" class="text-blue-900 hover:text-orange-500 font-semibold py-2">Galeri</a>
                <a href="#testimonials" class="text-blue-900 hover:text-orange-500 font-semibold py-2">Testimoni</a>
                <a href="#faq" class="text-blue-900 hover:text-orange-500 font-semibold py-2">FAQ</a>
                <a href="#contact" class="text-blue-900 hover:text-orange-500 font-semibold py-2">Kontak</a>
                <a href="#application-form" class="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full text-center mt-2">
                    Daftar Sekarang
                </a>
            </div>
        </div>
    </div>
</nav>

<script>
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        const navbarLinks = document.querySelectorAll('.navbar-link');
        const navbarText = document.querySelectorAll('.navbar-text');
        const navbarIcon = document.querySelectorAll('.navbar-icon');

        if (window.scrollY > 50) {
            navbar.classList.add('bg-white', 'shadow-lg', 'py-4');
            navbar.classList.remove('bg-transparent', 'py-6');
            navbarLinks.forEach(link => {
                link.classList.remove('text-white');
                link.classList.add('text-blue-900');
            });
            navbarText.forEach(text => {
                text.classList.remove('text-white');
                text.classList.add('text-blue-900');
            });
            navbarIcon.forEach(icon => {
                icon.classList.remove('text-white');
                icon.classList.add('text-orange-500');
            });
        } else {
            navbar.classList.remove('bg-white', 'shadow-lg', 'py-4');
            navbar.classList.add('bg-transparent', 'py-6');
            navbarLinks.forEach(link => {
                link.classList.remove('text-blue-900');
                link.classList.add('text-white');
            });
            navbarText.forEach(text => {
                text.classList.remove('text-blue-900');
                text.classList.add('text-white');
            });
            navbarIcon.forEach(icon => {
                icon.classList.remove('text-orange-500');
                icon.classList.add('text-white');
            });
        }
    });

    // Mobile menu toggle
    document.getElementById('mobile-menu-btn').addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.classList.toggle('hidden');
    });
</script>
```

**File: `resources/views/layouts/footer.blade.php`**
```blade
<footer class="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
                <div class="flex items-center gap-2 mb-4">
                    <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span class="text-2xl font-bold">Republikweb</span>
                </div>
                <p class="text-blue-200 mb-4 leading-relaxed">
                    Agensi digital yang fokus pada website development, app creation, dan SEO services. Membangun karir digital Anda bersama kami.
                </p>
            </div>

            <div>
                <h3 class="text-lg font-bold mb-4">Quick Links</h3>
                <ul class="space-y-2">
                    <li><a href="#about" class="text-blue-200 hover:text-orange-500 transition-colors">Tentang Program</a></li>
                    <li><a href="#positions" class="text-blue-200 hover:text-orange-500 transition-colors">Posisi Tersedia</a></li>
                    <li><a href="#gallery" class="text-blue-200 hover:text-orange-500 transition-colors">Galeri</a></li>
                    <li><a href="#testimonials" class="text-blue-200 hover:text-orange-500 transition-colors">Testimonial</a></li>
                    <li><a href="#faq" class="text-blue-200 hover:text-orange-500 transition-colors">FAQ</a></li>
                </ul>
            </div>

            <div>
                <h3 class="text-lg font-bold mb-4">Kontak</h3>
                <ul class="space-y-3">
                    <li class="flex items-start gap-2 text-blue-200 text-sm">
                        <svg class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Jl. Digital No. 123<br>Yogyakarta 55281
                    </li>
                    <li class="text-sm">
                        <a href="mailto:info@republikweb.net" class="flex items-center gap-2 text-blue-200 hover:text-orange-500 transition-colors">
                            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            info@republikweb.net
                        </a>
                    </li>
                    <li class="text-sm">
                        <a href="https://wa.me/6281234567890" class="flex items-center gap-2 text-blue-200 hover:text-orange-500 transition-colors">
                            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            +62 812-3456-7890
                        </a>
                    </li>
                </ul>
            </div>

            <div>
                <h3 class="text-lg font-bold mb-4">Newsletter</h3>
                <p class="text-blue-200 text-sm mb-4">
                    Subscribe untuk mendapatkan update terbaru tentang program magang dan tips karir digital
                </p>
                <form class="flex gap-2">
                    <input type="email" placeholder="Email Anda" class="flex-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700 text-white placeholder-blue-400 focus:outline-none focus:border-orange-500 text-sm">
                    <button class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>

        <div class="border-t border-blue-800 pt-8">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-blue-200 text-sm text-center md:text-left">
                    &copy; {{ date('Y') }} Republikweb.net. All rights reserved.
                </p>
                <div class="flex gap-6 text-sm">
                    <a href="#" class="text-blue-200 hover:text-orange-500 transition-colors">Privacy Policy</a>
                    <a href="#" class="text-blue-200 hover:text-orange-500 transition-colors">Terms of Service</a>
                </div>
            </div>
        </div>
    </div>
</footer>
```

### 2. Home Page

**File: `resources/views/home/index.blade.php`**
```blade
@extends('layouts.app')

@section('title', 'Program Magang Digital')

@section('content')
    @include('home.sections.hero')
    @include('home.sections.about')
    @include('home.sections.positions')
    @include('home.sections.application-form')
    @include('home.sections.gallery')
    @include('home.sections.testimonials')
    @include('home.sections.faq')
    @include('home.sections.contact')
@endsection
```

**File: `resources/views/home/sections/hero.blade.php`**
```blade
<section class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 overflow-hidden">
    <div class="absolute inset-0 opacity-20" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMCAwIi8+PC9nPjwvZz48L3N2Zz4=');"></div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center max-w-4xl mx-auto">
            <div class="inline-flex items-center justify-center p-3 bg-orange-500/10 rounded-2xl mb-6 animate-bounce">
                <svg class="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>

            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Bangun Karier Digitalmu<br>
                <span class="text-orange-500">Bersama Republikweb!</span>
            </h1>

            <p class="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
                Bergabunglah dengan program magang terbaik untuk mahasiswa dan fresh graduate.
                Kembangkan skill digital Anda bersama tim profesional dalam proyek nyata.
            </p>

            <a href="#application-form" class="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-orange-500/50">
                Daftar Sekarang
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </a>

            <div class="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div class="text-center">
                    <div class="text-4xl font-bold text-orange-500 mb-2">3 Bulan</div>
                    <div class="text-blue-200">Durasi Program</div>
                </div>
                <div class="text-center">
                    <div class="text-4xl font-bold text-orange-500 mb-2">{{ $positions->count() }}+</div>
                    <div class="text-blue-200">Posisi Tersedia</div>
                </div>
                <div class="text-center">
                    <div class="text-4xl font-bold text-orange-500 mb-2">100%</div>
                    <div class="text-blue-200">Gratis & Bersertifikat</div>
                </div>
            </div>
        </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" class="w-full">
            <path fill="#ffffff" fill-opacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
    </div>
</section>
```

**File: `resources/views/home/sections/about.blade.php`**
```blade
<section id="about" class="py-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
            <h2 class="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
                Tentang Program Magang
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                Program magang 3 bulan yang dirancang khusus untuk mengembangkan skill digital Anda
                dengan pengalaman kerja nyata di industri teknologi
            </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            @php
                $benefits = [
                    ['icon' => 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', 'title' => 'Sertifikat Resmi', 'description' => 'Dapatkan sertifikat magang yang diakui industri'],
                    ['icon' => 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', 'title' => 'Mentoring Langsung', 'description' => 'Bimbingan dari praktisi digital berpengalaman'],
                    ['icon' => 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', 'title' => 'Proyek Real', 'description' => 'Terlibat langsung dalam project client nyata'],
                    ['icon' => 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', 'title' => 'Fleksibel', 'description' => 'Jadwal yang dapat disesuaikan dengan kuliah']
                ];
            @endphp

            @foreach($benefits as $benefit)
            <div class="bg-gradient-to-br from-blue-50 to-orange-50 p-8 rounded-2xl text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-xl mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{{ $benefit['icon'] }}" />
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-blue-900 mb-2">{{ $benefit['title'] }}</h3>
                <p class="text-gray-600">{{ $benefit['description'] }}</p>
            </div>
            @endforeach
        </div>

        <div class="bg-gradient-to-br from-blue-900 to-blue-800 rounded-3xl p-10 sm:p-12 text-white">
            <div class="grid md:grid-cols-2 gap-12">
                <div>
                    <h3 class="text-3xl font-bold mb-6">Syarat Umum</h3>
                    <ul class="space-y-4">
                        <li class="flex items-start gap-3">
                            <span class="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">✓</span>
                            <span>Mahasiswa aktif atau fresh graduate (max 1 tahun lulus)</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">✓</span>
                            <span>Dapat berkomunikasi dengan baik dalam tim</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">✓</span>
                            <span>Memiliki laptop/komputer pribadi</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">✓</span>
                            <span>Berkomitmen untuk program 3 bulan penuh</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">✓</span>
                            <span>Memiliki passion dan motivasi tinggi untuk belajar</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-3xl font-bold mb-6">Yang Akan Kamu Dapatkan</h3>
                    <ul class="space-y-4">
                        <li class="flex items-start gap-3">
                            <span class="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">★</span>
                            <span>Pengalaman kerja di agensi digital profesional</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">★</span>
                            <span>Portfolio project nyata untuk career development</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">★</span>
                            <span>Networking dengan profesional industri</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">★</span>
                            <span>Sertifikat magang resmi dari Republikweb</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">★</span>
                            <span>Peluang karir setelah program berakhir</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>
```

---

**CATATAN:** Dokumentasi ini sangat panjang. Saya telah membuat bagian-bagian utama. Apakah Anda ingin saya lanjutkan dengan:

1. ✅ Sections lainnya (Positions, Form, Gallery, dll)
2. ✅ Admin Dashboard Views
3. ✅ Mail Templates
4. ✅ Seeding Data
5. ✅ Testing & Deployment

**Atau Anda ingin fokus ke bagian tertentu dulu?**
