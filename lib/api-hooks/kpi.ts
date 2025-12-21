import { useQuery } from '@tanstack/react-query';

export interface KPIResponse {
  current_balance: number;
  total_purchased: number;
  resume_count: number;
  scan_count: number;
  interview_prep_count: number;
}

export interface KPIError {
  error: string;
  type?: string;
}

export function useGetKPI() {
  return useQuery<KPIResponse, KPIError>({
    queryKey: ['kpi'],
    queryFn: async (): Promise<KPIResponse> => {
      const response = await fetch('/api/kpi', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = (await response.json()) as KPIResponse | KPIError;

      if (!response.ok) {
        throw data as KPIError;
      }

      return data as KPIResponse;
    },
  });
}
