import './App.css'
import { ProductProvider } from './context/ProductContext'
import { Home } from './pages/Home'

function App() {
  return (
    <>
      <ProductProvider>
        <div className='container py-4'>
          <h1 className='text-center mb-4' > Catálogo de productos</h1>
          <Home />
        </div>
      </ProductProvider>
    </>
  )
}

export default App
