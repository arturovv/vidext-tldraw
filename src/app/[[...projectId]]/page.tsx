import { auth } from "@/auth"
import Canvas from "@/components/canvas/canvas";
import Sidebar from "@/components/sidebar/sidebard";
import { findUserActiveProject, getProjectById } from "@/data-access/project";

export default async function Home({
  params,
}: {
  params: Promise<{ projectId?: string[] }>
}) {
  const session = await auth()
  let projectId = (await params).projectId?.[0]
  let userIsTheOwner = false
  let isLoggedIn = false

  if (session?.user?.id) {
    isLoggedIn = true

    const project = projectId ? await getProjectById(projectId)
      : await findUserActiveProject(session.user.id)

    projectId = project?.id
    userIsTheOwner = !projectId || project?.userId === session.user.id
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