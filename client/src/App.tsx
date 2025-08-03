import React from "react";
import { Switch, Route } from "wouter";

// Simple placeholder components to avoid complex dependencies
function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>AUTO ANI - Premium Used Cars</h1>
      <h2>Welcome to Mitrovica's Premier Car Dealership</h2>
      <p>Since 2005, AUTO ANI has been Kosovo's trusted source for premium used vehicles imported from Finland and Germany.</p>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Why Choose AUTO ANI?</h3>
        <ul>
          <li>🇫🇮 Direct imports from Finland - known for excellent car maintenance</li>
          <li>🔧 Thorough inspection of every vehicle</li>
          <li>📋 Complete documentation and history</li>
          <li>🛡️ Warranty on all vehicles</li>
          <li>🎯 Specialized in BMW, Mercedes, Audi, Volkswagen, Škoda</li>
        </ul>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Contact Information</h3>
        <p>📍 Location: Mitrovica, Kosovo</p>
        <p>📞 Phone: Available on request</p>
        <p>🕒 Operating since: 2005</p>
      </div>
    </div>
  );
}

function About() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>About AUTO ANI</h1>
      <p>Established in 2005 in Mitrovica, Kosovo, AUTO ANI has built a reputation as the region's premier destination for quality used vehicles.</p>
      <p>We specialize in importing premium vehicles from Finland, known for their excellent maintenance culture and harsh winter driving conditions that test vehicle reliability.</p>
    </div>
  );
}

function Services() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Our Services</h1>
      <ul>
        <li>Premium used car sales</li>
        <li>Vehicle importing from Finland</li>
        <li>Complete vehicle documentation</li>
        <li>Quality inspections</li>
        <li>Warranty services</li>
      </ul>
    </div>
  );
}

function Contact() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Contact AUTO ANI</h1>
      <p>Located in Mitrovica, Kosovo</p>
      <p>Serving customers since 2005</p>
      <p>Specializing in Finnish car imports</p>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

// Simple navigation
function Navigation() {
  return (
    <nav style={{ 
      padding: '10px 20px', 
      backgroundColor: '#f0f0f0', 
      borderBottom: '1px solid #ddd',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#333' }}>AUTO ANI</h3>
        <a href="/" style={{ textDecoration: 'none', color: '#0066cc' }}>Home</a>
        <a href="/about" style={{ textDecoration: 'none', color: '#0066cc' }}>About</a>
        <a href="/services" style={{ textDecoration: 'none', color: '#0066cc' }}>Services</a>
        <a href="/contact" style={{ textDecoration: 'none', color: '#0066cc' }}>Contact</a>
      </div>
    </nav>
  );
}

function App() {
  console.log("App component rendering...");
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
