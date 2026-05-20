import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@shared/config/api-client'
import type { InstructorProfile } from '@shared/types/domain'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get<InstructorProfile>('/instructor/profile'),
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<InstructorProfile>) =>
      api.patch<InstructorProfile>('/instructor/profile', payload),
    onSuccess: (data) => {
      qc.setQueryData(['profile'], data)
      qc.invalidateQueries({ queryKey: ['home', 'dashboard'] })
    },
  })
}

export function useUploadAvatar() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData()
      form.set('file', file)
      return api.postMultipart<{ avatarUrl: string }>(
        '/instructor/profile/avatar',
        form
      )
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
