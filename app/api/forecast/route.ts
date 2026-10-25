import { NextResponse } from 'next/server';
import { forecastUnused, getYearEndRisk } from '@/lib/unusedForecast';

export async function POST(req: Request) {
  const { items } = await req.json();
  const forecasts = items.map((it:any)=>({ id: it.id, project_name: it.project_name, forecast: forecastUnused(it) }));
  const yearEnd = getYearEndRisk(items);
  return NextResponse.json({ forecasts, yearEnd });
}