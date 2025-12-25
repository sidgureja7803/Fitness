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
      /* ======================
         1️⃣ SAVE USER
      ====================== */
      const saveRes = await fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok || !saveData.userId) {
        alert(saveData?.error || 'Failed to save user');
        return;
      }

      const userId = saveData.userId;

      /* ======================
         2️⃣ GENERATE PLAN
         (Send FULL DATA + userId)
      ====================== */
      const planRes = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...formData,
        }),
      });

      const planData = await planRes.json();

      if (!planRes.ok || !planData.success) {
        alert(planData?.error || 'Failed to generate plan');
        return;
      }

      /* ======================
         3️⃣ REDIRECT TO RESULTS
      ====================== */
      router.push(`/results?user=${userId}`);
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Enter Your Fitness Details
          </h1>
          <p className="text-muted-foreground">
            Get a personalized workout & diet plan powered by AI
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border rounded-lg p-8 space-y-6"
        >
          {/* Name & Age */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Name *</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Age *</Label>
              <Input
                type="number"
                required
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              />
            </div>
          </div>

          {/* Gender */}
          <Select
            required
            onValueChange={(v) =>
              setFormData({ ...formData, gender: v })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* Height & Weight */}
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              type="number"
              placeholder="Height (cm)"
              required
              value={formData.height}
              onChange={(e) =>
                setFormData({ ...formData, height: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Weight (kg)"
              required
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: e.target.value })
              }
            />
          </div>

          {/* Fitness Goal */}
          <Select
            required
            onValueChange={(v) =>
              setFormData({ ...formData, fitnessGoal: v })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Fitness goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
              <SelectItem value="Weight Loss">Weight Loss</SelectItem>
              <SelectItem value="General Fitness">
                General Fitness
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Fitness Level */}
          <Select
            required
            onValueChange={(v) =>
              setFormData({ ...formData, fitnessLevel: v })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Fitness level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          {/* Workout Location */}
          <Select
            required
            onValueChange={(v) =>
              setFormData({ ...formData, workoutLocation: v })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Workout location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gym">Gym</SelectItem>
              <SelectItem value="Home">Home</SelectItem>
              <SelectItem value="Outdoor">Outdoor</SelectItem>
            </SelectContent>
          </Select>

          {/* Diet Preference */}
          <Select
            required
            onValueChange={(v) =>
              setFormData({ ...formData, dietaryPreference: v })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Diet preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Veg">Vegetarian</SelectItem>
              <SelectItem value="Non-Veg">Non-Vegetarian</SelectItem>
              <SelectItem value="Vegan">Vegan</SelectItem>
              <SelectItem value="Keto">Keto</SelectItem>
            </SelectContent>
          </Select>

          {/* Medical History */}
          <Textarea
            placeholder="Medical history (optional)"
            value={formData.medicalHistory}
            onChange={(e) =>
              setFormData({
                ...formData,
                medicalHistory: e.target.value,
              })
            }
          />

          <Button type="submit" disabled={loading} className="w-full py-6">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Plan...
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
