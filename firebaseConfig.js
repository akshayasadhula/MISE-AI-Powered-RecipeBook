
// ✅ Ensure Firebase SDK is loaded before using it
if (typeof firebase === "undefined") {
  console.error("❌ Firebase SDK not loaded! Check script order.");
} else {
  // ✅ Firebase Configuration
  const firebaseConfig = {
      apiKey: "AIzaSyBDOfdlVQ1237NxctyeE52cA-vCLrhTBvQ",
      authDomain: "sizzle-2885f.firebaseapp.com",
      projectId: "sizzle-2885f",
      // storageBucket: "sizzle-2885f.firebasestorage.app",
      storageBucket: "sizzle-2885f.appspot.com",

      messagingSenderId: "548271743587",
      appId: "1:548271743587:web:418ca4584619e5c80bce56",
      measurementId: "G-QK96C0SQPS"
  };

  // ✅ Initialize Firebase only if it hasn’t been initialized already
  if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
  }

  // ✅ Ensure Firestore is globally accessible
  window.db = firebase.firestore();
  console.log(db ? "✅ Firestore is Ready!" : "❌ Firestore NOT Connected!");
}
