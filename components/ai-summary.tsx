"use client"

import { useState } from "react"
import { Sparkles, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  role: "assistant" | "user"
  content: string
}

export function AISummary() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "This dataset provides institutional-grade real-time equity pricing across global markets with exceptional coverage and reliability. Best suited for high-frequency trading, real-time portfolio valuation, and execution analytics. The data quality score of 9.2/10 reflects Bloomberg's direct exchange connectivity and rigorous validation processes. Commercial licensing required with typical approval within 24 hours.",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])

    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: `Based on your question about "${input}", this dataset offers comprehensive coverage with real-time updates. The data includes bid/ask spreads, last trade prices, and volume across 50M+ instruments. Would you like more specific information about any particular aspect?`,
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)

    setInput("")
  }

  return (
    <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-purple-600" />
        <span className="text-sm font-medium text-purple-900">AI Assistant</span>
      </div>

      <ScrollArea className="h-[120px] mb-2">
        <div className="space-y-2 pr-2">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-sm leading-relaxed ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-white text-foreground shadow-sm"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          placeholder="Ask about this dataset..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="bg-white text-sm h-8 flex-1"
        />
        <Button onClick={handleSend} size="icon" className="shrink-0 h-8 w-8">
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
