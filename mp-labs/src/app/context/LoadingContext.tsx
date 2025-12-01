'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Image from 'next/image';

type LoadingContextType = {
    showLoading: (message?: string) => void;
    hideLoading: () => void;
    isLoading: boolean;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Loading...');
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [showZs, setShowZs] = useState(false);

    useEffect(() => {
        const img = new window.Image();
        img.src = '/sleepy.png';
        img.onload = () => setIsImageLoaded(true);
    }, []);

    const showLoading = (message: string = 'Loading...') => {
        setLoadingMessage(message);
        setIsLoading(true);
        setShowZs(false);
    };

    const hideLoading = () => {
        setIsLoading(false);
        setShowZs(false);
    };

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
            {children}
            {isLoading && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                    }}
                >
                    <div className="loading-container">
                        <Image 
                            src="/sleepy.png" 
                            alt={loadingMessage}
                            width={300} 
                            height={300}
                            priority
                            onLoad={() => {
                                setIsImageLoaded(true);
                                setTimeout(() => setShowZs(true), 100);
                            }}
                        />
                        {showZs && (
                            <div className="z-container">
                                <div className="z z-1">Z</div>
                                <div className="z z-2">Z</div>
                                <div className="z z-3">Z</div>
                                <div className="z z-4">Z</div>
                            </div>
                        )}
                    </div>
                    <p style={{ 
                        color: 'white', 
                        marginTop: '20px', 
                        fontSize: '18px',
                        fontWeight: 'bold' 
                        }}>
                        {loadingMessage}
                    </p>
                </div>
            )}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}