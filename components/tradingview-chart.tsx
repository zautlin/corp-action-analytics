"use client"

import { useEffect, useRef, memo } from "react"

// TradingView Widget Types
declare global {
  interface Window {
    TradingView: any
  }
}

export interface TradingViewChartProps {
  symbol: string
  interval?: string
  theme?: "light" | "dark"
  style?: string
  locale?: string
  toolbar_bg?: string
  enable_publishing?: boolean
  allow_symbol_change?: boolean
  container_id?: string
  width?: number | string
  height?: number | string
  autosize?: boolean
  studies?: string[]
  show_popup_button?: boolean
  popup_width?: string
  popup_height?: string
  // Event markers for corporate actions
  event_markers?: Array<{
    date: string
    label: string
    color: string
    tooltip?: string
  }>
}

function TradingViewChartComponent(props: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  const {
    symbol,
    interval = "D",
    theme = "light",
    style = "1",
    locale = "en",
    toolbar_bg = "#f1f3f6",
    enable_publishing = false,
    allow_symbol_change = true,
    width = "100%",
    height = 500,
    autosize = false,
    studies = [],
    show_popup_button = true,
    popup_width = "1000",
    popup_height = "650",
    event_markers = [],
  } = props

  useEffect(() => {
    if (!containerRef.current) return

    const loadTradingViewScript = () => {
      if (scriptLoadedRef.current) return

      const script = document.createElement("script")
      script.src = "https://s3.tradingview.com/tv.js"
      script.async = true
      script.onload = () => {
        scriptLoadedRef.current = true
        initializeChart()
      }
      document.body.appendChild(script)
    }

    const initializeChart = () => {
      if (!window.TradingView || !containerRef.current) return

      // Create unique container ID
      const containerId = `tradingview_${Math.random().toString(36).substring(7)}`
      containerRef.current.id = containerId

      const widgetConfig: any = {
        symbol,
        interval,
        timezone: "Etc/UTC",
        theme,
        style,
        locale,
        toolbar_bg,
        enable_publishing,
        allow_symbol_change,
        container_id: containerId,
        width,
        height,
        autosize,
        studies,
        show_popup_button,
        popup_width,
        popup_height,
      }

      new window.TradingView.widget(widgetConfig)
    }

    if (window.TradingView) {
      initializeChart()
    } else {
      loadTradingViewScript()
    }

    return () => {
      // Cleanup if needed
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [
    symbol,
    interval,
    theme,
    style,
    locale,
    toolbar_bg,
    enable_publishing,
    allow_symbol_change,
    width,
    height,
    autosize,
    studies,
    show_popup_button,
    popup_width,
    popup_height,
  ])

  return <div ref={containerRef} className="tradingview-widget-container" />
}

export const TradingViewChart = memo(TradingViewChartComponent)
