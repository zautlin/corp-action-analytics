import { DatasetCard } from "@/components/dataset-card"

const datasets = [
  {
    id: "1",
    name: "Clean Energy Revolution Index",
    provider: "Index Analytics Inc.",
    assetClass: "Thematic Index",
    geography: "Global",
    qualityScore: 9.4,
    description:
      "Comprehensive thematic index tracking companies at the forefront of renewable energy, electric vehicles, and sustainable infrastructure. Real-time rebalancing with daily constituents updates.",
    licensingType: "Enterprise License",
    tags: ["ESG", "Renewable Energy", "Real-Time"],
    updateFrequency: "Daily",
    hasAccess: true,
  },
  {
    id: "2",
    name: "AI & Machine Learning Index",
    provider: "Tech Indices Ltd.",
    assetClass: "Thematic Index",
    geography: "Global",
    qualityScore: 9.3,
    description:
      "Tracks companies developing and deploying artificial intelligence and machine learning technologies across software, semiconductors, and cloud infrastructure sectors.",
    licensingType: "Enterprise License",
    tags: ["AI/ML", "Technology", "Innovation"],
    updateFrequency: "Daily",
    hasAccess: true,
  },
  {
    id: "3",
    name: "Cybersecurity Leaders Index",
    provider: "Security Markets Inc.",
    assetClass: "Thematic Index",
    geography: "North America",
    qualityScore: 8.9,
    description:
      "Focuses on cybersecurity software providers, managed security service providers, and security infrastructure companies protecting digital assets globally.",
    licensingType: "Per-User License",
    tags: ["Cybersecurity", "Enterprise", "Defense"],
    updateFrequency: "Daily",
    hasAccess: true,
  },
  {
    id: "4",
    name: "Genomics & Biotech Index",
    provider: "Healthcare Indices",
    assetClass: "Thematic Index",
    geography: "Global",
    qualityScore: 8.7,
    description:
      "Tracks companies engaged in genomic sequencing, gene therapy, personalized medicine, and biotech innovation with strong R&D pipelines.",
    licensingType: "Enterprise License",
    tags: ["Biotech", "Healthcare", "Innovation"],
    updateFrequency: "Weekly",
    hasAccess: false,
  },
  {
    id: "5",
    name: "Digital Payments Index",
    provider: "Fintech Indices",
    assetClass: "Thematic Index",
    geography: "Global",
    qualityScore: 9.1,
    description:
      "Comprehensive coverage of digital payment processors, digital wallets, cryptocurrency platforms, and financial technology innovators transforming payments.",
    licensingType: "Per-User License",
    tags: ["Fintech", "Payments", "Digital Currency"],
    updateFrequency: "Daily",
    hasAccess: true,
  },
  {
    id: "6",
    name: "Cloud Infrastructure Index",
    provider: "Tech Indices Ltd.",
    assetClass: "Thematic Index",
    geography: "Global",
    qualityScore: 9.5,
    description:
      "Tracks leading cloud computing providers, edge computing companies, and infrastructure software enabling the shift to cloud-native architectures.",
    licensingType: "Enterprise License",
    tags: ["Cloud", "Infrastructure", "SaaS"],
    updateFrequency: "Daily",
    hasAccess: true,
  },
  {
    id: "7",
    name: "Space Economy Index",
    provider: "Future Tech Indices",
    assetClass: "Thematic Index",
    geography: "Global",
    qualityScore: 8.2,
    description:
      "Emerging thematic index covering satellite operators, launch providers, space exploration, and space-based services across multiple sectors.",
    licensingType: "Enterprise License",
    tags: ["Space", "Emerging", "Innovation"],
    updateFrequency: "Weekly",
    hasAccess: false,
  },
  {
    id: "8",
    name: "Autonomous Vehicles Index",
    provider: "Mobility Indices",
    assetClass: "Thematic Index",
    geography: "Global",
    qualityScore: 8.6,
    description:
      "Comprehensive index of autonomous vehicle manufacturers, self-driving technology providers, and supporting ecosystem companies in transportation.",
    licensingType: "Per-User License",
    tags: ["Autonomous", "Transportation", "Mobility"],
    updateFrequency: "Daily",
    hasAccess: true,
  },
  {
    id: "9",
    name: "Metaverse & Web3 Index",
    provider: "Digital Innovation Ltd.",
    assetClass: "Thematic Index",
    geography: "Global",
    qualityScore: 7.8,
    description:
      "Tracks companies building metaverse platforms, virtual worlds, blockchain infrastructure, and Web3 technologies shaping the decentralized internet.",
    licensingType: "Enterprise License",
    tags: ["Web3", "Metaverse", "Blockchain"],
    updateFrequency: "Daily",
    hasAccess: true,
  },
]

export function CatalogGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {datasets.map((dataset) => (
        <DatasetCard key={dataset.id} dataset={dataset} />
      ))}
    </div>
  )
}
