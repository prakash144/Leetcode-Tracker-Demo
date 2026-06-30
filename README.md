# 🎯 Interview Tracly

Master Coding Interviews.

Track your journey. Crack your dream company. 🚀

A modern web app to track your coding problem-solving progress. Easily browse, filter, and mark problems as solved while staying up to date with the latest company-wise problem sets.

> 📅 **Problem Set – Updated on 20 Jun 2025**

---

## 🌐 Live Site

🔗 [Visit Interview Tracly](https://prakash144.github.io/Interview-Tracly/)

---

## 📌 Features

- ✅ Track your progress across company-wise coding problems
- 🏷️ Filter by company, topic, difficulty, or status (Solved / Attempted / Unsolved)
- ⭐ Bookmark favorites for quick review
- 📊 Analytics dashboard with difficulty and topic breakdowns
- 🔥 Activity heatmap to visualize your consistency
- 🔍 Search problems by name or number
- 📱 Fully responsive design (desktop, tablet, mobile)
- 🧠 Perfect for interview prep and daily challenges

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router)
- **State Management:** React hooks
- **Styling:** Tailwind CSS / shadcn UI
- **Data Source:** Dynamic GitHub CSV/API problem metadata
- **Persistence:** Firebase Authentication and Cloud Firestore for user progress
- **Deployment:** GitHub Pages

---

## Firebase Setup

The app is statically hosted on GitHub Pages. Firebase is used from the client SDK only.

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Firestore stores only user-specific progress:

- solved
- attempted
- bookmarked
- revision list
- notes
- activity counts for the heatmap

Problem metadata such as title, link, acceptance, difficulty, frequency, topic, company, and list continues to come from the GitHub CSV/API source.

Deploy the rules in `firestore.rules` to protect per-user progress data.
