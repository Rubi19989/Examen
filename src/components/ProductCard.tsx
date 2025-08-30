import React from 'react';
import type { Product } from '../types/Product';
import "../assets/styles/ProductCard.css"
import { useProducts } from '../context/ProductContext';
import { ConfirmModal } from './ConfirmModal';

interface Props {
    product: Product;
    onEdit: (product: Product) => void;
    onView: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onEdit, onView }) => {
    const { removeProduct } = useProducts();

    return (
        <>
            <div className="card h-100 shadow-sm">
                <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="card-img-top"
                />

                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.nombre}</h5>
                    <p className="card-text flex-grow-1">{product.descripcion}</p>
                    <p className="fw-bold mt-2">{`$ ${product.precio}`}</p>

                    <div className="mt-3 d-flex justify-content-between gap-2">
                        <button
                            className="btn btn-sm btn-outline-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#productDetailModal"
                            onClick={() => onView(product)}
                            title="Ver detalles"
                        >
                            <i className="bi bi-eye-fill"></i>
                        </button>
                        <button
                            className="btn btn-sm btn-warning"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasCrear"
                            onClick={() => onEdit(product)}
                            title="Editar producto"
                        >
                            <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                            className="btn btn-sm btn-danger"
                            data-bs-toggle="modal"
                            data-bs-target={`#confirmDelete${product.id}`}
                            title="Eliminar producto"
                        >
                            <i className="bi bi-trash3-fill"></i>
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                modalId={`confirmDelete${product.id}`}
                title="Confirmar eliminación"
                message={`¿Seguro que deseas eliminar el producto "${product.nombre}"?`}
                onConfirm={() => removeProduct(product.id)}
            />
        </>
    );
};

export { ProductCard };
