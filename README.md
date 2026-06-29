# 🧮 LeetCode Tracker

A sleek and simple web app to track your LeetCode problem-solving progress. Easily browse, filter, and mark problems as solved, while staying up to date with the latest additions and updates.

> 📅 **Problem Set – Updated on 20 Jun 2025**

---

## 🌐 Live Site

🔗 [Visit LeetCode Tracker](https://prakash144.github.io/Leetcode-Tracker-Demo/)

---

## 📌 Features

- ✅ Track your progress across LeetCode problems
- 🏷️ Filter by topic, difficulty, or status (Solved / Unsolved)
- 📅 See when the problem set was last updated
- 🔍 Search problems by name or number
- 🧠 Perfect for interview prep and daily challenges
- 📘 Clean, responsive UI focused on productivity

---

## 🛠️ Tech Stack

- **Frontend:** Next.js
- **State Management:** React hooks
- **Styling:** Tailwind CSS / Styled Components
- **Data Source:** Dynamic GitHub CSV/API problem metadata
- **Persistence:** Firebase Authentication and Cloud Firestore for user progress
- **Deployment:** GitHub Pages

---

## Firebase Setup

The app is still statically hosted on GitHub Pages. Firebase is used from the client SDK only.

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
