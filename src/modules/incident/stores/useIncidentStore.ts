import { create } from 'zustand'

interface IncidentTarget {
  sessionId: string
  sessionLabel: string
}

interface IncidentState {
  open: boolean
  target: IncidentTarget | null
  openModal: (target: IncidentTarget) => void
  closeModal: () => void
}

export const useIncidentStore = create<IncidentState>((set) => ({
  open: false,
  target: null,
  openModal: (target) => set({ open: true, target }),
  closeModal: () => set({ open: false, target: null }),
}))
