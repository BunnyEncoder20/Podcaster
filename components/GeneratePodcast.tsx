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
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Use PlayHT action to generate the audio file
  const streamAudio = useAction(api.playht.streamAudioAction);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getAudioURL = useMutation(api.podcasts.getURL);

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio("");

    if (!voiceType) {
      toast({
        title: "Voice missing!",
        description: "Please provide an AI voice to generate the podcast.",
      });
      setIsGenerating(false);
      return;
    }

    if (!voicePrompt) {
      toast({
        title: "Voice prompt missing!",
        description: "Please provide a prompt to generate the podcast.",
      });
      setIsGenerating(false);
      return;
    }

    try {
      const response = await streamAudio({
        text: voicePrompt,
        voiceEngine: "PlayDialog",
      });

      const blob = new Blob([response], { type: "audio/mpeg" });
      const filename = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], filename, { type: "audio/mpeg" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      const audioURL = await getAudioURL({ storageId });

      setAudioStorageId(storageId);
      setAudio(audioURL!);
      toast({
        title: "Podcast Generated Successfully!",
      });
    } catch (error) {
      console.error("Error generating podcast:", error);
      toast({
        title: "Error Creating Podcast!",
        description: "There was an error creating your podcast. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, generatePodcast };
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