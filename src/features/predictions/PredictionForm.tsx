import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchPrediction, clearCurrentResult } from './predictionsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  timeSpent: z.number().min(0, { message: 'Must be a positive number' }),
  pagesVisited: z.number().min(1, { message: 'Must visit at least 1 page' }),
  bounceRate: z.number().min(0).max(100),
  trafficSource: z.enum(['Organic', 'Direct', 'Paid', 'Referral', 'Social']),
  deviceType: z.enum(['Desktop', 'Mobile', 'Tablet']),
});

type FormValues = z.infer<typeof formSchema>;

export function PredictionForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.predictions);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeSpent: 120,
      pagesVisited: 3,
      bounceRate: 45,
      trafficSource: 'Organic',
      deviceType: 'Desktop',
    },
  });

  const onSubmit = (data: FormValues) => {
    dispatch(fetchPrediction(data));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Session Data</CardTitle>
        <CardDescription>Enter metrics to predict purchase intention.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="prediction-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeSpent">Time Spent (seconds)</Label>
              <Input id="timeSpent" type="number" {...register('timeSpent', { valueAsNumber: true })} />
              {errors.timeSpent && <p className="text-sm text-red-500">{errors.timeSpent.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pagesVisited">Pages Visited</Label>
              <Input id="pagesVisited" type="number" {...register('pagesVisited', { valueAsNumber: true })} />
              {errors.pagesVisited && <p className="text-sm text-red-500">{errors.pagesVisited.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bounceRate">Bounce Rate (%)</Label>
              <Input id="bounceRate" type="number" {...register('bounceRate', { valueAsNumber: true })} />
              {errors.bounceRate && <p className="text-sm text-red-500">{errors.bounceRate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="trafficSource">Traffic Source</Label>
              <select 
                id="trafficSource" 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register('trafficSource')}
              >
                <option value="Organic">Organic Search</option>
                <option value="Direct">Direct</option>
                <option value="Paid">Paid Ads</option>
                <option value="Referral">Referral</option>
                <option value="Social">Social Media</option>
              </select>
              {errors.trafficSource && <p className="text-sm text-red-500">{errors.trafficSource.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="deviceType">Device Type</Label>
               <select 
                id="deviceType" 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register('deviceType')}
              >
                <option value="Desktop">Desktop</option>
                <option value="Mobile">Mobile</option>
                <option value="Tablet">Tablet</option>
              </select>
              {errors.deviceType && <p className="text-sm text-red-500">{errors.deviceType.message}</p>}
            </div>
          </div>
          
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => reset()} disabled={status === 'loading'}>
          Reset
        </Button>
        <Button type="submit" form="prediction-form" disabled={status === 'loading'}>
          {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {status === 'loading' ? 'Predicting...' : 'Predict Intent'}
        </Button>
      </CardFooter>
    </Card>
  );
}
