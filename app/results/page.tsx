'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  RefreshCw,
  Loader2,
  ArrowUp,
  Volume2,
  Pause,
  Play,
  Dumbbell,
  Utensils,
  X,
  FileDown,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user');

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<any | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<any | null>(null);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageItem, setCurrentImageItem] = useState('');
  const [imageCache, setImageCache] = useState<Map<string, string>>(new Map());

  const [audioLoading, setAudioLoading] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const [globalLoading, setGlobalLoading] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  /* ---------------- Helpers ---------------- */

  const calculateDailyTotal = (meals: any[]) =>
    meals.reduce((sum, m) => sum + (parseInt(m.calories?.replace(/\D/g, '')) || 0), 0);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  /* ---------------- Data Fetch ---------------- */

  const fetchPlan = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/get-plan/${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load plan');

      const allPlans = data.plans || [];
      setPlans(allPlans);
      if (allPlans.length > 0) {
        setPlan(allPlans[allPlans.length - 1]);
        setCurrentPlanIndex(allPlans.length - 1);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchPlan();

    fetch(`/api/get-user/${userId}`)
      .then((r) => r.json())
      .then((d) => d?.user && setUserProfile(d.user))
      .catch(() => {});
  }, [userId]);

  /* ---------------- Image Handling ---------------- */

  const handleItemClick = async (name: string, type: 'exercise' | 'meal') => {
    const key = `${type}-${name.toLowerCase()}`;

    if (imageCache.has(key)) {
      setPreviewImage(imageCache.get(key)!);
      setCurrentImageItem(name);
      setShowImageModal(true);
      return;
    }

    try {
      setGlobalLoading(true);
      setImageLoading(true);
      setShowImageModal(true);
      setCurrentImageItem(name);

      const res = await fetch('/api/generate-image-for-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: name, type }),
      });

      const data = await res.json();
      if (!res.ok || !data.image_prompt) {
        throw new Error('Image generation failed');
      }

      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        data.image_prompt
      )}`;

      setPreviewImage(imageUrl);
      setImageCache((prev) => new Map(prev).set(key, imageUrl));
    } catch {
      alert('Failed to generate image');
      setShowImageModal(false);
    } finally {
      setImageLoading(false);
      setGlobalLoading(false);
    }
  };

  const closeModal = () => {
    setShowImageModal(false);
    setPreviewImage(null);
  };

  /* ---------------- Audio ---------------- */

  const handleReadPlan = async (text: string, id: string) => {
    if (currentAudio && (isPlaying === id || isPaused === id)) {
      currentAudio.paused ? currentAudio.play() : currentAudio.pause();
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    try {
      setGlobalLoading(true);
      setAudioLoading(id);

      const res = await fetch('/api/read-plan-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (!data.audio_base64) throw new Error();

      const audio = new Audio(
        `data:${data.mime_type || 'audio/mpeg'};base64,${data.audio_base64}`
      );

      audio.onplay = () => {
        setIsPlaying(id);
        setIsPaused(null);
        setAudioLoading(null);
      };
      audio.onpause = () => {
        setIsPaused(id);
        setIsPlaying(null);
      };
      audio.onended = () => {
        setIsPlaying(null);
        setIsPaused(null);
        setCurrentAudio(null);
      };

      setCurrentAudio(audio);
      audio.play();
    } catch {
      alert('Audio generation failed');
    } finally {
      setGlobalLoading(false);
    }
  };

  /* ---------------- Regenerate ---------------- */

  const regeneratePlan = async () => {
    if (!userProfile) {
      alert('User profile not loaded');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Regeneration failed');
      }

      setPlans((prev) => [...prev, data.plan]);
      setCurrentPlanIndex((p) => p + 1);
      setPlan(data.plan);
      scrollToTop();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PDF Export ---------------- */

  const exportToPDF = async () => {
    if (!printRef.current || !plan) return;
    setIsExportingPDF(true);

    try {
      const canvas = await html2canvas(printRef.current, { scale: 2 });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(img, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`Fitness_Plan_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch {
      alert('PDF export failed');
    } finally {
      setIsExportingPDF(false);
    }
  };

  /* ---------------- UI States ---------------- */

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin mr-2" /> Loading plan...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!plan || !plan.workout_plan || !plan.diet_plan) {
    return <div className="text-center text-muted-foreground">No plan found.</div>;
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Your Personalized Plan</h1>

        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={regeneratePlan} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Generate New Plan
          </Button>

          <Button onClick={exportToPDF} disabled={isExportingPDF}>
            <FileDown className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div ref={printRef} className="grid lg:grid-cols-2 gap-6">
        {/* Workout */}
        <div className="border rounded-lg bg-card p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Dumbbell className="w-5 h-5" /> Workout Plan
          </h2>

          {plan.workout_plan.map((w: any, i: number) => {
            const id = `w-${i}`;
            return (
              <div key={i} className="border rounded p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{w.day}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleReadPlan(
                        `${w.day}: ${w.exercises.map((e: any) => e.name).join(', ')}`,
                        id
                      )
                    }
                  >
                    {isPlaying === id ? <Pause /> : <Volume2 />}
                  </Button>
                </div>

                {w.exercises.map((e: any, j: number) => (
                  <div
                    key={j}
                    onClick={() => handleItemClick(e.name, 'exercise')}
                    className="cursor-pointer text-sm hover:underline"
                  >
                    {e.name} — {e.sets}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Diet */}
        <div className="border rounded-lg bg-card p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Utensils className="w-5 h-5" /> Diet Plan
          </h2>

          {plan.diet_plan.map((d: any, i: number) => {
            const id = `d-${i}`;
            return (
              <div key={i} className="border rounded p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{d.day}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleReadPlan(
                        `${d.day}: ${d.meals.map((m: any) => m.menu).join(', ')}`,
                        id
                      )
                    }
                  >
                    {isPlaying === id ? <Pause /> : <Volume2 />}
                  </Button>
                </div>

                {d.meals.map((m: any, j: number) => (
                  <div
                    key={j}
                    onClick={() => handleItemClick(m.menu, 'meal')}
                    className="cursor-pointer text-sm hover:underline"
                  >
                    {m.meal}: {m.menu} ({m.calories})
                  </div>
                ))}

                <div className="text-sm text-muted-foreground mt-2">
                  Total: {calculateDailyTotal(d.meals)} kcal
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 rounded-full"
          size="icon"
        >
          <ArrowUp />
        </Button>
      )}

      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div className="bg-background p-6 rounded-lg max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">{currentImageItem}</h3>
              <Button size="icon" variant="ghost" onClick={closeModal}>
                <X />
              </Button>
            </div>

            {imageLoading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              previewImage && (
                <img src={previewImage} alt={currentImageItem} className="rounded" />
              )
            )}
          </div>
        </div>
      )}

      {globalLoading && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}
