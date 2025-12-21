export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AI Fitness Coach. All rights reserved.</p>
          <p className="mt-2">
            Your journey to better health starts here.
          </p>
        </div>
      </div>
    </footer>
  );
}
