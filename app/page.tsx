import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dumbbell, Target, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            AI Gym Assistant
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            A smart AI-powered fitness and nutrition assistant that creates
            personalized workout routines and diet plans based on your goals,
            lifestyle, and preferences.
          </p>
          <Link href="/fitness-input">
            <Button size="lg" className="text-lg px-8 py-6">
              Build My Fitness Plan
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="text-center p-6 rounded-lg border bg-card">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">
            Personalized Workouts
          </h3>
          <p className="text-muted-foreground">
            AI-generated workout plans tailored to your fitness level,
            workout location, and long-term goals.
          </p>
        </div>

        <div className="text-center p-6 rounded-lg border bg-card">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">
            Smart Nutrition Guidance
          </h3>
          <p className="text-muted-foreground">
            Customized diet plans aligned with your dietary preferences,
            calorie needs, and fitness objectives.
          </p>
        </div>

        <div className="text-center p-6 rounded-lg border bg-card">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">
            Continuous Improvement
          </h3>
          <p className="text-muted-foreground">
            Regenerate plans as you progress and adapt your fitness strategy
            based on performance and consistency.
          </p>
        </div>
      </section>
    </div>
  );
}
