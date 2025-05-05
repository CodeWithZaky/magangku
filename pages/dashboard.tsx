import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MagangStatus } from "@/utils/constant";
import { api } from "@/utils/trpc";
import { Calendar, UserCheck, UsersRound, UserX } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch dashboard stats (moved outside conditional)
  const { data: stats, isLoading } = api.intern.getStats.useQuery();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="mb-6 font-bold text-3xl">Dashboard</h1>

        <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="font-medium text-sm">
                Total Peserta
              </CardTitle>
              <UsersRound className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                {isLoading ? "..." : stats?.totalInterns}
              </div>
              <p className="text-muted-foreground text-xs">
                Jumlah seluruh peserta magang
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="font-medium text-sm">
                Peserta Aktif
              </CardTitle>
              <UserCheck className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                {isLoading ? "..." : stats?.activeInterns}
              </div>
              <p className="text-muted-foreground text-xs">
                Peserta yang sedang magang
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="font-medium text-sm">
                Peserta Selesai
              </CardTitle>
              <UserX className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                {isLoading ? "..." : stats?.completedInterns}
              </div>
              <p className="text-muted-foreground text-xs">
                Peserta yang telah selesai magang
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="font-medium text-sm">
                Segera Selesai
              </CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                {isLoading ? "..." : stats?.endingSoonInterns}
              </div>
              <p className="text-muted-foreground text-xs">
                Peserta yang akan selesai dalam 7 hari
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="mt-8 mb-4 font-bold text-xl">
          Peserta Akan Segera Selesai
        </h2>
        {isLoading ? (
          <div className="animate-pulse">Loading...</div>
        ) : (
          <div className="border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="p-2 font-medium text-left">Nama</th>
                  <th className="p-2 font-medium text-left">Asal Instansi</th>
                  <th className="p-2 font-medium text-left">Tanggal Selesai</th>
                  <th className="p-2 font-medium text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.endingSoonInternsList?.map((intern) => (
                  <tr key={intern.id} className="border-b">
                    <td className="p-2">{intern.name}</td>
                    <td className="p-2">{intern.institution}</td>
                    <td className="p-2">
                      {new Date(intern.endDate).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          intern.status === MagangStatus.AKTIF
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {intern.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!stats?.endingSoonInternsList?.length && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-2 text-muted-foreground text-center"
                    >
                      Tidak ada peserta yang akan segera selesai
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
