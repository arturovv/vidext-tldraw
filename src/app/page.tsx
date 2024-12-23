import { auth } from "@/auth"
import Canvas from "@/components/canvas/canvas";
import Sidebar from "@/components/sidebar/sidebard";

export default async function Home() {
  const session = await auth()
  return (
    <>
      <div className="fixed inset-0 end-10">
        <Canvas />
      </div>
      <div className="fixed right-0 h-screen flex justify-center">
        <Sidebar isLoggedIn={!!session} />
      </div>
    </>
  );
}
