'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

type FormData = {
  domain: string;
  currentLevel: string;
  ultimateGoal: string;
  timeframe: string;
};

type GeneratorFormProps = {
  onGenerate: (data: FormData) => void;
  isLoading: boolean;
};

export function GeneratorForm({ onGenerate, isLoading }: GeneratorFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    domain: '',
    currentLevel: '',
    ultimateGoal: '',
    timeframe: '',
  });

  const updateForm = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(s => s + 1);

  return (
    <Card className="w-full max-w-2xl mx-auto p-8 sm:p-12 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.1] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight text-white/90">Create your Roadmap</CardTitle>
        <CardDescription className="text-white/60 text-sm leading-relaxed">Tell us your goals, and we&apos;ll map the path.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 mt-6 p-0">
        <AnimatePresence mode="sync">
          
          {step >= 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <Label htmlFor="domain" className="text-sm font-medium text-zinc-300">1. Select your Domain</Label>
              <Select onValueChange={(val) => { updateForm('domain', val as string); if (step === 1) handleNext(); }} value={formData.domain}>
                <SelectTrigger id="domain">
                  <SelectValue placeholder="e.g. Tech Skill or Competitive Exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tech Skill">Tech Skill</SelectItem>
                  <SelectItem value="Competitive Exam">Competitive Exam</SelectItem>
                  <SelectItem value="Language Learning">Language Learning</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 mt-6"
            >
              <Label htmlFor="currentLevel" className="text-sm font-medium text-zinc-300">2. Current Level</Label>
              <Input 
                id="currentLevel" 
                placeholder="e.g. 'I know basic Python' or 'Total beginner'" 
                value={formData.currentLevel}
                onChange={(e) => updateForm('currentLevel', e.target.value)}
                onBlur={() => { if (formData.currentLevel && step === 2) handleNext(); }}
              />
            </motion.div>
          )}

          {step >= 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 mt-6"
            >
              <Label htmlFor="ultimateGoal" className="text-sm font-medium text-zinc-300">3. Ultimate Goal</Label>
              <Input 
                id="ultimateGoal" 
                placeholder="e.g. 'Full Stack Developer'" 
                value={formData.ultimateGoal}
                onChange={(e) => updateForm('ultimateGoal', e.target.value)}
                onBlur={() => { if (formData.ultimateGoal && step === 3) handleNext(); }}
              />
            </motion.div>
          )}

          {step >= 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 mt-6"
            >
              <Label htmlFor="timeframe" className="text-sm font-medium text-zinc-300">4. Timeframe</Label>
              <Select onValueChange={(val) => updateForm('timeframe', val as string)} value={formData.timeframe}>
                <SelectTrigger id="timeframe">
                  <SelectValue placeholder="Select a realistic timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 Week">1 Week</SelectItem>
                  <SelectItem value="2 Weeks">2 Weeks</SelectItem>
                  <SelectItem value="1 Month">1 Month</SelectItem>
                  <SelectItem value="3 Months">3 Months</SelectItem>
                  <SelectItem value="6 Months">6 Months</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}

        </AnimatePresence>

        <div className="pt-6">
          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
            <Button 
              className="w-full h-12 text-base mt-4 bg-white text-black hover:bg-white/90 transition-all duration-150 rounded-xl font-medium tracking-[-0.01em]" 
              size="lg" 
              disabled={!formData.domain || !formData.currentLevel || !formData.ultimateGoal || !formData.timeframe || isLoading}
              onClick={() => onGenerate(formData)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Roadmap...
                </>
              ) : (
                "Build My Roadmap"
              )}
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
