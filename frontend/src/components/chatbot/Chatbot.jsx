import React, { useState } from 'react';
import { Bot, Loader2, MessageCircle, Send, X } from 'lucide-react';
import { sendChatbotMessage } from '@/api/chatbot';
import { useChatbotContext } from '@/components/chatbot/useChatbotContext';

const Chatbot = () => {
    const { pageContext } = useChatbotContext();
    const [isOpen, setIsOpen] = useState(false);

    const [message, setMessage] = useState('');

    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content:
                'আসসালামু আলাইকুম! আমি SP Assistant। Stand For People সম্পর্কে জানতে বা সাহায্যের অনুরোধ করতে আমি আপনাকে গাইড করতে পারি।',
        },
    ]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage || isLoading) {
            return;
        }

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: trimmedMessage,
        };

        setMessages((previousMessages) => [...previousMessages, userMessage]);

        setMessage('');
        setIsLoading(true);

        try {
            const response = await sendChatbotMessage(
                trimmedMessage,
                pageContext,
            );

            const assistantMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content:
                    response?.message ||
                    'দুঃখিত, এই মুহূর্তে উত্তর দেওয়া সম্ভব হচ্ছে না।',
            };

            setMessages((previousMessages) => [
                ...previousMessages,
                assistantMessage,
            ]);
        } catch (error) {
            console.error('Chatbot error:', error);

            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content:
                        'দুঃখিত, এই মুহূর্তে সংযোগে সমস্যা হচ্ছে। কিছুক্ষণ পর আবার চেষ্টা করুন।',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    className="
                        fixed
                        bottom-24
                        right-4
                        z-100
                        flex
                        h-[min(620px,calc(100vh-120px))]
                        w-[min(390px,calc(100vw-32px))]
                        flex-col
                        overflow-hidden
                        rounded-3xl
                        border
                        border-black/10
                        bg-white
                        shadow-[0_24px_70px_rgba(0,0,0,0.18)]
                        sm:right-6
                    "
                >
                    {/* Header */}
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            bg-[#083c36]
                            px-5
                            py-4
                            text-white!
                        "
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white/10
                                "
                            >
                                <Bot size={21} strokeWidth={1.8} />
                            </div>

                            <div>
                                <p className="font-sans text-[15px] font-semibold">
                                    SP Assistant
                                </p>

                                <p className="mt-0.5 font-sans text-[11px] text-white!/65">
                                    Stand For People
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                text-white!/75
                                transition
                                hover:bg-white/10
                                hover:text-white!
                            "
                        >
                            <X size={19} strokeWidth={1.8} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        className="
                            flex-1
                            overflow-y-auto
                            bg-text-on-dark
                            px-4
                            py-5
                        "
                    >
                        <div className="space-y-3">
                            {messages.map((chatMessage) => {
                                const isUser = chatMessage.role === 'user';

                                return (
                                    <div
                                        key={chatMessage.id}
                                        className={`flex ${
                                            isUser
                                                ? 'justify-end'
                                                : 'justify-start'
                                        }`}
                                    >
                                        <div
                                            className={`
                                                max-w-[88%]
                                                rounded-[18px]
                                                px-4
                                                py-3.5
                                                ${
                                                    isUser
                                                        ? 'rounded-br-md bg-[#083c36] text-white!'
                                                        : 'rounded-tl-md border border-black/6 bg-white text-[#183b36] shadow-sm'
                                                }
                                            `}
                                        >
                                            <p
                                                className={`
                                                    font-bengali
                                                    text-[14px]
                                                    leading-[1.7]
                                                    ${
                                                        isUser
                                                            ? 'text-white!'
                                                            : 'text-[#183b36]'
                                                    }
                                                `}
                                            >
                                                {chatMessage.content}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            rounded-[18px]
                                            rounded-tl-md
                                            border
                                            border-black/6
                                            bg-white
                                            px-4
                                            py-3.5
                                            text-[#183b36]
                                            shadow-sm
                                        "
                                    >
                                        <Loader2
                                            size={15}
                                            className="animate-spin"
                                        />

                                        <span
                                            className="
                                                font-bengali
                                                text-[13px]
                                                text-black/55
                                            "
                                        >
                                            উত্তর তৈরি হচ্ছে...
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Input */}
                    <div
                        className="
                            border-t
                            border-black/[0.07]
                            bg-white
                            p-3
                        "
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="
                                flex
                                items-end
                                gap-2
                                rounded-2xl
                                border
                                border-black/10
                                bg-text-on-dark
                                p-2
                            "
                        >
                            <textarea
                                value={message}
                                onChange={(event) =>
                                    setMessage(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key === 'Enter' &&
                                        !event.shiftKey
                                    ) {
                                        event.preventDefault();

                                        handleSubmit(event);
                                    }
                                }}
                                placeholder="আপনার প্রশ্ন লিখুন..."
                                rows={1}
                                disabled={isLoading}
                                className="
                                    max-h-28
                                    min-h-10
                                    flex-1
                                    resize-none
                                    bg-transparent
                                    px-2
                                    py-2
                                    font-bengali
                                    text-[13px]
                                    leading-normal
                                    text-[#183b36]
                                    outline-none
                                    placeholder:text-black/35
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            />

                            <button
                                type="submit"
                                disabled={!message.trim() || isLoading}
                                aria-label="Send message"
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[#ed864a]
                                    text-white!
                                    transition
                                    hover:bg-[#d96f35]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-35
                                "
                            >
                                {isLoading ? (
                                    <Loader2
                                        size={17}
                                        strokeWidth={2}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Send size={17} strokeWidth={2} />
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {!isOpen && (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open SP Assistant"
                    className="
                        fixed
                        bottom-5
                        right-4
                        z-100
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-full
                        bg-[#083c36]
                        text-white!
                        shadow-[0_12px_35px_rgba(8,60,54,0.28)]
                        transition
                        duration-200
                        hover:-translate-y-0.5
                        hover:bg-[#0f6258]
                        sm:bottom-6
                        sm:right-6
                    "
                >
                    <MessageCircle size={23} strokeWidth={1.8} />
                </button>
            )}
        </>
    );
};

export default Chatbot;
