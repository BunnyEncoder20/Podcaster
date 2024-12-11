import React,{ useState } from 'react'

// me-made types imports 🫡
import { GeneratePodcastProps } from '@/types'

// shadcn imports 🌟
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'


// Custom hooks 🪝
const useGeneratePodcast = ({
  setAudio,
  voiceType,
  voicePrompt,
  setAudioStorageId
} : GeneratePodcastProps) => {
  // state
  const [isGenerating, setIsGenerating] = useState(false)

  // logic for podcast generation
  const generatePodcast = async () => {
    
    // initlize values
    setIsGenerating(true)
    setAudio('');

    if (!voicePrompt) {
      // Todo: show error message
      return setIsGenerating(false);
    }

    try {
      const response = await getPodcastAudio({ 
        voice: voiceType,
        input: voicePrompt, 
      })
      
    } catch (error) {
      console.error("Error in generating podcast: ", error)
      // todo: show error message
      setIsGenerating(false)
    }
  }


  return {
    isGenerating,
    generatePodcast,
  }
}


const GeneratePodcast = (props: GeneratePodcastProps) => {

  // making hook (will get the state from here)
  const { isGenerating, generatePodcast } = useGeneratePodcast(props)

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="font-16 font-bold text-white-1">
          AI Prompt to generate podcast
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
        <Button type="submit" className="text-16 py-4 font-bold text-white-1 bg-orange-1">
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