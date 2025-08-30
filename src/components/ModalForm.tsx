import React from "react";
import { ProductForm } from "./ProductForm";
import type { Product } from "../types/Product";

interface ModalFormProps {
    selectProduct: Product | null;
    onClose: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ selectProduct, onClose }) => {

    return (
        <>
            <div className='d-flex justify-content-end mb-3'>
                <button
                    type="button"
                    className="btn btn-dark rounded-circle d-flex align-items-center justify-content-center shadow"
                    style={{
                        width: "50px",
                        height: "50px",
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        zIndex: 1050,
                    }}
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCrear"
                    onClick={() => onClose()}
                >
                    <i className="bi bi-plus-lg"></i>
                </button>
            </div>
            <div
                className="offcanvas offcanvas-end"
                tabIndex={-1}
                id="offcanvasCrear"
                aria-labelledby="offcanvasCrearLabel"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
            >
                <div className="offcanvas-header">
                    <h5 id="offcanvasCrearLabel">
                        {selectProduct ? "Editar Producto" : "Crear Producto"}
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        onClick={onClose}
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <ProductForm  selectProduct={selectProduct} onClose={onClose}/>
                </div>
            </div>
        </>
    )
}

export { ModalForm }