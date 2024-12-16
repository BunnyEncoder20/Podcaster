'use client';

import React, { useState, createContext, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";

// custom types
import { AudioContextType, AudioProps } from "@/types";

const AudioContext = createContext<AudioContextType | undefined>(undefined)

const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [audio, setAudio] = useState<AudioProps | undefined>()
    const pathname = usePathname();

    useEffect(() => {
        // when creating a new podcast, stop playing audio
        if (pathname === '/create-podcast') setAudio(undefined);
    },[pathname])

    return (
        <AudioContext.Provider value={{ audio, setAudio }}>
            { children }
        </AudioContext.Provider>
    )
}

// useAudio hook: return audio context
export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context){
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}

export default AudioProvider;