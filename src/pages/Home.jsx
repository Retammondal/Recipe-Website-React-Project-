import React, { useEffect, useState } from 'react'
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';


const FIRST_LOAD = 5;
const PAGE_SIZE = 6;

export default function Home() {
    
    const [recipes, setRecipes] = useState([]);
    const [loading,setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    
    async function fetchRecipes(skipCount = 0) {
        const limit = skipCount === 0 ? FIRST_LOAD : PAGE_SIZE;
        try{
            const {data} = await axios.get(`https://dummyjson.com/recipes?limit=${limit}&skip=${skipCount}`)           // ?limit=6 => each fetch only 6 data loads..
                                                                                                                // HTTP client to fetch APIs. Install with: npm i axios
                                                                                    // setRecipes(data.recipes) ❌
            setRecipes((prev)=> [...prev, ...data.recipes]);                        // Keep existing recipes and append the new ones
            setTotal(data.total)                                                    // how much data has been fetched till now
            setLoading(false)
        }catch(error){
            console.log(error.message);
        }
    }
    useEffect(() => {                                                               // runs and fetched first 6 items in First Render
        fetchRecipes();
    }, []);

    if (loading){            
        return(
            <div className="loader m-auto mt-7"></div>
        )
    }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Input Form Div  */}
        <div>
            <form action="" className='flex gap-2 max-w-md mx-auto mb-8'>
                <input type="text"
                placeholder='Search Recipes...'
                className='flex-1 border border-border rounded-full px-3 py-2 bg-card text-text outline-none focus:border-accent' />
                <button type='button' className='bg-accent hover:bg-accent-hover text-white rounded-full px-4 py-2 font-medium cursor-pointer'>
                    Search
                </button>
            </form>
        </div>


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



        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">                                     {/* slice(2) means “everything from index 2 onward”. */}
            {recipes.slice(2).map((recipe) => (                                                     
                <RecipeCard key={recipe.id} recipe={recipe} className="lg:h-96" />
            ))}
        </div>

        {/* Load More Button  */}
        { recipes.length<total && <div className='text-center mt-8'>                                {/* If current<total present then only button will be present  */}
            <button type='button' className='bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium cursor-pointer' 
            onClick={()=>fetchRecipes(recipes.length)}>                                             {/* After each click fetch will again run with some skip value  */}
                Load More
            </button>
        </div>}

    </main>
  )
}
