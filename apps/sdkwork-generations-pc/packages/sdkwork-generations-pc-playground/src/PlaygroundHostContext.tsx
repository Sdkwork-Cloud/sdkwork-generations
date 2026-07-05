import { createContext, useContext, type ReactNode } from 'react';
import type { PlaygroundHostPort } from './playground-host.ts';

const PlaygroundHostContext = createContext<PlaygroundHostPort | null>(null);

export function PlaygroundHostProvider({
  host,
  children,
}: {
  host: PlaygroundHostPort;
  children: ReactNode;
}) {
  return (
    <PlaygroundHostContext.Provider value={host}>
      {children}
    </PlaygroundHostContext.Provider>
  );
}

export function usePlaygroundHost(): PlaygroundHostPort {
  const host = useContext(PlaygroundHostContext);
  if (!host) {
    throw new Error('usePlaygroundHost requires PlaygroundHostProvider');
  }
  return host;
}

export function useOptionalPlaygroundHost(): PlaygroundHostPort | null {
  return useContext(PlaygroundHostContext);
}
