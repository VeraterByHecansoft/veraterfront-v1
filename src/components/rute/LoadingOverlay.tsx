interface LoadingOverlayProps {
  isVisible: boolean;
  title?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  title = "Ejecutando..." 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-5 shadow-xl flex items-center space-x-3">
        {/* Spinner pequeño */}
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        
        {/* Título */}
        <span className="text-gray-800 font-medium">{title}</span>
      </div>
    </div>
  );
};

export default LoadingOverlay