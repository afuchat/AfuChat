import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { MobileNavigation, TopBar } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star, MessageSquare, Bot, Sparkles } from "lucide-react";

const premiumFeatures = [
  {
    icon: Bot,
    title: "Unlimited AI Conversations",
    description: "Chat with AfuAI without limits - get help, ideas, and assistance anytime"
  },
  {
    icon: Sparkles,
    title: "Advanced AI Content Enhancement",
    description: "Transform your posts with AI-powered writing improvements and suggestions"
  },
  {
    icon: Crown,
    title: "Premium Badge",
    description: "Stand out with a golden premium badge on your profile and posts"
  },
  {
    icon: Zap,
    title: "Priority Support",
    description: "Get faster response times and dedicated customer support"
  },
  {
    icon: MessageSquare,
    title: "Extended Message History",
    description: "Access unlimited message history and advanced conversation features"
  },
  {
    icon: Star,
    title: "Exclusive Features",
    description: "Early access to new features and premium-only tools"
  }
];

const pricingPlans = [
  {
    name: "Monthly",
    price: "$9.99",
    period: "/month",
    description: "Perfect for trying out premium features",
    popular: false
  },
  {
    name: "Annual",
    price: "$99.99",
    period: "/year",
    description: "Save 17% with annual billing",
    popular: true,
    savings: "Save $20"
  }
];

export default function Premium() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("Annual");

  const handleSubscribe = (planName: string) => {
    console.log(`Subscribing to ${planName} plan`);
    // Here you would integrate with a payment processor like Stripe
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <TopBar title="AfuChat Premium" />
        
        <main className="flex-1 overflow-y-auto mobile-content pb-20">
          <div className="max-w-4xl mx-auto p-4 space-y-8">
            
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Crown className="w-8 h-8 text-yellow-500" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  AfuChat Premium
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Unlock the full potential of AfuChat with unlimited AI features, premium tools, and exclusive benefits
              </p>
            </div>

            {/* Pricing Plans */}
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {pricingPlans.map((plan) => (
                <Card 
                  key={plan.name}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    selectedPlan === plan.name 
                      ? "ring-2 ring-primary shadow-lg" 
                      : "hover:shadow-md"
                  } ${plan.popular ? "border-yellow-500" : ""}`}
                  onClick={() => setSelectedPlan(plan.name)}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-center space-x-1">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                      {plan.savings && (
                        <Badge variant="secondary" className="text-green-600">
                          {plan.savings}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleSubscribe(plan.name)}
                      className={`w-full ${
                        plan.popular 
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600" 
                          : ""
                      }`}
                    >
                      Choose {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Features Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">Premium Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {premiumFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-6 h-6 text-yellow-600" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Benefits Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Free vs Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center font-semibold border-b pb-2">
                    <div>Feature</div>
                    <div>Free</div>
                    <div className="text-yellow-600">Premium</div>
                  </div>
                  
                  {[
                    ["AI Chat Messages", "10/day", "Unlimited"],
                    ["Content Enhancement", "3/day", "Unlimited"],
                    ["Message History", "7 days", "Forever"],
                    ["Premium Badge", "❌", "✅"],
                    ["Priority Support", "❌", "✅"],
                    ["Early Access", "❌", "✅"]
                  ].map(([feature, free, premium], index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 text-center py-2 border-b last:border-b-0">
                      <div className="font-medium">{feature}</div>
                      <div className="text-muted-foreground">{free}</div>
                      <div className="text-yellow-600 font-semibold">{premium}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  {
                    question: "Can I cancel my subscription anytime?",
                    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period."
                  },
                  {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards, PayPal, and other secure payment methods through our payment processor."
                  },
                  {
                    question: "Is there a free trial?",
                    answer: "Yes! All new users get a 7-day free trial of premium features when they sign up."
                  }
                ].map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        </main>
        
        <MobileNavigation />
      </div>
    </div>
  );
}