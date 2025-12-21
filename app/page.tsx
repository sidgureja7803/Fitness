import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dumbbell, Target, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <section className="text-center mb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Your Personal AI Fitness Coach
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Transform your fitness journey with personalized workout plans and
            nutrition guidance powered by artificial intelligence. Achieve your
            goals with science-backed recommendations tailored to your needs.
          </p>
          <Link href="/fitness-input">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="text-center p-6 rounded-lg border bg-card">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Custom Workouts</h3>
          <p className="text-muted-foreground">
            Get workout plans designed specifically for your fitness level,
            goals, and available equipment.
          </p>
        </div>

        <div className="text-center p-6 rounded-lg border bg-card">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Nutrition Plans</h3>
          <p className="text-muted-foreground">
            Receive personalized meal plans that align with your dietary
            preferences and fitness objectives.
          </p>
        </div>

        <div className="text-center p-6 rounded-lg border bg-card">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
          <p className="text-muted-foreground">
            Monitor your improvements and adjust your plans as you reach new
            milestones in your fitness journey.
          </p>
        </div>
      </section>
    </div>
  );
}
