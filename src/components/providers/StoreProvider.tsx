"use client";

import { Provider } from "react-redux";
import { store } from "@/stores/store";
import type { ReactNode } from "react";

export function StoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
