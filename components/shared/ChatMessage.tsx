"use client";

import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface Props {
    currentUserImg: string;
}

function ChatMessage({ currentUserImg }: Props) {
    const pathname = usePathname();

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {

        form.reset();
    };

    return (
        <Form {...form}>
            <form className='comment-form'>
                <FormField
                    control={form.control}
                    name='thread'
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
