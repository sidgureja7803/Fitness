'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { RefreshCw, Loader2, ArrowUp, Volume2, Pause, Play, Dumbbell, Utensils, X, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user');
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageItem, setCurrentImageItem] = useState<string>('');
  const [imageCache, setImageCache] = useState<Map<string, string>>(new Map());
  const [globalLoading, setGlobalLoading] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  
  // Helper function to calculate daily total calories
  const calculateDailyTotal = (meals: any[]) => {
    return meals.reduce((total, meal) => {
      const calories = parseInt(meal.calories.replace(/\D/g, '')) || 0;
      return total + calories;
    }, 0);
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  const fetchPlan = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/get-plan/${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load plan");

      // Handle the response structure properly
      const allPlans = data?.plans || [data.latest_plan].filter(Boolean);
      setPlans(allPlans);
      setCurrentPlanIndex(allPlans.length - 1); // show latest
      setPlan(allPlans[allPlans.length - 1]); // Set current plan
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = async (name: string, type: "exercise" | "meal") => {
    console.log('handleItemClick called:', name, type);
    
    // Check cache first
    const cacheKey = `${type}-${name.toLowerCase()}`;
    if (imageCache.has(cacheKey)) {
      console.log('Loading from cache:', cacheKey);
      setPreviewImage(imageCache.get(cacheKey)!);
      setCurrentImageItem(name);
      setShowImageModal(true);
      console.log('Modal state set to true (cached)');
      return;
    }

    try {
      console.log('Starting image generation...');
      setGlobalLoading(true);
      setImageLoading(true);
      setPreviewImage(null);
      setCurrentImageItem(name);
      setShowImageModal(true);
      console.log('Modal state set to true (generating)');

      const res = await fetch("/api/generate-image-for-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: name, type }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Image generation failed");
        setShowImageModal(false);
        setImageLoading(false);
        setGlobalLoading(false);
        return;
      }

      let imageUrl: string | null = null;
      if (data.image_base64) {
        imageUrl = `data:${data.mime_type || "image/jpeg"};base64,${data.image_base64}`;
      } else if (data.image_url) {
        imageUrl = data.image_url;
      }

      if (imageUrl) {
        console.log('Image generated successfully');
        setPreviewImage(imageUrl);
        // Cache the image (TypeScript knows imageUrl is string here due to the if check)
        setImageCache(prev => new Map(prev).set(cacheKey, imageUrl as string));
      } else {
        alert("No image generated for this item.");
        setShowImageModal(false);
      }
    } catch (err) {
      console.error("Image generation error:", err);
      alert("Error generating image. Try again.");
      setShowImageModal(false);
    } finally {
      setImageLoading(false);
      setGlobalLoading(false);
    }
  };

  const closeModal = () => {
    setShowImageModal(false);
    setPreviewImage(null);
    setCurrentImageItem('');
  };

  const exportToPDF = async () => {
    if (!plan || !printRef.current) return;

    setIsExportingPDF(true);

    try {
      // Save current theme
      const html = document.documentElement;
      const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
      
      // Force light theme for export
      html.classList.remove('dark');
      html.classList.add('light');
      
      // Hide interactive buttons during export
      const buttons = printRef.current.querySelectorAll('button');
      buttons.forEach((btn) => {
        (btn as HTMLElement).style.display = 'none';
      });
      
      // Show print-only elements
      const printOnlyElements = printRef.current.querySelectorAll('.print-only');
      printOnlyElements.forEach((el) => {
        (el as HTMLElement).classList.remove('hidden');
      });
      
      // Wait a bit for theme and styles to apply
      await new Promise(resolve => setTimeout(resolve, 300));

      const element = printRef.current;
      
      // Configure html2canvas with high quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename with timestamp
      const date = new Date().toISOString().split('T')[0];
      const filename = `Fitness_Plan_${date}.pdf`;
      
      // Download PDF
      pdf.save(filename);

      // Restore button visibility
      buttons.forEach((btn) => {
        (btn as HTMLElement).style.display = '';
      });
      
      // Hide print-only elements again
      printOnlyElements.forEach((el) => {
        (el as HTMLElement).classList.add('hidden');
      });

      // Restore original theme
      if (currentTheme === 'dark') {
        html.classList.remove('light');
        html.classList.add('dark');
      }
      
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Failed to export PDF. Please try again.');
      
      // Restore theme in case of error
      const html = document.documentElement;
      const buttons = printRef.current?.querySelectorAll('button');
      buttons?.forEach((btn) => {
        (btn as HTMLElement).style.display = '';
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleReadPlan = async (text: string, identifier: string) => {
    // If audio is currently playing or paused for this identifier, toggle pause/resume
    if (currentAudio && (isPlaying === identifier || isPaused === identifier)) {
      if (currentAudio.paused) {
        // Resume
        currentAudio.play();
        setIsPlaying(identifier);
        setIsPaused(null);
      } else {
        // Pause
        currentAudio.pause();
        setIsPaused(identifier);
        setIsPlaying(null);
      }
      return;
    }

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(null);
      setIsPaused(null);
    }

    try {
      setGlobalLoading(true);
      setAudioLoading(identifier);
      const res = await fetch("/api/read-plan-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      
      if (data.audio_base64) {
        const audio = new Audio(`data:${data.mime_type || "audio/mpeg"};base64,${data.audio_base64}`);
        
        // Set up event listeners
        audio.onplay = () => {
          setIsPlaying(identifier);
          setIsPaused(null);
          setAudioLoading(null);
        };
        
        audio.onpause = () => {
          if (audio.currentTime > 0 && audio.currentTime < audio.duration) {
            setIsPaused(identifier);
            setIsPlaying(null);
          }
        };
        
        audio.onended = () => {
          setIsPlaying(null);
          setIsPaused(null);
          setCurrentAudio(null);
        };
        
        audio.onerror = (e) => {
          console.error("Audio playback error:", e);
          setIsPlaying(null);
          setIsPaused(null);
          setAudioLoading(null);
          alert("Error playing audio. Please try again.");
        };
        
        setCurrentAudio(audio);
        
        // Play the audio
        audio.play().catch((err) => {
          console.error("Audio play error:", err);
          setAudioLoading(null);
          setGlobalLoading(false);
          alert("Failed to play audio. Please check your browser settings.");
        });
      } else {
        setAudioLoading(null);
        setGlobalLoading(false);
        alert("Voice generation failed: " + (data.error || "No audio data received"));
      }
    } catch (err) {
      console.error("Voice generation error:", err);
      setAudioLoading(null);
      setGlobalLoading(false);
      alert("Error generating voice. Try again.");
    } finally {
      setGlobalLoading(false);
    }
  };


  const regeneratePlan = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Regeneration failed");

      // Instead of overwriting, append to local plans list
      setPlans((prev: any[]) => [...prev, data.plan]);
      setCurrentPlanIndex(prev => prev + 1);
      setPlan(data.plan); // Set the new plan as current

      // Scroll to top to show the new plan
      scrollToTop();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPlan();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin mr-2" /> Loading plan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No plan found.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 md:py-10 px-4 max-w-7xl">
      {/* Header Section */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Personalized Plan</h1>
        <p className="text-muted-foreground mb-4 text-sm md:text-base">
          AI-generated fitness and nutrition plan tailored for you
        </p>

        {/* Quick Stats */}
        <div className="flex justify-center gap-4 md:gap-8 mb-6">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold">7</div>
            <div className="text-xs md:text-sm text-muted-foreground">Days</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold">{plan?.workout_plan?.length || 0}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Workouts</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold">
              {plan?.diet_plan?.reduce((total: number, day: any) => total + day.meals.length, 0) || 0}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Meals</div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <Button onClick={regeneratePlan} variant="outline" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating New Plan...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate New Plan
              </>
            )}
          </Button>

          <Button 
            onClick={exportToPDF} 
            variant="default" 
            disabled={isExportingPDF || !plan}
            className="bg-green-600 hover:bg-green-700"
          >
            {isExportingPDF ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Export as PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Plan Selection */}
      {plans.length > 1 && (
        <div className="mb-6">
          <p className="text-center text-sm text-muted-foreground mb-3">
            You have {plans.length} generated plans. Switch between them:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {plans.map((_, i) => (
              <Button
                key={i}
                variant={i === currentPlanIndex ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCurrentPlanIndex(i);
                  setPlan(plans[i]);
                }}
              >
                Plan {i + 1}
              </Button>

            ))}
          </div>

        </div>
      )}

      {/* Exportable Content Wrapper */}
      <div ref={printRef}>
        {/* Header for PDF */}
        <div className="mb-6 text-center print-only hidden">
          <h1 className="text-3xl font-bold mb-2">Your Personalized Fitness Plan</h1>
          <p className="text-sm text-muted-foreground">AI-Generated on {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Workout Plan Section */}
        <div className="border rounded-lg bg-card h-fit lg:sticky lg:top-6">
          <div className="p-4 md:p-6 border-b">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-primary" />
              Workout Plan
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              7-day personalized exercise routine
            </p>
          </div>

          <div className="p-4 md:p-6">
            <div className="space-y-4">
              {plan.workout_plan.map((w: any, i: number) => {
                const dayId = `workout-day-${i}`;
                const exerciseText = `${w.day}: ${w.exercises?.map((e: any) => `${e.name}, ${e.sets}`).join(". ") || 'No exercises'}`;
                
                return (
                <div key={i} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <div className="flex items-center gap-2 mb-2 sm:mb-0">
                      <span className="font-semibold text-lg">{w.day}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {w.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {w.focus}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReadPlan(exerciseText, dayId)}
                        disabled={audioLoading !== null && audioLoading !== dayId}
                        className="ml-2"
                      >
                        {audioLoading === dayId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isPaused === dayId ? (
                          <Play className="h-4 w-4" />
                        ) : isPlaying === dayId ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {w.exercises?.map((ex: any, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => handleItemClick(ex.name, "exercise")}
                        className="flex justify-between items-center text-sm cursor-pointer hover:bg-gray-50 p-2 rounded-md transition"
                      >
                        <span className="font-medium text-blue-600 hover:underline">{ex.name}</span>
                        <div className="text-xs text-muted-foreground">
                          {ex.sets} • {ex.rest}
                        </div>
                      </div>
                    )) || <p className="text-sm text-muted-foreground">No exercises available</p>}
                  </div>
                </div>
              )})}
            </div>
          </div>
        </div>

        {/* Diet Plan Section */}
        <div className="border rounded-lg bg-card">
          <div className="p-4 md:p-6 border-b">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Utensils className="w-6 h-6 text-primary" />
              Diet Plan
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              7-day personalized nutrition guide
            </p>
          </div>

          <div className="p-4 md:p-6">
            <div className="space-y-6">
              {plan.diet_plan.map((dayPlan: any, dayIndex: number) => {
                const dailyTotal = calculateDailyTotal(dayPlan.meals || []);
                const dayId = `diet-day-${dayIndex}`;
                const mealText = `${dayPlan.day}: ${dayPlan.meals?.map((m: any) => `${m.meal} - ${m.menu}`).join(". ") || 'No meals'}`;
                
                return (
                  <div key={dayIndex} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg">{dayPlan.day}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                          {dailyTotal} kcal total
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReadPlan(mealText, dayId)}
                          disabled={audioLoading !== null && audioLoading !== dayId}
                        >
                          {audioLoading === dayId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : isPaused === dayId ? (
                            <Play className="h-4 w-4" />
                          ) : isPlaying === dayId ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {dayPlan.meals?.map((meal: any, mealIndex: number) => (
                        <div
                          key={mealIndex}
                          onClick={() => handleItemClick(meal.menu, "meal")}
                          className="flex justify-between items-start cursor-pointer hover:bg-gray-50 p-2 rounded-md transition"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1 text-green-600 hover:underline">
                              {meal.meal}
                            </div>
                            <div className="text-sm text-muted-foreground">{meal.menu}</div>
                          </div>
                          <div className="text-sm font-medium ml-4">{meal.calories}</div>
                        </div>
                      )) || <p className="text-sm text-muted-foreground">No meals available</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

        {/* Footer Summary */}
        <div className="mt-12 text-center py-8 border-t">
          <p className="text-sm text-muted-foreground">
            This personalized plan was generated specifically for your fitness goals and preferences.
            <br />
            Remember to stay hydrated and listen to your body during workouts.
          </p>
        </div>
      </div>
      {/* End of Exportable Content */}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 rounded-full p-3 shadow-lg"
          size="icon"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}

      {/* Global Loading Overlay */}
      {globalLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-center justify-center">
          <div className="bg-background border rounded-lg p-8 shadow-2xl flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-semibold">
              {imageLoading ? 'Generating AI Image...' : audioLoading ? 'Generating Voice...' : 'Processing...'}
            </p>
            <p className="text-sm text-muted-foreground">Please wait, do not close this page</p>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            ref={modalRef}
            className="bg-background border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{currentImageItem}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {imageLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
                  <p className="text-lg font-medium">Generating AI Image...</p>
                  <p className="text-sm text-muted-foreground mt-2">This may take a few seconds</p>
                </div>
              ) : previewImage ? (
                <div className="flex flex-col items-center">
                  <img
                    src={previewImage}
                    alt={currentImageItem}
                    className="rounded-lg max-w-full h-auto shadow-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-4">AI Generated Visualization</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <p className="text-lg text-muted-foreground">No image available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
