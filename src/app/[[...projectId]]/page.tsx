import { auth } from "@/auth"
import Canvas from "@/components/canvas/canvas";
import Sidebar from "@/components/sidebar/sidebar";
import { getProjectById, setProjectActive } from "@/data-access/projects";

export default async function Home({
  params,
}: {
  params: Promise<{ projectId?: string[] }>
}) {
  const session = await auth()
  let projectId = (await params).projectId?.[0]
  let userIsTheOwner = !projectId
  let isLoggedIn = false

  if (session?.user?.id) {
    isLoggedIn = true

    const project = projectId ? await getProjectById(projectId) : null

    projectId = project?.id
    userIsTheOwner = !projectId || project?.userId === session.user.id

    if (project && userIsTheOwner && !project.isActive) {
      await setProjectActive(project.id)
    }
  }

  return (
    <main>
      <div className="fixed inset-0 end-10">
        <Canvas projectId={projectId} isLoggedIn={isLoggedIn} readOnly={!userIsTheOwner} />
      </div>
      <div className="fixed right-0 h-screen flex justify-center">
        <Sidebar isLoggedIn={isLoggedIn} />
      </div>
    </main>
  );
}