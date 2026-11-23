"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { ProfileForm } from "./ProfileForm";

export function SettingsManager() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Your admin profile and password.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Change password</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="pt-4">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="password" className="pt-4">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
