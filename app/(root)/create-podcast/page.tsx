"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"

// zod imports 
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// Shadcn imports 
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// utils imports 
import { cn } from "@/lib/utils"
import { Label } from "@radix-ui/react-label"
import { Loader } from "lucide-react"

// components imports
import GeneratePodcast from "@/components/GeneratePodcast"
import GenerateThumbnail from "@/components/GenerateThumbnail"

// convex import
import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { useAction } from "convex/react"

// custom types
import { VoiceCategoryType } from "@/types"

// form schema
const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(2),
})



// current page component ⚛️
const CreatePodcastPage = () => {

  // use states 
  const [voices, setVoices] = useState<VoiceCategoryType[]>([]);
  const [audioSample, setAudioSample] = useState('')
  const [voiceEngine, setVoiceEngine] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null)
  const [imageURL, setImageURL] = useState('')
  
  const [audioURL, setAudioURL] = useState('')
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null)
  const [audioDuration, setAudioDuration] = useState(0)

  const [voicePrompt, setVoicePrompt] = useState('')
  const [voiceType, setVoiceType] = useState('')



  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }



  // PlayHT action
  const fetchVoices = useAction(api.playht.fetchVoicesAction)
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const voices = await fetchVoices();
        setVoices(voices);
      } catch (error) {
        console.error('Error loading voices:', error);
      }
    };

    loadVoices();
    console.log(voices)
  }, [fetchVoices]);

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">
          Create Podcast
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col">
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">

            {/* Podcast Title Field */}
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem>

                  <FormLabel className="text-16 font-bold text-white-1">Podcast Title</FormLabel>

                  <FormControl>
                    <Input placeholder="My Podcast" {...field} className="input-class focus-visible:ring-offset-orange-1"/>
                  </FormControl>

                  <FormMessage className="text-white-1"/>

                </FormItem>
              )}
            />

            {/* Select AI Voice dropdown */}
            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                Select AI Voice
              </Label>
              <Select onValueChange={(value) => {
                // Find the selected voice object using its ID
                const selectedVoice = voices.find((voice) => voice.id === value);

                if (selectedVoice) {
                  setVoiceType(selectedVoice.id);            // Set voice ID
                  setAudioSample(selectedVoice.sample);      // Set audio sample URL
                  setVoiceEngine(selectedVoice.voice_engine) // set voice engine of voice
                }
              }}>
                <SelectTrigger className={cn("text-16 w-full border-none bg-black-1 text-gray-1 focus:ring-offset-orange-1")}>
                  <SelectValue placeholder="AI Voices" className="placeholder:text-gray-1"/>
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus-visible:ring-offset-orange-1">
                  {
                    voices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id} className="capitalize focus:bg-orange-1">
                        {voice.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
                {
                  audioSample && (
                    <audio 
                      src={audioSample}
                      autoPlay
                      className="hidden"
                    />
                  )
                }
              </Select>
            </div>

            {/* Podcast Description Field */}
            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem>

                  <FormLabel className="text-16 font-bold text-white-1">Podcast Description</FormLabel>

                  <FormControl>
                    <Textarea placeholder="Write a short Podcast description" {...field} className="input-class focus-visible:ring-offset-orange-1"/>
                  </FormControl>

                  <FormMessage className="text-white-1"/>

                </FormItem>
              )}
            />
          </div>


          {/* AI components */}
          <div className="flex flex-col pt-10">

            {/* Generate Podcast audio */}
            <GeneratePodcast 
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioURL}
              voiceType={voiceType}
              voiceEngine={voiceEngine}
              audio={audioURL}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration}
            />

            {/* Generate Thumbnail image */}
            <GenerateThumbnail 
              setImage={setImageURL} 
              setImageStorageId={setImageStorageId}
              image={imageURL}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
            />

            <div className="mt-10 w-full">
              <Button type="submit" className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1">
                {
                  isSubmitting ? (
                    <>
                      Submitting
                      <Loader size={ 20 } className="animate-spin ml-1"/>
                    </>
                  ) : (
                    'Submit and Publish Podcast'
                  )
                }
              </Button>
            </div>
          </div>

        </form>
      </Form>
    </section>
  )
}


export default CreatePodcastPage