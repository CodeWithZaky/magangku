import DashboardLayout from "@/components/dashboard-layout";
import { ExportPDFButton } from "@/components/export-pdf-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MagangStatus } from "@/utils/constant";
import { api } from "@/utils/trpc";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ENUM_FILTER = {
  SEMUA: "SEMUA",
  AKTIF: MagangStatus.AKTIF,
  SELESAI: MagangStatus.SELESAI,
  DIBATALKAN: MagangStatus.DIBATALKAN,
  TIDAK_LULUS: MagangStatus.TIDAK_LULUS,
};

export default function Interns() {
  const { status } = useSession();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("SEMUA");
  const [page, setPage] = useState(1);
  const [internToDelete, setInternToDelete] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch interns with filters
  const { data, isLoading, refetch } = api.intern.getInterns.useQuery(
    {
      search: searchQuery || "",
      status: statusFilter !== "SEMUA" ? statusFilter : undefined,
      page: page || 1,
      limit: 10,
    },
    {
      enabled: isAuthenticated,
      // Tambahkan retry untuk mengatasi kegagalan sementara
      retry: 3,
      // Tambahkan staleTime untuk mengurangi jumlah permintaan
      staleTime: 5000,
    }
  );

  const { mutate: deleteIntern } = api.intern.deleteIntern.useMutation({
    onSuccess: () => {
      refetch();
      setInternToDelete(null);
    },
  });

  const handleDelete = () => {
    if (internToDelete) {
      deleteIntern({ id: internToDelete });
    }
  };

  useEffect(() => {
    setIsAuthenticated(status === "authenticated");
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (!isAuthenticated && status !== "loading") {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-3xl">Daftar Peserta Magang</h1>
          <div className="flex gap-2">
            <ExportPDFButton />
            <Button onClick={() => router.push("/interns/create")}>
              <Plus className="mr-2 w-4 h-4" /> Tambah Peserta
            </Button>
          </div>
        </div>

        <div className="flex sm:flex-row flex-col gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau instansi..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ENUM_FILTER).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Asal Instansi</TableHead>
                <TableHead>Tanggal Mulai</TableHead>
                <TableHead>Tanggal Selesai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center">
                    <div className="animate-pulse">Loading...</div>
                  </TableCell>
                </TableRow>
              ) : data?.interns.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-6 text-muted-foreground text-center"
                  >
                    Tidak ada data peserta magang
                  </TableCell>
                </TableRow>
              ) : (
                data?.interns.map((intern) => (
                  <TableRow key={intern.id}>
                    <TableCell className="font-medium">{intern.name}</TableCell>
                    <TableCell>{intern.institution}</TableCell>
                    <TableCell>
                      {new Date(intern.startDate).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      {new Date(intern.endDate).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          intern.status === MagangStatus.AKTIF
                            ? "bg-green-100 text-green-800 border-green-800/50 border dark:border-none"
                            : intern.status === MagangStatus.SELESAI
                            ? "bg-blue-100 text-blue-800 border border-blue-800/50 dark:border-none"
                            : intern.status === MagangStatus.DIBATALKAN
                            ? "bg-red-100 text-red-800 border border-red-800/50 dark:border-none"
                            : intern.status === MagangStatus.TIDAK_LULUS
                            ? "bg-red-200 text-red-900 border border-red-900/50 dark:border-none"
                            : "bg-gray-400 text-gray-950 border border-gray-950/50 dark:border-none"
                        }`}
                      >
                        {intern.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/interns/edit/${intern.id}`)
                          }
                        >
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setInternToDelete(intern.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Hapus Data Peserta
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus data peserta{" "}
                                {intern.name}? Tindakan ini tidak dapat
                                dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setInternToDelete(null)}
                              >
                                Batal
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete}>
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {data?.totalPages && data.totalPages > 1 ? (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={
                    page <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      onClick={() => setPage(p)}
                      isActive={page === p}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((p) => Math.min(data.totalPages, p + 1))
                  }
                  className={
                    page >= data.totalPages
                      ? "pointer-events-none opacity-50 "
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : (
          ""
        )}
      </div>
    </DashboardLayout>
  );
}
