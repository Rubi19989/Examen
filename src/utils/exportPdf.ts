import jsPDF from "jspdf";
import autoTable, { CellHookData } from "jspdf-autotable";


export type ExportMeta = {
  search?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

const urlToDataUrl = async (url: string): Promise<string> => {
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

const exportProductsDF =  async(
  products: Array<{ id: string | number; nombre: string; descripcion?: string; precio: number | string; imagen: string }>,
  meta?: ExportMeta
) =>  {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(16);
  doc.text("Catálogo de productos", pageWidth / 2, 40, { align: "center" });

  doc.setFontSize(10);
  const now = new Date();
  const metaLine = [
    meta?.search ? `Filtro: "${meta.search}"` : null,
    meta?.sort ? `Orden: ${meta.sort}` : null,
    meta?.page && meta?.pageSize ? `Página: ${meta.page} (x${meta.pageSize})` : null,
  ].filter(Boolean).join("   •   ");
  if (metaLine) doc.text(metaLine, pageWidth / 2, 58, { align: "center" });
  doc.text(now.toLocaleString(), pageWidth - 40, 58, { align: "right" });

  const rows = products.map(p => ([
    "",
    String(p.nombre ?? ""),
    String(p.descripcion ?? ""),
    typeof p.precio === "number" ? p.precio.toFixed(2) : p.precio,
  ]));

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
    styles: { fontSize: 10, cellPadding: 8, valign: "middle", minCellHeight: 50 },
    headStyles: { fillColor: [33, 37, 41] },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 140 },
      2: { cellWidth: 230 },
      3: { cellWidth: 70, halign: "right" },
    },

    margin: { top: 80, left: 20, right: 20 },
    didDrawCell: (data: CellHookData) => {
      if (data.section === "body" && data.column.index === 0) {
        const idx = data.row.index;
        const img = images[idx];
        if (img) {
          const { x, y, height } = data.cell;
          const size = 40;
          try {
            doc.addImage(
              img,
              "PNG",
              x + 4,
              y + (height - size) / 2,
              size, size
            );
          } catch {
            throw Error("Error al exportar")
          }
        }
      }
    },
  });

  doc.save("productos.pdf");
}

export {exportProductsDF}