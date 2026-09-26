
export const SkeletonTable = () => {

    return (<div className="felx p-4 bg-gray-200 rounded-md ">
        {/* Fila 1 */}
        <div className="flex gap-4 animate-bounce items-center justify-between p-2  dark:bg-gray-700 rounded-sm">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
        </div>

        {/* Fila 2 */}
        <div className="flex gap-4 animate-bounce items-center justify-between p-2 dark:bg-gray-700 rounded-sm">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
        </div>
    </div>)
}