import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/constants';
import { UploadWidgetValue } from '@/types';
import { UploadCloud } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'

const UploadWidget = ({ value= null, onChange, disabled = false}) => {
  const widgetRef = useRef<CloudinaryWidget | null>(null); // Create a ref for the widget and hold it in state
  const onChangeRef = useRef(onChange); // Create a ref for the onChange prop and hold it in state
  
  const [preview, setPreview] = useState<UploadWidgetValue | null>(value); // Show value if it exists or default to NULL

  // const [ deleteToken, setDeleteToken ] = useState<string | null>(null);

  // const [isRemoving, setIsRemoving] = useState(false); //removing something on changing the UI

  useEffect( ()=> {
    setPreview(value);
    // if(!value) setDeleteToken(null);
  }, [value]); // Widget opens up whenever the value changes
  
  useEffect( ()=>{ // Goal is to always have the onChange prop up to date
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(()=>{ // Initialize useEffect on Client side
    if(typeof(window)==='undefined') return; //Works only on browser with window object
    
    const initializeWidget = ()=> { // Sub-function to initialize the widget
      if(!window.cloudinary || widgetRef.current) return false; // We exit if a cloudinary is not loaded or if a widget already exists
      
      widgetRef.current = window.cloudinary.createUploadWidget({  // createUploadWidget accepts the settings that we configure by using Environment Variables
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        multiple: false, // We shall upload only one file at a time
        folder: 'uploads',
        maxFileSize: 5000000, // 5 MB,
        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp']
      }, (error, result)=> {
        if(!error && result.event === 'success'){
          const payload: UploadWidgetValue = {
            url: result.info.secure_url, // Public image URL
            publidId: result.info.public_id, // Public ID
          } 
          setPreview(payload)
          setDeleteToken(result.info.delete_token ?? null); // Allows to delete uploaded image from cloudinary
          onChangeRef.current?.(payload); // Modifying the onChange prop with the payload
        }

      }); 


      return true; // If upload is complete
    }
    
    if(initializeWidget()) return; // Simply return if widget is initialized already and value is false

    const intervalId = window.setInterval( ()=> {
      if(initializeWidget()){
        window.clearInterval(intervalId); // Keep checking until widget is initialized
      }
    }, 500) // Run the function every 500ms

    return () => window.clearInterval (intervalId);
  },[]);  


  const openWidget = ()=> { // Function to open up the widget
    if(!disabled) widgetRef.current?.open();
  }

  // const removeFromCloudinary = async () => {} //Function to remove a file from cloudinary



  return (
    <div className='space-y-2'>
      {preview? ( // if there is a preview, show it or else show the dropzone
        <div className='upload-preview'>
          <img src={preview.url} alt="Uploaded file" />
        </div>
      ): <div className='upload-dropzone' role="button" tabIndex={0} 
      onClick={openWidget} onKeyDown={ (event) => {
        if(event.key==='Enter'){
          event.preventDefault();
          openWidget();
        }
      }} >
        <div className="upload-prompt">
          <UploadCloud className='icon'/>
          <div>
            <p>Click to upload photo</p>
            <p>PNG, JPG upto 5MB</p>
          </div>
        </div>
        </div>} 

    </div>
  )
}

export default UploadWidget