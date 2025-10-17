import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="text-center space-y-6 max-w-md">
        <Compass className="h-20 w-20 mx-auto text-primary" />
        <h1 className="text-6xl font-bold text-gradient-primary">404</h1>
        <h2 className="text-2xl font-semibold">Lost in Transit</h2>
        <p className="text-muted-foreground">
          Looks like this destination doesn't exist. Let's get you back on track!
        </p>
        <Button size="lg" asChild>
          <Link to="/">
            <Home className="mr-2 h-5 w-5" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
