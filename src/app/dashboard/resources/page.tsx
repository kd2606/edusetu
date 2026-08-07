'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, ExternalLink, BookOpen } from 'lucide-react';

const CURATED_RESOURCES = [
  {
    title: 'NCERT Class 12 Physics (Part 1)',
    category: '12th Board',
    type: 'PDF',
    size: '15 MB',
    url: '#',
  },
  {
    title: 'HC Verma - Concepts of Physics (Vol 1)',
    category: 'JEE (Mains/Advanced)',
    type: 'Book / PDF',
    size: '42 MB',
    url: '#',
  },
  {
    title: 'Indian Polity by M. Laxmikanth',
    category: 'UPSC / State PSC',
    type: 'Book',
    size: 'External Link',
    url: '#',
  },
  {
    title: 'React Official Documentation',
    category: 'Tech Skill',
    type: 'Docs',
    size: 'External Link',
    url: 'https://react.dev',
  }
];

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">Digital Library</h1>
          <p className="text-on-surface-variant mt-2">Curated books, PDFs, and official documentation.</p>
        </div>
        <Button variant="outline" className="gap-2 border-outline">
          <Download className="w-4 h-4" />
          Upload Resource (Coming Soon)
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CURATED_RESOURCES.map((resource, i) => (
          <Card key={i} className="bg-surface border border-outline-variant shadow-e1 group hover:border-outline transition-all">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-surface-high rounded-lg">
                  {resource.type.includes('PDF') ? <FileText className="w-5 h-5 text-primary" /> : <BookOpen className="w-5 h-5 text-progress" />}
                </div>
                <span className="text-[10px] font-medium px-2 py-1 bg-surface-high rounded-md text-on-surface-muted">
                  {resource.category}
                </span>
              </div>
              <CardTitle className="text-base font-semibold leading-tight text-on-surface">
                {resource.title}
              </CardTitle>
              <CardDescription className="text-xs text-on-surface-variant mt-1">
                {resource.type} • {resource.size}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2 bg-surface-high text-on-surface hover:bg-surface border border-outline shadow-sm" variant="secondary">
                {resource.type.includes('External') ? (
                  <>Open Link <ExternalLink className="w-3 h-3 ml-1" /></>
                ) : (
                  <>Download <Download className="w-3 h-3 ml-1" /></>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
