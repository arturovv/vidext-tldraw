import { auth } from "@/auth"
import { redirect } from "next/navigation";


export default async function Home() {
  const session = await auth()

  if (session) {
    redirect("/canvas")
  }

  return (
    <div className="">
      <h1 className="text-3xl font-bold underline">
        Bienvenido a Vidext - tldraw
      </h1>
      Iniciar sesión o crear cuenta
      Continuar como invitado
    </div>
  );
}
