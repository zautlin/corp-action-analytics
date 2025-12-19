"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Crosshair,
  TrendingUp,
  Minus,
  PenTool,
  Type,
  ZoomIn,
  Home,
  Ruler,
  Lock,
  Eye,
  Trash2,
  Magnet,
  ChevronUp,
  GitBranch,
  Shapes,
} from "lucide-react"

const tools = [
  { icon: Crosshair, label: "Crosshair", shortcut: "+" },
  { icon: TrendingUp, label: "Trend Line", shortcut: "Alt+T" },
  { icon: Minus, label: "Horizontal Line", shortcut: "Alt+H" },
  { icon: GitBranch, label: "Pitchfork", shortcut: "Alt+P" },
  { icon: PenTool, label: "Freehand Draw" },
  { icon: Type, label: "Text", shortcut: "Alt+X" },
  { icon: Shapes, label: "Shapes" },
  { icon: Ruler, label: "Measure", shortcut: "Shift+Click" },
]

const actions = [
  { icon: ZoomIn, label: "Zoom In" },
  { icon: Home, label: "Reset Chart" },
  { icon: Magnet, label: "Magnet Mode" },
  { icon: Lock, label: "Lock All Drawings" },
  { icon: Eye, label: "Hide All Drawings" },
  { icon: Trash2, label: "Remove All Drawings" },
]

export function ToolsSidebar() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex w-12 flex-col items-center border-r border-border bg-card py-2">
        <div className="flex flex-col gap-1">
          {tools.map((tool, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                  <tool.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{tool.label}</p>
                {tool.shortcut && <p className="text-xs text-muted-foreground">{tool.shortcut}</p>}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator className="my-2 w-8" />

        <div className="flex flex-col gap-1">
          {actions.map((action, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                  <action.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{action.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="mt-auto">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}
