// navigation — lets a page link to any other page in the handoff site. This is
// what turns a set of documents into a connected system: a component page can
// point back at the flow step it belongs to, a flow step can open the screen
// that implements it, and a screen can open the component it is built from.
//
// Pages address each other by *label*, so a target reads like
// `{ page: 'Screens' }` rather than an internal path.

import { createContext, useContext, type ReactNode } from 'react';

export interface NavTarget {
  /** Feature id. Omit to stay inside the current feature. */
  feature?: string;
  /** Page label to open, e.g. 'User flow' or 'NameField'. */
  page?: string;
  /** Open the feature's markdown context page instead of a story page. */
  context?: boolean;
  /** Return to the hub. */
  home?: boolean;
}

export type Navigate = (target: NavTarget) => void;

const NavigateContext = createContext<Navigate>(() => {
  /* no-op outside a provider */
});

export function NavigationProvider({
  navigate,
  children,
}: {
  navigate: Navigate;
  children: ReactNode;
}) {
  return <NavigateContext.Provider value={navigate}>{children}</NavigateContext.Provider>;
}

/** Navigate to another page of the handoff site. */
export function useHandoffNav(): Navigate {
  return useContext(NavigateContext);
}
