import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

const difficultyDot = {
    Easy: 'bg-green-500',
    Medium: 'bg-amber-500',
    Hard: 'bg-red-500',
};

export default function RecipeDetail() {
    const {id} = useParams();                                                           // Grabs dynamic values from the URL
    const [recipe, setRecipe] = useState({});
    const [loading, setLoading] = useState(true);                                       // loading...
    const [errMsg, setErrorMsg] = useState("");                                         // error message if give wrong Params

    async function fetchRecipe() {
        try{
            const {data} = await axios.get(`https://dummyjson.com/recipes/${id}`);
            setRecipe(data)
        } catch(err){
            console.log(err.message);
            setErrorMsg("Could not load Recipe details..., Please Try Again...")
        } finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchRecipe();
    },[])

    if (loading){
        return( <div className="loader m-auto mt-7"></div> )
    }
    
    // Error Message if Give Wrong Parameters..
    if (errMsg) {
    return (
        <main className="max-w-6xl mx-auto px-4 py-8">
            <Link
                to="/"
                className="inline-flex items-center gap-1.5 mb-6 text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
                <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Home
            </Link>

            <div
                role="alert"
                className="mx-auto max-w-md rounded-2xl border border-border bg-card px-6 py-10 text-center"
            >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                    <svg className="h-7 w-7 stroke-red-500 fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <h1 className="font-serif text-2xl font-bold text-text mb-2">
                    Recipe not found
                </h1>
                <p className="text-sm text-muted mb-6">
                    {errMsg || "Something went wrong while loading this recipe."}
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2 font-medium text-white hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                    Browse all recipes
                </Link>
            </div>
        </main>
    )
}

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Back to Home Button  */}
        <Link
        to="/"
        className="group inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full text-sm font-medium text-text bg-card border border-border transition-all duration-200 hover:border-accent hover:text-accent hover:shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
        <svg
            className="w-4 h-4 text-muted transition-all duration-200 group-hover:text-accent group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Back to Home</span>
        </Link>

      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full aspect-5/3 object-cover rounded-2xl border border-border"
        />

        <div className="flex flex-col">
          <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-text mb-3">
            {recipe.name}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-sm">
            <span className="flex items-center gap-1.5 font-semibold text-text">
              <svg className="w-4 h-4 fill-accent" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {recipe.rating}
              <span className="font-normal text-muted">({recipe.reviewCount} reviews)</span>
            </span>
            <span className="text-muted">{recipe.cuisine} cuisine</span>
            <span className="flex items-center gap-2 font-medium text-text">
              <span
                className={`h-2 w-2 rounded-full ${difficultyDot[recipe.difficulty] ?? 'bg-muted'}`}
                aria-hidden="true"
              />
              {recipe.difficulty}
            </span>
          </div>

            <dl className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-6">
                {/* Prep Time */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-3.5 shadow-xs transition-colors hover:border-accent/40">
                    <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                    <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    </div>
                    <div className="min-w-0">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">Prep time</dt>
                    <dd className="text-base font-bold text-text truncate">
                        {recipe.prepTimeMinutes} <span className="text-xs font-normal text-muted">mins</span>
                    </dd>
                    </div>
                </div>

                {/* Cook Time */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-3.5 shadow-xs transition-colors hover:border-accent/40">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                    <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 2c.5 3.5 4 4.5 4 8a6 6 0 1 1-12 0c0-3.5 3.5-4.5 4-8 1.5 2 2 3 4 0z" />
                    </svg>
                    </div>
                    <div className="min-w-0">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">Cook time</dt>
                    <dd className="text-base font-bold text-text truncate">
                        {recipe.cookTimeMinutes} <span className="text-xs font-normal text-muted">mins</span>
                    </dd>
                    </div>
                </div>

                {/* Servings */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-3.5 shadow-xs transition-colors hover:border-accent/40">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    </div>
                    <div className="min-w-0">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">Servings</dt>
                    <dd className="text-base font-bold text-text truncate">
                        {recipe.servings} <span className="text-xs font-normal text-muted">{recipe.servings === 1 ? 'person' : 'people'}</span>
                    </dd>
                    </div>
                </div>

                {/* Calories */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-3.5 shadow-xs transition-colors hover:border-accent/40">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
                    <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    </div>
                    <div className="min-w-0">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">Calories</dt>
                    <dd className="text-base font-bold text-text truncate">
                        {recipe.caloriesPerServing} <span className="text-xs font-normal text-muted">kcal</span>
                    </dd>
                    </div>
                </div>
            </dl>

        <div className="flex flex-wrap items-center gap-2">
            {/* Meal Type Primary Badges */}
            {recipe?.mealType?.map((type) => (
                <span
                key={type}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-accent/15 text-accent border border-accent/25 shadow-2xs"
                >
                {type}
                </span>
            ))}

            {/* Secondary Descriptive Tags */}
            {recipe?.tags?.map((tag) => (
                <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-muted bg-card/70 border border-border/80 shadow-2xs hover:border-accent/40 hover:text-text transition-colors duration-150 cursor-default"
                >
                <span className="text-muted/60 font-mono text-[11px]">#</span>
                {tag}
                </span>
            ))}
        </div>
        </div>
      </section>

      {/* Ingredients + Instructions */}
    <section className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
    {/* Ingredients Sidebar (Sticky on Desktop) */}
    <div className="md:col-span-2 md:sticky md:top-6 self-start rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-border/60">
        <h2 className="font-serif text-2xl font-bold text-text tracking-tight">
            Ingredients
        </h2>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent">
            {recipe?.ingredients?.length || 0} items
        </span>
        </div>

        <ul className="space-y-1">
        {recipe?.ingredients?.map((item, index) => (
            <li 
            key={index} 
            className="group flex items-start gap-3 p-2 rounded-xl text-sm leading-relaxed text-text hover:bg-muted/15 transition-colors cursor-default"
            >
            {/* Subtle Custom Bullet / Check-Circle Indicator */}
            <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/5 group-hover:border-accent group-hover:bg-accent/20 transition-all">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="flex-1 font-normal group-hover:text-text">
                {item}
            </span>
            </li>
        ))}
        </ul>
    </div>

    {/* Instructions Main Column (Connected Step-by-Step Flow) */}
    <div className="md:col-span-3">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/60">
        <h2 className="font-serif text-2xl font-bold text-text tracking-tight">
            Instructions
        </h2>
        <span className="text-xs font-medium text-muted">
            {recipe?.instructions?.length || 0} steps
        </span>
        </div>

        <ol className="relative space-y-1">
        {recipe?.instructions?.map((step, index) => {
            const isLast = index === (recipe?.instructions?.length ?? 0) - 1;

            return (
            <li key={index} className="relative flex gap-4 group">
                {/* Step Counter Badge & Connecting Timeline Line */}
                <div className="flex flex-col items-center">
                <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white shadow-xs group-hover:scale-105 transition-transform"
                    aria-hidden="true"
                >
                    {index + 1}
                </span>
                {!isLast && (
                    <div 
                    className="w-0.5 flex-1 bg-border/80 my-1 group-hover:bg-accent/40 transition-colors" 
                    aria-hidden="true" 
                    />
                )}
                </div>

                {/* Instruction Content Card */}
                <div className="pb-6 pt-0.5 flex-1">
                <p className="text-s font-semibold uppercase tracking-wider text-muted mb-1">
                    Step {index + 1}
                </p>
                <p className="text-[15px] leading-relaxed text-text font-normal">
                    {step}
                </p>
                </div>
            </li>
            );
        })}
        </ol>
    </div>
    </section>
    </main>
  );
}

// Optional chaining (?.) prevents crashes on initial render while async data is still loading