import SettingsFeature from "@/components/settings/settings-feature";
import { Suspense } from 'react';
export default function SettingsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SettingsFeature />
        </Suspense>
    );
}