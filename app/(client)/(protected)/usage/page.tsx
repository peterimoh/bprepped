'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Coins,
  FileText,
  Scan,
  MessageSquare,
  Zap,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Usage() {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock usage data
  const currentBalance = 150;
  const totalTokens = 200;
  const usagePercentage = (currentBalance / totalTokens) * 100;

  const usageByFeature = [
    {
      feature: 'Resume Analysis',
      icon: Scan,
      tokens: 45,
      percentage: 30,
      color: 'from-blue-500 to-cyan-500',
      count: 5,
      avgTokens: 9,
    },
    {
      feature: 'Auto-Optimization',
      icon: Zap,
      tokens: 30,
      percentage: 20,
      color: 'from-purple-500 to-pink-500',
      count: 2,
      avgTokens: 15,
    },
    {
      feature: 'Interview Prep',
      icon: MessageSquare,
      tokens: 50,
      percentage: 33.3,
      color: 'from-green-500 to-teal-500',
      count: 2,
      avgTokens: 25,
    },
    {
      feature: 'Resume Downloads',
      icon: Download,
      tokens: 25,
      percentage: 16.7,
      color: 'from-amber-500 to-orange-500',
      count: 5,
      avgTokens: 5,
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      date: '2024-01-15',
      time: '2:30 PM',
      type: 'usage',
      feature: 'Resume Analysis',
      description: 'Analyzed resume against Senior Frontend Developer position',
      tokens: 10,
      balance: 150,
      status: 'completed',
    },
    {
      id: 2,
      date: '2024-01-14',
      time: '10:15 AM',
      type: 'usage',
      feature: 'Interview Prep',
      description: 'Generated interview questions for Product Manager role',
      tokens: 20,
      balance: 160,
      status: 'completed',
    },
    {
      id: 3,
      date: '2024-01-13',
      time: '4:45 PM',
      type: 'usage',
      feature: 'Auto-Optimization',
      description: 'Optimized resume for Digital Marketing Manager position',
      tokens: 15,
      balance: 180,
      status: 'completed',
    },
    {
      id: 4,
      date: '2024-01-12',
      time: '11:20 AM',
      type: 'purchase',
      feature: 'Token Purchase',
      description: 'Purchased 200 tokens',
      tokens: -200,
      balance: 195,
      status: 'completed',
    },
    {
      id: 5,
      date: '2024-01-11',
      time: '3:30 PM',
      type: 'usage',
      feature: 'Resume Download',
      description: 'Downloaded optimized resume as PDF',
      tokens: 5,
      balance: 5,
      status: 'completed',
    },
  ];

  const monthlyUsage = [
    { month: 'Jan', tokens: 150 },
    { month: 'Feb', tokens: 120 },
    { month: 'Mar', tokens: 180 },
    { month: 'Nov', tokens: 90 },
    { month: 'Dec', tokens: 200 },
  ];

  const handleExportData = () => {
    toast({
      title: 'Export started',
      description: 'Your usage data is being exported to CSV...',
    });
  };

  const handleFilterTransactions = () => {
    toast({
      title: 'Filter options',
      description: 'Advanced filtering options would appear here.',
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Token Usage
          </h1>
          <p className="text-xl text-muted-foreground">
            Track how you're using your tokens
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleFilterTransactions}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Token Balance Overview */}
      <Card className="border bg-gradient-to-br from-primary/5 to-accent/5 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-primary" />
            Current Balance
          </CardTitle>
          <CardDescription>
            Your token balance and usage overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Available Tokens</p>
              <p className="text-4xl font-bold text-primary">
                {currentBalance}
              </p>
              <p className="text-sm text-muted-foreground">
                of {totalTokens} total
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Used This Period</p>
              <p className="text-4xl font-bold text-warning">
                {totalTokens - currentBalance}
              </p>
              <p className="text-sm text-muted-foreground">
                {(((totalTokens - currentBalance) / totalTokens) * 100).toFixed(
                  1
                )}
                % used
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Daily Average</p>
              <p className="text-4xl font-bold text-success">8.5</p>
              <p className="text-sm text-muted-foreground">tokens per day</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Usage Progress</span>
              <span className="text-muted-foreground">
                {usagePercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={usagePercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">By Feature</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {usageByFeature.map((feature, index) => (
              <Card key={index} className="border shadow-card">
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`rounded-lg bg-gradient-to-br p-2 ${feature.color}`}
                    >
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="secondary">{feature.count} uses</Badge>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {feature.tokens}
                    </p>
                    <p className="text-sm text-muted-foreground">tokens used</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {feature.avgTokens} avg per use
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Usage Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageByFeature.map((feature, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`rounded bg-gradient-to-br p-1.5 ${feature.color}`}
                        >
                          <feature.icon className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-medium">
                          {feature.feature}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {feature.tokens} tokens ({feature.percentage.toFixed(1)}
                        %)
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={feature.percentage} className="h-2" />
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-full`}
                        style={{ width: `${feature.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Feature Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {usageByFeature.map((feature, index) => (
              <Card key={index} className="border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div
                      className={`rounded-lg bg-gradient-to-br p-2 ${feature.color}`}
                    >
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    {feature.feature}
                  </CardTitle>
                  <CardDescription>Detailed usage breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted/30 p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {feature.tokens}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total Tokens
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {feature.count}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Times Used
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Average per use
                        </span>
                        <span className="font-medium">
                          {feature.avgTokens} tokens
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Percentage of total
                        </span>
                        <span className="font-medium">
                          {feature.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Progress value={feature.percentage} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card className="border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Your complete token transaction history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-lg p-2 ${
                          transaction.type === 'purchase'
                            ? 'bg-success/10'
                            : 'bg-warning/10'
                        }`}
                      >
                        {transaction.type === 'purchase' ? (
                          <Coins className="h-5 w-5 text-success" />
                        ) : (
                          <FileText className="h-5 w-5 text-warning" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {transaction.feature}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.date} at {transaction.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.tokens < 0
                            ? 'text-success'
                            : 'text-warning'
                        }`}
                      >
                        {transaction.tokens < 0 ? '+' : '-'}
                        {Math.abs(transaction.tokens)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Balance: {transaction.balance}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Usage Trends
              </CardTitle>
              <CardDescription>
                Your token consumption over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4">
                  {monthlyUsage.map((month, index) => (
                    <div key={index} className="text-center">
                      <div className="relative h-32 overflow-hidden rounded-lg bg-muted/20">
                        <div
                          className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/60 transition-all duration-500 hover:from-primary/80 hover:to-primary/40"
                          style={{ height: `${(month.tokens / 200) * 100}%` }}
                        ></div>
                      </div>
                      <p className="mt-2 text-sm font-medium">{month.month}</p>
                      <p className="text-xs text-muted-foreground">
                        {month.tokens} tokens
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Average Monthly Usage
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round(
                        monthlyUsage.reduce((sum, m) => sum + m.tokens, 0) /
                          monthlyUsage.length
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Peak Month</p>
                    <p className="text-2xl font-bold text-primary">Dec</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
