import Image from "next/image";

import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ChatMessage from "@/components/shared/ChatMessage";
import Link from "next/link";


async function TopBar({ params }: { params: { id: string } }) {
    const userInfo = await fetchUser(params.id);
    return (
        <div className="flex items-center justify-between p-4 text-white rounded-md bg-glassmorphism backdrop-blur-lg">
            <div className='user-card_avatar'>
                <div className='relative h-12 w-12'>
                    <Link href={`/profile/${userInfo.id}`}>
                        <Image
                            src={userInfo.image}
                            alt='user_logo'
                            fill
                            className='rounded-full object-cover'
                        />
                    </Link>
                </div>

                <div className='flex-1 text-ellipsis'>
                    <h4 className='text-base-semibold text-light-1'>{userInfo.name}</h4>
                    <p className='text-small-medium text-gray-1'>@{userInfo.username}</p>
                </div>
            </div>
            <div className='flex flex-row justify-end text-ellipsis'>
                <Image
                    src='/assets/gray-circle.svg'
                    alt='offline'
                    width={10}
                    height={10}
                />
                <h4 className='ml-2 mr-7 text-small-medium text-gray-1'>offline</h4>
            </div>
        </div>
    );
}

function MessageArea({ messages }: { messages: any[] }) {
    return (
        <div className="flex-grow overflow-y-auto p-4 h-80 w-auto custom-scrollbar">
            {messages.map((message) => (
                <div key={message.id} className={`mb-3 flex w-auto ${message.sender === "me" ? "justify-end" : ""}`}>
                    <article className={`flex w-auto flex-col rounded-xl p-4 max-w-md ${message.sender === "me" ? "bg-gradient-to-r from-purple-950 to-indigo-900" : "bg-gradient-to-l from-dark-4 to-dark-3"}`}>
                        <p className={`flex text-base-semibold w-auto text-light-1 ${message.sender === "me" ? "justify-end" : "justify-start"}`}>{message.text}</p>
                    </article>
                </div>
            ))}
        </div>
    );
}



async function ChatPage({ params }: { params: { id: string } }) {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(params.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    // Mock messages for demonstration purposes
    const messages = [
        { id: 1, text: "Hello!", sender: "them" },
        { id: 2, text: "Nice to meet you.", sender: "them" },
        { id: 3, text: "Do you need any help?", sender: "them" },
        { id: 4, text: "Nice to meet you too.", sender: "me" },
        { id: 5, text: "I wanted you to check my recent home asignment and give some feedback on it.", sender: "me" }
    ];

    if (!user || !userInfo?.onboarded) return null;

    return (
        <div className="flex flex-col">

            <TopBar params={userInfo} />
            <MessageArea messages={messages} />
            <div className="">
                <ChatMessage currentUserImg={user.imageUrl} />
            </div>
        </div>
    );
}



export default ChatPage;
