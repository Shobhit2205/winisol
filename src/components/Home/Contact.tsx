'use client';

import { useState } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import contactImage from '@/assets/contact.png';
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { sendMail } from "@/services/authService";


// Zod schema for form validation
const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(1, { message: "Message is required" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
      } = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
          name: "",
          email: "",
          message: ""
        }
      });
      const { toast } = useToast();
      const [isMailSent, setIsMailSent] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
    
      const onSubmit = async (data: ContactFormValues) => {
        try {
          setIsLoading(true);
          
          const res = await sendMail(data.name, data.email, data.message);
          await new Promise(resolve => setTimeout(resolve, 2000));
          if(res.success){
            toast({
              title: "Success",
              description: "Your message has been sent successfully.",
            });
          }
          setIsMailSent(true);
          reset();
        } catch (error) {
          toast({
            title: "Error",
            description: "There was an error sending your message. Please try again.",
            variant: "destructive",
          })
        } finally {
            setIsLoading(false);
        }
      };
    return (
        <div className="border border-white mx-8 lg:mx-16 rounded-3xl flex justify-between items-center gap-4 max-w-screen-2xl w-auto xl:mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12 p-8">
                <div className="flex flex-col gap-2">
                    <h2 className="text-4xl gradient-text bg-gradient-to-b from-white to-primary">Contact Us</h2>
                    <p className="text-lg font-light">Fill out the form below, and our team will get back to you ASAP!</p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="name" className="text-[#C8C8C8] font-light">Your Name</Label>
                        <Input id="name" type="text" className="bg-[#1A1A1A] py-5" {...register("name")} />
                        {errors.name && (
                            <p className="text-red-600 text-sm">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="email" className="text-[#C8C8C8] font-light">Your Email</Label>
                        <Input id="email" type="email" className="bg-[#1A1A1A] py-5" {...register("email")} />
                        {errors.email && (
                            <p className="text-red-600 text-sm">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="message" className="text-[#C8C8C8] font-light">Message</Label>
                        <Textarea id="message" className="bg-[#1A1A1A] py-5 resize-none" rows={4}  {...register("message")}/>
                        {errors.message && (
                            <p className="text-red-600 text-sm">{errors.message.message}</p>
                        )}
                    </div>
                    <Button className="border-2 border-primary bg-custom_black rounded-xl py-6 px-10 text-xl font-medium text-primary hover:bg-primary hover:text-black" type="submit" disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit"}
                    </Button>
                    {isMailSent && (
                        <p className="text-primary text-center">
                        Your message has been sent successfully! Our team will reach out to you soon.</p>
                    )}
                </div>
            </form>
            <div className="hidden lg:block self-center">
                <Image width={100} height={100} src={contactImage.src} alt="Contact winisol" className="w-[500px] rounded-3xl" />
            </div>
        </div>
    )
}