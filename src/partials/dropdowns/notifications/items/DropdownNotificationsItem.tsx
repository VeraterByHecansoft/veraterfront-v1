import { toAbsoluteUrl } from '@/utils';
import { Link } from 'react-router-dom';

interface IDropdownNotificationsItemProps {
  userName: string;
  avatar?: string;
  badgeColor: string;
  description: string;
  link?: { to: string, text: string };
  day?: string;
  date: string;
  info: string;
  onAcept?: () => void;
  onCancel?: () => void
}

const DropdownNotificationsItem = ({
  userName,
  avatar,
  badgeColor,
  description,
  link,
  day,
  date,
  info,
  onAcept,
  onCancel
}: IDropdownNotificationsItemProps) => {
  const handleAcept = (event:any)=>{
    onAcept?.()
  }
  const handleCancer = (event:any)=>{
    onCancel?.()
  }
  return (
    <div className="flex grow gap-2.5 px-5">
      <div className="relative shrink-0 mt-0.5">
        {avatar && <img
          src={avatar}
          className="rounded-full size-8"
          alt={`${userName} avatar`}
        />}
        <span
          className={`size-1.5 badge badge-circle ${badgeColor} absolute top-7 end-0.5 ring-1 ring-light transform -translate-y-1/2`}
        ></span>
      </div>
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <div className="text-2sm font-medium mb-px">
              <Link to="#" className="hover:text-primary-active text-gray-900 font-semibold">
                {userName}
              </Link>
              <span className="text-gray-700"> {description} </span>
              {link && <Link to={link.to} className="hover:text-primary-active text-primary">
                {link.text}
              </Link>}
              {day&&<span className="text-gray-700"> {day} </span>}
            </div>
            <span className="flex items-center text-2xs font-medium text-gray-500">
              {' '}
              {date}
              <span className="badge badge-circle bg-gray-500 size-1 mx-1.5"></span>
              {info}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
           {onCancel&& <button className="btn btn-light btn-sm" onClick={handleCancer}>Decline</button>}
            {onAcept&&<button className="btn btn-dark btn-sm" onClick={handleAcept}>Aceptar</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export { DropdownNotificationsItem };
