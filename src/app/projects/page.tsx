import { auth } from "@/auth"
import { getUserProjects } from "@/data-access/projects";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectPublicSwitch from "./_components/project-public-switch";
import EditProjectDialog from "./_components/edit-project";
import NewProjectDialog from "./_components/new-project";
import CopyLink from "./_components/copy-link";

export default async function Projects() {
  const session = await auth()

  if (!session?.user?.id) {
    return (
      <main className="flex flex-col h-screen px-[50px] pt-5 gap-[300px]">
        Unauthorized
        <Link href="/api/auth/signin">Login</Link>
      </main>
    );
  }

  const projects = await getUserProjects()

  return (
    <main>
      <div className="flex justify-between p-5">
        <Button variant="link" asChild>
          <Link href="/"><ArrowLeft /> Go back</Link>
        </Button>
        <NewProjectDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Public</TableHead>
            <TableHead>Updated at</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="min-w-[300px]">
                <Button variant="link" asChild>
                  <Link href={`/${project.id}`}>{project.title}</Link>
                </Button>
              </TableCell>
              <TableCell><ProjectPublicSwitch initialValue={project.isPublic} projectId={project.id} /></TableCell>
              <TableCell>{project.updatedAt.toLocaleDateString() + " " + project.updatedAt.toLocaleTimeString()}</TableCell>
              <TableCell>{project.createdAt.toLocaleDateString() + " " + project.createdAt.toLocaleTimeString()}</TableCell>
              <TableCell className="flex gap-2">
                <EditProjectDialog initialTitle={project.title} projectId={project.id} />
                <CopyLink projectId={project.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}