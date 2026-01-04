import { app } from "./firebase.js";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const db = getFirestore(app);

// Example: Adding a recipe
async function addRecipe(name, ingredients) {
  await addDoc(collection(db, "recipes"), { name, ingredients });
  alert("Recipe added!");
}
