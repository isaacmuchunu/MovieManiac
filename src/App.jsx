import { useState } from 'react'
import Navbar from './components/Navbar'
import { MovieList } from './components/MovieList'

function App() {

  return (
    <div className='bg-gray-900 '>
      <Navbar/>
      <MovieList/>
   
   
    </div>
  )
}

export default App
