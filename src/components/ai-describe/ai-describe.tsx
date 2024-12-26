'use client'

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { Editor } from "tldraw"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AiDescribeProps {
  editor: Editor | null
  isLoggedIn: boolean
  isShapeSelected: boolean
}

export default function AiDescribe({ editor, isLoggedIn, isShapeSelected }: AiDescribeProps) {

  const handleClick = () => {
    if (!editor) return
    console.log(editor.getSelectedShapeIds())
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip open={isLoggedIn || !isShapeSelected ? false : undefined}>
          <TooltipTrigger asChild>
            <Button
              onClick={handleClick}
              disabled={!isLoggedIn || !isShapeSelected}
            ><Sparkles />Describe with AI</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Please access to use AI features</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
