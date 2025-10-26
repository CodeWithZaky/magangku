import { Button } from "@/components/ui/button";
import { api } from "@/utils/trpc";
import { FileDown } from "lucide-react";
import { useState } from "react";

export function ExportPDFButton() {
  const [loading, setLoading] = useState(false);
  const exportPDF = api.intern.exportInternsPDF.useMutation();

  const handleExport = async () => {
    setLoading(true);
    try {
      const pdfBase64 = await exportPDF.mutateAsync();
      const link = document.createElement("a");
      link.href = pdfBase64;
      link.download = "laporan_data_peserta_magang_PT.Minilemon_Nusantara.pdf";
      link.click();
    } catch (error) {
      alert("Gagal mengekspor PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      variant="secondary"
      className="flex items-center gap-2"
    >
      <FileDown size={18} />
      {loading ? "Mengekspor..." : "Export PDF"}
    </Button>
  );
}
