import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PokemonByGeneration } from './components/general/ShowingApi'
import { Layout } from './components/general/Layout'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout children={<PokemonByGeneration />}>
    </Layout>
  </StrictMode>,
)
