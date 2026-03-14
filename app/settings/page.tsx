"use client";

import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import SettingsForm from "@/components/forms/SettingsForm";

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="Settings"
          subtitle="Ish vaqti va penalty sozlamalarini boshqaring"
        />

        <SettingsForm />
      </div>
    </MainLayout>
  );
}