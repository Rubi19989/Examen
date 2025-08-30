import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "../types/Product";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../services/productService";

interface ProductContextType {
    products: Product[],
    addProduct: (product: Product) => Promise<void>;
    editProduct: (id: number, product: Product) => Promise<void>;
    removeProduct: (id: number) => Promise<void>
    fetchProducts: () => Promise<void>
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [products, setProducts] = useState<Product[]>([]);

    const fetchProducts = async () => {
        const data = await getProducts();
        setProducts(data)
    }

    const addProduct = async (product: Product) => {
        await createProduct(product);
        await fetchProducts();
    }

    const editProduct = async (id: number, product: Product) => {
        await updateProduct(id, product);
        await fetchProducts()
    }

    const removeProduct = async (id: number) => {
        await deleteProduct(id);
        await fetchProducts()
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider value={{
            products,
            addProduct,
            editProduct,
            removeProduct,
            fetchProducts,
            setProducts
        }}>
            {children}
        </ProductContext.Provider>
    )

};

const useProducts = () => {
    const context = useContext(ProductContext);

    if (!context) {
        throw new Error("useProducts debe usarse dentro de ProductProvider");
    }

    return context
}

export { ProductContext, ProductProvider, useProducts }