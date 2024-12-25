'use client'
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/server/client";
import { useState } from "react";

interface PublicSwitchProps {
  initialValue: boolean;
  projectId: string;
}

export default function ProjectPublicSwitch({ initialValue, projectId }: PublicSwitchProps) {
  const [checked, setChecked] = useState(initialValue);
  const updateProjectMutation = trpc.projects.update.useMutation()

  const handleToggle = async (newValue: boolean) => {
    setChecked(newValue);
    try {
      await updateProjectMutation.mutateAsync({ id: projectId, isPublic: newValue })
    } catch (error) {
      console.error(error)
      setChecked(!newValue)
    }
  };

  return (
    <Switch
      checked={checked}
      onCheckedChange={handleToggle}
    />
  )
}
