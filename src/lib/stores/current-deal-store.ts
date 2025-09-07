import { type DealsResponse } from "../pocketbase-types";
import { create } from 'zustand';
import { updateCurrentDeal } from "../api/api";

interface CurrentDealStore {
    currentDeal: DealsResponse | null;
    currentDealId: string | null;
    setCurrentDeal: (deal: DealsResponse) => Promise<void>;
    setCurrentDealId: (id: string) => Promise<void>;
}

export const useCurrentDealStore = create<CurrentDealStore>((set, get) => ({
    currentDeal: null,
    currentDealId: null,
    setCurrentDeal: async (deal: DealsResponse) => {
        set({ currentDeal: deal });
        console.log(get().currentDealId)
        if (get().currentDealId && deal) {
            try {
                await updateCurrentDeal(get().currentDealId!, deal.id);
            } catch (error) {
                console.error('Failed to update deal in database:', error);
            }
        }
    },
    setCurrentDealId: async (id: string) => {
        set({ currentDealId: id });
    },
}));
