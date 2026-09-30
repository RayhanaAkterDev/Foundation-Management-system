import React, { useState } from 'react';

import { HeartHandshake, Loader2, Send, X, MessageCircle } from 'lucide-react';

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

    /* =========================================================
       LOGIC — UNCHANGED
    ========================================================== */
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
            {/* =========================================================
                CHAT WINDOW
            ========================================================== */}
            {isOpen && (
                <div
                    className="
                        fixed
                        right-4
                        bottom-24
                        z-100

                        flex
                        h-[min(560px,calc(100vh-120px))]
                        w-[min(390px,calc(100vw-32px))]
                        flex-col

                        overflow-hidden
                        rounded-[22px]

                        border
                        border-[#e5e1d8]

                        bg-[#fcfbf8]

                        shadow-[0_24px_70px_rgba(32,42,40,0.16)]

                        sm:right-6
                    "
                >
                    {/* =================================================
                        HEADER
                    ================================================== */}
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4

                            px-5
                            pt-5
                            pb-4
                        "
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    relative

                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center

                                    rounded-full

                                    bg-[#e7f1ef]

                                    text-primary
                                "
                            >
                                <HeartHandshake size={18} strokeWidth={1.8} />

                                <span
                                    className="
                                        absolute
                                        right-0
                                        bottom-0

                                        h-2.5
                                        w-2.5

                                        rounded-full

                                        border-2
                                        border-[#fcfbf8]

                                        bg-[#65a889]
                                    "
                                />
                            </div>

                            <div>
                                <p
                                    className="
                                        text-[14px]
                                        font-semibold
                                        leading-none
                                        text-[#183b36]
                                    "
                                >
                                    SP Assistant
                                </p>

                                <p
                                    className="
                                        mt-1.5

                                        font-bengali
                                        text-[11px]
                                        leading-none
                                        text-[#7b8985]
                                    "
                                >
                                    আপনার সহায়তায় আছি
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center

                                rounded-full

                                text-[#87918e]

                                transition-colors
                                duration-200

                                hover:bg-black/[0.04]
                                hover:text-[#183b36]

                                focus:outline-none
                            "
                        >
                            <X size={17} strokeWidth={1.8} />
                        </button>
                    </div>

                    <div className="mx-5 h-px bg-[#ebe7df]" />

                    {/* =================================================
                        MESSAGES
                    ================================================== */}
                    <div
                        className="
                            flex-1
                            overflow-y-auto

                            px-5
                            py-6
                        "
                    >
                        <div className="space-y-5">
                            {messages.map((chatMessage) => {
                                const isUser = chatMessage.role === 'user';

                                return (
                                    <div
                                        key={chatMessage.id}
                                        className={`
                                            flex

                                            ${
                                                isUser
                                                    ? 'justify-end'
                                                    : 'justify-start'
                                            }
                                        `}
                                    >
                                        {isUser ? (
                                            /* =========================
                                                USER MESSAGE
                                            ========================== */
                                            <div
                                                className="
                                                    max-w-[78%]

                                                    rounded-[18px]
                                                    rounded-br-[6px]

                                                    bg-[#183f3a]

                                                    px-4
                                                    py-3
                                                "
                                            >
                                                <p
                                                    className="
                                                        font-bengali
                                                        text-[13.5px]
                                                        leading-[1.75]
                                                        text-white!
                                                    "
                                                >
                                                    {chatMessage.content}
                                                </p>
                                            </div>
                                        ) : (
                                            /* =========================
                                                ASSISTANT MESSAGE
                                            ========================== */
                                            <div
                                                className="
                                                    flex
                                                    max-w-[88%]
                                                    items-start
                                                    gap-2.5
                                                "
                                            >
                                                <div
                                                    className="
                                                        mt-1

                                                        flex
                                                        h-6
                                                        w-6
                                                        shrink-0
                                                        items-center
                                                        justify-center

                                                        rounded-full

                                                        bg-[#e7f1ef]

                                                        text-primary
                                                    "
                                                >
                                                    <HeartHandshake
                                                        size={12}
                                                        strokeWidth={1.8}
                                                    />
                                                </div>

                                                <div>
                                                    <p
                                                        className="
                                                            mb-1.5

                                                            text-[10px]
                                                            font-medium
                                                            tracking-[0.02em]
                                                            text-[#91a09c]
                                                        "
                                                    >
                                                        SP Assistant
                                                    </p>

                                                    <p
                                                        className="
                                                            font-bengali
                                                            text-[13.5px]
                                                            leading-[1.85]
                                                            text-[#294641]
                                                        "
                                                    >
                                                        {chatMessage.content}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* =========================================
                                LOADING
                            ========================================== */}
                            {isLoading && (
                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-2.5
                                    "
                                >
                                    <div
                                        className="
                                            mt-1

                                            flex
                                            h-6
                                            w-6
                                            shrink-0
                                            items-center
                                            justify-center

                                            rounded-full

                                            bg-[#e7f1ef]

                                            text-primary
                                        "
                                    >
                                        <HeartHandshake
                                            size={12}
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    <div>
                                        <p
                                            className="
                                                mb-2

                                                text-[10px]
                                                font-medium
                                                text-[#91a09c]
                                            "
                                        >
                                            SP Assistant
                                        </p>

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-1.5
                                            "
                                        >
                                            <span
                                                className="
                                                    h-1.5
                                                    w-1.5

                                                    animate-pulse
                                                    rounded-full

                                                    bg-[#9eaaa7]
                                                "
                                            />

                                            <span
                                                className="
                                                    h-1.5
                                                    w-1.5

                                                    animate-pulse
                                                    rounded-full

                                                    bg-[#9eaaa7]

                                                    [animation-delay:150ms]
                                                "
                                            />

                                            <span
                                                className="
                                                    h-1.5
                                                    w-1.5

                                                    animate-pulse
                                                    rounded-full

                                                    bg-[#9eaaa7]

                                                    [animation-delay:300ms]
                                                "
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* =================================================
                        COMPOSER
                    ================================================== */}
                    <div
                        className="
                            px-4
                            pt-2
                            pb-4
                        "
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="
                                flex
                                items-end
                                gap-2

                                overflow-hidden

                                rounded-[18px]

                                border
                                border-[#dedbd3]

                                bg-white

                                p-1.5

                                shadow-[0_4px_18px_rgba(24,59,54,0.05)]

                                transition-all
                                duration-200

                                focus-within:border-[#b4c9c4]
                                focus-within:shadow-[0_4px_22px_rgba(24,59,54,0.08)]
                            "
                        >
                            {/* =========================================
                                IMPORTANT:
                                Local inline styles intentionally reset
                                global textarea focus styling.
                            ========================================== */}
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
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    borderRadius: '12px',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    WebkitAppearance: 'none',
                                    appearance: 'none',
                                }}
                                className="
                                    max-h-28
                                    min-h-10
                                    flex-1
                                    resize-none

                                    px-3
                                    py-2.5

                                    font-bengali
                                    text-[13px]
                                    leading-normal
                                    text-[#294641]

                                    placeholder:text-[#96a09d]

                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
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

                                    rounded-[13px]

                                    bg-[#183f3a]

                                    text-white!

                                    transition-all
                                    duration-200

                                    hover:bg-primary

                                    disabled:cursor-not-allowed
                                    disabled:bg-[#d9dfdd]

                                    focus:outline-none
                                "
                            >
                                {isLoading ? (
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Send size={16} strokeWidth={1.9} />
                                )}
                            </button>
                        </form>

                        <div
                            className="
                                mt-2.5

                                flex
                                items-center
                                justify-center
                                gap-1.5
                            "
                        >
                            <HeartHandshake size={10} className="text-accent" />

                            <p
                                className="
                                    font-bengali
                                    text-[9.5px]
                                    text-[#a0aaa7]
                                "
                            >
                                Stand For People সহায়তা
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
    ASSISTANT LAUNCHER
========================================================== */}
{!isOpen && (
    <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="সহায়তা খুলুন"
        title="সহায়তা"
        className="
            fixed
            right-5
            bottom-5
            z-100

            inline-flex
            size-14
            items-center
            justify-center

            rounded-full
            border-0

            bg-primary
            text-white

            shadow-[0_6px_20px_rgba(15,118,110,0.24)]

            transition
            duration-200
            ease-out

            hover:-translate-y-0.5
            hover:bg-primary-hover
            hover:shadow-[0_9px_26px_rgba(15,118,110,0.30)]

            active:translate-y-0
            active:scale-[0.96]

            focus-visible:outline-none
            focus-visible:ring-3
            focus-visible:ring-primary/25
            focus-visible:ring-offset-3

            sm:right-6
            sm:bottom-6
        "
    >
        <MessageCircle
            size={23}
            strokeWidth={2}
            aria-hidden="true"
        />
    </button>
)}
        </>
    );
};

export default Chatbot;
