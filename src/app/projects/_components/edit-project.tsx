'use client'
import { trpc } from "@/server/client";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditProjectDialogProps {
  initialTitle: string;
  projectId: string;
}

export default function EditProjectDialog({ initialTitle, projectId }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const updateProjectMutation = trpc.projects.update.useMutation()
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      await updateProjectMutation.mutateAsync({ id: projectId, title })
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2" onClick={() => setOpen(true)}><Pencil />Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 items-center gap-2">
          <Label htmlFor="title">
            Title
          </Label>
          <Input
            id="title"
            defaultValue={initialTitle}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-4"
          />
        </div>
        {updateProjectMutation.isError && (
          <DialogDescription className="text-red-500">
            There was an error updating the project
          </DialogDescription>
        )}
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={updateProjectMutation.isPending || title.trim().length === 0}>
            {updateProjectMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
