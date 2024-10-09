import dynamic from "next/dynamic";
// import AdminKycFeature from "@/components/admin/kyc/admin-kyc-feature";

const AdminKycFeature = dynamic(() => import('@/components/admin/kyc/admin-kyc-feature'), { ssr: false });

export default function AdminKycPage() {
    return <AdminKycFeature />;
};