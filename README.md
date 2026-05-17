# 🍳 Simmer — AI-Powered Recipe Book

Simmer is a web application that lets you store, manage, and discover recipes — powered by AI. Built with vanilla HTML, CSS, and JavaScript with Firebase for real-time data and Groq AI for intelligent features.

---

## 🌟 Features

### Recipe Management
- ➕ **Add Recipes** — Save recipes with name, category, ingredients and instructions
- 📖 **View Recipes** — Browse all recipes in a clean card layout
- ✏️ **Edit Recipes** — Update any recipe with a popup modal
- 🗑️ **Delete Recipes** — Remove recipes instantly
- ❤️ **Favourite Recipes** — Save your favourite recipes to a separate collection
- 🔗 **Share Recipes** — Share any recipe via link
- 🔍 **Search & Filter** — Search by name or filter by category

### AI Features (Powered by Groq)
- ✨ **AI Recipe Fill** — Type a recipe name and AI auto-fills ingredients and instructions
- 🧑‍🍳 **What Can I Cook?** — Enter ingredients you have and AI suggests a complete recipe
- 💬 **AI Cooking Chatbot** — Floating chat assistant for cooking tips and advice
- 🔥 **AI Tip Generator** — Generate smart cooking tips by category and save them

### Tips & Secrets
- 📝 Submit your own cooking tips
- ❤️ Like tips from other users
- 🗑️ Delete tips
- 🏷️ Filter by category (Hack, Flavor, Health)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML, CSS, JavaScript | Frontend — no frameworks |
| Bootstrap 4 | Responsive layout and navbar |
| Firebase Firestore | Real-time NoSQL cloud database |
| Groq API (Llama 3.1) | AI features — recipe generation and chatbot |

---

## 📁 Project Structure

```
simmer/
├── Home.html                # Landing page
├── addRecipe.html           # Add recipe page with AI features
├── viewrecipes.html         # View all recipes with search and filter
├── favouriterecipe.html     # Saved favourite recipes
├── tips.html                # Tips and secrets page
├── ai.js                    # AI module — all Groq API calls
├── aiChat.js                # Floating chatbot widget
├── addRecipe.js             # Recipe form logic
├── viewrecipes.js           # Recipe list, edit, delete, filter logic
├── favourites.js            # Favourites logic
├── firebaseConfig.js        # Firebase initialization
├── Home.css                 # Home page styles
├── addRecipe.css            # Add recipe page styles
├── viewrecipes.css          # View recipes styles
└── favouriterecipe.css      # Favourites page styles
```

---

## 🗄️ Database Structure (Firebase Firestore)

```
recipes/
└── {documentId}
    ├── name: string
    ├── category: string
    ├── ingredients: array
    ├── instructions: string
    └── timestamp: timestamp

favorites/
└── {documentId}
    └── (same fields as recipe)

tips/
└── {documentId}
    ├── text: string
    ├── category: string
    ├── likes: number
    └── timestamp: timestamp
```

---

## 🤖 How AI Works

All AI features use the **Groq API** with the **Llama 3.1** model called directly from the browser.

```
Browser → Groq API → Response → UI
```

- Each feature uses a different system prompt to control AI behavior
- Recipe features return structured JSON that fills the form automatically
- Chatbot maintains conversation history array for context memory

---

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/akshayasadhula/SIZZLE_RecipeBook.git
cd SIZZLE_RecipeBook
```

### 2. Firebase Setup
- Go to [firebase.google.com](https://firebase.google.com)
- Create a new project
- Enable Firestore Database
- Replace the config in `firebaseConfig.js` with your own

### 3. Groq API Key
- Go to [console.groq.com](https://console.groq.com)
- Create a free account
- Generate an API key
- Open `ai.js` and replace:
```js
const GROQ_API_KEY = "YOUR_GROQ_KEY_HERE";
```
with your actual key

### 4. Run
- Open `Home.html` with **Live Server** in VS Code
- Or just open the file directly in your browser

---

## 💡 What I Learned

- Integrating third-party AI APIs into a frontend project
- Firebase Firestore real-time listeners with `onSnapshot`
- Handling CORS issues with browser-based API calls
- Structuring prompts to get consistent JSON responses from AI models
- Building modular JavaScript with separation of concerns
- Managing API keys safely in frontend projects

---

## 🙋 Author

**Akshaya Sadhula**
- GitHub: [@akshayasadhula](https://github.com/akshayasadhula)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
