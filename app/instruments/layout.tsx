import { InstrumentBreadcrumb } from "@/components/instruments/instrument-breadcrumb"

export default function InstrumentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <InstrumentBreadcrumb />
      {children}
    </div>
  )
}
