import { lazy, Suspense } from "react";
import useSWR from "swr";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type FinancialMovement,
  type KPIMetrics,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const IncomeOutcomeChart = lazy(() =>
  import("@/components/dashboard/income-outcome-chart").then((module) => ({
    default: module.IncomeOutcomeChart,
  })),
);
const ProfitPercentChart = lazy(() =>
  import("@/components/dashboard/profit-percent-chart").then((module) => ({
    default: module.ProfitPercentChart,
  })),
);

async function fetchFinancialData(url: string): Promise<FinancialMovement[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

function ChartFallback() {
  return (
    <Card className="border-border/60" aria-hidden="true">
      <CardHeader className="pb-4">
        <Skeleton className="h-5 w-52" />
        <Skeleton className="h-3 w-64 mt-1" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[280px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

function App() {
  const { data: movements, error } = useSWR(
    `${API_BASE_URL}/api/metrics`,
    fetchFinancialData,
    { shouldRetryOnError: false },
  );
  const metrics: KPIMetrics | null = movements
    ? computeKPIs(movements)
    : null;
  const monthlyData: MonthlyDataPoint[] = movements
    ? computeMonthlyData(movements)
    : [];
  const loading = !error && !movements;

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <DashboardHeader period="2024 - Full Year" />

          {error ? (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground"
            >
              <span lang="es">
                No se pudo cargar la informacion financiera. Revisa la API de
                backend.
              </span>
            </div>
          ) : null}

          <section aria-label="Key performance indicators">
            <KPIRow metrics={metrics} loading={loading} />
          </section>

          <section
            aria-label="Financial charts"
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
          >
            <Suspense fallback={<ChartFallback />}>
              <IncomeOutcomeChart data={monthlyData} loading={loading} />
            </Suspense>
            <Suspense fallback={<ChartFallback />}>
              <ProfitPercentChart data={monthlyData} loading={loading} />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
