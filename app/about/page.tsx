import { Brain, Dumbbell, Utensils, Mic, Image, Target, Zap, RefreshCw, Smartphone } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            About AI Fitness Coach
          </h1>
          <p className="text-xl text-muted-foreground">
            Your Personal AI-Powered Fitness & Nutrition Companion
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-card border rounded-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Our Mission</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            To democratize access to personalized fitness and nutrition planning through the power of AI. 
            We believe everyone deserves a customized fitness journey tailored to their unique goals, 
            preferences, and lifestyle.
          </p>
        </div>

        {/* What We Offer Section */}
        <div className="bg-card border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Personalized Workouts</h3>
                <p className="text-muted-foreground">
                  AI-generated 7-day workout plans tailored to your fitness level, goals, and available equipment.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                <Utensils className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Custom Nutrition</h3>
                <p className="text-muted-foreground">
                  Complete meal plans designed around your dietary preferences and caloric needs.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Voice Guidance</h3>
                <p className="text-muted-foreground">
                  Listen to your daily workout and diet plans with professional AI voice narration.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                <Image className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Visual Demonstrations</h3>
                <p className="text-muted-foreground">
                  AI-generated images to help you visualize proper exercise form and meal presentations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-card border rounded-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Technology Stack</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Frontend</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Next.js 14</li>
                <li>• React 19</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• shadcn/ui</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">AI Services</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Google Gemini AI</li>
                <li>• ElevenLabs TTS</li>
                <li>• Stable Diffusion XL</li>
                <li>• Replicate API</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Backend</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Next.js API Routes</li>
                <li>• MongoDB</li>
                <li>• Server Components</li>
                <li>• Edge Functions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-card border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Share Your Details</h3>
                <p className="text-muted-foreground">
                  Tell us about your age, fitness goals, experience level, and dietary preferences.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI Generates Your Plan</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your profile and creates a personalized 7-day workout and nutrition plan.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Follow & Track</h3>
                <p className="text-muted-foreground">
                  Access your plan anytime, listen to daily guidance, and regenerate new plans as you progress.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="bg-card border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Choose AI Fitness Coach?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-6 flex flex-col items-center text-center h-full">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-muted-foreground">Get your personalized plan in seconds</p>
            </div>
            <div className="border rounded-lg p-6 flex flex-col items-center text-center h-full">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">100% Personalized</h3>
              <p className="text-sm text-muted-foreground">Every plan is unique to you</p>
            </div>
            <div className="border rounded-lg p-6 flex flex-col items-center text-center h-full">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <RefreshCw className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Unlimited Regeneration</h3>
              <p className="text-sm text-muted-foreground">Create as many plans as you need</p>
            </div>
            <div className="border rounded-lg p-6 flex flex-col items-center text-center h-full">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Accessible Anywhere</h3>
              <p className="text-sm text-muted-foreground">Works on all your devices</p>
            </div>
          </div>
        </div>

        {/* CTA Section - Full Width Centered */}
        <div className="text-center bg-card border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Fitness Journey?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start your personalized fitness plan today and achieve your goals with AI-powered guidance.
          </p>
          <a
            href="/fitness-input"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </div>
  );
}
