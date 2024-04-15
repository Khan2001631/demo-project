import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IFileData {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  file: string;
}
interface IFileObject {
  FILE_TYPE: string[];
  FILE_SIZE: number;
  FILE_TYPE_ERROR_MSG: string;
  FILE_SIZE_ERROR_MSG: string;
}
interface FileUploaderProps {
  expectedFileObject: IFileObject;
  handleFileUpload: (data: IFileData) => void;
  showUploadButton: boolean;
  isFileInputRequired: boolean;
}
const FileUploadComponent: React.FC<FileUploaderProps> = (props: FileUploaderProps) => {
  const { t } = useTranslation();
  const { FILE_TYPE, FILE_SIZE, FILE_TYPE_ERROR_MSG, FILE_SIZE_ERROR_MSG } = props.expectedFileObject;
  const [showErrorMsg, setShowErrorMsg] = useState("")
  const [selected, setSelected] = useState<IFileData | undefined>(undefined);
  
  //input file onchange function 
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowErrorMsg("");
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];

      // if (props.isFileInputRequired && !selectedFile) {console.log("in if")
      //   setShowErrorMsg(t('message.file_required'));
      //   return;
      // }
      if (selectedFile.size > FILE_SIZE) {
        setShowErrorMsg(FILE_SIZE_ERROR_MSG);
        event.target.value = "";
        return;
      }
      if (!FILE_TYPE.includes(selectedFile.type)) {
        setShowErrorMsg("The file must be in CSV format");
        event.target.value = "";
        return;
      }
  
      let reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const selectedFileData = {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          lastModified: selectedFile.lastModified,
          file: dataUrl,
        };
        setSelected(selectedFileData);
        if(!props.showUploadButton){
          props.handleFileUpload(selectedFileData);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleUpload = async () => {
    if(!selected){
      setShowErrorMsg("Please select any document to upload.")
      return;
    }
    props.handleFileUpload(selected);
  };

  return (
    <div className='row'>
      <div className='col-lg-12'>
        <div>
            <label htmlFor='fileInput' className='fw-bold'>
              {t('inputs.file.upload.label')}
              {props.isFileInputRequired &&
                <span className='text-danger'>*</span>
              }
            </label>
            <input type='file' className='form-control'
              required={props.isFileInputRequired}
              id='fileInput' 
              onChange={handleFileChange} 
            />
        </div>
        <div className='mt-1'>
          {
            showErrorMsg && (
              <div className='mb-2'>
                <small id="imageUpload" className="form-text text-danger">
                  {showErrorMsg}
                </small>
              </div>
            )
          }
          {props.showUploadButton && (
            <div className='text-center'>
              <button type="submit" className="btn btn-primary btn-md rounded-pill px-4 mt-2" onClick={handleUpload} >
                {t('buttons.upload.label')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadComponent;