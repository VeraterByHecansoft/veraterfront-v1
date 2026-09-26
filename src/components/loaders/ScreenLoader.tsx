import { toAbsoluteUrl } from '@/utils';

const ScreenLoader = () => {
  return (
    <div className="flex flex-col items-center gap-4 justify-center fixed inset-0 z-50 bg-light transition-opacity duration-700 ease-in-out">
      {/* Logo con animación de pulso */}
      <div className="relative">
        <img
          className="h-[100px] max-w-none animate-[pulse_1.5s_ease-in-out_infinite]"
          src={toAbsoluteUrl('/media/app/mini-logo.svg')}
          alt="logo"
        />
        {/* Efecto de halo pulsante */}
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] transform scale-125"></div>
      </div>

      {/* Texto con animación de desvanecimiento */}
      <div className="text-gray-500 font-medium text-sm">
        <span className="inline-block animate-[fadeInOut_2s_ease-in-out_infinite]">
          Cargando
        </span>
        <span className="animate-[dots_2s_infinite]">...</span>
      </div>
    </div>
  );
};

export { ScreenLoader };
