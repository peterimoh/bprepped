import { useQuery } from '@tanstack/react-query';

export interface Resume {
  id: number;
  title: string | null;
  templateId: number | null;
  atsScore: number | null;
  isActive: boolean;
  isDraft: boolean;
  lastEdited: Date | null;
  createdAt: Date;
}

export interface ResumesResponse {
  data: Resume[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ResumesError {
  error: string;
  type?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface UseGetResumesParams {
  page?: number;
  limit?: number;
  isDraft?: boolean;
  isActive?: boolean;
  search?: string;
  sort?: 'latest' | 'oldest';
}

export function useGetResumes(params?: UseGetResumesParams) {
  return useQuery<ResumesResponse, ResumesError>({
    queryKey: ['resumes', params],
    queryFn: async (): Promise<ResumesResponse> => {
      // Build query string from params
      const searchParams = new URLSearchParams();

      if (params?.page) {
        searchParams.append('page', params.page.toString());
      }
      if (params?.limit) {
        searchParams.append('limit', params.limit.toString());
      }
      if (params?.isDraft !== undefined) {
        searchParams.append('isDraft', params.isDraft.toString());
      }
      if (params?.isActive !== undefined) {
        searchParams.append('isActive', params.isActive.toString());
      }
      if (params?.search) {
        searchParams.append('search', params.search);
      }
      if (params?.sort) {
        searchParams.append('sort', params.sort);
      }

      const queryString = searchParams.toString();
      const url = `/api/resumes${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = (await response.json()) as ResumesResponse | ResumesError;

      if (!response.ok) {
        throw data as ResumesError;
      }

      return data as ResumesResponse;
    },
  });
}
