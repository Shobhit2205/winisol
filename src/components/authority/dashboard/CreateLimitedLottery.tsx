'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useWinisolProgram } from "@/components/winisol/winisol-data-access";

const lotterySchema = z.object({
    lotteryName: z.string().min(2, "Lottery name must be at least 2 characters."),
    lotterySymbol: z.string().min(1, "Symbol is required."),
    lotteryURI: z.string().url("Enter a valid URL."),
    lotteryImage: z.string().url("Enter a valid image URL."),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Price must be a positive number", 
    }).transform((val) => Number(val)),
    totalTickets: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Price must be a positive number",
    }).transform((val) => Number(val)),
});

export type CreateLimitedLotteryInputArgs = z.infer<typeof lotterySchema>;

export default function CreateLimitedLottery() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(lotterySchema),
    });
    const {initializeLimitedLotteryConfig} = useWinisolProgram();

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: CreateLimitedLotteryInputArgs) => {
        try {
            setLoading(true);

            await initializeLimitedLotteryConfig.mutateAsync(data);
            reset();
        } catch (error) {
            console.error("Error creating lottery:", error);
        } finally {
            setLoading(false);
        }
    };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-4 items-center justify-between">
        {/* Lottery Name */}
        <div className="w-1/2 flex flex-col gap-3">
          <Label htmlFor="name" className="text-[#C8C8C8] font-light">Lottery Name</Label>
          <Input id="name" placeholder="Lottery Name" className="bg-[#1A1A1A] py-5" {...register("lotteryName")} />
          {errors.lotteryName && (
            <p className="text-red-500 text-sm">{errors.lotteryName.message}</p>
          )}
        </div>
        {/* Lottery Symbol */}
        <div className="w-1/2 flex flex-col gap-3">
          <Label htmlFor="symbol" className="text-[#C8C8C8] font-light">Symbol</Label>
          <Input id="symbol" placeholder="Symbol" className="bg-[#1A1A1A] py-5" {...register("lotterySymbol")} />
          {errors.lotterySymbol && (
            <p className="text-red-500 text-sm">{errors.lotterySymbol.message}</p>
          )}
        </div>
      </div>


      <div className="flex flex-col gap-3">
          <Label htmlFor="uri" className="text-[#C8C8C8] font-light">URI</Label>
          <Input id="uri"  placeholder="URI" className="bg-[#1A1A1A] py-5" {...register("lotteryURI")} />
          {errors.lotteryURI && (
            <p className="text-red-500 text-sm">{errors.lotteryURI.message}</p>
          )}
      </div>

      <div className="flex flex-col gap-3">
          <Label htmlFor="imageUrl" className="text-[#C8C8C8] font-light">Image URL</Label>
          <Input id="imageUrl" placeholder="Image URL" className="bg-[#1A1A1A] py-5" {...register("lotteryImage")} />
          {errors.lotteryImage && (
            <p className="text-red-500 text-sm">{errors.lotteryImage.message}</p>
          )}
      </div>

      <div className="flex flex-col gap-3">
          <Label htmlFor="price" className="text-[#C8C8C8] font-light">Price</Label>
          <Input id="price" placeholder="Price" className="bg-[#1A1A1A] py-5" {...register("price")} />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
      </div>

      <div className="flex flex-col gap-3">
          <Label htmlFor="totalTickets" className="text-[#C8C8C8] font-light">Price</Label>
          <Input id="totalTickets" placeholder="Total Tickets" className="bg-[#1A1A1A] py-5" {...register("totalTickets")} />
          {errors.totalTickets && (
            <p className="text-red-500 text-sm">{errors.totalTickets.message}</p>
          )}
      </div>

      {/* Submit Button */}
      <Button type="submit"  disabled={loading} className="border-2 w-full border-primary bg-custom_black rounded-xl py-6 px-10 text-xl font-medium text-primary hover:bg-primary hover:text-black">
        {"Create Lottery"}
      </Button>
    </form>
  );
}
