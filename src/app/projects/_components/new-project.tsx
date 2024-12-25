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
import { PlusCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const createProjectMutation = trpc.projects.create.useMutation()
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    try {
      const project = await createProjectMutation.mutateAsync({ title, snapshot: '{}' })
      startTransition(() => {
        router.push(`/${project.id}`)
        setOpen(false)
      })
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 text-lg" onClick={() => setOpen(true)}><PlusCircle />New project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 items-center gap-2">
          <Label htmlFor="title">
            Title
          </Label>
          <Input
            id="title"
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-4"
          />
        </div>
        {createProjectMutation.isError && (
          <DialogDescription className="text-red-500">
            There was an error creating the project
          </DialogDescription>
        )}
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={createProjectMutation.isPending || isPending || title.trim().length === 0}>
            {createProjectMutation.isPending || isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
