import jsPDF from "jspdf";
import autoTable, { CellHookData } from "jspdf-autotable";

// Convierte una URL de imagen a DataURL (para poder incluirla en el PDF).
export async function urlToDataUrl(url: string): Promise<string> {
  // Si ya es dataURL, la devolvemos tal cual
  if (url.startsWith("data:image")) return url;

  const res = await fetch(url, { cache: "no-store" });
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

export type ExportMeta = {
  search?: string;
  sort?: string;         // "nombre" | "precio" | ""
  page?: number;         // 1-based
  pageSize?: number;
};

// products: elementos ya filtrados y paginados que están en pantalla
export async function exportProductsAsTablePDF(
  products: Array<{ id: string | number; nombre: string; descripcion?: string; precio: number | string; imagen: string }>,
  meta?: ExportMeta
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Título
  doc.setFontSize(16);
  doc.text("Catálogo de productos", pageWidth / 2, 40, { align: "center" });

  // Subtítulo/metadatos
  doc.setFontSize(10);
  const now = new Date();
  const metaLine = [
    meta?.search ? `Filtro: "${meta.search}"` : null,
    meta?.sort ? `Orden: ${meta.sort}` : null,
    meta?.page && meta?.pageSize ? `Página: ${meta.page} (x${meta.pageSize})` : null,
  ].filter(Boolean).join("   •   ");
  if (metaLine) doc.text(metaLine, pageWidth / 2, 58, { align: "center" });
  doc.text(now.toLocaleString(), pageWidth - 40, 58, { align: "right" });

  // Preparamos filas (sin imagen aún; la dibujamos con hook)
  const rows = products.map(p => ([
    "", // columna imagen (la pintamos luego)
    String(p.nombre ?? ""),
    String(p.descripcion ?? ""),
    typeof p.precio === "number" ? p.precio.toFixed(2) : p.precio,
  ]));

  // Intentaremos convertir todas las imágenes a dataURL (si alguna falla, la omitimos)
  const images: (string | null)[] = await Promise.all(
    products.map(async p => {
      try {
        return await urlToDataUrl(p.imagen);
      } catch {
        return null;
      }
    })
  );

  autoTable(doc, {
    startY: 80,
    head: [["Img", "Nombre", "Descripción", "Precio"]],
    body: rows,
    styles: { fontSize: 9, cellPadding: 6, valign: "middle" },
    headStyles: { fillColor: [33, 37, 41] }, // Bootstrap-like dark
    columnStyles: {
      0: { cellWidth: 40 },  // columna imagen
      1: { cellWidth: 160 },
      2: { cellWidth: 250 },
      3: { cellWidth: 70, halign: "right" },
    },
    didDrawCell: (data: CellHookData) => {
      // Pintamos miniatura en la columna 0
      if (data.section === "body" && data.column.index === 0) {
        const idx = data.row.index;
        const img = images[idx];
        if (img) {
          const { x, y } = data.cell;
          const size = 32; // thumbnail
          try {
            doc.addImage(img, "PNG", x + 4, y + (data.cell.height - size) / 2, size, size);
          } catch {
            // si falla, no detenemos la exportación
          }
        }
      }
    },
  });

  doc.save("productos.pdf");
}