import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import VehicleDetails from "./pages/VehicleDetails";
import Admin from "./pages/Admin";
import AdminCarManagement from "./pages/AdminCarManagement";
import ContentManager from "./pages/ContentManager";
import AdvancedContentManager from "./pages/AdvancedContentManager";
import FullControlManager from "./pages/FullControlManager";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/vehicle/:id" component={VehicleDetails} />
        <Route path="/services" component={Services} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/cars" component={AdminCarManagement} />
        <Route path="/content-manager" component={ContentManager} />
        <Route path="/advanced-content" component={AdvancedContentManager} />
        <Route path="/full-control" component={FullControlManager} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
