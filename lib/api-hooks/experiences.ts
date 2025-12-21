import { useQuery, useMutation } from '@tanstack/react-query';

export interface UserExperience {
  id: number;
  userId: number;
  company: string | null;
  position: string | null;
  location: string | null;
  employmentType: string | null;
  startDate: Date | null;
  endDate: Date | null;
  isCurrent: boolean;
  description: string | null;
  technologies: any | null;
  achievements: any | null;
  responsibilities: any | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperiencesResponse {
  data: UserExperience[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ExperiencesError {
  error: string;
  type?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface UseGetExperiencesParams {
  page?: number;
  limit?: number;
  isCurrent?: boolean;
  search?: string;
  sort?: 'latest' | 'oldest';
}

export interface CreateExperienceData {
  company: string;
  position: string;
  location?: string;
  employment_type?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  technologies?: string[];
  achievements?: string[];
  responsibilities?: string[];
}

export interface UpdateExperienceData {
  company?: string;
  position?: string;
  location?: string;
  employment_type?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  technologies?: string[];
  achievements?: string[];
  responsibilities?: string[];
}

export function useGetExperiences(params?: UseGetExperiencesParams) {
  return useQuery<ExperiencesResponse, ExperiencesError>({
    queryKey: ['experiences', params],
    queryFn: async (): Promise<ExperiencesResponse> => {
      // Build query string from params
      const searchParams = new URLSearchParams();

      if (params?.page) {
        searchParams.append('page', params.page.toString());
      }
      if (params?.limit) {
        searchParams.append('limit', params.limit.toString());
      }
      if (params?.isCurrent !== undefined) {
        searchParams.append('isCurrent', params.isCurrent.toString());
      }
      if (params?.search) {
        searchParams.append('search', params.search);
      }
      if (params?.sort) {
        searchParams.append('sort', params.sort);
      }

      const queryString = searchParams.toString();
      const url = `/api/experiences${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = (await response.json()) as ExperiencesResponse | ExperiencesError;

      if (!response.ok) {
        throw data as ExperiencesError;
      }

      return data as ExperiencesResponse;
    },
  });
}

export function useGetExperience(id: number) {
  return useQuery<UserExperience, ExperiencesError>({
    queryKey: ['experience', id],
    queryFn: async (): Promise<UserExperience> => {
      const response = await fetch(`/api/experiences/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = (await response.json()) as UserExperience | ExperiencesError;

      if (!response.ok) {
        throw data as ExperiencesError;
      }

      return data as UserExperience;
    },
    enabled: !!id, // Only run the query if id is provided
  });
}

export function useUpdateExperience(id: number) {
  return useMutation<UserExperience, ExperiencesError, UpdateExperienceData>({
    mutationFn: async (data: UpdateExperienceData): Promise<UserExperience> => {
      const response = await fetch(`/api/experiences/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as UserExperience | ExperiencesError;

      if (!response.ok) {
        throw result as ExperiencesError;
      }

      return result as UserExperience;
    },
  });
}

export function useDeleteExperience(id: number) {
  return useMutation<{ message: string }, ExperiencesError, void>({
    mutationFn: async (): Promise<{ message: string }> => {
      const response = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = (await response.json()) as { message: string } | ExperiencesError;

      if (!response.ok) {
        throw result as ExperiencesError;
      }

      return result as { message: string };
    },
  });
}

export function useCreateUserExperience() {
  return useMutation<UserExperience, ExperiencesError, CreateExperienceData>({
    mutationFn: async (data: CreateExperienceData): Promise<UserExperience> => {
      const response = await fetch('/api/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as UserExperience | ExperiencesError;

      if (!response.ok) {
        throw result as ExperiencesError;
      }

      return result as UserExperience;
    },
  });
}
