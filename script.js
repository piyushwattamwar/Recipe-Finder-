document.getElementById('butt').addEventListener('click', async function (e) {
   e.preventDefault();
   let name = document.getElementById('name');
   name.innerHTML = `<h2>Fetching your Recipes...</h2>`;
   let meal = document.getElementById('text').value.trim();
   if(meal==''){
      name.innerHTML = `<h2>Please Enter Recipes...</h2>`;
     }

   if (meal) {
       try {
           const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`);
           const data = await response.json();

           const cardsContainer = document.querySelector('.cards');
           cardsContainer.innerHTML = ``;

           if (!data.meals) {
            name.innerHTML = `<h2>Sorry Recipe not found...</h2>`;
               return;
           }
          

           name.innerHTML = ``;

           data.meals.forEach((m, index) => {
               const cdiv = document.createElement('div');
               cdiv.className = 'cards-child';
               cdiv.innerHTML = `
                   <img src="${m.strMealThumb}" alt="${m.strMeal}" />
                   <h3>${m.strMeal}</h3>
                   <p><b>${m.strArea}</b> Dish </p>
                   <p><b>${m.strCategory}</b> Category</p>
               `;

               let detail = document.createElement('button');
               detail.textContent = `View Recipe`;
               detail.className = 'vrecipe'; 
               detail.dataset.index = index; 
               cdiv.appendChild(detail);

               cardsContainer.appendChild(cdiv);
           });

        
           document.querySelectorAll('.vrecipe').forEach((button) => {
               button.addEventListener('click', function () {
                   const mealIndex = button.dataset.index;
                   const selectedMeal = data.meals[mealIndex];

                  
                   const fetchIngredients = (meal) => {
                       let ingredientsList = '';
                       for (let i = 1; i <= 20; i++) {
                           const ingredient = meal[`strIngredient${i}`];
                           const measure = meal[`strMeasure${i}`];
                           if (ingredient) {
                               ingredientsList += `<li>${measure ? measure : ''} ${ingredient}</li>`;
                           } else {
                               break;
                           }
                       }
                       return ingredientsList;
                   };
      
                   const recipeDetailsContent = document.querySelector('.recipe-deatls-content');
                   recipeDetailsContent.innerHTML = `
                       <h2>${selectedMeal.strMeal}</h2>
                       <h3>Ingredients:</h3>
                       <ul>${fetchIngredients(selectedMeal)}</ul>
                       <h3>Instructions:</h3>
                       <p>${selectedMeal.strInstructions}</p>
                   `;
                   recipeDetailsContent.parentElement.style.display = 'block';

                   
document.getElementById('close-button').addEventListener('click', function () {
   this.parentElement.style.display = "none";
});

               });
           });
       } catch (error) {
           console.error('Error fetching meal data:', error);
       }
   } else {
       console.error('Please enter a meal name!');
   }
});
