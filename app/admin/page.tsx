import { Suspense } from "react";
import { isAdmin } from "@/lib/admin-auth";
import { getCatalog } from "@/lib/catalog";
import AdminDashboard from "@/components/admin/admin-dashboard";

export const metadata = { title: "Admin — SONORA" };
export const instant = false;

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="glass flex items-center justify-center rounded-[2rem] px-6 py-20 text-sm text-slate-400">
          Loading dashboard…
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  const catalog = await getCatalog();
  const admin = await isAdmin();
  const { passwordHash: _passwordHash, ...safe } = catalog;
  void _passwordHash;
  return <AdminDashboard catalog={safe} isAdmin={admin} />;
}
