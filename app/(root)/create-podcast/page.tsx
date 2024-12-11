"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"

// zod imports 
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// Shadcn imports 
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"


// form schema
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})


// voices from OpenAI
const voiceCategories = ['alloy', 'shimmer', 'nova', 'echo', 'fable', 'onyx'];




// current page component
const CreatePodcastPage = () => {

  // states 
  const [voiceType, setVoiceType] = useState('')


  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

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

                  <FormLabel className="text-16 font-bold text-white-1">Username</FormLabel>

                  <FormControl>
                    <Input placeholder="My Podcast" {...field} className="input-case focus-visible:ring-orange-1"/>
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
              <Select onValueChange={(value) => setVoiceType(value)}>
                <SelectTrigger className={cn("text-16 w-full border-none bg-black-1 text-gray-1")}>
                  <SelectValue placeholder="AI Voices" className="placeholder:text-gray-1"/>
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
                  {
                    voiceCategories.map((category) => (
                      <SelectItem key={category} value={category} className="capitalize focus:bg-orange-1">
                        {category}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
                {
                  voiceType && (
                    <audio 
                      src={`/${voiceType}.mp3`}
                      autoPlay
                      className="hidden"
                    />
                  )
                }
              </Select>
            </div>


          </div>

          <Button type="submit">Submit</Button>

        </form>
      </Form>
    </section>
  )
}


export default CreatePodcastPage