import type React from "react";

import DashboardLayout from "@/components/dashboard-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MagangStatus } from "@/utils/constant";
import { api } from "@/utils/trpc";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditIntern() {
  const { status } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState<{
    name: string;
    institution: string;
    startDate: string;
    endDate: string;
    status: MagangStatus;
  }>({
    name: "",
    institution: "",
    startDate: "",
    endDate: "",
    status: MagangStatus.AKTIF,
  });
  const [error, setError] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch intern data
  const { data: intern, isLoading: isLoadingIntern } =
    api.intern.getInternById.useQuery({ id: id as string }, { enabled: !!id });

  // Update mutation
  const { mutate: updateIntern, isPending: isUpdating } =
    api.intern.updateIntern.useMutation({
      onSuccess: () => {
        router.push("/interns");
      },
      onError: (error) => {
        setError(error.message || "Terjadi kesalahan saat memperbarui data");
      },
    });

  // Set form data when intern data is loaded
  useEffect(() => {
    if (intern) {
      setFormData({
        name: intern.name,
        institution: intern.institution,
        startDate: new Date(intern.startDate).toISOString().split("T")[0],
        endDate: new Date(intern.endDate).toISOString().split("T")[0],
        status: intern.status as MagangStatus,
      });
    }
  }, [intern]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: MagangStatus) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (
      !formData.name ||
      !formData.institution ||
      !formData.startDate ||
      !formData.endDate
    ) {
      setError("Semua field harus diisi");
      return;
    }

    // Check if end date is after start date
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError("Tanggal selesai harus setelah tanggal mulai");
      return;
    }

    updateIntern({
      id: id as string,
      name: formData.name,
      institution: formData.institution,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      status: formData.status as MagangStatus,
    });
  };

  if (status === "unauthenticated") {
    return null;
  }

  if (isLoadingIntern) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center p-6">
          <div className="text-xl animate-pulse">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/interns")}
            className="mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-3xl">Edit Peserta Magang</h1>
        </div>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Form Edit Peserta Magang</CardTitle>
            <CardDescription>Perbarui data peserta magang</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Asal Instansi</Label>
                <Input
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="Masukkan asal instansi"
                  required
                />
              </div>

              <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Tanggal Mulai</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Tanggal Selesai</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={intern?.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(MagangStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/interns")}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Menyimpan..." : "Simpan"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
