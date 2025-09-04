import { type DealsResponse } from "../pocketbase-types";
import { create } from 'zustand';
import { getCurrentDeal, updateCurrentDeal } from "../api/api";

interface CurrentDealStore {
    currentDeal: DealsResponse | null;
    currentDealId: string | null;
    setCurrentDeal: (deal: DealsResponse) => Promise<void>;
    fetchCurrentDeal: () => Promise<void>;
}

export const useCurrentDealStore = create<CurrentDealStore>((set, get) => ({
    currentDeal: null,
    currentDealId: null,
    setCurrentDeal: async (deal: DealsResponse) => {
        set({ currentDeal: deal });
        set({ currentDealId: deal.id });
        if (get().currentDealId && deal) {
            try {
                await updateCurrentDeal(get().currentDealId!, deal.id);
            } catch (error) {
                console.error('Failed to update deal in database:', error);
            }
        }
    },
    fetchCurrentDeal: async () => {
        try {
            const currentDeal = await getCurrentDeal()
            set({ currentDeal: currentDeal.expand.deal });
        } catch (error) {
            console.error('Failed to fetch current deal:', error);
            set({ currentDeal: null });
        }
    },
}));

useCurrentDealStore.getState().fetchCurrentDeal();