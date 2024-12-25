'use client'

import { Button } from "@/components/ui/button"
import { Link } from "lucide-react"
import { useState } from "react"

interface CopyLinkProps {
  projectId: string
}

export default function CopyLink({ projectId }: CopyLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (copied) {
      return
    }
    try {
      await navigator.clipboard.writeText(window.location.origin + `/${projectId}`)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Button className={`flex gap-2 ${copied ? "cursor-default" : ""}`} variant={"link"} onClick={handleCopy}>
      <Link />
      {copied ? "Copied!" : "Copy Link"}
    </Button>
  )
}
