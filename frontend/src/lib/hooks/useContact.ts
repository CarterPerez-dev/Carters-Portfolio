// ===========================
// Contact API Hooks
// ©AngelaMos | 2025
// ===========================

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { api, API_ENDPOINTS } from '@/lib/api';
import { CONTACT_MESSAGES } from '@/constants';
import type {
  ContactCreateRequest,
  ContactCreateResponse,
  ContactResponse,
  ContactListResponse,
} from '@/lib/types/api/contact';
import {
  isValidContactCreateResponse,
  isValidContactResponse,
  isValidContactListResponse,
  isContactErrorResponse,
} from '@/lib/types/guards/contact.guards';

export const contactQueryKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactQueryKeys.all, 'list'] as const,
  list: (limit?: number) =>
    [...contactQueryKeys.lists(), { limit }] as const,
  details: () => [...contactQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...contactQueryKeys.details(), id] as const,
};

export const contactQueries = {
  getContactList: async (limit?: number): Promise<ContactListResponse> => {
    const params = limit !== undefined ? { limit } : undefined;
    return api.get<ContactListResponse>(API_ENDPOINTS.contact.list, {
      params,
    });
  },

  getContactById: async (contactId: string): Promise<ContactResponse> => {
    return api.get<ContactResponse>(
      API_ENDPOINTS.contact.getById(contactId),
    );
  },
};

export const contactMutations = {
  submitContact: async (
    data: ContactCreateRequest,
  ): Promise<ContactCreateResponse> => {
    return api.post<ContactCreateResponse>(
      API_ENDPOINTS.contact.submit,
      data,
    );
  },
};

export const useSubmitContact = (): UseMutationResult<
  ContactCreateResponse,
  unknown,
  ContactCreateRequest
> => {
  const queryClient = useQueryClient();

  return useMutation<ContactCreateResponse, unknown, ContactCreateRequest>({
    mutationFn: async (
      data: ContactCreateRequest,
    ): Promise<ContactCreateResponse> => {
      const response = await contactMutations.submitContact(data);

      if (isValidContactCreateResponse(response)) {
        return response;
      }

      throw new Error(CONTACT_MESSAGES.ERROR.INVALID_SUBMISSION_RESPONSE);
    },

    onSuccess: (data: unknown) => {
      if (isValidContactCreateResponse(data)) {
        if (data.email_sent) {
          toast.success(CONTACT_MESSAGES.SUCCESS.EMAIL_SENT);
        } else {
          toast.success(CONTACT_MESSAGES.SUCCESS.EMAIL_FAILED);
        }

        void queryClient.invalidateQueries({
          queryKey: contactQueryKeys.lists(),
        });
      } else {
        toast.error(CONTACT_MESSAGES.ERROR.UNEXPECTED_FORMAT);
      }
    },

    onError: (error: unknown): void => {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as unknown;

        if (isContactErrorResponse(errorData)) {
          toast.error(errorData.error);
          return;
        }

        if (
          errorData &&
          typeof errorData === 'object' &&
          'message' in errorData
        ) {
          const apiError = errorData as { message: unknown };
          if (
            typeof apiError.message === 'string' &&
            apiError.message.length > 0
          ) {
            toast.error(apiError.message);
            return;
          }
        }
      }

      const fallbackMessage =
        error instanceof Error
          ? error.message
          : CONTACT_MESSAGES.ERROR.SEND_FAILED;
      toast.error(fallbackMessage);
    },
  });
};

export const useContactList = (
  limit?: number,
): UseQueryResult<ContactListResponse, unknown> => {
  return useQuery({
    queryKey: contactQueryKeys.list(limit),
    queryFn: async (): Promise<ContactListResponse> => {
      const response = await contactQueries.getContactList(limit);

      if (isValidContactListResponse(response)) {
        return response;
      }

      throw new Error(CONTACT_MESSAGES.ERROR.INVALID_LIST_RESPONSE);
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useContactById = (
  contactId: string,
): UseQueryResult<ContactResponse, unknown> => {
  return useQuery({
    queryKey: contactQueryKeys.detail(contactId),
    queryFn: async (): Promise<ContactResponse> => {
      const response = await contactQueries.getContactById(contactId);

      if (isValidContactResponse(response)) {
        return response;
      }

      throw new Error(CONTACT_MESSAGES.ERROR.INVALID_CONTACT_RESPONSE);
    },
    enabled:
      contactId !== undefined && contactId !== null && contactId.length > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
