import { CustomIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils/Assets';
import { ImageInput } from '@/components/image-input';
import type { IImageInputFile } from '@/components/image-input';
import { useEffect, useState } from 'react';


interface CrudImageUploadProps {
  onChangeImage?: (files: IImageInputFile[]) => void;
  dataURL?:string|undefined;
}
const CrudImageUpload: React.FC<CrudImageUploadProps> = ({
    onChangeImage,
    dataURL = ""
  }) => {
  
  const [image, setImage] = useState<IImageInputFile[]>([]);

  useEffect(() => {
    if (onChangeImage) {
      onChangeImage(image);
    }
  }, [image, onChangeImage,dataURL]);

  return (
    <ImageInput value={image} onChange={(selectedImage) => setImage(selectedImage)}>
      {({ onImageUpload }) => (
        <div className="image-input size-28" onClick={onImageUpload}>
         {image.length > 0 && <div
            className="btn btn-icon btn-icon-xs btn-light shadow-default absolute z-1 size-5 -top-0.5 -end-0.5 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setImage([]);
            }}
          >
            <CustomIcon icon="cross" />
          </div>}
          <span className="tooltip" id="image_input_tooltip">
            Click to remove or revert
          </span>
          <div
            className="image-input-placeholder  border-2 border-success image-input-empty:border-gray-300"
            style={{ backgroundImage: `url(${toAbsoluteUrl(dataURL||`/media/avatars/blank.png`)})` }}
          >
            { image.length > 0 && <img src={image[0].dataURL} alt="avatar" />}

          </div>
        </div>
      )}
    </ImageInput>
  );
};

export { CrudImageUpload };
