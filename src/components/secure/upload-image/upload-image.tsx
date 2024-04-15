import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import TooltipComponent from '../../common/bootstrap-component/tooltip-component';
import { draggableBootstrapModal } from '../../common/modal/draggable-modal';

interface ImageCropperProps {
  id: string;
  imageSize: number;
  imageType: string[];
  handleImageUpload: (imageUrl: string) => void;
  maintainAspectRatio?: boolean;
}

const ImageCropper = (props: ImageCropperProps) => {
  const { t } = useTranslation();
  const [src, setSrc] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(Date.now());
  // const [crop, setCrop] = useState<Crop & { aspect?: number }>({ unit: 'px', width: 200, height: 200, x: 0, y: 0, aspect: props.maintainAspectRatio ? 1 : 1 });
  //const [crop, setCrop] = useState<Crop & { aspect?: number }>({ unit: 'px', width: 200, height: 200, x: 0, y: 0, aspect: 1 })
  const [crop, setCrop] = useState<Crop & { aspect?: number }>({
    unit: 'px', 
    width: 200, 
    height: 200, 
    x: 0, 
    y: 0,
    aspect: props.maintainAspectRatio ? 1 : undefined
  });

  useEffect(() => {
    setCrop((prevCrop) => ({ ...prevCrop, aspect: props.maintainAspectRatio ? 1 : undefined }));
  }, [props.maintainAspectRatio]);
  const [showErrMsg, setShowErrMsg] = useState("")
  const [showSizeErrorMsg, setShowSizeErrorMsg] = useState("")
  const [showImageTypeErrorMsg, setShowImageTypeErrorMsg] = useState("")
  const [showCropBeforeEditErrorMsg, setShowCropBeforeEditErrorMsg] = useState("")
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | undefined>(undefined);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { isSessionExpired } = useSelector((state: any) => state.commonSlice);

  useEffect(() => {
    if (src && imageRef.current) {
      adjustCropDimensions(imageRef.current);
    }
  }, [src]);

  useEffect(() => {
    const modalElement = document.getElementById(props.id);
    if (modalElement) {
      draggableBootstrapModal(modalElement);
      modalElement.addEventListener('hidden.bs.modal', function () {
        // Reset the state here
        setSrc(null);
        setCroppedImageUrl(undefined);
        setShowErrMsg("");
        setShowSizeErrorMsg("");
        setShowImageTypeErrorMsg("");
        setShowCropBeforeEditErrorMsg("");
        // Reset the input
        setInputKey(Date.now());
      });
    }
  }, [props.id]);

  const adjustCropDimensions = (image: HTMLImageElement) => {
    if(props.maintainAspectRatio){
      const minCropSize = Math.min(image.width, image.height) * 0.2; // Set minimum crop size as 20% of the smallest dimension
      setCrop((prevCrop:any) => ({
        ...prevCrop,
        width: minCropSize,
        height: minCropSize,
      }));
    }else{
      const aspectRatio = image.width / image.height;
    const minCropSize = Math.min(image.width, image.height) * 0.2; // Set minimum crop size as 20% of the smallest dimension
    setCrop((prevCrop:any) => ({
      ...prevCrop,
      width: minCropSize,
      height: minCropSize / aspectRatio,
    }));
    }
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowErrMsg("");
    setShowSizeErrorMsg("");
    setShowImageTypeErrorMsg("");
    setShowCropBeforeEditErrorMsg("");
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if(selectedFile.size >  props.imageSize){
        setShowSizeErrorMsg(t('message.file_size_1MB_error'))
        e.target.value = ""
        return
      }

      if (!props.imageType.includes(selectedFile.type)) {
        setShowImageTypeErrorMsg(t('message.file_type_JPEG_JPG_PNG_error'))
        e.target.value = ""
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setSrc(e.target.result);
          // Reset croppedImageUrl when a new image is selected
          setCroppedImageUrl(undefined);
        }
      };
      reader.onerror = () => {
        setShowCropBeforeEditErrorMsg(t('message.file_read_error'))
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  

  // const onCropChange = (newCrop: Crop) => {
  //   setShowCropBeforeEditErrorMsg("");
  //   if (imageRef.current) {
  //     const imageWidth = imageRef.current.width;
  //     const imageHeight = imageRef.current.height;
  
  //     // Ensure the crop area does not exceed the image boundaries
  //     if (newCrop.x + newCrop.width > imageWidth) {
  //       newCrop.width = imageWidth - newCrop.x;
  //     }
  //     if (newCrop.y + newCrop.height > imageHeight) {
  //       newCrop.height = imageHeight - newCrop.y;
  //     }
  //   }
  
  //   if(props.maintainAspectRatio){
  //     const { width, height } = newCrop;
  //     let newWidth = width;
  //     let newHeight = height;
  
  //     // Ensure the width and height maintain a square aspect ratio
  //     const aspectRatio = 1; // Square aspect ratio
  //     if (newWidth !== newHeight) {
  //       newHeight = newWidth;
  //       newWidth = newHeight;
  //     }
  //     console.log(newWidth, newHeight);
  
  //     // Update the crop state, omitting 'width' and 'height' to prevent duplication
  //     setCrop({
  //       ...newCrop,
  //       width: newWidth,
  //       height: newHeight
  //     });
  //   }else{
  //     setCrop(newCrop);
  //   }
  // };






  const [prevCrop, setPrevCrop] = useState<Crop>({ unit: 'px', width: 50, height: 50, x: 0, y: 0 });


  
  // const onCropChange = (newCrop: Crop) => {
  //   setShowCropBeforeEditErrorMsg("");
  //   if (imageRef.current) {
  //     const imageWidth = imageRef.current.width;
  //     const imageHeight = imageRef.current.height;
  
  //     // Ensure the crop area does not exceed the image boundaries
  //     if (newCrop.x + newCrop.width > imageWidth) {
  //       newCrop.width = imageWidth - newCrop.x;
  //     }
  //     if (newCrop.y + newCrop.height > imageHeight) {
  //       newCrop.height = imageHeight - newCrop.y;
  //     }
  //   }
  
  //   if(props.maintainAspectRatio){
  //     const { width, height } = newCrop;
  //     let newWidth = width;
  //     let newHeight = height;
  
  //     // Determine which dimension was changed
  //     if (width !== prevCrop.width) {
  //       // Width was changed, adjust height to match
  //       newHeight = newWidth;
  //     } else if (height !== prevCrop.height) {
  //       // Height was changed, adjust width to match
  //       newWidth = newHeight;
  //     }
  
  //     // Update the crop state, omitting 'width' and 'height' to prevent duplication
  //     setCrop({
  //       ...newCrop,
  //       width: newWidth,
  //       height: newHeight
  //     });
  
  //     // Update the previous crop state
  //     setPrevCrop(newCrop);
  //   }else{
  //     setCrop(newCrop);
  //     setPrevCrop(newCrop);
  //   }
  // };





  const onCropChange = (newCrop: Crop) => {
    setShowCropBeforeEditErrorMsg("");
    if (imageRef.current) {
      const imageWidth = imageRef.current.width;
      const imageHeight = imageRef.current.height;
  
      // Ensure the crop area does not exceed the image boundaries
      if (newCrop.x + newCrop.width > imageWidth) {
        newCrop.width = imageWidth - newCrop.x;
      }
      if (newCrop.y + newCrop.height > imageHeight) {
        newCrop.height = imageHeight - newCrop.y;
      }
    }
  
    if(props.maintainAspectRatio){
      const { width, height } = newCrop;
      let newWidth = width;
      let newHeight = height;
  
      // Determine which dimension was changed
      if (width !== prevCrop.width) {
        // Width was changed, adjust height to match
        newHeight = newWidth;
      } else if (height !== prevCrop.height) {
        // Height was changed, adjust width to match
        newWidth = newHeight;
      }
  
      // Ensure the new width and height do not exceed the image boundaries
      if (imageRef.current) {
        const imageWidth = imageRef.current.width;
        const imageHeight = imageRef.current.height;
        if (newCrop.x + newWidth > imageWidth) {
          newWidth = imageWidth - newCrop.x;
          newHeight = newWidth; // Keep aspect ratio
        }
        if (newCrop.y + newHeight > imageHeight) {
          newHeight = imageHeight - newCrop.y;
          newWidth = newHeight; // Keep aspect ratio
        }
      }
  
      // Update the crop state, omitting 'width' and 'height' to prevent duplication
      setCrop({
        ...newCrop,
        width: newWidth,
        height: newHeight
      });
  
      // Update the previous crop state
      setPrevCrop(newCrop);
    }else{
      setCrop(newCrop);
      setPrevCrop(newCrop);
    }
  };










  const onCropComplete = async (crop: Crop) => {
    if(imageRef.current && crop.width && crop.height){
      let scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      let scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      let cropX = crop.x! * scaleX;
      let cropY = crop.y! * scaleY;
      let cropWidth = crop.width! * scaleX;
      let cropHeight = crop.height! * scaleY;
      let size = Math.min(cropWidth, cropHeight);
      if (cropWidth > cropHeight) {
        cropX += (cropWidth - size) / 2;
        cropWidth = size;
      } else {
        cropY += (cropHeight - size) / 2;
        cropHeight = size;
      }
      const cropToPass = props.maintainAspectRatio ?  { unit: 'px',  x: cropX, y: cropY, width: cropWidth, height: cropHeight } as Crop : crop
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        cropToPass,
        'cropped-image'
      );
      setCroppedImageUrl(croppedImageUrl);
      
    }
    
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: Crop,
    fileName: string
  ): Promise<string | undefined> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setShowErrMsg(t('message.error_try_again'))
      return;
    }
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
  
    canvas.width = crop.width || 200;
    canvas.height = crop.height || 200;

    ctx.drawImage(
      image,
      props.maintainAspectRatio? crop.x!: crop.x! * scaleX,
      props.maintainAspectRatio? crop.y!: crop.y! * scaleY,
      props.maintainAspectRatio? crop.width!: crop.width! * scaleX,
      props.maintainAspectRatio? crop.height!: crop.height! * scaleY,
      0,
      0,
      crop.width || 200,
      crop.height || 200
    );
    return new Promise<string | undefined>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          setShowErrMsg(t('message.error_try_again'))
          resolve(undefined);
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          }
        };
        reader.onerror = () => {
          setShowErrMsg(t('message.error_try_again'))
        };
        reader.readAsDataURL(blob);
      }, 'image/png'); 
    });
    
  };

  const handleUpload = async () => {
    if(!croppedImageUrl){
      setShowCropBeforeEditErrorMsg(t('message.file_crop_image_error'))
      return
    }
    props.handleImageUpload(croppedImageUrl);
  };

  return (
    <div className="modal fade modal-draggable" data-bs-backdrop="false" id={props.id} tabIndex={-1} aria-labelledby={`${props.id}Label`} aria-hidden="true">
      <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`${props.id}Label`}>
                {t('modals.image_crop.title')}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="imageUpload" className="form-label">{t('inputs.file.upload_image.label')}</label>
                <input id="imageUpload" type="file" key={inputKey} className="form-control" onChange={onSelectFile} />
                {
                  showImageTypeErrorMsg && (<small id="imageUpload" className="form-text text-danger">{showImageTypeErrorMsg}</small>)
                }
                {
                  showCropBeforeEditErrorMsg && (<div className='mb-2'><small id="imageUpload" className="form-text text-danger">{showCropBeforeEditErrorMsg}</small></div>)
                }
                {
                  showSizeErrorMsg && (<div className='mb-2'><small id="imageUpload" className="form-text text-danger">{showSizeErrorMsg}</small></div>)
                }
                {
                  showErrMsg && (<div className='mb-2'><small id="imageUpload" className="form-text text-danger">{showErrMsg}</small></div>)
                }
                
              </div>
            </div>

            {src && (
              <div className="row">
                <div className="col-lg-12 mb-3 text-center">
                  <TooltipComponent title={t('buttons.save_crop.tooltip')}>
                    <button className="btn btn-primary" onClick={handleUpload}>
                      {t('buttons.save_crop.label')}
                    </button>
                  </TooltipComponent>
                </div>

                <div className="col-md-6">
                    <ReactCrop
                      crop={crop}
                      ruleOfThirds
                      onComplete={onCropComplete}
                      onChange={onCropChange}
                    >
                      <img src={src} alt="Cropped" ref={imageRef} className="w-100"/>
                    </ReactCrop>
                </div>
                <div className="col-md-6">
                    <div>
                      {
                        croppedImageUrl && (<img src={croppedImageUrl} alt="Cropped" className="img-fluid mb-3"/>)
                      }
                    </div>
                </div>
              </div>
              )}
              {isSessionExpired && 
                <div className="row">
                  <div className="col">
                    <p className="mt-3">{t('image_crop.auth_msg')}</p>
                  </div>
                </div>
              }
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{t('buttons.close.label')}</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;