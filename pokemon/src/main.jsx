import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PokemonByGeneration } from './components/ShowingApi'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PokemonByGeneration />
  </StrictMode>,
)
