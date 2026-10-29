# React Recipe Project: Study Notes

*React, React Router, Tailwind and the dummyjson API. Written October 29, 2026.*

## 1. What I built

A recipe browser. The home page has a search bar, a bento-style card layout and a Load More button. Each recipe has a detail page, and both pages have loading and error states.

## 2. Core concepts

### React basics

- **Props**: data passed into a component, like `<RecipeCard recipe={recipe} className='...' />`. A card can accept an optional `className` so the parent controls its layout.
- **State (`useState`)**: values that change and redraw the screen, like `recipes`, `loading`, `errMsg` and `searchQuery`.
- **`useEffect(fn, [])`**: runs after the first render. This is the place to fetch data.
- **Lists**: `.map()` plus a unique `key` on each item.
- **Conditional rendering**: `cond && <X />`, `cond ? <A /> : <B />`, and early `return` for loading and error screens.
- **Updating from previous state**: `setRecipes((prev) => [...prev, ...newItems])`. The spread makes a new array. Never change state directly.

### Routing (React Router)

- `<Routes>` and `<Route path='/recipe/:id' />` define pages. `<Link to='/'>` navigates without a reload.
- `useParams()` reads the `:id` from the URL.
- `path='*'` is the catch-all for a 404 page.

### Fetching data

- axios returns a response object, and the real JSON is in `.data`. That is why you write `const { data } = await axios.get(url)`. dummyjson then wraps its list in `data.recipes` and gives `data.total`.
- `try / catch / finally`: `catch` sets the error, `finally` always turns the loading flag off.
- Pagination uses `limit` and `skip`. Use `skip = recipes.length`, and use `total` to decide when to hide Load More. I load 5 first, then 6 per click.

### Forms

- `onSubmit` with `e.preventDefault()` stops the page reload.
- `new FormData(e.target).get('query')` reads an input by its `name`. `e.target.reset()` clears it.

### Tailwind

- Theme tokens live in `@theme` (`--color-accent` gives `bg-accent`, `text-accent`, `border-accent`).
- Text color and font are inherited, so set them once on a wrapper div.
- Variants add a condition to a class: `hover:`, `lg:`, `disabled:`, `focus-visible:`, `motion-safe:`.
- Grid: `grid-cols-*` and `col-span-*`. For the bento layout, keep a `spans` array and use `spans[index % spans.length]`.
- Fill the remaining height: a parent with a fixed height and `flex flex-col`, the free child with `flex-1`, the fixed child with `shrink-0`, and `min-h-0` on the free child so its content cannot overflow.
- Loading skeletons: gray blocks with `animate-pulse` that copy the real layout.

## 3. Problem areas (the important part)

Each one: what I saw, why it happened, the fix, and the rule to remember.

### 3.1 `.map()` with curly braces showed nothing

```jsx
{recipes.map((recipe) => { <RecipeCard ... /> })}   // wrong: returns undefined
{recipes.map((recipe) => ( <RecipeCard ... /> ))}   // right
```

- **Why**: `{ }` after the arrow is a block body, so nothing is returned without `return`.
- **Rule**: `=> {` needs `return`. `=> (` returns automatically.

### 3.2 The data is not there on the first render

- `recipes` starts as `[]`, so `recipes[0]` is `undefined`. Reading `recipe.prepTimeMinutes` on it crashes the page.
- **Fix**: `recipes[0] && <RecipeCard recipe={recipes[0]} />`, and optional chaining like `recipe?.tags?.map(...)`.
- **Rule**: state starts empty. Guard anything you read from it.

### 3.3 Calling an async function inside JSX

```jsx
{fetchRecipes()}   // never do this in the return
```

- **Why it breaks**: rendering must be pure. A Promise cannot be rendered, and setting state during render causes an endless loop.
- **Fix**: only fetch inside `useEffect` or an event handler such as `onClick`.

### 3.4 Wrong logic operator

- `index != 0 | index != 1` is true for every number, so the first two cards were shown twice. `|` is also bitwise, not logical.
- **Fix**: `index > 1`, or better `recipes.slice(2).map(...)`.
- **Rule**: “not A and not B” is `&&`.

### 3.5 Tailwind arbitrary values and class names

