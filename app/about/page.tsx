"use client";

import {
  Brain,
  Dumbbell,
  Utensils,
  Mic,
  Image as ImageIcon,
  Target,
  Zap,
  RefreshCw,
  Smartphone,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About AI Gym Assistant
          </h1>
          <p className="text-xl text-muted-foreground">
            Your AI-powered fitness & nutrition companion
          </p>
        </div>

        {/* Mission */}
        <div className="bg-card border rounded-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Our Mission</h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Our mission is to make personalized fitness accessible to everyone
            using AI-driven workout and nutrition planning tailored to
            individual goals and lifestyles.
          </p>
        </div>

        {/* Features */}
        <div className="bg-card border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">What AI Gym Assistant Offers</h2>
          <div className="grid md:grid-cols-2 gap-6">

            <Feature
              icon={<Dumbbell />}
              title="Smart Workout Plans"
              desc="AI-generated weekly workouts based on your goal, level, and equipment."
            />

            <Feature
              icon={<Utensils />}
              title="Personalized Diet Plans"
              desc="Nutrition plans aligned with your dietary preferences and fitness goals."
            />

            <Feature
              icon={<Mic />}
              title="Voice Guidance"
              desc="Listen to your workout and diet plans with AI voice narration."
            />

            <Feature
              icon={<ImageIcon />}
              title="Exercise Visuals"
              desc="AI-generated images for workouts and meals."
            />
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-card border rounded-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Technology Stack</h2>
          </div>

          <ul className="text-muted-foreground space-y-2">
            <li>• Next.js 14 (App Router)</li>
            <li>• React 18 + TypeScript</li>
            <li>• Tailwind CSS + shadcn/ui</li>
            <li>• Google Gemini / OpenAI</li>
            <li>• ElevenLabs (Text-to-Speech)</li>
          </ul>
        </div>

        {/* Why Choose */}
        <div className="bg-card border rounded-lg p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-6">
            Why Choose AI Gym Assistant?
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Highlight icon={<Zap />} title="Instant Plans" />
            <Highlight icon={<Target />} title="Fully Personalized" />
            <Highlight icon={<RefreshCw />} title="Unlimited Regeneration" />
            <Highlight icon={<Smartphone />} title="Any Device Support" />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-card border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">
            Start Your Fitness Journey Today
          </h2>
          <p className="text-muted-foreground mb-6">
            Build smarter workouts and better habits with AI-powered guidance.
          </p>
          <a
            href="/fitness-input"
            className="inline-flex px-8 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
          >
            Get Started
          </a>
        </div>

      </div>
    </div>
  );
}

/* Reusable Components */

function Feature({ icon, title, desc }: any) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm">{desc}</p>
      </div>
    </div>
  );
}

function Highlight({ icon, title }: any) {
  return (
    <div className="border rounded-lg p-6 flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
    </div>
  );
}
