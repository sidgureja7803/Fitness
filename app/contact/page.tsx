'use client';

import { Mail, MapPin, Github, Linkedin, Instagram, Globe, Award, Code, Briefcase } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Get In Touch
          </h1>
          <p className="text-xl text-muted-foreground">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>

  <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Developer Info - Left Column */}
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6 h-full flex flex-col justify-between">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://avatars.githubusercontent.com/u/160741414?v=4"
                  alt="Hariharan P"
                  className="w-20 h-20 rounded-full border-2 border-primary"
                />
                <div>
                  <h2 className="text-2xl font-bold">Hariharan P</h2>
                  <p className="text-muted-foreground">Creator & Developer</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">About Me</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    AI Engineer, Full Stack Developer & GenAI Developer passionate about crafting 
                    impactful AI-driven solutions. Currently building innovative projects like 
                    BioPrompt.AI and exploring cutting-edge technologies like LangGraph, MCP, 
                    and Gemini workflows.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">Recognition</h3>
                  </div>
                  <p className="text-muted-foreground">
                    All Round Performer Nominee — SNS College of Engineering
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">Location</h3>
                  </div>
                  <p className="text-muted-foreground">Coimbatore, Tamil Nadu, India</p>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-card border rounded-lg p-6 h-full flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Tech Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'Django', 'MongoDB', 'Python', 'TypeScript', 'FastAPI', 
                  'TensorFlow', 'PyTorch', 'LangChain', 'Gemini', 'OpenAI', 'Docker', 'AWS'].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-card border rounded-lg p-6 h-full flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Certifications</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Salesforce Certified Agentforce Specialist</li>
                <li>• Microsoft Certified: Azure AI Fundamentals</li>
                <li>• Databricks GenAI & Lakehouse Fundamentals</li>
                <li>• Postman API Fundamentals Student Expert</li>
              </ul>
            </div>
          </div>

          {/* Contact Methods - Right Column */}
          <div className="space-y-6">
            {/* Contact Links */}
            <div className="bg-card border rounded-lg p-6 h-full flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Connect With Me</h3>
              </div>
              <div className="space-y-4">
                <a
                  href="https://harlee.pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Portfolio Website</h4>
                    <p className="text-sm text-muted-foreground">harlee.pro</p>
                  </div>
                </a>

                <a
                  href="https://github.com/Hariharanpugazh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Github className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">GitHub</h4>
                    <p className="text-sm text-muted-foreground">@Hariharanpugazh</p>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/hari-haran-z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Linkedin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">LinkedIn</h4>
                    <p className="text-sm text-muted-foreground">hari-haran-z</p>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/harlee_28"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Instagram className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Instagram</h4>
                    <p className="text-sm text-muted-foreground">@harlee_28</p>
                  </div>
                </a>

                <a
                  href="mailto:contact@harlee.pro"
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-sm text-muted-foreground">contact@harlee.pro</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Notable Projects */}
            <div className="bg-card border rounded-lg p-6 h-full flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Notable Projects</h3>
              </div>
              <div className="space-y-3">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold">DeepSecure AI</h4>
                  <p className="text-sm text-muted-foreground">
                    Deepfake detection using EfficientNetV2 & MTCNN
                  </p>
                </div>
                <div className="border-l-4 border-primary/70 pl-4 py-2">
                  <h4 className="font-semibold">Agentic-AI</h4>
                  <p className="text-sm text-muted-foreground">
                    Multi-LLM code review platform with Groq & Gemini
                  </p>
                </div>
                <div className="border-l-4 border-primary/50 pl-4 py-2">
                  <h4 className="font-semibold">FestiFly AI</h4>
                  <p className="text-sm text-muted-foreground">
                    AI-powered festival management platform
                  </p>
                </div>
                <div className="border-l-4 border-primary/30 pl-4 py-2">
                  <h4 className="font-semibold">BioPrompt.AI</h4>
                  <p className="text-sm text-muted-foreground">
                    Currently building next-gen AI assistant
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action - Full Width Centered (spans both grid columns) */}
          <div className="mt-8 md:col-span-2">
            <div className="text-center bg-card border rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-3">Open for Collaboration!</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Interested in AI, web development, or innovative tech projects? Let's connect and build something amazing together!
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://github.com/Hariharanpugazh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                >
                  View GitHub
                </a>
                <a
                  href="https://harlee.pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Visit Portfolio
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-12 text-center bg-card border rounded-lg p-6">
          <p className="text-muted-foreground">
            <span className="font-semibold">Built with passion by Hariharan P</span>
            <br />
            <span className="text-sm">
              Using Next.js, MongoDB, Google Gemini AI, ElevenLabs, and Replicate API
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
