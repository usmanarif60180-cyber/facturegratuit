"use client";

import { orderBy, savedDesignService } from "@/lib/services/savedDesignService";
import { useOrgCollection } from "./useOrgCollection";

export function useSavedDesigns() {
  return useOrgCollection(savedDesignService, [orderBy("updatedAt", "desc")]);
}
