# VehicleHub

An OLX-style vehicle buy/sell marketplace, built on the same stack and conventions as your BookMyCinema project (Express + MongoDB/Mongoose + JWT auth on the backend; React + Redux Toolkit + antd + Tailwind on the frontend), so it should feel immediately familiar to work in.

## Roles
- **admin** — created directly in the database (no public signup path). Can remove listings from the marketplace and block/unblock user accounts, from `/admin`.
- **user** — a single role that covers both buying and selling, like OLX. Any user can post a listing (seller) and message any other seller about their listing (buyer). Chat only works between two DIFFERENT users — you can't message yourself about your own listing.

## Features
- Search bar + filters: category, brand, price range, year range, location, sort (newest / price / year)
- Multi-photo listings uploaded straight to Cloudinary (up to 8 photos per ad)
- Edit listing (update details, remove old photos, add new ones)
- Real-time buyer↔seller chat over Socket.io (falls back gracefully — messages are always saved to MongoDB even if the socket push misses)
- Seller tools: mark as sold, delete listing, view count
- Forgot/reset password via emailed OTP (same SendGrid pattern as BookMyCinema)
- User profiles: view anyone's public profile (name, location, member-since, active listings), edit your own (name, phone, location)
- Ratings: rate another user 1–5 stars with an optional comment; profile shows the average + review list. Ratings are tied to the (rater, ratee) pair — one rating per pair unless it's about a specific vehicle, so no rating spam.
- Location filter on Home (dropdown of real locations already in use) + free-text/suggested location entry when posting an ad
- Admin moderation: remove any listing, block/unblock any user

## Setup

### 1. Backend
```
cd server
npm install
cp .env.example .env
# fill in MONGO_URL, JWT_SECRET, Cloudinary credentials, and SENDGRID_API_KEY + EMAIL_FROM (for password-reset emails)
npm run dev
```
Runs on `http://localhost:8082` by default.

To create your first admin: register a normal account through the app, then manually flip that user's `role` field to `"admin"` in MongoDB (e.g. via MongoDB Compass or `mongosh`). There's no public "sign up as admin" path, on purpose.

### 2. Frontend
```
cd client
npm install
cp .env.example .env
# REACT_APP_API_URL should point at <backend-url>/api
npm start
```
Runs on `http://localhost:3000`.

## Notes / things you may want to extend next
- Ratings currently have no "verified transaction" check — anyone can rate anyone else once (as long as they're not rating themselves). If you want to restrict rating to only people who actually chatted/transacted, that's a small addition to `submitRating` (check a Conversation exists between the two users first).
- Chat is text-only for now — no image sharing in-chat, no "mark as read" receipts.
- Categories (`Car, Bike, Truck, Bus, Auto Rickshaw, Other`) are a fixed enum on the Vehicle model rather than a separate manageable collection.
- Location is free text (with autocomplete suggestions drawn from existing listings) rather than a structured city/state picker or geocoded coordinates — no map-based "near me" search yet.
- I couldn't run an actual `npm install` + build in this sandbox (no network access), so I reviewed every file by hand for correctness — worth a real `npm start` smoke test on both sides before you trust it in front of users.
