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

interface AiDescribeProps {
  editor: Editor | null
  isLoggedIn: boolean
  isShapeSelected: boolean
}

export default function AiDescribe({ editor, isLoggedIn, isShapeSelected }: AiDescribeProps) {

  const handleClick = async () => {
    if (!editor) return

    const shapeIds = editor.getSelectedShapeIds()
    const blob = await exportToBlob({ editor, ids: shapeIds, format: "png" })
    const description = await describeImageWithAI(blob)
    alert(description)
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
    </>
  );
}
