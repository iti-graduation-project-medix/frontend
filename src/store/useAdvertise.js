import { create } from 'zustand'

export const useAdvertise = create((set) => ({
    advertise: null,
    setAdvertise: (values)=>set({advertise:values})
}))