import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ActionCenter } from "./components/ActionCenter";
import { StudentSelector } from "./components/StudentSelector";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zyra-600">
                Zyra Counselor
              </p>
              <h1 className="text-lg font-semibold text-zyra-900">
                Student Action Center
              </h1>
            </div>
            <StudentSelector />
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <ActionCenter />
        </main>
      </div>
    </QueryClientProvider>
  );
}
