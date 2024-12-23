'use client'
import { Tldraw } from "tldraw"
import "tldraw/tldraw.css"

export default function CanvasComponent() {
  return (
    <Tldraw persistenceKey="tldraw" />
  );
}
