'use client'

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { Editor, exportToBlob } from "tldraw"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"
import { describeImageWithAI } from "@/lib/ai/actions"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Loading from "@/components/ui/loading"

interface AiDescribeProps {
  editor: Editor | null
  isLoggedIn: boolean
  isShapeSelected: boolean
}

export default function AiDescribe({ editor, isLoggedIn, isShapeSelected }: AiDescribeProps) {
  const [openDialog, setOpenDialog] = useState(false)
  const [status, setStatus] = useState<"loading" | "idle" | "error">("idle")
  const [description, setDescription] = useState<string | null>(null)

  const handleClick = async () => {
    if (!editor) return
    setStatus("loading")
    setOpenDialog(true)
    try {
      const shapeIds = editor.getSelectedShapeIds()
      const blob = await exportToBlob({ editor, ids: shapeIds, format: "png" })
      const description = await describeImageWithAI(blob)
      setDescription(description)
      setStatus("idle")
    } catch (error) {
      console.error(error)
      setStatus("error")
    }
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip open={isLoggedIn || !isShapeSelected ? false : undefined}>
          <TooltipTrigger asChild>
            <Button
              onClick={handleClick}
              disabled={!isLoggedIn || !isShapeSelected || !editor}
            ><Sparkles />Describe with AI</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Please <Link href="/api/auth/signin" className="underline">login</Link> to use AI features</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Draw description</DialogTitle>
          </DialogHeader>

          {status === "loading" && (
            <Loading text="Generating description..." />
          )}

          {status === "error" && (
            <div>There was an error generating the description</div>
          )}

          {status === "idle" && (
            <div>{description}</div>
          )}

        </DialogContent>
      </Dialog>
    </>
  );
}
