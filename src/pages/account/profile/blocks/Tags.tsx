import clsx from 'clsx';
import { FormattedMessage } from 'react-intl';

interface ITagsItem {
  label: string|undefined;
}
interface ITagsItems extends Array<ITagsItem> {}

interface ITagsProps {
  title: string;
  items?: ITagsItems;
  className?: string;
}

const Tags = ({ title, className, items }: ITagsProps) => {

  const renderItem = (item: ITagsItem, index: number) => {
    return (
      <span key={index} className="badge badge-sm badge-gray-200">
        {item.label}
      </span>
    );
  };

  return (
    <div className={clsx('card', className && className)}>
      <div className="card-header">
        <h3 className="card-title"><FormattedMessage id={title} /></h3>
      </div>

      <div className="card-body">
        <div className="flex flex-wrap gap-2.5 mb-2">
          {items && items.map((item, index) => {
            return renderItem(item, index);
          })}
        </div>
      </div>
    </div>
  );
};

export { Tags, type ITagsItem, type ITagsItems, type ITagsProps };
