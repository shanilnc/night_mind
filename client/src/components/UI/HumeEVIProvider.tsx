import React from "react";
import { VoiceProvider } from "@humeai/voice-react";

interface HumeEVIProviderProps {
  children: React.ReactNode;
  accessToken: string | null;
}

export function HumeEVIProvider({
  children,
  accessToken,
}: HumeEVIProviderProps) {
  if (!accessToken) {
    return <div>Loading voice chat...</div>;
  }

  return (
    <VoiceProvider auth={{ type: "accessToken", value: accessToken }}>
      {children}
    </VoiceProvider>
  );
}
