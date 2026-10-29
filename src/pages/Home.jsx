import React, { useEffect, useState } from 'react'
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

const FIRST_LOAD = 5;
const PAGE_SIZE = 6;

export default function Home() {

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);                                        // loading for 'Initial Page Render'
    const [searching, setSearching] = useState(false);                                  // searching for 'Search' Input
    const [loadingMore, setLoadingMore] = useState(false);                              // loading for 'Load More' Button

    const [total, setTotal] = useState(0);
    const [errMsg, setErrorMsg] = useState("");
    const [searchQuery, setSearchQuery] = useState("")

    async function fetchRecipes(skipCount = 0, query) {
        const limit = skipCount === 0 ? FIRST_LOAD : PAGE_SIZE;
        if (skipCount === 0) setSearching(true);                                        // new list: search or reset
        else setLoadingMore(true);                                                      // appending: Load More

        try {
            let url = `https://dummyjson.com/recipes?limit=${limit}&skip=${skipCount}`

            if (query) {
                url = `https://dummyjson.com/recipes/search?limit=${limit}&skip=${skipCount}&q=${query}`;         // url for search Recipes
            }
            const { data } = await axios.get(url)         // ?limit=6 => each fetch only 6 data loads..
            // HTTP client to fetch APIs. Install with: npm i axios
            // setRecipes(data.recipes) ❌
            setRecipes((prev) =>
                skipCount === 0 ? data.recipes : [...prev, ...data.recipes]);         // Keep existing recipes and append the new ones
            setTotal(data.total)                                                     // how much data has been fetched till now
        } catch (error) {
            setErrorMsg("Please Try again later...")
        } finally {
            setLoading(false)
            setLoadingMore(false)
            setSearching(false)
        }
    }
    useEffect(() => {                                                               // runs and fetched first 6 items in First Render
        fetchRecipes();
    }, []);

    if (loading) {                                   // In First Render/ Reload Of Page
        return (
            <div className="loader m-auto mt-7"></div>
        )
    }


    if (errMsg) {                                                                   // If somehow error come from api, this will handle that..
        return (
            <main className="max-w-6xl mx-auto px-4 py-16">
                <div
                    role="alert"
                    className="mx-auto max-w-md rounded-2xl border border-border bg-card px-6 py-10 text-center"
                >
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                        <svg
                            className="h-7 w-7 stroke-red-500 fill-none"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-text mb-2">
                        Unable to load recipes
                    </h1>
                    <p className="text-sm text-muted mb-6">
                        {errMsg || "Something went wrong while fetching the recipes. Please check your connection and try again."}
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2 font-medium text-white hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
                    >
                        <svg
                            className="h-4 w-4 stroke-current fill-none"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                            <path d="M16 16h5v5" />
                        </svg>
                        Try again
                    </button>
                </div>
            </main>
        );
    }


    function handleSearch(e) {
        e.preventDefault();
        const form = new FormData(e.target);
        const query = form.get("query").trim();            // from FormData we will get data for name='query'
        if (query) {                                         // if query is present do the fetch
            setSearchQuery(query)
            fetchRecipes(0, query)
        }
        e.target.reset();                                   // Clears all inputs inside this form
    }

    function handleReset(){
        setSearchQuery("");
        fetchRecipes();
    }

    function SearchBar(){                                   // Search Bar
        return(
            <div>
                <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-8">
                    <input
                        type="text"
                        name="query"
                        placeholder="Search Recipes..."
                        className="flex-1 border border-border rounded-full px-4 py-2 bg-card text-text outline-none focus:border-accent"
                    />
                    <button
                        type="submit"
                        className="bg-accent hover:bg-accent-hover text-white rounded-full px-5 py-2 font-medium cursor-pointer"
                    >
                        Search
                    </button>
                </form>
                {searchQuery && (
                    <p className="-mt-4 mb-8 text-center text-sm text-muted">
                        Showing Results for "{searchQuery}" <br />
                        <button
                            type='button'
                            onClick={handleReset}
                            disabled={searching}
                            className="font-medium text-accent hover:underline cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                            Reset
                        </button>
                    </p>
                )}
            </div>

        )
    }                                      



    function LengthZero() {                                     // If recipes.length === 0
        return (
            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="mx-auto my-12 max-w-md rounded-2xl border border-border bg-card px-6 py-10 text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                        <svg
                            className="h-7 w-7 stroke-accent fill-none"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-text mb-2">
                        No recipes found
                    </h2>
                    <p className="text-sm text-muted">
                        We couldn&apos;t find any recipes matching your search. Try searching for a different dish or ingredient!
                    </p>
                </div>
            </main>
        );
    }

    
    return (
        <main className="max-w-6xl mx-auto px-4 py-8">
            <SearchBar/>
            {searching && <p className='text-center text-sm text-muted pt-0 pb-6'>Loading...</p>}
            {recipes.length == 0 ? <LengthZero /> : (
                <>
                    {/* Recipes List + Welcome to Food World */}
                    <div className="mb-4 flex flex-col gap-4 lg:h-32rem lg:flex-row">
                        <div className="lg:flex-2">
                            {recipes[0] && <RecipeCard recipe={recipes[0]} className="h-full" />}
                        </div>

                        <div className="flex flex-col gap-4 lg:flex-1">
                            <div className="flex min-h-32 flex-1 flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 text-center">
                                <h2 className="font-serif text-2xl font-bold text-text">Welcome,</h2>
                                <h3 className="text-muted">to the Food World..</h3>
                            </div>
                            {recipes[1] && <RecipeCard recipe={recipes[1]} className="shrink-0" />}
                        </div>
                    </div>



                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">                                  {/* slice(2) means “everything from index 2 onward”. */}
                        {recipes.slice(2).map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} className="lg:h-96" />
                        ))}
                    </div>

                    {/* Load More Button  */}
                    {recipes.length < total && <div className='text-center mt-8'>                            {/* If current<total present then only button will be present  */}
                        <button
                            type="button"
                            disabled={loadingMore}
                            onClick={() => fetchRecipes(recipes.length, searchQuery)}
                            className="bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loadingMore ? "Loading..." : "Load More"}
                        </button>
                    </div>}
                </>
            )}


        </main>
    );
}