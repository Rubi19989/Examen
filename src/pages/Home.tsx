import { useRef, useState } from "react";
import { useProducts } from "../context/ProductContext";
import { ProductCard } from "../components/ProductCard";
import { ModalForm } from "../components/ModalForm";
import type { Product } from "../types/Product";
import { exportProductsDF } from "../utils/exportPdf";
import { ProductDetails } from "./ProductDetail";
import { Pagination } from "../components/Pagination";


const PAGE_SIZE = 8;

const Home: React.FC = () => {
    const { products } = useProducts();
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"" | "nombre" | "precio">("");
    const [selectProduct, setSelectProduct] = useState<Product | null>(null);
    const [page, setPage] = useState(1);

    const filtered = products
        .filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) =>
            sort === "precio"
                ? a.precio - b.precio
                : sort === "nombre"
                    ? a.nombre.localeCompare(b.nombre)
                    : 0
        );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const currentPageItems = filtered.slice(start, start + PAGE_SIZE);

    const gridRef = useRef<HTMLDivElement | null>(null);

    const handleExportTable = async () => {
        await exportProductsDF(
            filtered.map((p) => ({
                id: p.id,
                nombre: p.nombre,
                descripcion: p.descripcion ?? "",
                precio: p.precio,
                imagen: p.imagen,
            })),
        );
    };


    const handleSearch = (v: string) => {
        setSearch(v);
        setPage(1);
    };
    const handleSort = (v: "" | "nombre" | "precio") => {
        setSort(v);
        setPage(1);
    };

    return (
        <>
            <div className="row col-6 col-md-4">
                <ProductDetails
                    product={selectProduct}
                    onClose={() => setSelectProduct(null)} />
            </div>

            <div className="row mb-4">
                <div className="col-6 col-md-4 mx-auto">
                    <ModalForm
                        selectProduct={selectProduct}
                        onClose={() =>
                            setSelectProduct(null)} />
                </div>
            </div>

            <div className="container">
                <div className="row g-2 align-items-center mb-3">
                    <div className="col-12 col-md-5">
                        <label htmlFor="buscar" className="form-label visually-hidden">
                            Buscar
                        </label>
                        <input
                            id="buscar"
                            className="form-control"
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            aria-label="Buscar productos por nombre"
                        />
                    </div>
                    <div className="col-6 col-md-3">
                        <label htmlFor="sort" className="form-label visually-hidden">
                            Ordenar
                        </label>
                        <select
                            id="sort"
                            className="form-select"
                            value={sort}
                            onChange={(e) => handleSort(e.target.value as any)}
                            aria-label="Ordenar productos"
                        >
                            <option value="">Ordenar Por</option>
                            <option value="nombre">Nombre</option>
                            <option value="precio">Precio</option>
                        </select>
                    </div>

                    <div className="col-6 col-md-4 d-flex gap-2 justify-content-end">
                        <button
                            className="btn btn-dark"
                            onClick={handleExportTable}
                            aria-label="Exportar listado actual a PDF"
                            title="Exportar tabla (filtrado + paginado)"
                        >
                            Exportar PDF
                        </button>
                    </div>
                </div>
                <div>
                    <div className="d-flex flex-wrap  gap-4" ref={gridRef}>
                        {currentPageItems.map(product => (
                            <div>
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onEdit={setSelectProduct}
                                    onView={setSelectProduct}
                                />
                            </div>
                        ))}
                    </div>


                    {currentPageItems.length === 0 && (
                        <div className="col-12">
                            <div className="alert alert-info" role="status">
                                No hay productos para mostrar con el filtro actual.
                            </div>
                        </div>
                    )}
                </div>

                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div >
        </>
    );
};

export { Home };
