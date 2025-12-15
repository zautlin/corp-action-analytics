import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function DatasetSchema() {
  const schemaFields = [
    { name: "ticker", type: "STRING", description: "Stock ticker symbol", nullable: false, indexed: true },
    {
      name: "isin",
      type: "STRING",
      description: "International Securities Identification Number",
      nullable: false,
      indexed: true,
    },
    { name: "cusip", type: "STRING", description: "CUSIP identifier", nullable: true, indexed: true },
    { name: "timestamp", type: "TIMESTAMP", description: "Quote timestamp in UTC", nullable: false, indexed: true },
    { name: "bid_price", type: "DECIMAL(18,6)", description: "Best bid price", nullable: true, indexed: false },
    { name: "ask_price", type: "DECIMAL(18,6)", description: "Best ask price", nullable: true, indexed: false },
    { name: "last_price", type: "DECIMAL(18,6)", description: "Last trade price", nullable: false, indexed: false },
    { name: "volume", type: "BIGINT", description: "Cumulative volume", nullable: false, indexed: false },
    { name: "bid_size", type: "INTEGER", description: "Size at best bid", nullable: true, indexed: false },
    { name: "ask_size", type: "INTEGER", description: "Size at best ask", nullable: true, indexed: false },
    { name: "exchange", type: "STRING", description: "Exchange code", nullable: false, indexed: true },
    { name: "currency", type: "STRING", description: "Currency code (ISO 4217)", nullable: false, indexed: false },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dataset Schema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field Name</TableHead>
                <TableHead>Data Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Properties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schemaFields.map((field) => (
                <TableRow key={field.name}>
                  <TableCell className="font-mono text-sm">{field.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {field.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{field.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {!field.nullable && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                      {field.indexed && (
                        <Badge variant="secondary" className="text-xs">
                          Indexed
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
