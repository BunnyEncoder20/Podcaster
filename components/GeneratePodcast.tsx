import React,{ useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

// me-made types imports 🫡
import { GeneratePodcastProps } from '@/types'

// shadcn imports 🌟
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// convex imports
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

// uplaodstuff imports 
import { useUploadFiles } from '@xixixao/uploadstuff/react'

// Custom hooks OpenAI 🪝

// const useGeneratePodcast = ({
//   setAudio,
//   voiceType,
//   voicePrompt,
//   setAudioStorageId
// } : GeneratePodcastProps) => {
//   // state
//   const [isGenerating, setIsGenerating] = useState(false)

//   // shadcn toast for notifications
//   const { toast } = useToast()

//   // uploadstuff mutation
//   const generateUploadUrl = useMutation(api.files.generateUploadUrl)
//   const { startUpload } = useUploadFiles(generateUploadUrl)
//   const getAudioURL = useMutation(api.podcasts.getURL)

//   // fetching action from convex 
//   const getPodcastAudio = useAction(api.openai.generateAudioAction)

//   // logic for podcast generation
//   const generatePodcast = async () => {
    
//     // initlize values
//     setIsGenerating(true)
//     setAudio('');

//     // safety checks
//     if (!voiceType) {
//       toast({
//         title: "Voice missing !",
//         description: "Please provide an AI voice to generate the podcast",
//       })
//       console.error("Error: voiceType cannot be null")
//       return setIsGenerating(false);
//     }
//     if (!voicePrompt) {
//       toast({
//         title: "Voice prompt missing !",
//         description: "Please provide a prompt to generate the podcast",
//       })
//       console.error("Error: voicePrompt cannot be null")
//       return setIsGenerating(false);
//     }


//     try {
//       const response = await getPodcastAudio({ 
//         voice: voiceType,
//         input: voicePrompt, 
//       });

//       // from the response, extract and create teh audio file
//       const blob = new Blob([response], { type: "audio/mpeg" });
//       const filename = `podcast-${uuidv4()}.mp3`;
//       const file = new File([blob], filename, { type: "audio/mpeg" });

//       // upload the file and extract urls
//       const uploaded = await startUpload([file])
//       const storageId = (uploaded[0].response as any).storageId
//       const audioURL = await getAudioURL({ storageId })

//       // set states 
//       setAudioStorageId(storageId)
//       setAudio(audioURL!)
//       setIsGenerating(false)

//       toast({
//         title: "Podcast Generated Successfully!",
//       })

//     } catch (error) {
//       console.error("Error in generating podcast: ", error)
//       toast({
//         title: "Error Creating Podcast !",
//         description: "There was an erorr in creating your podcast. Please try again later.",
//         variant: "destructive",
//       })
//       setIsGenerating(false)
//     }
//   }


//   return {
//     isGenerating,
//     generatePodcast,
//   }
// }


const useGeneratePodcast = ({
  setAudio,
  voiceType,
  voicePrompt,
  setAudioStorageId,
}: GeneratePodcastProps) => {

  // for toast notifications
  const { toast } = useToast()

  // State to track the generation process
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch Convex action for PlayHT
  const getAudioUrl = useAction(api.playht.generateAudioAction);

  // Upload URL generation logic
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio('');

    try {
      // Validate inputs
      if (!voicePrompt) throw new Error('Prompt is required');
      if (!voiceType) throw new Error('Voice type is required');

      // Get the audio URL
      const audioUrl = await getAudioUrl({ text: voicePrompt, voice: voiceType });

      // Download the audio file
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const file = new File([blob], `podcast-${uuidv4()}.mp3`, {
        type: 'audio/mpeg',
      });

      // Upload the file
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      // Set states
      setAudioStorageId(storageId);
      setAudio(audioUrl);
      toast({
        title: 'Podcast Generated Successfully!',
      });
    } catch (error) {
      console.error('Error generating podcast:', error);
      toast({
        title: 'Error Creating Podcast!',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatePodcast,
  };
};



//* component ⚛️
const GeneratePodcast = (props: GeneratePodcastProps) => {

  // making hook (will get the state from here)
  const { isGenerating, generatePodcast } = useGeneratePodcast(props)

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="font-16 font-bold text-white-1">
          Prompt to generate podcast
        </Label>
        <Textarea 
          placeholder='Provide text to generate audio' 
          rows={ 5 } 
          value={ props.voicePrompt } 
          onChange={ (e) => props.setVoicePrompt(e.target.value) }  
          className="input-class font-light focus-visible:ring-offset-orange-1"
        />
      </div>

      <div className="mt-5 w-full max-w-[200px]">
        <Button type="submit" onClick={ generatePodcast } className="text-16 py-4 font-bold text-white-1 bg-orange-1">
          {
            isGenerating ? (
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

      {/* Audio player */}
      { props.audio && (
        <audio 
          controls
          src={props.audio}
          autoPlay
          onLoadedMetadata={ (e) => props.setAudioDuration(e.currentTarget.duration)}
          className="mt-5"
        />
      )}
    </div>
  )
}

export default GeneratePodcast