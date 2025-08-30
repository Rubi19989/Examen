import React from 'react'
import type { Product } from '../types/Product'


interface Props {
    product: Product | null;
    onClose: () => void;
}

const ProductDetails: React.FC<Props> = ({ product, onClose }) => {
    return (
        <>
            <div
                className='modal fade'
                id='productDetailModal'
                tabIndex={-1}
                aria-labelledby="productDetailModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 id="productDetailModalLabel" className="modal-title">
                                {product?.nombre ?? "Detalle del producto"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Cerrar"
                                onClick={onClose}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {product ? (
                                <div className="row">
                                    <div className="col-md-6 text-center">
                                        <img
                                            src={product.imagen}
                                            alt={product.nombre}
                                            className="img-fluid rounded shadow-sm"
                                            style={{ maxHeight: "300px", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className="text-start col-md-6">
                                        <p>
                                            <strong>Nombre:</strong> {product.nombre}
                                        </p>
                                        <p>
                                            <strong>Descripción:</strong> {product.descripcion || "Sin descripción"}
                                        </p>
                                        <p>
                                            <strong>Precio:</strong> ${product.precio}
                                        </p>
                                        <p>
                                            <strong>ID:</strong> {product.id}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p>No se ha seleccionado un producto.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export { ProductDetails }