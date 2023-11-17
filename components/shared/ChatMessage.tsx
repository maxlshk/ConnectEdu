"use client";

import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { ChatImageInput } from "../ui/chatInput";
import { Button } from "../ui/button";
import { ChangeEvent, useState } from "react";

import { MessageValidation } from "@/lib/validations/thread";
import { createMessage } from "@/lib/actions/message.actions";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";

interface Props {
    currentUserImg: string;
    currentUser: string;
    otherUser: string;
}

function ChatMessage({ currentUserImg, currentUser, otherUser }: Props) {
    const pathname = usePathname();
    const { startUpload } = useUploadThing("media");

    const [files, setFiles] = useState<File[]>([]);

    const form = useForm<z.infer<typeof MessageValidation>>({
        resolver: zodResolver(MessageValidation),
        defaultValues: {
            message: "",
            file: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof MessageValidation>) => {
        const blob = values.file;

        const hasImage = isBase64Image(blob);
        if (hasImage) {
            const imgRes = await startUpload(files);

            if (imgRes && imgRes[0].fileUrl) {
                values.file = imgRes[0].fileUrl;
            }
        }

        await createMessage({
            sender: currentUser,
            recipient: otherUser,
            text: values.message,
            file: values.file,
            path: pathname
        });

        form.reset();
    };

    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
    ) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));

            if (!file.type.includes("image")) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || "";
                fieldChange(imageDataUrl);
            };

            fileReader.readAsDataURL(file);
        }
    };

    return (
        <Form {...form}>
            <form
                className='comment-form'
                onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name='message'
                    render={({ field }) => (
                        <FormItem className='flex w-full items-center gap-3'>
                            <FormLabel>
                                <Image
                                    src={currentUserImg}
                                    alt='current_user'
                                    width={48}
                                    height={48}
                                    className='rounded-full object-cover'
                                />
                            </FormLabel>
                            <FormControl className='border-none bg-transparent'>
                                <Input
                                    type='text'
                                    {...field}
                                    placeholder='Send message...'
                                    className='no-focus text-light-1 outline-none'
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='file'
                    render={({ field }) => (
                        <FormItem className='flex items-center'>
                            <FormLabel>
                                {field.value ? (
                                    <Image
                                        src={field.value}
                                        alt='file'
                                        width={296}
                                        height={296}
                                        priority
                                        className='object-contain rounded-md'
                                    />
                                ) : (<></>)}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='file'
                                    accept='image/*'
                                    placeholder='Add file'
                                    className='opacity-0 w-1.5 cursor-pointer right-0 chat-image-input'
                                    onChange={(e) => handleImage(e, field.onChange)}
                                />
                            </FormControl>
                        </FormItem>
                    )}

                />
                <div className='flex cursor-pointer gap-3 mx-3 px-2 py-2'>
                    <Image
                        src='/assets/clip.svg'
                        alt='file'
                        width={40}
                        height={40}
                    />
                </div>
                <Button type='submit' className='comment-form_btn'>
                    Send
                </Button>
            </form>
        </Form>
    );
}

export default ChatMessage;
