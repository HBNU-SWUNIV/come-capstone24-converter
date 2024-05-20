'use client'
import buttonStyles from "../styles/button.module.css"; 

import React, { useState, FormEvent } from 'react'

export default function FiletoEmail(){
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null) 

        try{
            const formData = new FormData(event.currentTarget)
            
            const response = await fetch('/api/upload_ses/', {
              method: 'POST',
              body: formData,
            })
            formData.forEach((value, key) => {
                console.log(key, value);
              });
            const data = await response.json()
      
        }catch(error){
            setError(error.message)
            console.error(error)
        }finally{
            setIsLoading(false)
        }
       
     
   
      }
     
    return(
    
        <div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={onSubmit}>
          <input type="text" name="email" />
          <button className={buttonStyles["btn-16"]} type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </form>
         </div>
    
    )
}