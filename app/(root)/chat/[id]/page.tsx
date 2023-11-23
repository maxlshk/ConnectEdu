import Image from "next/image";

import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ChatMessage from "@/components/shared/ChatMessage";
import Link from "next/link";
import { fetchMessagesBetweenUsers } from "@/lib/actions/message.actions";


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

function formatTimestamp(createdAt: string) {
    const messageDate = new Date(createdAt);
    const today = new Date();

    if (
        messageDate.getDate() === today.getDate() &&
        messageDate.getMonth() === today.getMonth() &&
        messageDate.getFullYear() === today.getFullYear()
    ) {
        return `Today, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (
        messageDate.getDate() === yesterday.getDate() &&
        messageDate.getMonth() === yesterday.getMonth() &&
        messageDate.getFullYear() === yesterday.getFullYear()
    ) {
        return `Yesterday, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    if (messageDate >= yesterday && messageDate >= today) {
        return `${messageDate.toLocaleDateString('en-US', { weekday: 'short' })}, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    return `${messageDate.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })} ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}



function MessageArea({ messages, currentUser }: { messages: any[], currentUser: string }) {
    return messages.length > 0 ? (
        <div className="flex-grow overflow-y-auto p-4 h-80 w-auto custom-scrollbar">
            {messages.map((message) => (
                <div key={message.id} className={`mb-3 flex w-auto ${message.sender === currentUser ? "justify-end" : ""}`}>
                    <article className={`flex w-auto flex-col rounded-xl p-4 max-w-md ${message.sender === currentUser ? "bg-gradient-to-r from-purple-950 to-indigo-900" : "bg-gradient-to-l from-dark-4 to-dark-3"}`}>
                        {message.file != "" && (
                            <a href={message.file} target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={message.file}
                                    alt='file'
                                    width={1080}
                                    height={1080}
                                    priority
                                    className='object-contain rounded-md mb-2 w-auto h-auto'
                                />
                            </a>
                        )}
                        <p className={`flex text-base-semibold w-auto text-light-1 ${message.sender === currentUser ? "justify-end" : "justify-start"}`}>
                            {message.text}
                        </p>
                        <span className={`flex text-tiny-medium mt-2 text-gray-500 ${message.sender === currentUser ? "justify-start" : "justify-end"}`}>
                            {formatTimestamp(message.createdAt)}
                        </span>
                    </article>
                </div>
            ))}
        </div>
    ) : (
        <div className="flex-grow overflow-y-auto p-4 h-80 w-auto custom-scrollbar">
            <div className="flex justify-center items-center h-full">
                <p className="text-light-1">No messages yet</p>
            </div>
        </div>
    );
}




async function ChatPage({ params }: { params: { id: string } }) {
    const user = await currentUser();
    if (!user) return null;
    const fulluser = await fetchUser(user.id);

    const userInfo = await fetchUser(params.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const messages = await fetchMessagesBetweenUsers(user.id, userInfo.id);

    if (!user || !userInfo?.onboarded) return null;

    return (
        <div className="flex flex-col">

            <TopBar params={userInfo} />
            <MessageArea
                messages={messages}
                currentUser={user.id}
            />
            <div className="">
                <ChatMessage
                    currentUserImg={fulluser.image}
                    currentUser={user.id}
                    otherUser={userInfo.id}
                />
            </div>
        </div>
    );
}



export default ChatPage;
