import { auth } from "@/auth"
import Canvas from "@/components/canvas/canvas";
import Sidebar from "@/components/sidebar/sidebard";
import { TProject } from "@/db/schema/project";
import { findUserActiveProject, getProjectById } from "@/data-access/project";

export default async function Home({
  params,
}: {
  params: Promise<{ projectId?: string }>
}) {
  const session = await auth()
  let projectId = (await params).projectId
  let userIsTheOwner = false
  let project: TProject | null = null
  let isLoggedIn = false

  if (session?.user?.id) {
    isLoggedIn = true

    project = projectId ? await getProjectById(projectId)
      : await findUserActiveProject(session.user.id)

    projectId = project?.id
    userIsTheOwner = !projectId || project?.userId === session.user.id
  }


  return (
    <main>
      <div className="fixed inset-0 end-10">
        <Canvas initialProjectId={projectId} isLoggedIn={isLoggedIn} readOnly={!userIsTheOwner} />
      </div>
      <div className="fixed right-0 h-screen flex justify-center">
        <Sidebar isLoggedIn={isLoggedIn} />
      </div>
    </main>
  );
}