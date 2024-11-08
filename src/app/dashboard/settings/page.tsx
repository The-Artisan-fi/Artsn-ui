import Settings from "@/components/settings/Settings";
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';

export default function SettingsPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Settings />
        </Suspense>
    );
}