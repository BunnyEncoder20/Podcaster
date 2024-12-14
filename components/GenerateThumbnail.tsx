import React, { useRef, useState } from 'react'

// utils imports 
import { cn } from '@/lib/utils'

// shadcn imports
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Loader } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// custom Types imports
import { GenerateThumbnailProps } from '@/types'
import { Input } from './ui/input'
import Image from 'next/image'

// convex imports
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

// uploadstuff imports
import { useUploadFiles } from '@xixixao/uploadstuff/react'




const GenerateThumbnail = ({ 
  setImage, 
  setImageStorageId,
  image,
  imagePrompt,
  setImagePrompt,
}: GenerateThumbnailProps) => {

  // toast notifications
  const {toast} = useToast()

  // states 
  const [isAiThumbnail, setIsAiThumbnail] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)

  // image refs 
  const imageRef = useRef<HTMLInputElement>(null);

  const generateImage = async () => {

  }

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files
      if (!files) return;
      
      // make the file
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

      // handle image upload to convex storage
      handleImage(blob, file.name);

    } catch (error) {
      console.error(error)
      toast({
        title: "Error uploading image !",
        description: "There was an error in uploading your image. Please try again later",
        variant: "destructive",
      })
    }
  }

  // convex mutations and actions
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageURL = useMutation(api.podcasts.getURL);

  const handleImage = async (blob: Blob, filename: string) => {
    setIsImageLoading(true);
    setImage('');             // reset the image if set before

    try {

      // make file from blob
      const file = new File([blob], filename, {
        type: 'image/png',
      });

      // Upload the file
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      // get storage url from convex backend
      const imageURL = await getImageURL({ storageId });

      // Set states
      setImageStorageId(storageId);
      setImage(imageURL!);
      setIsImageLoading(false);
      toast({
        title: 'Image Uploaded Successfully!',
      });
    } catch (error) {
      console.error(error)
      toast({
        title: "Error generating thumbnail !",
        description: "There was an error in generating your thumbnail. Please try again later or upload your image directly",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="generate_thumbnail">
        {/* Generate with AI */}
        <Button 
        type="button" 
        variant={"plain"}
        onClick={() => setIsAiThumbnail(true)} 
        className={cn('', {'bg-black-6': isAiThumbnail})}>
          Use AI to generate Thumbnail
        </Button>

        {/* Upload on your own */}
        <Button 
        type="button" 
        variant={"plain"}
        onClick={() => setIsAiThumbnail(false)}
        className={cn('', {'bg-black-6': !isAiThumbnail})}>
          Upload Image
        </Button>
      </div>

      {/* AI Prompt Box or Image Upload Box */}
      { isAiThumbnail ? (
        <div className="flex flex-col gap-5">
          <div className="mt-5 flex flex-col gap-2.5">
            <Label className="font-16 font-bold text-white-1">
              AI Prompt to generate Thumbnail
            </Label>
            <Textarea 
              placeholder='Provide text to generate thumbnail image' 
              rows={ 5 } 
              value={ imagePrompt } 
              onChange={ (e) => setImagePrompt(e.target.value) }  
              className="input-class font-light focus-visible:ring-offset-orange-1"
            />
          </div>

          <div className="w-full max-w-[200px]">
            <Button type="submit" onClick={ generateImage } className="text-16 py-4 font-bold text-white-1 bg-orange-1">
              {
                isImageLoading ? (
                  <>
                    Generating...
                    <Loader size={ 20 } className="animate-spin ml-1"/>
                  </>
                ) : (
                  'Generate'
                )
              }
            </Button>
          </div>
        </div>
      ) : (
        <div onClick={ () => imageRef?.current?.click()} className="image_div">
          <Input 
            type='file'
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
            className='hidden'
          />

          {!isImageLoading ? (
            <Image src="./icons/upload-image.svg" alt="upload" width={40} height={40} />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading...
              <Loader size={20} className="animate-spin ml-2"/>
            </div>
          )}

          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">
              Click to Upload
            </h2>
            <p className="text-12 font-normal text-gray-1">SVG, PNG, JPG, or GIF (max: 1080x1080px)</p>
          </div>
        </div>
      )}

      { image && (
        <div className="flex-center w-full">
          <Image 
            src={image}
            alt="thumbnail"
            width={200}
            height={200}
            className="mt-5"
          />
        </div>
      )}

    </>
  )
}

export default GenerateThumbnail