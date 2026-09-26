

export const SkeletonTable = () => {

    return (<div className="animate-pulse space-y-4">
        {/* Fila 1 */}
        <div className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
        </div>

        {/* Fila 2 */}
        <div className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
        </div>

        {/* Fila 3 */}
        <div className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
        </div>

        {/* Añade más filas según sea necesario */}
    </div>)
}