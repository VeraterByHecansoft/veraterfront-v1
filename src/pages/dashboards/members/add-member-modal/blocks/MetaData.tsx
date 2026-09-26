import { CrudAvatarUpload } from '@/partials/crud';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CustomIcon } from '@/components';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { isAxiosError, useAuthContext } from '@/auth';
import { delay } from '@/utils';
import { IImageInputFile } from '@/components/image-input';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useAPIContext } from '@/auth/useAPIContext';

const MetaData = () => {
  const {putMultipart} = useAPIContext()
  const { user } = useAuthContext();
  const [avatar, setAvatar] = useState<IImageInputFile | undefined>(undefined);
  const [avatarP, setAvatarP] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(new Date(1984, 0, 20));
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');

  const [ageInput, setAgeInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [StateInput, setStateInput] = useState('');
  const [CountryInput, setCountryInput] = useState('');
  const [postcodeInput, setPostcodeInput] = useState('');
  const [phoneInput, sePhoneInput] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{;
  },[user])

  const handleSubmit = async (data:any) => {
    try {
      const formData = new FormData();
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('metadata', JSON.stringify(data.metadata));
      if (avatar?.file) {
        formData.append('avatar', avatar?.file);
      }
      await delay(300);
      const response = await putMultipart('user/',formData);
      if(isAxiosError(response)){
        const rs = response as AxiosError<any>;
        setSaving(false);
        setError(`${rs.response?.data?.message}`);
        setTimeout(()=>{
          setSaving(false);
          setError(null);
        },1200)
      } else {
        const rs = response as AxiosResponse<any>;
        setMessage(rs?.data?.message);
        setTimeout(()=>{
          setSaving(false);
          setError(null);
          setMessage(null)
        },1200);
      }
    } catch (err: any) {
      setSaving(false);
      setError(`${err.response || err}`)
    }
  };

  const handleSave = async () => {
    if (error) return;
    setSaving(true);
    try {
      const data = {
        first_name:nameInput,
        last_name:lastNameInput,
        metadata:{
          Age:ageInput,
          City:cityInput,
          State:StateInput,
          Country:CountryInput,
          Postcode:postcodeInput,
          phone:phoneInput,
          BirthDate:date?.getTime()
        }
      }
      await handleSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el correo');
    } finally {
      setSaving(false);
    }
  };
  const handleChangeAvatar = (files: IImageInputFile[]) =>{
    if(files.length==1){
      setAvatar(files[0]);
    }
  }
  return (
    <div className="card pb-2.5">
      <div className="card-header" id="basic_settings">
        <h3 className="card-title">Datos del miembro</h3>
        {error&& (
          <span role="alert" className="text-danger text-xs mt-1">
            {error}
          </span>
        )}
        {message&& (
          <span role="alert" className="text-success text-xs mt-1">
            {message}
          </span>
        )}
      </div>
      <div className="card-body grid gap-5">
  
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">City</label>
            <input
              className="input"
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
            /> 
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">State</label>
            <input
              className="input"
              type="text"
              value={StateInput}
              onChange={(e) => setStateInput(e.target.value)}
            /> 
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Country</label>
            <input
              className="input"
              type="text"
              value={CountryInput}
              onChange={(e) => setCountryInput(e.target.value)}
            /> 
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Postcode</label>
            <input
              className="input"
              type="text"
              value={postcodeInput}
              onChange={(e) => setPostcodeInput(e.target.value)}
            /> 
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Birth Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="date"
                  className={cn(
                    'input data-[state=open]:border-primary',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CustomIcon icon="calendar" className="-ms-0.5" />
                  {date ? format(date, 'LLL dd, y') : <span>Pick a date</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  fromYear={1950}           
                  toYear={new Date().getFullYear() + 5} 
                  initialFocus
                  captionLayout="dropdown" 
                  mode="single" // Single date selection
                  defaultMonth={date}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Rol</label>
            <input
              className="input"
              type="text"
              readOnly={true}
              value={user?.tipo}
            />  
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label flex items-center gap-1 max-w-56">Email</label>
            <input
              className="input"
              type="text"
              readOnly={true}
              value={emailInput}
            />  
          </div>
        </div>
        {/* <div className="flex items-center flex-wrap gap-2.5">
          <label className="form-label max-w-56">Visibility</label>
          <div className="grow">
            <Select defaultValue="1">
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Public</SelectItem>
                <SelectItem value="2">Option 2</SelectItem>
                <SelectItem value="3">Option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div> */}
        {/* 
        <div className="flex items-center flex-wrap gap-2.5">
          <label className="form-label max-w-56">Avaibality</label>
          <div className="grow">
            <label className="switch">
              <span className="switch-label">Available to hire</span>
              <input type="checkbox" defaultChecked value="1" readOnly />
            </label>
          </div>
        </div> */}
        <div className="flex justify-end pt-2.5">
          <button 
            onClick={handleSave}
            disabled={!!error || saving }
            className="btn btn-primary">{saving ? 'Guardando...' : 'Save Changes'}</button>        
        </div>
      </div>
    </div>
  );
};

export { MetaData };
