"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendMail } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

// Zod schema for form validation
const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(1, { message: "Message is required" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Page() {
  useEffect(() => {
    document.title = "Contact us - WiniSol";
  }, []);

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
    <>
      <Head>
        <title>Contact Us - WiniSol</title>
        <meta
          name="description"
          content="Get in touch with WiniSol. Have questions? Contact our team for support."
        />
        <meta property="og:title" content="Contact Us - WiniSol" />
        <meta
          property="og:description"
          content="Need help? Reach out to the WiniSol support team."
        />
        <meta property="og:image" content="/winisol-thumbnail.jpg" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "name": "Contact Us",
              "url": "https://www.winisol.com/contact",
              "description":
                "Contact WiniSol's support team for assistance with any inquiries or issues.",
              "contactOption": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "areaServed": "Global",
                "availableLanguage": "English",
              },
            }),
          }}
        />
      </Head>

      <div className="my-16 flex flex-col gap-8 lg:gap-16 max-w-screen-2xl w-full xl:mx-auto">
        <div className="flex flex-col items-center gap-4 mx-8">
          <h1 className="text-4xl lg:text-5xl gradient-text bg-gradient-to-b from-primary to-secondary">
            Contact us
          </h1>
          <p className="text-center max-w-5xl">
            Our dedicated team is always here for you, ready to resolve your
            queries with speed and care. We understand the value of your time,
            which is why we work tirelessly to provide quick and effective
            solutions. Whether it&apos;s a small question or a complex issue, we
            are committed to offering instant support, ensuring you get the help
            you need without delay. Your satisfaction is our priority, and we
            take every concern seriously, handling it with expertise and genuine
            dedication.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="m-8 xl:mx-16 flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="w-full lg:w-1/2 flex flex-col gap-3">
              <Label htmlFor="name" className="text-[#C8C8C8] font-light">
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Name"
                className="bg-[#1A1A1A] py-5"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="w-full lg:w-1/2 flex flex-col gap-3">
              <Label htmlFor="email" className="text-[#C8C8C8] font-light">
                Your Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="bg-[#1A1A1A] py-5"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="message" className="text-[#C8C8C8] font-light">
              Message
            </Label>
            <Textarea
              id="message"
              className="bg-[#1A1A1A] py-5 resize-none"
              rows={10}
              placeholder="Message..."
              {...register("message")}
            />
            {errors.message && (
              <p className="text-red-600 text-sm">{errors.message.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="border-2 border-primary bg-custom_black rounded-xl py-6 px-10 text-xl font-medium text-primary hover:bg-primary hover:text-black"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>

          {isMailSent && (
            <p className="text-primary text-center">
              Your message has been sent successfully! Our team will reach out to you soon.</p>
          )}
        </form>

        <div className="mx-8 lg:mx-16">
          <h2 className="font-xl text-red-600">
            * We never ask for any personal or financial information. Please do
            not share such details with anyone claiming to be from our team.
            Your security is our priority, and we encourage you to stay cautious
            and protect your information.
          </h2>
        </div>
      </div>
    </>
  );
}