- `lg:h-32rem` does nothing. Custom values need brackets: `lg:h-[32rem]`.
- `flex-2` only exists in Tailwind v4. `flex-[2]` works in v3 and v4.
- Class names must be written in full. `` `col-span-${n}` `` does not work because Tailwind cannot find it in the source.
- A wrong class fails silently, so check the spelling first (`text-s` should be `text-sm`).

### 3.6 The Home link did not reset the page

- Clicking a link to the page you are already on does not remount the component, so its state stays. After a bad search, Home kept showing “No recipes found”.
- **Fix**: add `useLocation()` and put `location.key` in the effect dependencies, so each click on Home refetches. Or give an explicit “Show all recipes” or Reset button.
- **Rule**: same component plus same route means state persists.

### 3.7 Stale search state

- Reset reloaded the list but left `searchQuery` set, so Load More fetched the old search again and appended it.
- `setSearchQuery(query)` ran even for an empty search, with the same effect.
- **Fix**:

```jsx
function handleReset() {
  setSearchQuery('');
  fetchRecipes();
}
```

- **Rule**: when the data source changes, reset everything tied to it together: the query, the list and the skip value.

### 3.8 Loading states

- One `loading` boolean only covers the first load. Searching and Load More need their own flags: `loading` (first load), `searching` (a new list), `loadingMore` (appending).
- An early `return` replaces the whole page, so the search bar disappeared. Render the loader inside the page instead.
- `disabled={loadingMore}` stops double clicks that would fetch the same batch twice and create duplicate keys. Style it with `disabled:opacity-60`.
- **Rule**: let state decide what the user can do. Disable the control while its action is running.

### 3.9 Errors that never ended loading

- If `catch` does not turn loading off, the skeleton shows forever. Use `finally` for cleanup.
- Clear the old error (`setErrorMsg('')`) at the start of a new fetch, or one failure blocks the page until reload.

### 3.10 StrictMode runs effects twice in development

- Appending on the first load put the first batch in twice. Fix: when `skipCount === 0`, replace the list. Otherwise append.

### 3.11 URLs need encoding

- `q=${query}` breaks if the text contains `&` or `#`. Let axios build it:

```jsx
axios.get(base, { params: { limit, skip: skipCount, q: query || undefined } })
```

### 3.12 Components defined inside other components

- `function LengthZero()` inside `Home` is a new function every render, so React treats it as a different component and remounts it each time. Define it outside `Home`, or just write the JSX inline.

### 3.13 Hooks must run in the same order

- Put every hook (`useState`, `useEffect`, `useLocation`) at the top, before any early `return`.

### 3.14 Flex height

- `flex-1` only fills space if the parent has a known height. Add `min-h-0` on the free child to stop content overflowing, and `shrink-0` on the fixed child.

## 4. Debugging habits

- Read the first line of the console error. It names the component and the line.
- Open the Network tab and check the URL, the status code and the response.
- `console.log` the value just before the crash. Is it `undefined`?
- Change one thing at a time. Delete a class to see what it did, and put it back if the page looks wrong.
- When something renders nothing and shows no error, suspect a missing `return`, a wrong class name or an empty array.

## 5. Quick rules

- Fetch in `useEffect` or event handlers, never in the render.
- State starts empty, so guard it.
- `=> {` needs `return`.
- A new data source means reset the query, the list and the skip value together.
- Use separate loading flags, and disable buttons while their action runs.
- Custom Tailwind values need `[ ]`, and class names must be written in full.
- All hooks go at the top of the component.
- Define components outside other components.

## 6. Still open in my code (as of my last paste)

- `lg:h-32rem` should be `lg:h-[32rem]`, and `text-s` should be `text-sm`.
- `handleSearch` still ignores an empty search, and Reset does not clear `searchQuery`.
- The Home link does not refetch yet (`useLocation` fix).
- `LengthZero` is still defined inside `Home`.
- Search the empty state shows “No recipes found” and “Loading...” together while `searching` is true.

## 7. Next things to practice

- Debounce the search so it does not fetch on every keystroke.
- Move the fetching into a custom hook like `useRecipes`.
- Keep the search in the URL with `useSearchParams` so it survives a refresh.
- Try React Query for caching and built-in loading and error states.