import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import type { Product } from '../types/Product'
import { useProducts } from '../context/ProductContext'

interface FormData {
    nombre: string,
    descripcion?: string,
    precio: number,
    imagen: FileList
}

interface Props {
    selectProduct?: Product | null;
    onClose?: () => void;
}

const ProductForm: React.FC<Props> = ({ selectProduct = null, onClose = () => { } }) => {

    const { addProduct, editProduct } = useProducts();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
    const [previsualizar, setPrevisualizar] = useState<string | null>(null);

    useEffect(() => {
        if (selectProduct) {
            reset({
                nombre: selectProduct.nombre,
                descripcion: selectProduct.descripcion,
                precio: selectProduct.precio,
            });
            setPrevisualizar(selectProduct.imagen)
        } else {
            reset({
                nombre: "",
                descripcion: "",
                precio: 0,
                imagen: undefined as any
            })
        }
        setPrevisualizar(null)
    }, [selectProduct, reset]);

    const onSubmit = async (data: FormData) => {
        const file = data.imagen[0]
        const reader = new FileReader();
        reader.onloadend = async () => {
            const product: Product = {
                id: selectProduct ? selectProduct.id : Date.now(),
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                imagen: file ? (reader.result as string) 
                : selectProduct?.imagen || previsualizar || "",
            };

            if (selectProduct) {
                await editProduct(selectProduct.id, product);
            } else {
                await addProduct(product)
            }

            reset();
            setPrevisualizar(null);
            onClose?.();
        };

        if (file) {
            reader.readAsDataURL(file)
        } else {
            reader.onloadend(null as any)
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPrevisualizar(reader.result as string)
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <>
            <form className='card p-4 shadow-sm' onSubmit={handleSubmit(onSubmit)}>
                {/* <h4 className='mb-3'>Crear Producto</h4> */}
                <div className='mb-3'>
                    <label className='form-label'>Nombre</label>
                    <input type="text"
                        className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                        {...register("nombre", { required: true, minLength: 3, maxLength: 80 })}
                    />
                    {errors.nombre && (
                        <div className='invalid-feedback'>
                            El nombre es requerido (3-80 caracteres)
                        </div>
                    )}
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Descipción</label>
                    <textarea
                        className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
                        {...register("descripcion", { maxLength: 500 })}
                    />
                    {errors.descripcion && (
                        <div className='invalid-feedback'>
                            Maximo 500 caracteres
                        </div>
                    )}
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Precio</label>
                    <input
                        type="number"
                        className={`form-control ${errors.precio ? "is-invalid" : ""}`}
                        {...register("precio", { required: true, minLength: 1 })}
                    />
                    {errors.precio && (
                        <div className='invalid-feedback'>
                            El precio debe ser mayor a 0
                        </div>
                    )}
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Imagen</label>
                    <input
                        type="file"
                        className={`form-control ${errors.imagen ? "is-invalid" : ""}`}
                        {...register("imagen", { required: false })}
                        onChange={handleImageChange}
                    />
                    {errors.imagen && (
                        <div className='invalid-feedback'>
                            Colocar Imagen de preferencia
                        </div>
                    )}
                </div>

                {previsualizar && (
                    <div className='mb-3 text-center'>
                        <img
                            src={previsualizar}
                            alt={previsualizar}
                            className='img-thumbnail'
                            style={{ maxHeight: "200px" }}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className='btn btn-primary w-100'
                    data-bs-dismiss="offcanvas"
                >
                    {selectProduct ? "Actualizar Producto" : "Guardar Producto"}
                </button>
            </form>

        </>
    )
}

export { ProductForm }