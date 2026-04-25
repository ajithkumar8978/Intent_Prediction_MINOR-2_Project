import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, BrainCircuit } from 'lucide-react';

export function PredictionResultDisplay() {
  const { currentResult, status } = useSelector((state: RootState) => state.predictions);

  if (status === 'loading') {
    return (
      <Card className="w-full h-full flex items-center justify-center min-h-[300px] border-dashed">
        <div className="flex flex-col items-center text-muted-foreground">
          <BrainCircuit className="w-12 h-12 animate-pulse mb-4" />
          <p>Analyzing session data with AI...</p>
        </div>
      </Card>
    );
  }

  if (!currentResult) {
    return (
      <Card className="w-full h-full flex flex-col items-center justify-center min-h-[300px] bg-muted/30">
         <BrainCircuit className="w-12 h-12 text-muted-foreground/30 mb-4" />
         <p className="text-muted-foreground text-sm">Submit session data to see AI prediction</p>
      </Card>
    );
  }

  const { intent, confidenceScore, reasoning } = currentResult;
  const isPositive = intent === 'Yes';

  return (
    <Card className="w-full h-full relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Prediction Result
          <Badge variant={isPositive ? 'default' : 'destructive'} className="text-sm">
            {isPositive ? 'Will Purchase' : 'Will Not Purchase'}
          </Badge>
        </CardTitle>
        <CardDescription>Based on real-time behavior analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isPositive ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{confidenceScore}%</h3>
            <p className="text-sm text-muted-foreground">Confidence Score</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Certainty Level</span>
            <span className="font-medium">{confidenceScore}%</span>
          </div>
          <Progress value={confidenceScore} className={`h-2 ${isPositive ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`} />
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-2 flex items-center">
            <BrainCircuit className="w-4 h-4 mr-2" />
            AI Insight
          </h4>
          <p className="text-sm leading-relaxed text-muted-foreground italic">
            "{reasoning}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
