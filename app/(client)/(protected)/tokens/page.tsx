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
import { Slider } from '@/components/ui/slider';
import { Coins, Zap, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Tokens() {
  const { toast } = useToast();
  const [selectedTokens, setSelectedTokens] = useState([150]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Pricing tiers with volume discounts
  const calculatePrice = (tokens: number) => {
    if (tokens <= 50) return tokens * 0.15; // $0.15 per token
    if (tokens <= 100) return tokens * 0.12; // $0.12 per token
    if (tokens <= 250) return tokens * 0.1; // $0.10 per token
    if (tokens <= 500) return tokens * 0.08; // $0.08 per token
    if (tokens <= 1000) return tokens * 0.07; // $0.07 per token
    return tokens * 0.06; // $0.06 per token for bulk
  };

  const currentPrice = calculatePrice(selectedTokens[0]);
  const savings = selectedTokens[0] * 0.15 - currentPrice; // Savings compared to base price

  const quickPackages = [
    { tokens: 50, label: 'Quick Start', popular: false },
    { tokens: 150, label: 'Most Popular', popular: true },
    { tokens: 300, label: 'Professional', popular: false },
    { tokens: 500, label: 'Power User', popular: false },
  ];

  const handleQuickSelect = (tokens: number) => {
    setSelectedTokens([tokens]);
  };

  const handlePurchase = async () => {
    setIsPurchasing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsPurchasing(false);
      toast({
        title: 'Purchase successful!',
        description: `You've successfully purchased ${selectedTokens[0]} tokens for $${currentPrice.toFixed(2)}.`,
      });
    }, 2000);
  };

  const getTokenTier = (tokens: number) => {
    if (tokens <= 50) return { color: 'text-gray-600', label: 'Starter' };
    if (tokens <= 100) return { color: 'text-blue-600', label: 'Basic' };
    if (tokens <= 250)
      return { color: 'text-purple-600', label: 'Professional' };
    if (tokens <= 500) return { color: 'text-orange-600', label: 'Advanced' };
    return { color: 'text-green-600', label: 'Enterprise' };
  };

  const tier = getTokenTier(selectedTokens[0]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold text-foreground">
          Get More Tokens
        </h1>
        <p className="text-xl text-muted-foreground">
          Choose the perfect amount for your needs
        </p>
      </div>

      {/* Current Balance */}
      <Card className="mx-auto max-w-md border bg-gradient-to-br from-amber-50 to-orange-50 shadow-card dark:from-amber-950/20 dark:to-orange-950/20">
        <CardContent className="pt-6 text-center">
          <Coins className="mx-auto mb-4 h-16 w-16 text-warning" />
          <p className="mb-2 text-sm text-muted-foreground">Current Balance</p>
          <p className="text-5xl font-bold text-foreground">150</p>
          <p className="mt-1 text-muted-foreground">tokens</p>
        </CardContent>
      </Card>

      {/* Interactive Token Selector */}
      <Card className="mx-auto max-w-4xl border shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Zap className="h-6 w-6 text-primary" />
            Custom Token Amount
          </CardTitle>
          <CardDescription>
            Slide to select your desired token amount and see instant pricing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Token Display */}
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-6xl font-bold text-foreground">
                {selectedTokens[0]}
              </span>
              <span className="text-2xl text-muted-foreground">tokens</span>
            </div>
            <div className={`text-lg font-semibold ${tier.color}`}>
              {tier.label} Tier
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-4">
            <div className="px-2">
              <Slider
                value={selectedTokens}
                onValueChange={setSelectedTokens}
                max={1000}
                min={10}
                step={10}
                className="w-full"
              />
            </div>
            <div className="flex justify-between px-2 text-sm text-muted-foreground">
              <span>10</span>
              <span>250</span>
              <span>500</span>
              <span>750</span>
              <span>1000</span>
            </div>
          </div>

          {/* Pricing Display */}
          <div className="grid gap-6 text-center md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Price per token</p>
              <p className="text-2xl font-bold text-foreground">
                ${(currentPrice / selectedTokens[0]).toFixed(3)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total price</p>
              <p className="text-3xl font-bold text-primary">
                ${currentPrice.toFixed(2)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">You save</p>
              <p className="text-2xl font-bold text-success">
                ${savings.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              Quick select packages:
            </p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {quickPackages.map((pkg) => (
                <Button
                  key={pkg.tokens}
                  variant={
                    selectedTokens[0] === pkg.tokens ? 'default' : 'outline'
                  }
                  onClick={() => handleQuickSelect(pkg.tokens)}
                  className="relative"
                >
                  {pkg.popular && (
                    <span className="absolute -right-2 -top-2 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                      Popular
                    </span>
                  )}
                  {pkg.tokens}
                </Button>
              ))}
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handlePurchase}
            disabled={isPurchasing}
          >
            {isPurchasing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <Coins className="mr-2 h-5 w-5" />
                Purchase {selectedTokens[0]} Tokens for $
                {currentPrice.toFixed(2)}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Token Usage Info */}
      <Card className="mx-auto max-w-4xl border shadow-card">
        <CardHeader>
          <CardTitle>How Tokens Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Resume Analysis</h3>
              <p className="text-sm text-muted-foreground">
                10 tokens per scan
              </p>
              <p className="text-xs text-muted-foreground">
                Get detailed ATS scoring and keyword analysis
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                Auto-Optimization
              </h3>
              <p className="text-sm text-muted-foreground">
                15 tokens per optimization
              </p>
              <p className="text-xs text-muted-foreground">
                AI-powered resume enhancement
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Interview Prep</h3>
              <p className="text-sm text-muted-foreground">
                20 tokens to generate + 5 per feedback
              </p>
              <p className="text-xs text-muted-foreground">
                Personalized interview questions and coaching
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volume Discount Info */}
      <Card className="mx-auto max-w-4xl border bg-gradient-to-r from-primary/5 to-accent/5 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Volume Discounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm md:grid-cols-3">
            <div className="flex justify-between rounded-lg bg-background p-3">
              <span>1-50 tokens</span>
              <span className="font-semibold">$0.15/token</span>
            </div>
            <div className="flex justify-between rounded-lg bg-background p-3">
              <span>51-250 tokens</span>
              <span className="font-semibold text-success">$0.10/token</span>
            </div>
            <div className="flex justify-between rounded-lg bg-background p-3">
              <span>251-500 tokens</span>
              <span className="font-semibold text-success">$0.08/token</span>
            </div>
            <div className="flex justify-between rounded-lg bg-background p-3">
              <span>501-1000 tokens</span>
              <span className="font-semibold text-success">$0.07/token</span>
            </div>
            <div className="flex justify-between rounded-lg bg-background p-3">
              <span>1000+ tokens</span>
              <span className="font-semibold text-success">$0.06/token</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
