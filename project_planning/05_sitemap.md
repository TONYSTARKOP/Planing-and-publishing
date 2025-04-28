# NoteFlow - Sitemap

## Public Pages

### 1. Landing Page (/)
- Hero section
- Feature highlights
- Call-to-action
- Login/Signup buttons

### 2. Authentication Pages
- Login (/login)
- Signup (/signup)
- Password Recovery (/reset-password)

## Protected Pages (After Login)

### 1. Dashboard (/dashboard)
- Notes overview
- Quick actions
- Recent notes
- Search bar

### 2. Notes Management
- All Notes (/notes)
- Create Note (/notes/new)
- Edit Note (/notes/:id)
- View Note (/notes/:id/view)

### 3. Organization
- Tags (/tags)
- Search Results (/search)
- Favorites (/favorites)

### 4. User Settings
- Profile (/settings/profile)
- Preferences (/settings/preferences)
- Security (/settings/security)

## Navigation Structure

### 1. Main Navigation
```
Home
├── Dashboard
├── Notes
│   ├── All Notes
│   ├── Create Note
│   └── Tags
├── Search
└── Settings
```

### 2. User Menu
```
User Profile
├── Profile Settings
├── Preferences
└── Logout
```

## URL Structure

### 1. Public URLs
```
/                   # Landing page
/login              # Login page
/signup             # Signup page
/reset-password     # Password recovery
```

### 2. Protected URLs
```
/dashboard          # Main dashboard
/notes              # All notes
/notes/new          # Create note
/notes/:id          # Edit note
/notes/:id/view     # View note
/tags               # Tags management
/search             # Search results
/settings/*         # User settings
```

## Page Components

### 1. Common Elements
- Header
- Navigation
- Search bar
- User menu
- Footer

### 2. Page-Specific Elements
- Note editor
- Tag manager
- Search filters
- Settings forms

## Mobile Navigation

### 1. Bottom Navigation
- Home
- Notes
- Search
- Profile

### 2. Side Menu
- All sections
- Quick actions
- Settings
- Logout 