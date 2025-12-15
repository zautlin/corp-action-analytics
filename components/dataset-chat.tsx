"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function DatasetChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I can help you understand this dataset's structure, quality metrics, and use cases. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("latency") || lowerQuery.includes("speed") || lowerQuery.includes("real-time")) {
      return "This dataset provides sub-millisecond latency for real-time equity prices. The data is streamed directly from exchange feeds with typical latency of 0.5-2ms from the exchange timestamp to delivery. This makes it ideal for high-frequency trading and algorithmic execution strategies."
    }

    if (lowerQuery.includes("coverage") || lowerQuery.includes("exchanges") || lowerQuery.includes("markets")) {
      return "The dataset covers 50M+ equity instruments across 150+ exchanges globally, including all major markets (NYSE, NASDAQ, LSE, TSE, HKEX) and emerging markets. Coverage includes both liquid large-cap stocks and less liquid small-cap securities."
    }

    if (lowerQuery.includes("cost") || lowerQuery.includes("price") || lowerQuery.includes("licensing")) {
      return "This is a commercial dataset requiring a Bloomberg license. Pricing is typically based on user count and data usage volume. The licensing model includes redistribution rights for internal use. Contact the data steward for specific pricing details based on your use case."
    }

    if (lowerQuery.includes("quality") || lowerQuery.includes("accuracy") || lowerQuery.includes("reliable")) {
      return "The dataset has a quality score of 9.2/10, reflecting Bloomberg's direct exchange connectivity, rigorous validation processes, and 99.99% uptime SLA. Data accuracy is maintained through automated reconciliation with multiple sources and manual oversight by Bloomberg's market data team."
    }

    if (lowerQuery.includes("schema") || lowerQuery.includes("fields") || lowerQuery.includes("columns")) {
      return "The schema includes key fields such as ticker symbol, ISIN, CUSIP, bid/ask prices, last trade price, volume, market depth (Level 2), timestamps, exchange codes, and corporate action flags. All prices include currency denomination and are adjusted for splits and dividends in real-time."
    }

    if (lowerQuery.includes("access") || lowerQuery.includes("request") || lowerQuery.includes("approval")) {
      return "To access this dataset, click the 'Request Access' button and provide your use case and business justification. Requests are typically reviewed within 24 hours by the data governance team. Once approved, you'll receive connection credentials and documentation."
    }

    return "That's a great question! This dataset provides institutional-grade real-time equity pricing with exceptional coverage and reliability. It's best suited for algorithmic trading, portfolio valuation, and execution analytics. Is there a specific aspect of the dataset you'd like to explore further?"
  }

  return (
    <div className="p-6 space-y-4">
      <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2.5 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="mt-1.5 text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {message.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          placeholder="Ask a question about this dataset..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend()
            }
          }}
          className="flex-1"
        />
        <Button onClick={handleSend} size="icon" disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
