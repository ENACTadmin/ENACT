# ENACT Platform — Engineering Documentation

**Last updated:** June 2026  
**Stack:** Node.js · Express · MongoDB · EJS · React 18 · Bootstrap 4 · AWS S3  

---

## Table of Contents

1. [What is ENACT?](#1-what-is-enact)
2. [Repository Layout](#2-repository-layout)
3. [Tech Stack Overview](#3-tech-stack-overview)
4. [Running the App Locally](#4-running-the-app-locally)
5. [Environment Variables](#5-environment-variables)
6. [Backend Architecture](#6-backend-architecture)
7. [Database Schemas](#7-database-schemas)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [API Routes Reference](#9-api-routes-reference)
10. [Frontend Architecture](#10-frontend-architecture)
11. [React Components (existing)](#11-react-components-existing)
12. [File Storage — AWS S3](#12-file-storage--aws-s3)
13. [Email & Notifications](#13-email--notifications)
14. [Testing](#14-testing)
15. [React Migration Plan](#15-react-migration-plan)
16. [Known Issues & Security Notes](#16-known-issues--security-notes)

---

## 1. What is ENACT?

**ENACT** (Entrepreneurship and Civic Engagement in Technology) is a web platform for educational resource sharing and course management across a national civic education network. It is primarily used by:

- **Students** — join courses, upload resources, search the library
- **Faculty** — create/manage courses, review & approve student submissions, publish resources publicly
- **TAs** — assist faculty with course resource management
- **Admins** — full system control, user management, tag approval

Core capabilities:
- Course creation, enrollment via PIN, and schedule management
- Resource upload (documents, videos, links) with public/private visibility tiers
- Faculty approval workflow before resources go public
- Full-text and advanced search across the resource library
- Direct messaging between users with email notifications
- Event management with image uploads
- Tag system with faculty-approval workflow
- Faculty networking directory

---

## 2. Repository Layout

```
ENACT/
├── app.js                    # Express app setup, DB connection, all route wiring
├── bin/
│   └── www                   # HTTP server entry point (port 3500)
│
├── config/
│   └── passport.js           # Passport.js strategies (Google OAuth, local login/signup/reset)
│
├── controllers/              # Business logic (one file per domain)
│   ├── resourceController.js # 2,500+ lines — resources, search, collections
│   ├── courseController.js   # Course CRUD, PIN gen, enrollment, TA assign
│   ├── profileController.js  # User profile CRUD, faculty profiles, pic upload
│   ├── messageController.js  # Direct messaging, message board
│   ├── notificationController.js # Review workflow, approval/denial notifications
│   ├── tagController.js      # Tag proposals, approval workflow
│   ├── eventController.js    # Event CRUD, image uploads
│   └── utils.js              # Shared middleware (checkUserName, checkUserAccess)
│
├── models/                   # Mongoose schemas
│   ├── User.js
│   ├── Course.js
│   ├── Resource.js
│   ├── Event.js
│   ├── Message.js
│   ├── ResourceSet.js        # Collections / folders
│   ├── Tag.js
│   ├── Faculty.js
│   ├── TA.js
│   ├── CourseMember.js
│   ├── AuthorAlternative.js
│   ├── Verification.js
│   └── SearchKeyword.js
│
├── routes/
│   ├── auth.js               # Login, signup, OAuth callbacks, password reset
│   ├── aws.js                # S3 signed-URL generation endpoint
│   └── mail.js               # Email send endpoint
│
├── views/                    # EJS templates
│   ├── components/           # Reusable partials (navbar, footer, modals, selectors)
│   └── pages/                # Full page templates (organized by feature)
│
├── src/
│   └── app/                  # React source (compiled → public/js/bundle.js via webpack)
│       ├── index.js          # Webpack entry point
│       ├── SearchComponent.js
│       ├── Pagination.js
│       ├── OldSearchComponent.js
│       ├── components/       # React sub-components (card, navFilters, etc.)
│       ├── hooks/            # Custom hooks (useData, useDebounce)
│       ├── styles/           # CSS modules & styled-components
│       └── data/             # Static data files
│
├── public/                   # Static assets served directly by Express
│   ├── js/
│   │   ├── bundle.js         # Webpack output (React search component)
│   │   ├── aws.js            # Client-side S3 upload logic
│   │   ├── navbar.js
│   │   ├── search.js
│   │   ├── editModal.js
│   │   ├── likeAjax.js
│   │   ├── loadAjax.js
│   │   └── ...               # Other page-specific scripts
│   ├── stylesheets/
│   │   ├── style.css         # Global styles
│   │   └── search.css
│   └── images/               # Logos, icons, static images
│
├── cypress/                  # End-to-end tests
│   └── e2e/
│       ├── sample_spec.cy.js
│       ├── dynamic_spec.cy.js
│       └── static_spec.cy.js
│
├── test/                     # Unit tests (Mocha + Chai)
│   ├── simple.test.js
│   └── courses.test.js
│
├── scripts/                  # Utility/migration scripts
├── webpack.config.js         # Webpack 5 config (Babel + CSS modules)
├── .babelrc                  # Babel presets (env + react + styled-components)
├── nodemon.json              # Dev watcher config
├── cypress.config.js
└── package.json
```

---

## 3. Tech Stack Overview

| Layer | Technology |
|-------|-----------|
| **Server** | Node.js 18, Express 4 |
| **Database** | MongoDB (hosted on MongoDB Atlas), Mongoose 5 ODM |
| **Authentication** | Passport.js — Google OAuth 2.0 + local (email/password) |
| **Template Engine** | EJS 3 (server-side rendering) |
| **Frontend Framework** | Bootstrap 4.5, jQuery 3.5 |
| **React** | React 18 (compiled with Webpack 5 + Babel) |
| **File Storage** | AWS S3 (us-east-2, bucket: `enact-resources`) using SDK v3 |
| **Email** | Nodemailer (Gmail SMTP) + SendGrid (configured but partially commented out) |
| **Build Tool** | Webpack 5 |
| **Dev Server** | Nodemon (auto-restart) + optional livereload |
| **E2E Tests** | Cypress 13 |
| **Unit Tests** | Mocha 10 + Chai 5 + Supertest |

---

## 4. Running the App Locally

### Prerequisites

- Node.js 18.x
- npm 6+
- A `.env` file at the repo root with the variables listed in §5

### Install dependencies

```bash
npm install
```

### Start the server

```bash
# Production-like (just Express)
npm start

# Development (auto-restart on file changes)
npm run start:dev

# Development with React watch + livereload
npm run start:devReact
```

The server starts on **http://localhost:3500** by default.

### Build React bundle

```bash
# One-off build
npm run watch   # (actually runs webpack --watch, rename if you want single-pass)

# Or directly
npx webpack
```

The compiled bundle lands at `public/js/bundle.js`.

---

## 5. Environment Variables

Create a `.env` file at the repo root. Variables in use:

```bash
# Google OAuth
clientID=<your-google-client-id>
clientSecret=<your-google-client-secret>
callbackURL=http://localhost:3500/login/authorized

# AWS S3
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
S3_BUCKET=enact-resources

# Email (Gmail)
EMAIL_USER=<gmail-address>
EMAIL_PASS=<gmail-app-password>

# Email (SendGrid — partially used)
SENDGRID_API_KEY=<key>

# MongoDB
MONGODB_URI=<connection-string>

# Server
PORT=3500

# Session
SESSION_SECRET=<long-random-string>
```

> **Warning:** Several of these values are currently hardcoded in `app.js` and `config/passport.js`. This is a known security issue — see §16.

---

## 6. Backend Architecture

### Entry Points

| File | Role |
|------|------|
| `bin/www` | Creates the HTTP server, binds to port |
| `app.js` | Sets up Express middleware, Mongoose connection, all route handlers |

### Middleware Stack (in order, `app.js`)

1. Morgan (HTTP logging)
2. Cookie parser
3. Body parser (urlencoded + JSON)
4. Express session (secret: `"keyboard cat"` — must be replaced)
5. Passport initialize + session
6. Connect-flash (flash messages)
7. Optional livereload (if `USE_LIVERELOAD=true`)
8. Static file serving from `public/`
9. Route handlers

### Controller Pattern

Each controller exports plain async functions that receive `(req, res)` and are called directly from route definitions in `app.js`. There is no dependency injection — controllers import models and other utilities directly.

```
Route definition (app.js) → Controller function → Mongoose model → MongoDB
```

---

## 7. Database Schemas

### User

```javascript
{
  googleid: String,
  googletoken: String,
  googlename: String,
  googleemail: String,
  userName: String,           // Display name (required after signup)
  password: String,           // Hashed via passport-local (see note in §16)
  profilePicURL: String,
  status: String,             // 'student' | 'faculty' | 'admin' | 'TA'
  linkedInURL: String,
  hasFullAccess: Boolean,
  state: String,
  enrolledCourses: [ObjectId], // Refs to Course
  workEmail: String,
  personalEmail: String,
  phoneNumber: String,
  affiliation: String,
  department: String,
  pronoun: String,
  personalWebsiteURL: String,
  networkCheck: String,       // 'on' | 'off'  (visibility in faculty directory)
  graduationYear: Number
}
```

### Course

```javascript
{
  ownerId: ObjectId,          // Faculty/Admin user
  instructor: String,
  courseName: String,
  coursePin: String,          // Students use this to enroll
  tas: [ObjectId],            // TA user IDs
  zipcode: String,
  state: String,
  year: Number,
  semester: String,
  createdAt: Date,
  institution: String,
  timezone: String,
  institutionURL: String,
  undecided: Boolean,
  asynchronous: Boolean
}
```

### Resource

```javascript
{
  ownerId: ObjectId,
  ownerName: String,
  courseId: ObjectId,
  status: String,             // See visibility tiers below
  createdAt: Date,
  name: String,
  description: String,
  tags: [String],
  uri: String,                // S3 URL or external link
  state: String,
  mediaType: String,          // 'video' | 'text document' | 'image' | ...
  contentType: String,        // 'pitch' | 'research' | ...
  institution: String,
  yearOfCreation: Number,
  facultyId: ObjectId,        // Faculty reviewer
  checkStatus: String,        // 'UnderReview' | 'deny' | 'approve'
  review: String,             // Faculty review comment
  views: Number
}
```

**Resource visibility tiers** (`status` field):
- `'private to professors'` — only the owning faculty can see it
- `'private to ENACT'` — visible to all logged-in users
- `'partPublic'` — visible on certain public pages
- `'public'` — approved by faculty, visible publicly
- `'finalPublic'` — approved by admin, shown on main public pages

### ResourceSet (Collections)

```javascript
{
  ownerId: ObjectId,
  name: String,
  resources: [ObjectId],      // Refs to Resource
  createdAt: Date
}
```

### Event

```javascript
{
  ownerId: ObjectId,
  title: String,
  start: Date,
  end: Date,
  description: String,
  imageURL: String,
  visibility: String          // 'public' | 'private'
}
```

### Message

```javascript
{
  relevantResourceId: ObjectId,
  senderId: ObjectId,
  receiverId: ObjectId,
  subject: String,
  message: String,
  createdAt: Date
}
```

### Tag

```javascript
{
  ownerId: ObjectId,
  ownerName: String,
  ownerStatus: String,
  status: String,             // 'proposed' | 'approved' | 'denied'
  info: String,               // Tag text
  reason: String              // Why the tag was proposed
}
```

### CourseMember

```javascript
{
  studentId: ObjectId,
  courseId: ObjectId,
  createdAt: Date
}
```

### Other Models

- **Faculty** — `(userId, email, status, approvedBy)` — tracks faculty approval status
- **TA** — `(email)` — email allowlist for TA role
- **AuthorAlternative** — `(resourceId, userName, userEmail)` — additional credited authors on a resource
- **Verification** — `(email)` — students who have been course-verified
- **SearchKeyword** — `(keyword, searchCount)` — search analytics

---

## 8. Authentication & Authorization

### Strategies (`config/passport.js`)

| Strategy name | Type | Purpose |
|--------------|------|---------|
| `'google'` | Google OAuth 2.0 | Main OAuth login |
| `'google-secret'` | Google OAuth 2.0 | OAuth flow for message composer |
| `'local'` | Local | Email + password login |
| `'local-signup'` | Local | New user registration |
| `'local-reset'` | Local | Password reset flow |

### User Roles

| Role | Capabilities |
|------|-------------|
| `admin` | Full system access; can manage all users, courses, resources, tags |
| `faculty` | Create courses, review/approve student resources, manage own resources |
| `TA` | Assist with course resource review |
| `student` | Enroll in courses, upload resources (pending faculty approval) |

### Admin List

The admin list is **hardcoded** in `routes/auth.js`. Any user whose email appears in the list is automatically set to `status: 'admin'` on login. This should be moved to the database.

### Session

```javascript
express-session({
  secret: "keyboard cat",   // ← must be replaced with environment variable
  resave: false,
  saveUninitialized: false
})
```

### Enrollment Flow

1. User registers (`POST /signup`) — creates User with `status: 'student'`
2. Student navigates to `/verification`, enters course PIN
3. Server matches PIN → creates `CourseMember` record → enrolls student
4. Student is required to complete their profile (`checkUserName` middleware enforces this)

### Password Reset Flow

1. `POST /reset` — sends reset email with a time-limited link
2. `GET /reset/:id` — shows the reset form
3. `POST /reset/:id` — verifies token and updates password

---

## 9. API Routes Reference

All routes are defined in `app.js` and `routes/`. The app mixes page-rendering routes (returns HTML) with JSON API routes (prefixed `/api/v0/`).

### Authentication (`routes/auth.js`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Redirect to login or home |
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/login/authorized` | Google OAuth callback |
| POST | `/login` | Local login |
| GET | `/logout` | Destroy session |
| POST | `/signup` | Register new user |
| GET | `/reset` | Password reset request page |
| POST | `/reset` | Send reset email |
| GET | `/reset/:id` | Reset password form |
| POST | `/reset/:id` | Execute password reset |
| GET | `/verification` | Course verification page |
| POST | `/verification` | Verify PIN & enroll in course |

### Courses

| Method | Path | Description |
|--------|------|-------------|
| POST | `/course/create` | Create new course |
| GET | `/courses` | Course management dashboard |
| GET | `/course/view/:courseId/:limit` | Single course view |
| GET | `/course/update/:courseId` | Edit course form |
| POST | `/course/update/:courseId` | Save course edits |
| POST | `/course/delete/:courseId` | Delete course |
| POST | `/course/copy/:courseId` | Copy course |
| POST | `/course/join` | Admin: manually enroll user in course |
| GET | `/TA/assign/:courseId` | Assign TAs page |
| POST | `/TA/assign/:courseId` | Save TA assignments |

### Resources

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v0/resources/` | List all resources (JSON) |
| POST | `/resource/upload/course/:courseId` | Upload resource to course |
| POST | `/resource/upload/faculty` | Upload faculty resource |
| POST | `/resource/update/:resourceId/limit/:limit` | Edit resource metadata |
| POST | `/resource/remove/:resourceId` | Delete resource |
| POST | `/resource/star/:resourceId` | Favorite resource |
| POST | `/resource/unstar/:resourceId` | Unfavorite resource |
| POST | `/resource/show/:resourceId` | Make resource public |
| POST | `/resource/hide/:resourceId` | Remove from public display |
| POST | `/resource/approve` | Faculty: approve resource |
| POST | `/resource/deny` | Faculty: deny resource |
| POST | `/resource/publish` | Admin: publish to public |

### Search

| Method | Path | Description |
|--------|------|-------------|
| GET | `/search/` | New React search page |
| GET | `/resources/search/private/general` | Full-text search page (logged-in) |
| POST | `/resources/search/private/general/results` | Search results (logged-in) |
| GET | `/resources/search/public/general` | Public full-text search page |
| GET | `/resources/search/public/advanced` | Advanced public search |
| GET | `/api/v0/resources/searchByKeyword` | Keyword search (JSON) |
| GET | `/api/v0/resources/tags/:tag` | Filter by tag (JSON) |

### Profiles

| Method | Path | Description |
|--------|------|-------------|
| GET | `/profile/view/:id` | View user profile |
| POST | `/profile/update` | Update own profile |
| GET | `/profile/update/:userId` | Admin: edit profile form |
| POST | `/profile/update/:userId` | Admin: save profile edits |
| GET | `/profiles/view/faculty` | Faculty directory |
| POST | `/profile/create/faculty` | Create faculty profile |
| POST | `/profile/:userId/update/imageURL` | Update profile picture |

### Messages

| Method | Path | Description |
|--------|------|-------------|
| GET | `/messages/view/:sender/:receiver/:resourceId` | View conversation |
| POST | `/messages/save/:sender/:receiver/:resourceId` | Send message |
| GET | `/messages/view/all` | Message board |

### Events

| Method | Path | Description |
|--------|------|-------------|
| POST | `/event/save` | Create event |
| POST | `/event/delete/:eventId` | Delete event |
| POST | `/event/edit/:eventId` | Edit event |
| GET | `/event/image/update/:eventId` | Update image form |
| POST | `/event/image/update/:eventId` | Save image update |

### Collections

| Method | Path | Description |
|--------|------|-------------|
| GET | `/collection/view/:resourceSetId` | View collection |
| POST | `/collection/create` | Create collection |
| POST | `/collection/delete/:collectionId` | Delete collection |
| POST | `/collection/:collectionId/add/:resourceId` | Add resource to collection |
| POST | `/collection/:collectionId/delete/:resourceId` | Remove resource from collection |

### Tags

| Method | Path | Description |
|--------|------|-------------|
| POST | `/tag/add` | Propose new tag |
| GET | `/tag/approve` | Review proposed tags |
| POST | `/tag/agree` | Approve tag |
| POST | `/tag/deny` | Deny tag |
| GET | `/tag/my` | View own proposed tags |

### AWS & Mail

| Method | Path | Description |
|--------|------|-------------|
| GET | `/sign-s3` | Get pre-signed S3 upload URL |
| POST | `/api/mail/send` | Send email |

---

## 10. Frontend Architecture

### Current Approach

The frontend is **server-side rendered** using EJS templates. Each Express route renders an EJS view file and passes data via `res.render('pageName', { data })`.

```
Browser request → Express route → Controller → Mongoose → res.render(ejsTemplate, data) → HTML response
```

### EJS Template Structure

```
views/
├── components/         # Reusable partials (included via <%- include(...) %>)
│   ├── header.ejs      # <head> tag and CDN scripts
│   ├── navbar.ejs      # Navigation bar (different versions per role)
│   ├── navbar-common.ejs
│   ├── footer.ejs
│   ├── component-resourceStack.ejs  # Resource card list
│   ├── component-tagSelector.ejs
│   ├── component-editModal.ejs      # Edit resource modal
│   ├── component-loginToView.ejs    # "Login to see this" placeholder
│   ├── component-stateSelector.ejs
│   ├── component-institutionSelector.ejs
│   ├── component-yearOfCreationSelector.ejs
│   ├── component-event.ejs
│   ├── component-eventImport.ejs
│   ├── component-basicInfo.ejs
│   ├── google-analytics-tag.ejs    # GA4 script injection
│   └── react-scripts.ejs           # Injects bundle.js for React pages
└── pages/              # Full page templates
    ├── index.ejs       # Home page
    ├── login/          # Auth pages
    ├── staticPages/    # About, contact, help
    ├── newSearch/      # New React-powered search
    └── ...             # All other feature pages
```

### Client-Side JavaScript (Legacy)

Scripts in `public/js/` are loaded per-page via `<script>` tags in EJS templates. They use jQuery for DOM manipulation and AJAX calls.

| Script | Purpose |
|--------|---------|
| `aws.js` / `aws-uploadFile.js` | Client-side S3 upload flow |
| `aws-uploadProfilePic.js` | Profile picture S3 upload |
| `navbar.js` | Navigation dropdowns, mobile menu |
| `search.js` | Basic search form handling |
| `autoCompleteSearch.js` | Search autocomplete |
| `editModal.js` / `editModalAjax.js` | Resource edit modal (jQuery) |
| `likeAjax.js` | Favorite/unfavorite via AJAX |
| `loadAjax.js` | "Load more" pagination |
| `slideShow.js` | Image slideshow |
| `authorship.js` | Add/remove co-authors |
| `courseTimeSelector.js` | Course time picker UI |
| `daylightTime.js` | Client-side timezone display |

### CSS

- `public/stylesheets/style.css` — global styles, Bootstrap 4 overrides
- `public/stylesheets/search.css` — search page-specific styles
- Inline `<style>` blocks in some EJS templates (legacy)

---

## 11. React Components (existing)

The search feature was the first page migrated to React. It lives in `src/app/` and is compiled by Webpack into `public/js/bundle.js`.

### File Map

| File | Description |
|------|-------------|
| `src/app/index.js` | Webpack entry — mounts `<SearchComponent>` into `#root` |
| `src/app/SearchComponent.js` | Main search component with filters, results, pagination |
| `src/app/OldSearchComponent.js` | Archived version |
| `src/app/Pagination.js` | Pagination UI |
| `src/app/components/card.js` | Resource card |
| `src/app/components/home.js` | Home section inside search |
| `src/app/components/navFilters.js` | Filter nav (tags, type, state) |
| `src/app/components/StickySearchInput.js` | Sticky search bar |
| `src/app/hooks/useData.js` | Custom hook: fetches resources from `/api/v0/resources/` |
| `src/app/hooks/useDebounce.js` | Debounce hook for search input |
| `src/app/styles/search.module.css` | CSS module for search component |
| `src/app/styles/SearchStyles.js` | Styled-components definitions |

### How It's Loaded

The EJS template `views/pages/newSearch/search.ejs` contains a `<div id="root"></div>` and includes `views/components/react-scripts.ejs`, which loads `bundle.js`. The React app mounts into that div.

### Webpack Config Summary

```javascript
entry: './src/app/SearchComponent.js'  // ← single entry
output: { path: 'public/js', filename: 'bundle.js' }
// Supports: JS/JSX (Babel), CSS modules, global CSS, SVG assets
```

---

## 12. File Storage — AWS S3

### Upload Flow

```
Client picks file
  → GET /sign-s3?file-name=X&file-type=Y
  → Server generates pre-signed PUT URL (15-min expiry)
  → Client PUT to S3 directly (bypasses Express server)
  → Client POSTs resource metadata to Express with the S3 URL
```

### Key Details

- **Bucket:** `enact-resources`
- **Region:** `us-east-2`
- **ACL:** `public-read` (files are publicly accessible via URL)
- **SDK:** `@aws-sdk/client-s3` v3 + `@aws-sdk/s3-request-presigner`
- Profile pictures and event images also go through S3

---

## 13. Email & Notifications

### Nodemailer (primary)

Configured in `controllers/mailer.js`:

```
Transport: Gmail SMTP
Host: smtp.gmail.com
Port: 465 (SSL)
Auth: EMAIL_USER / EMAIL_PASS (Gmail app password)
```

Used for:
- Password reset emails
- Message notifications ("You have a new message")
- Event reminders (via event controller)

### SendGrid (secondary — partially implemented)

- API key expected via `SENDGRID_API_KEY` env var
- Package `@sendgrid/mail` is installed
- Some code paths reference it but are commented out

### Mail API

`POST /api/mail/send` — generic send endpoint accepting `{ to, subject, text }`. Called by client-side JS when a user sends a message.

---

## 14. Testing

### Unit Tests (Mocha + Chai)

```bash
npm test               # runs test/**/*.js
```

Files:
- `test/simple.test.js` — basic sanity checks
- `test/courses.test.js` — course creation/retrieval (uses Supertest)

### End-to-End Tests (Cypress)

```bash
npm run cypress:open   # interactive browser UI
npm run cypress:run    # headless (CI)
```

Test files in `cypress/e2e/`:
- `sample_spec.cy.js` — smoke tests
- `static_spec.cy.js` — static page tests (about, contact, help)
- `dynamic_spec.cy.js` — interactive page tests (login, search)

Cypress config (`cypress.config.js`):
- Video recording enabled
- Base URL: `http://localhost:3500`

---

## 15. React Migration Plan

> **Branch:** `feature/ui-migration`

The goal is to incrementally migrate all EJS templates to React components while keeping the Express backend. The Express server will eventually serve only a JSON API; React Router will handle all client-side routing.

### Architecture Target

```
Browser → React SPA (React Router)
              ↓ fetch / axios
         Express REST API (JSON responses)
              ↓
         MongoDB via Mongoose
```

### Migration Phases

#### Phase 1 — Infrastructure Setup
- Create `src/app/App.jsx` with React Router v6
- Create shared layout components: `Navbar`, `Footer`, `Layout`
- Add `react-router-dom` dependency
- Update webpack to support the new entry point alongside the existing search bundle
- Express continues to serve EJS pages; React Router handles a `/app/*` SPA shell

#### Phase 2 — Auth Pages
- `LoginPage.jsx` — replaces `views/pages/login/login.ejs`
- `SignupPage.jsx` — replaces `views/pages/login/signup.ejs`
- `VerificationPage.jsx` — replaces `views/pages/login/verification.ejs`
- `PasswordResetPage.jsx` — replaces the two reset EJS pages

#### Phase 3 — Home & Static Pages
- `HomePage.jsx` — replaces `views/pages/index.ejs`
- `AboutPage.jsx`, `ContactPage.jsx`, `HelpPage.jsx` — static pages

#### Phase 4 — Course Pages
- `CourseCreatePage.jsx`
- `CourseViewPage.jsx`
- `CoursesManagementPage.jsx`

#### Phase 5 — Resource Pages
- `ResourceUploadPage.jsx`
- `MyResourcesPage.jsx`
- `ResourceReviewPage.jsx`

#### Phase 6 — Search (already React, wire into router)
- Integrate existing `SearchComponent.js` into React Router

#### Phase 7 — Profiles, Messages, Events, Tags
- Remaining pages

### API Refactor (alongside Phase 2+)

As each page is converted to React, the corresponding Express route is refactored from `res.render(ejsFile, data)` to `res.json(data)`. A parallel route (e.g., `GET /api/v0/courses`) is added so the React page can fetch data.

### How to Work on the Migration

```bash
git checkout feature/ui-migration
npm run start:devReact   # starts Express + webpack watch
# Edit files in src/app/
# Browser at http://localhost:3500
```

---

## 16. Known Issues & Security Notes

### Critical

| Issue | Location | Fix |
|-------|----------|-----|
| MongoDB URI hardcoded with credentials | `app.js` line ~10 | Move to `MONGODB_URI` env var |
| Google OAuth credentials partially hardcoded | `config/passport.js` | Move all to env vars |
| Session secret is `"keyboard cat"` | `app.js` | Use `SESSION_SECRET` env var |
| Admin list hardcoded as email array | `routes/auth.js` | Move to a database role field |

### Medium

| Issue | Location | Notes |
|-------|----------|-------|
| No CSRF protection | All POST routes | Add `csurf` or similar |
| Password reset token storage unclear | `routes/auth.js` | Should use time-limited signed tokens |
| Public S3 bucket ACL | `routes/aws.js` | Consider signed read URLs for private resources |

### Low

| Issue | Notes |
|-------|-------|
| Inline `<style>` in EJS templates | Should be consolidated into `style.css` |
| `src/app/OldSearchComponent.js` | Dead code — safe to remove |
| `views/pages/courses-schedule-buggy.ejs` and `-temp.ejs` | Staging artifacts — remove or archive |
| `events-private copy.ejs` | File name with a space — remove or rename |

---

*This document covers the state of the repo as of June 2026. For the React migration progress, see the `feature/ui-migration` branch and its commit history.*
