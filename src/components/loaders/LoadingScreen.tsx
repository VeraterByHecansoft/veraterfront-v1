import { toAbsoluteUrl } from '@/utils';
import React, { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [dots, setDots] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev + 1) % 4);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 justify-center fixed inset-0 z-50 bg-light transition-opacity duration-700 ease-in-out">
      {/* Contenedor de logo con animaciones */}
      <div className="relative">
        {/* Logo con animación de pulso */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping"></div>
          <img
            className="h-24 max-w-none animate-pulse"
            src={toAbsoluteUrl('/media/app/mini-logo.svg')}
            alt="logo"
          />
        </div>
        
        {/* Partículas flotantes alrededor del logo */}
        {/* <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-3 h-3 rounded-full bg-blue-500"
              style={{
                top: `${Math.sin(i * Math.PI/2) * 40}px`,
                left: `${Math.cos(i * Math.PI/2) * 40}px`,
                animation: `float 2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div> */}
      </div>
      
      {/* Barra de progreso animada */}
      {/* <div className="mt-4 w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500" style={{
          animation: 'loader 1.5s ease-in-out infinite'
        }}></div>
      </div> */}
      
      {/* Texto con animación */}
      <div className="text-gray-500 dark:text-gray-400 font-medium text-sm">
        <span className="inline-block animate-pulse">Cargando</span>
        {/* Puntos animados */}
        {Array.from({ length: dots }).map((_, i) => (
          <span key={i} className="inline-block" style={{
            animation: 'bounce 0.8s ease-in-out infinite'
          }}>.</span>
        ))}
      </div>
      
      {/* Definición de animaciones en estilo inline */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-15px) scale(1.1); opacity: 1; }
        }
        
        @keyframes loader {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export {LoadingScreen};