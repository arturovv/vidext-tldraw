'use client'
import { Tldraw } from "tldraw"
import "tldraw/tldraw.css"

export default function Home() {
  return (
    <div className="fixed inset-0">
      <Tldraw persistenceKey="tldraw" />
    </div>
  );
}
