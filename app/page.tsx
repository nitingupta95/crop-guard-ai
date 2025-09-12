// 1st commit
//2nd commit 
// 3rd commit 
//4th commit 


import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, BarChart3, AlertTriangle, MapPin } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">AgriMonitor</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </a>
              <a href="/fields" className="text-muted-foreground hover:text-foreground transition-colors">
                Fields
              </a>
              <a href="/reports" className="text-muted-foreground hover:text-foreground transition-colors">
                Reports
              </a>
              <a href="/alerts" className="text-muted-foreground hover:text-foreground transition-colors">
                Alerts
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            AI-Powered Agriculture Monitoring
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Real-time insights on crop health, soil conditions, and pest risks to optimize your agricultural operations
          </p>
          <Button size="lg" className="mr-4">
            <a href="/dashboard">Get Started</a>
          </Button>
          <Button variant="outline" size="lg">
            View Demo
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
            Comprehensive Agricultural Intelligence
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Field Mapping</CardTitle>
                <CardDescription>Interactive crop health maps with real-time monitoring</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Leaf className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Crop Health</CardTitle>
                <CardDescription>AI-powered analysis of vegetation stress and growth patterns</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Soil Analytics</CardTitle>
                <CardDescription>Monitor moisture, pH, nutrients, and soil composition</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <AlertTriangle className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Risk Alerts</CardTitle>
                <CardDescription>Early detection of pests, diseases, and environmental threats</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
