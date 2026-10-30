# React Recipe Project 01

A recipe website I built while working through the React part of my web development course. You can browse recipes, search for them, keep loading more as you scroll down, and open any recipe to see its ingredients and steps.

There's no backend of my own. All the data comes from the free DummyJSON recipes API (https://dummyjson.com/recipes).

## What I used

- React (set up with Vite)
- React Router for the pages
- Axios for the API calls
- Tailwind CSS for all the styling

## Running it

```
npm install
npm run dev
```

## Pages

There are three routes:

- `/` is the Home page with the search bar and all the recipe cards
- `/recipe/:id` is the detail page for one recipe
- `*` is a Not Found page for anything else

The Navbar sits outside the `<Routes>` so it shows on every page.

## How the Home page works

**Loading in batches.** The API takes a `limit` and a `skip`. On the first load I ask for 5 recipes. Every click on Load More asks for 6 more, and `skip` is just `recipes.length`, so it always matches how many cards are already on screen. The 5 and 6 are because of the layout. The top section uses 2 recipes, so the first 5 fill that plus one full row of 3 below it. Each batch of 6 after that fills two more rows on desktop.

**Knowing when to stop.** The response also has a `total`. I save it in state and only show the Load More button while `recipes.length < total`. Once everything is loaded the button disappears.

**Replace or append.** When `skipCount` is 0 (first load, a new search, a reset) the list gets replaced. For any other skip value the new recipes get added to the end with `[...prev, ...data.recipes]`. I used the callback form of `setRecipes` so it always works with the latest list.

**Search.** The search form has an input with `name="query"`. On submit I call `e.preventDefault()` and read the value with `FormData`, so I don't need a state update on every keystroke. Searching uses a different endpoint (`/recipes/search?q=...`). I keep the search text in a `searchQuery` state and pass it to Load More as well, otherwise the next batches would come from the full list instead of the search results. The Reset button loads the normal list again, and it has to clear `searchQuery` too or Load More goes back to the old search.

**Three loading states.** I ended up needing three separate ones:

- `loading` is for the very first render and shows a spinner for the whole page
- `searching` shows a small "Loading..." under the search bar, and the search bar stays on screen
- `loadingMore` changes the Load More button text and disables it, so I can't double click and fetch the same batch twice

**Empty and error states.** If a search finds nothing there's a "No recipes found" card. If a request fails, the `catch` sets an error message and the page shows an error card with a Try again button that reloads the page.

**The layout.** The first recipe is big on the left. The second one sits on the right under a welcome box, and that box is `flex-1` so it takes whatever height is left. Everything else comes from `recipes.slice(2)` in a normal grid.

## RecipeCard

The whole card is a `<Link>` to `/recipe/${recipe.id}`. The total time is `prepTimeMinutes + cookTimeMinutes`. The little coloured dot for difficulty comes from a small object that maps Easy, Medium and Hard to a colour. The card also takes a `className` prop so Home can decide how big each card should be.

## RecipeDetail

`useParams()` gives me the `id` from the URL, and I fetch `https://dummyjson.com/recipes/${id}` with it. A `loading` state shows a placeholder until the data arrives, and an error message shows if the request fails. The recipe starts as an empty object, so I used optional chaining (`recipe?.ingredients?.map`) on the lists. The steps are numbered using the `index` from `.map`.

## Theme

All the colours and fonts are in one `@theme` block in the CSS (background, card, text, muted, accent, accent-hover, border). Tailwind turns those into classes like `bg-card`, `text-muted` and `border-border`, so if I want to change how the whole site looks I only change that one block.

## Mistakes I made along the way

Writing these down so I don't repeat them.

- I wrote `.map((recipe) => { <RecipeCard /> })` with curly braces and no `return`, so nothing showed up. Use `( )` or add `return`.
- `index != 0 | index != 1` is always true. I wanted "not 0 and not 1", which is `&&`. `recipes.slice(2)` was cleaner anyway.
- I called `fetchRecipes()` straight inside the JSX. Fetching has to go in `useEffect` or an event handler, not in the render.
- Axios wraps the response, so the recipes are in `data.recipes`, not `data`. That's why I write `const { data } = await axios.get(...)`.
- Tailwind needs square brackets for custom values, like `lg:h-[32rem]`. `lg:h-32rem` does nothing.
- After pressing Reset, the old search text was still in state, so Load More added the old search results to the full list.