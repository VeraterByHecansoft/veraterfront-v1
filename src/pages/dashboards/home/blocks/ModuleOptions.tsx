import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toAbsoluteUrl } from '@/utils';
import { getModules, ModuleAuthItem, ModuleAuthItems, useAuthContext } from '@/auth';



const ModuleOptions = () => {
  // const [options, setMenuOptions] = useState<ModuleAuthItems | undefined>(modulos);
  const options = getModules()
  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, idx) => (
      <div
        key={idx}
        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow animate-pulse flex flex-col items-center space-y-2"
      >
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    ));
  };

  const renderItem = (item: ModuleAuthItem, index: number) => {
    return (
      <div
        key={index}
        className="card px-5 lg:px-7.5 h-full bg-[length:85%] [background-position:9rem_-4rem] rtl:[background-position:-4rem_-4rem] bg-no-repeat channel-stats-bg"
      >
        <div className="flex flex-col gap-4 pt-6">
          <Icon icon={item.icon} className="w-6 h-6 mr-2 text-gray-600" />
          <div className="flex flex-col gap-2.5 mb-2">
            <h3 className="text-base font-medium leading-none text-gray-900">{item.title}</h3>
            <span className="text-2sm text-gray-800 leading-5">{item.description}</span>
          </div>
        </div>
        <div className="flex mb-4 items-center gap-1 cursor-pointer">
          <Link to={`${item.path}`} className="btn text-primary hover:text-primary-active px-0">
            Ver más
          </Link>
          <Icon icon="right" className="text-primary text-xs" />
        </div>
      </div>
    );
  };

  useEffect(() => {

  }, []);

  return (
    <Fragment>
      <style>
        {`
          .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3.png')}');
          }
          .dark .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3-dark.png')}');
          }
        `}
      </style>
      {!options ? (
        renderSkeletons()
      ) : options.length > 0 ? (
        options.map(renderItem)
      ) : (
        <div className="p-4 text-center text-gray-500">
          No hay módulos disponibles
        </div>
      )}
    </Fragment>
  );
};

export { ModuleOptions };
