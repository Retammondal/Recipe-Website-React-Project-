import React from 'react'
import { Link } from 'react-router';

const difficultyDot = {
    Easy: 'bg-green-500',
    Medium: 'bg-amber-500',
    Hard: 'bg-red-500',
};

export default function RecipeCard({ recipe }) {
    const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

    return (
        <Link
            to={`/recipe/${recipe.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-200 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
            {/* Image with rating overlaid */}
            <div className="relative aspect-5/3 overflow-hidden">
                <img
                    src={recipe.image}
                    alt={recipe.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-sm font-semibold text-text backdrop-blur-sm">
                    <svg className="h-4 w-4 fill-accent" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {recipe.rating}
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
                <h3 className=" transition-colors group-hover:text-accent">
                    {recipe.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{recipe.cuisine} cuisine</p>

                {/* Footer: time + difficulty */}
                <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
                        <span className="flex items-center gap-1.5 text-muted">
                            <svg
                                className="h-4 w-4 fill-none stroke-current"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {totalTime} min
                        </span>
                        <span className="flex items-center gap-2 font-medium text-text">
                            <span
                                className={`h-2 w-2 rounded-full ${difficultyDot[recipe.difficulty] ?? 'bg-muted'}`}
                                aria-hidden="true"
                            />
                            {recipe.difficulty}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}