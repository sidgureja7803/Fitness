'use client';

import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Instagram,
  Globe,
  Award,
  Code,
  Briefcase,
} from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-muted-foreground">
            Let’s connect and build something impactful together
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Left Column */}
          <div className="space-y-6">

            {/* Developer Info */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center text-xl font-bold">
                  RD
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Rishabh Dhawan</h2>
                  <p className="text-muted-foreground">
                    Full Stack & AI Developer
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Section
                  icon={<Code className="w-5 h-5 text-primary" />}
                  title="About Me"
                  text="I am a full-stack developer with strong interest in AI-powered applications, backend systems, and LLM-based products. I enjoy building scalable, real-world solutions that combine clean UI with intelligent automation."
                />

                <Section
                  icon={<Award className="w-5 h-5 text-primary" />}
                  title="Focus Areas"
                  text="AI Applications · Backend Engineering · GenAI Systems · Secure APIs"
                />

                <Section
                  icon={<MapPin className="w-5 h-5 text-primary" />}
                  title="Location"
                  text="India"
                />
              </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Tech Stack</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  'Next.js',
                  'React',
                  'TypeScript',
                  'Node.js',
                  'MongoDB',
                  'Gemini AI',
                  'OpenAI',
                  'ElevenLabs',
                  'Tailwind CSS',
                  'Docker',
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Contact Links */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Connect With Me</h3>
              </div>

              <div className="space-y-4">

                <ContactLink
                  href="https://github.com/rishabhdvn"
                  icon={<Github className="w-6 h-6 text-primary" />}
                  title="GitHub"
                  subtitle="@rishabhdvn"
                />

                <ContactLink
                  href="https://www.linkedin.com"
                  icon={<Linkedin className="w-6 h-6 text-primary" />}
                  title="LinkedIn"
                  subtitle="Connect professionally"
                />

                <ContactLink
                  href="mailto:rishabh@example.com"
                  icon={<Mail className="w-6 h-6 text-primary" />}
                  title="Email"
                  subtitle="rishabh@example.com"
                />
              </div>
            </div>

            {/* Projects */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Notable Projects</h3>
              </div>

              <Project
                title="AI Gym Assistant"
                desc="AI-powered fitness and diet planning platform using Gemini and ElevenLabs"
              />
              <Project
                title="NyayaVaani"
                desc="Legal domain LLM for simplifying Indian laws in regional languages"
              />
              <Project
                title="SecureCollab"
                desc="Secure real-time collaborative coding platform"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="md:col-span-2 mt-8">
            <div className="text-center bg-card border rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-3">
                Open to Opportunities & Collaboration
              </h3>
              <p className="text-muted-foreground mb-6">
                Interested in AI, backend systems, or full-stack development? Let’s talk.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center bg-card border rounded-lg p-6">
          <p className="text-muted-foreground">
            <span className="font-semibold">Built by Rishabh Dhawan</span>
            <br />
            <span className="text-sm">
              Next.js · MongoDB · Gemini AI · ElevenLabs
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}

/* Reusable Components */

function Section({ icon, title, text }: any) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}

function ContactLink({ href, icon, title, subtitle }: any) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </a>
  );
}

function Project({ title, desc }: any) {
  return (
    <div className="border-l-4 border-primary pl-4 py-2 mb-2">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
