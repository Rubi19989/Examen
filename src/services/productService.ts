import axios from "axios";
import type { Product } from "../types/Product";

const API_URL = "http://localhost:3001/products"

// Obtener todos los productos
const getProducts = async (): Promise<Product[]> => {
    const res = await axios.get(API_URL)
    return res.data
}

// Crear nuevos productos
const createProduct = async( product: Product): Promise<Product> => {
    const res = await axios.post(API_URL, product);
    return res.data
}

// Actualizar Productos 
const updateProduct = async(id: number, product: Product): Promise<Product> => {
    const res = await axios.put(`${API_URL}/${id}`, product)
    return res.data
}

// Eliminar Productos
const deleteProduct = async(id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
}

// Obtener un solo producto
const getProductId = async(id: number): Promise<Product> => {
    const res = await axios.get(`${API_URL}/${id}`);
     return res.data;
} 

export { getProducts, createProduct, updateProduct, deleteProduct, getProductId }