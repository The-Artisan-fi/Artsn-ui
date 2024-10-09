import SettingsFeature from "@/components/settings/settings-feature";
import { Suspense } from 'react';
import { LoadingFeature } from '@/components/loading/loading-feature';

export default function SettingsPage() {
    return (
        <Suspense fallback={<LoadingFeature />}>
            <SettingsFeature />
        </Suspense>
    );
}