import { DashboardOverview } from './features/dashboard/DashboardOverview';
import { PredictionForm } from './features/predictions/PredictionForm';
import { PredictionResultDisplay } from './features/predictions/PredictionResult';
import { BrainCircuit } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="border-b bg-white top-0 sticky z-10 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-white">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">IntentPredict AI</span>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Live Prediction</h1>
          <p className="text-muted-foreground">Enter real-time session parameters to calculate purchase intent probability.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-7">
            <PredictionForm />
          </div>
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24">
               <PredictionResultDisplay />
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6 tracking-tight text-slate-900">Operations Dashboard</h2>
          <DashboardOverview />
        </div>
      </main>
    </div>
  );
}
