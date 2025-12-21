// AI Fitness App/app/fitness-input/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

export default function FitnessInputPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessGoal: '',
    fitnessLevel: '',
    workoutLocation: '',
    dietaryPreference: '',
    medicalHistory: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save user data to MongoDB via Next.js API
      const saveRes = await fetch("/api/save-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok || !saveData.insertedId) {
        const message = saveData?.error || "Failed to save user data";
        alert(message);
        setLoading(false);
        return;
      }

      const userId = saveData.insertedId;

      // Generate plan using Gemini API via Next.js API
      const planRes = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const planData = await planRes.json();

      if (!planRes.ok || !planData.success) {
        const message = planData?.error || "Failed to generate plan";
        alert(message);
        setLoading(false);
        return;
      }

      // Navigate to results with the userId
      router.push(`/results?user=${userId}`);
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Enter Your Fitness Details</h1>
          <p className="text-muted-foreground">
            Provide your information to receive a personalized fitness and
            nutrition plan
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border rounded-lg p-8 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                required
                placeholder="25"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select
              required
              onValueChange={(value) =>
                setFormData({ ...formData, gender: value })
              }
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm) *</Label>
              <Input
                id="height"
                type="number"
                required
                placeholder="175"
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                required
                placeholder="70"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fitnessGoal">Fitness Goal *</Label>
            <Select
              required
              onValueChange={(value) =>
                setFormData({ ...formData, fitnessGoal: value })
              }
            >
              <SelectTrigger id="fitnessGoal">
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight-loss">Weight Loss</SelectItem>
                <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                <SelectItem value="endurance">Endurance</SelectItem>
                <SelectItem value="general-fitness">
                  General Fitness
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fitnessLevel">Fitness Level *</Label>
            <Select
              required
              onValueChange={(value) =>
                setFormData({ ...formData, fitnessLevel: value })
              }
            >
              <SelectTrigger id="fitnessLevel">
                <SelectValue placeholder="Select your fitness level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workoutLocation">Workout Location *</Label>
            <Select
              required
              onValueChange={(value) =>
                setFormData({ ...formData, workoutLocation: value })
              }
            >
              <SelectTrigger id="workoutLocation">
                <SelectValue placeholder="Select workout location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="gym">Gym</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietaryPreference">Dietary Preference *</Label>
            <Select
              required
              onValueChange={(value) =>
                setFormData({ ...formData, dietaryPreference: value })
              }
            >
              <SelectTrigger id="dietaryPreference">
                <SelectValue placeholder="Select dietary preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="veg">Vegetarian</SelectItem>
                <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalHistory">
              Medical History / Notes (Optional)
            </Label>
            <Textarea
              id="medicalHistory"
              placeholder="Any injuries, medical conditions, or other important notes..."
              rows={4}
              value={formData.medicalHistory}
              onChange={(e) =>
                setFormData({ ...formData, medicalHistory: e.target.value })
              }
            />
          </div>

          <Button
            type="submit"
            className="w-full text-lg py-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Your Plan...
              </>
            ) : (
              'Generate Plan'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
