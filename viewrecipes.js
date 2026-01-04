
// ✅ Render all recipes correctly
function renderAllRecipes(snapshot) {
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = '';

    snapshot.forEach(doc => {
        const recipe = doc.data();
        recipe.id = doc.id;

        const li = document.createElement('li');
        li.classList.add('recipe-item');
        li.dataset.name = recipe.name.toLowerCase();
        li.dataset.category = recipe.category;

        li.innerHTML = `
            <h3>${recipe.name}</h3>
            <p><strong>Category:</strong> ${recipe.category}</p>
            <p><strong>Ingredients:</strong> ${recipe.ingredients ? recipe.ingredients.join(', ') : 'No Ingredients'}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions || 'No Instructions'}</p>
            <button class="favoriteBtn" data-id="${recipe.id}">${recipe.isFavorited ? '💛 Favorited' : '❤️ Favorite'}</button>
            <button class="editBtn" data-id="${recipe.id}">Edit</button>
            <button class="deleteBtn" data-id="${recipe.id}">Delete</button>
            <button class="shareBtn" data-id="${recipe.id}">🔗 Share</button>
        `;
        recipeList.appendChild(li);
    });

    attachHandlers(); 
    attachShareHandlers();
}

function attachHandlers() {
    document.querySelectorAll('.favoriteBtn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            const favDoc = await db.collection("favorites").doc(id).get();

            if (favDoc.exists) {
                await db.collection("favorites").doc(id).delete();
                e.target.textContent = '❤️ Favorite';
                console.log(`❌ Removed from favorites: ${id}`);
            } else {
                const doc = await db.collection("recipes").doc(id).get();
                if (doc.exists) {
                    await db.collection("favorites").doc(id).set(doc.data());
                    e.target.textContent = '💛 Favorited';
                    console.log(`⭐ Recipe added to favorites: ${id}`);
                }
            }
        });
    });

    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            try {
                await db.collection("recipes").doc(id).delete();
                console.log(`🗑️ Deleted recipe with ID: ${id}`);

                // 🔁 Also delete from favorites if it exists
                const favDoc = await db.collection("favorites").doc(id).get();
                if (favDoc.exists) {
                    await db.collection("favorites").doc(id).delete();
                    console.log(`🗑️ Also deleted from favorites: ${id}`);
                }

            } catch (error) {
                console.error("❌ Error deleting recipe:", error);
            }
        });
    });

    document.querySelectorAll('.editBtn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            openEditModal(id);
        });
    });
}

function attachShareHandlers() {
    document.querySelectorAll('.shareBtn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const shareUrl = `${window.location.origin}/viewrecipes.html?id=${id}`;

            if (navigator.share) {
                navigator.share({
                    title: "Check out this recipe!",
                    url: shareUrl
                }).then(() => {
                    console.log("✅ Recipe shared successfully!");
                }).catch((err) => console.error("❌ Error sharing:", err));
            } else {
                navigator.clipboard.writeText(shareUrl).then(() => {
                    alert("✅ Link copied to clipboard!");
                }).catch(err => {
                    console.error("❌ Failed to copy:", err);
                });
            }
        });
    });
}

let editingRecipeId = null;
const editModal = document.getElementById('editModal');

function openEditModal(id) {
    db.collection("recipes").doc(id).get().then((doc) => {
        if (doc.exists) {
            const recipe = doc.data();
            document.getElementById('editRecipeName').value = recipe.name;
            document.getElementById('editCategory').value = recipe.category;
            document.getElementById('editIngredients').value = recipe.ingredients.join(', ');
            document.getElementById('editInstructions').value = recipe.instructions;

            editingRecipeId = id;
            editModal.style.display = 'block';
        } else {
            console.error("❌ Recipe not found for editing.");
        }
    });
}

document.getElementById('saveChangesBtn').addEventListener('click', async () => {
    const updatedRecipe = {
        name: document.getElementById('editRecipeName').value.trim(),
        category: document.getElementById('editCategory').value.trim(),
        ingredients: document.getElementById('editIngredients').value.split(',').map(i => i.trim()).filter(i => i),
        instructions: document.getElementById('editInstructions').value.trim(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (!updatedRecipe.name || !updatedRecipe.category || updatedRecipe.ingredients.length === 0 || !updatedRecipe.instructions) {
        alert("Please fill in all fields properly.");
        return;
    }

    try {
        await db.collection("recipes").doc(editingRecipeId).update(updatedRecipe);
        console.log("✅ Recipe updated successfully!");
        editModal.style.display = "none";
    } catch (error) {
        console.error("❌ Error updating recipe:", error);
    }
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    editModal.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', async () => {
    await fetchSharedRecipe();
});

async function fetchSharedRecipe() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (recipeId) {
        try {
            const doc = await db.collection("recipes").doc(recipeId).get();
            if (doc.exists) {
                const recipe = doc.data();
                renderSingleRecipe(recipe);
            } else {
                console.error("❌ Recipe not found.");
                document.getElementById('recipeList').innerHTML = '<p>Recipe not found.</p>';
            }
        } catch (error) {
            console.error("❌ Error fetching recipe:", error);
        }
    } else {
        db.collection("recipes").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
            if (snapshot.empty) {
                document.getElementById('recipeList').innerHTML = '<p>No recipes available.</p>';
                return;
            }
            renderAllRecipes(snapshot);
        }, (error) => {
            console.error("❌ Error fetching recipes:", error);
        });
    }
}

function renderSingleRecipe(recipe) {
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = `
        <li class="recipe-item">
            <h3>${recipe.name}</h3>
            <p><strong>Category:</strong> ${recipe.category}</p>
            <p><strong>Ingredients:</strong> ${recipe.ingredients ? recipe.ingredients.join(', ') : 'No Ingredients'}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions || 'No Instructions'}</p>
        </li>
    `;
}

const modalContent = document.querySelector(".modal-content");
let isDragging = false, offsetX = 0, offsetY = 0;

modalContent.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - modalContent.offsetLeft;
    offsetY = e.clientY - modalContent.offsetTop;
    modalContent.style.cursor = "grabbing";
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    modalContent.style.cursor = "move";
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        modalContent.style.left = `${e.clientX - offsetX}px`;
        modalContent.style.top = `${e.clientY - offsetY}px`;
        modalContent.style.margin = 0;
        modalContent.style.position = "absolute";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const chips = document.querySelectorAll(".chip");
    const searchBox = document.getElementById("searchBox");

    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            const selected = chip.dataset.filter;
            filterAndRender(selected, searchBox.value.toLowerCase());
        });
    });

    searchBox.addEventListener("input", () => {
        const selected = document.querySelector(".chip.active").dataset.filter;
        filterAndRender(selected, searchBox.value.toLowerCase());
    });
});

function filterAndRender(category, search) {
    db.collection("recipes").orderBy("timestamp", "desc").get().then(snapshot => {
        const filtered = snapshot.docs.filter(doc => {
            const recipe = doc.data();
            const matchesCategory = category === "All" || recipe.category === category;
            const matchesSearch = recipe.name.toLowerCase().includes(search);
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            document.getElementById("recipeList").innerHTML = `<p style="color:antiquewhite;font-family:cursive;">😢 No recipes found!</p>`;
        } else {
            renderAllRecipes({ forEach: cb => filtered.forEach(cb) });
        }
    });
}
