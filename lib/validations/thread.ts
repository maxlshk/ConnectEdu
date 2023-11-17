import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
});

export const MessageValidation = z.object({
  message: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  file: z.string().url().nonempty(),
});
