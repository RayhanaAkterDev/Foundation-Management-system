import React, { useEffect, useRef, useState } from 'react';

import {
    ArrowUpRight,
    HeartHandshake,
    Loader2,
    MessageCircle,
    Send,
    X,
} from 'lucide-react';

import { sendChatbotMessage } from '@/api/chatbot';
import { useChatbotContext } from '@/components/chatbot/useChatbotContext';

const QUICK_PROMPTS = [
    'কীভাবে সাহায্য চাইতে পারি?',
    'ক্যাম্পেইন সম্পর্কে জানতে চাই',
    'স্বেচ্ছাসেবক হতে চাই',
    'SP কীভাবে কাজ করে?',
];

const Chatbot = () => {
    const { pageContext } = useChatbotContext();

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content:
                'আসসালামু আলাইকুম! আমি SP Assistant। Stand For People সম্পর্কে জানতে বা সাহায্যের অনুরোধ করতে আমি আপনাকে গাইড করতে পারি।',
        },
    ]);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const messageIdRef = useRef(2);

    /*
    |--------------------------------------------------------------------------
    | MESSAGE ID
    |--------------------------------------------------------------------------
    */

    const getNextMessageId = () => {
        const id = messageIdRef.current;

        messageIdRef.current += 1;

        return id;
    };

    /*
    |--------------------------------------------------------------------------
    | AUTO SCROLL
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    }, [messages, isLoading]);

    /*
    |--------------------------------------------------------------------------
    | ESCAPE TO CLOSE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    /*
    |--------------------------------------------------------------------------
    | FOCUS INPUT WHEN OPENED
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            textareaRef.current?.focus();
        }, 250);

        return () => clearTimeout(timer);
    }, [isOpen]);

    /*
    |--------------------------------------------------------------------------
    | SEND MESSAGE
    |--------------------------------------------------------------------------
    */

    const submitMessage = async (rawMessage) => {
        const trimmedMessage = rawMessage.trim();

        if (!trimmedMessage || isLoading) {
            return;
        }

        const userMessage = {
            id: getNextMessageId(),
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
                id: getNextMessageId(),
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

            const errorMessage = {
                id: getNextMessageId(),
                role: 'assistant',
                content:
                    'দুঃখিত, এই মুহূর্তে সংযোগে সমস্যা হচ্ছে। কিছুক্ষণ পর আবার চেষ্টা করুন।',
            };

            setMessages((previousMessages) => [
                ...previousMessages,
                errorMessage,
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | FORM SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {
        event.preventDefault();

        await submitMessage(message);
    };

    /*
    |--------------------------------------------------------------------------
    | QUICK PROMPT
    |--------------------------------------------------------------------------
    */

    const handleQuickPrompt = async (prompt) => {
        await submitMessage(prompt);
    };

    /*
    |--------------------------------------------------------------------------
    | KEYBOARD
    |--------------------------------------------------------------------------
    */

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();

            if (!isLoading && message.trim()) {
                handleSubmit(event);
            }
        }
    };

    return (
        <>
            {/* =========================================================
                LAUNCHER
            ========================================================== */}

            {!isOpen && (
                <div
                    className="
                        group
                        fixed
                        right-3
                        bottom-3
                        z-[100]

                        min-[400px]:right-4
                        min-[400px]:bottom-4

                        sm:right-6
                        sm:bottom-6

                        motion-safe:animate-[chatFloat_4s_ease-in-out_infinite]
                    "
                >
                    {/* Tooltip */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            right-0
                            bottom-[calc(100%+12px)]

                            hidden
                            w-max

                            translate-y-2

                            rounded-[11px]

                            border
                            border-[#dce5e2]

                            bg-white

                            px-3.5
                            py-2

                            opacity-0

                            shadow-[0_10px_28px_rgba(15,23,42,0.08)]

                            transition-all
                            duration-200

                            sm:block

                            group-hover:translate-y-0
                            group-hover:opacity-100
                        "
                    >
                        <p
                            className="
                                font-bengali
                                text-[11px]
                                font-medium!
                                text-[#294641]
                            "
                        >
                            কীভাবে সাহায্য করতে পারি?
                        </p>

                        <span
                            className="
                                absolute
                                right-5
                                top-full

                                size-2

                                -translate-y-1/2
                                rotate-45

                                border-r
                                border-b
                                border-[#dce5e2]

                                bg-white
                            "
                        />
                    </div>

                    {/* Button */}

                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        aria-label="সহায়তা খুলুন"
                        className="
                            relative

                            flex
                            size-[54px]
                            items-center
                            justify-center

                            rounded-full

                            bg-[#0f766e]

                            text-white

                            shadow-[0_11px_30px_rgba(15,118,110,0.26)]

                            transition-all
                            duration-300
                            ease-out

                            min-[400px]:size-[56px]
                            sm:size-[58px]

                            hover:scale-[1.04]
                            hover:bg-[#115e59]
                            hover:shadow-[0_15px_38px_rgba(15,118,110,0.30)]

                            active:scale-[0.96]

                            focus-visible:outline-none
                            focus-visible:ring-4
                            focus-visible:ring-[#0f766e]/20
                            focus-visible:ring-offset-2
                        "
                    >
                        {/* Pulse */}

                        <span
                            className="
                                pointer-events-none
                                absolute
                                inset-0

                                rounded-full

                                border
                                border-[#0f766e]/30

                                motion-safe:animate-[chatPulse_3s_ease-out_infinite]
                            "
                        />

                        <MessageCircle
                            size={24}
                            strokeWidth={1.9}
                            className="
                                relative
                                z-10

                                transition-transform
                                duration-300

                                group-hover:rotate-[-6deg]
                                group-hover:scale-105
                            "
                        />

                        {/* Status */}

                        <span
                            className="
                                absolute
                                right-[2px]
                                bottom-[2px]
                                z-20

                                size-3

                                rounded-full

                                border-[2.5px]
                                border-[#0f766e]

                                bg-[#7fba94]
                            "
                        />
                    </button>
                </div>
            )}

            {/* =========================================================
                CHAT WINDOW
            ========================================================== */}

            {isOpen && (
                <section
                    aria-label="SP Assistant"
                    className="
                        fixed
                        inset-x-2
                        bottom-2
                        z-[100]

                        flex
                        h-[min(620px,calc(100dvh-16px))]
                        w-auto
                        flex-col

                        overflow-hidden

                        rounded-[18px]

                        border
                        border-[#dce4e1]

                        bg-white

                        shadow-[0_30px_80px_rgba(15,43,39,0.18)]

                        min-[400px]:inset-x-3
                        min-[400px]:bottom-3
                        min-[400px]:h-[min(630px,calc(100dvh-24px))]
                        min-[400px]:rounded-[20px]

                        sm:inset-x-auto
                        sm:right-6
                        sm:bottom-6
                        sm:h-[min(630px,calc(100dvh-48px))]
                        sm:w-[414px]
                        sm:rounded-[22px]

                        motion-safe:animate-[chatOpen_220ms_cubic-bezier(0.22,1,0.36,1)]
                    "
                >
                    {/* =================================================
                        HEADER
                    ================================================== */}

                    <header
                        className="
                            relative
                            shrink-0

                            border-b
                            border-[#e5ebe8]

                            bg-white

                            px-3.5
                            pt-3.5
                            pb-3.5

                            min-[400px]:px-4
                            min-[400px]:pt-4
                            min-[400px]:pb-4

                            sm:px-5
                            sm:pt-[17px]
                            sm:pb-4
                        "
                    >
                        <div className="flex items-center justify-between gap-3 sm:gap-4">
                            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                                {/* Identity mark */}

                                <div
                                    className="
                                        relative

                                        flex
                                        size-[38px]
                                        shrink-0
                                        items-center
                                        justify-center

                                        rounded-[11px]

                                        border
                                        border-[#cfe3df]

                                        bg-[#eaf4f2]

                                        text-[#0f766e]

                                        min-[400px]:size-10

                                        sm:size-[42px]
                                        sm:rounded-[12px]
                                    "
                                >
                                    <HeartHandshake
                                        size={20}
                                        strokeWidth={1.8}
                                    />

                                    <span
                                        className="
                                            absolute
                                            -right-[3px]
                                            -bottom-[3px]

                                            size-[11px]

                                            rounded-full

                                            border-[2.5px]
                                            border-white

                                            bg-[#73ad87]
                                        "
                                    />
                                </div>

                                <div className="min-w-0">
                                    <div className="flex min-w-0 items-center gap-1.5 min-[400px]:gap-2">
                                        <p
                                            className="
                                                truncate

                                                text-[14px]
                                                font-semibold
                                                leading-none

                                                text-[#183b36]

                                                sm:text-[15px]
                                            "
                                        >
                                            SP Assistant
                                        </p>

                                        <span
                                            className="
                                                size-[5px]
                                                shrink-0
                                                rounded-full
                                                bg-[#76ad88]
                                            "
                                        />

                                        <span
                                            className="
                                                shrink-0
                                                rounded-full

                                                bg-[#edf5f1]

                                                px-1.5
                                                py-0.5

                                                text-[7px]
                                                font-medium!
                                                uppercase
                                                tracking-[0.06em]

                                                text-[#5d8b79]

                                                min-[400px]:text-[8px]
                                                min-[400px]:tracking-[0.08em]
                                            "
                                        >
                                            Online
                                        </span>
                                    </div>

                                    <p
                                        className="
                                            mt-1.5
                                            truncate

                                            font-bengali
                                            text-[10.5px]
                                            leading-none

                                            text-[#72827e]

                                            min-[400px]:mt-[7px]

                                            sm:text-[11.5px]
                                        "
                                    >
                                        Stand For People সহায়তা
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="চ্যাট বন্ধ করুন"
                                className="
                                    flex
                                    size-8
                                    shrink-0
                                    items-center
                                    justify-center

                                    rounded-[10px]

                                    text-[#778581]

                                    transition-all
                                    duration-200

                                    min-[400px]:size-9

                                    hover:bg-[#f1f5f3]
                                    hover:text-[#183b36]

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-[#0f766e]/20
                                "
                            >
                                <X size={18} strokeWidth={1.8} />
                            </button>
                        </div>
                    </header>

                    {/* =================================================
                        CONVERSATION
                    ================================================== */}

                    <div
                        className="
                            min-h-0
                            flex-1

                            overflow-y-auto
                            overscroll-contain

                            bg-[#fbfcfc]

                            px-3.5
                            py-4

                            min-[400px]:px-4
                            min-[400px]:py-[18px]

                            sm:px-5
                            sm:py-5

                            scrollbar-thin
                            scrollbar-thumb-[#d9dfdc]
                            scrollbar-track-transparent
                        "
                    >
                        <div className="space-y-4 min-[400px]:space-y-[18px] sm:space-y-5">
                            {messages.map((chatMessage) => {
                                const isUser = chatMessage.role === 'user';

                                return (
                                    <div
                                        key={chatMessage.id}
                                        className={
                                            isUser
                                                ? 'flex justify-end'
                                                : 'flex justify-start'
                                        }
                                    >
                                        {isUser ? (
                                            /* USER */

                                            <div
                                                className="
                                                    max-w-[88%]

                                                    rounded-[18px]
                                                    rounded-br-[5px]

                                                    bg-[#134e4a]

                                                    px-3.5
                                                    py-2.5

                                                    shadow-[0_3px_10px_rgba(19,78,74,0.08)]

                                                    min-[400px]:max-w-[85%]
                                                    min-[400px]:px-4
                                                    min-[400px]:py-[11px]

                                                    sm:max-w-[82%]
                                                "
                                            >
                                                <p
                                                    className="
                                                        font-bengali

                                                        text-[13px]
                                                        leading-[1.72]

                                                        text-white

                                                        min-[400px]:text-[13.5px]
                                                        min-[400px]:leading-[1.75]
                                                    "
                                                >
                                                    {chatMessage.content}
                                                </p>
                                            </div>
                                        ) : (
                                            /* ASSISTANT */

                                            <div
                                                className="
                                                    flex
                                                    max-w-full
                                                    items-start
                                                    gap-2

                                                    min-[400px]:gap-[10px]

                                                    sm:max-w-[94%]
                                                "
                                            >
                                                <div
                                                    className="
                                                        mt-[2px]

                                                        flex
                                                        size-[26px]
                                                        shrink-0
                                                        items-center
                                                        justify-center

                                                        rounded-[8px]

                                                        bg-[#e6f3f1]

                                                        text-[#0f766e]

                                                        min-[400px]:size-7
                                                    "
                                                >
                                                    <HeartHandshake
                                                        size={13}
                                                        strokeWidth={1.8}
                                                    />
                                                </div>

                                                <div className="min-w-0 pt-[1px]">
                                                    <p
                                                        className="
                                                            mb-[5px]

                                                            text-[9px]
                                                            font-semibold
                                                            tracking-[0.025em]

                                                            text-[#879692]

                                                            min-[400px]:text-[9.5px]
                                                        "
                                                    >
                                                        SP Assistant
                                                    </p>

                                                    <p
                                                        className="
                                                            font-bengali

                                                            text-[13px]
                                                            leading-[1.78]

                                                            text-[#294641]

                                                            min-[400px]:text-[13.5px]
                                                            min-[400px]:leading-[1.82]
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

                            {/* =================================================
                                QUICK START
                            ================================================== */}

                            {messages.length === 1 && !isLoading && (
                                <div
                                    className="
                                        ml-[34px]
                                        pt-1

                                        min-[400px]:ml-[38px]

                                        motion-safe:animate-[suggestionsIn_320ms_ease-out]
                                    "
                                >
                                    <p
                                        className="
                                            mb-2

                                            font-bengali
                                            text-[10px]
                                            font-medium!

                                            text-[#7c8b87]

                                            min-[400px]:mb-2.5
                                            min-[400px]:text-[10.5px]
                                        "
                                    >
                                        অথবা একটি বিষয় বেছে নিন
                                    </p>

                                    <div className="space-y-[6px] min-[400px]:space-y-[7px]">
                                        {QUICK_PROMPTS.map((prompt) => (
                                            <button
                                                key={prompt}
                                                type="button"
                                                onClick={() =>
                                                    handleQuickPrompt(prompt)
                                                }
                                                className="
                                                    group/prompt

                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-between
                                                    gap-3

                                                    rounded-[11px]

                                                    border
                                                    border-[#dfe7e4]

                                                    bg-white

                                                    px-3
                                                    py-[9px]

                                                    text-left

                                                    transition-all
                                                    duration-200

                                                    min-[400px]:gap-4
                                                    min-[400px]:px-3.5
                                                    min-[400px]:py-[10px]

                                                    hover:border-[#b9d2cc]
                                                    hover:bg-[#f5f9f7]

                                                    focus-visible:outline-none
                                                    focus-visible:ring-2
                                                    focus-visible:ring-[#0f766e]/15
                                                "
                                            >
                                                <span
                                                    className="
                                                        font-bengali

                                                        text-[11px]
                                                        leading-[1.5]

                                                        text-[#38564f]

                                                        transition-colors

                                                        min-[400px]:text-[11.5px]

                                                        group-hover/prompt:text-[#0f766e]
                                                    "
                                                >
                                                    {prompt}
                                                </span>

                                                <ArrowUpRight
                                                    size={13}
                                                    strokeWidth={1.8}
                                                    className="
                                                        shrink-0

                                                        text-[#9ba8a4]

                                                        transition-all
                                                        duration-200

                                                        group-hover/prompt:-translate-y-px
                                                        group-hover/prompt:translate-x-px
                                                        group-hover/prompt:text-[#0f766e]
                                                    "
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* =================================================
                                LOADING
                            ================================================== */}

                            {isLoading && (
                                <div className="flex items-start gap-2 min-[400px]:gap-[10px]">
                                    <div
                                        className="
                                            mt-[2px]

                                            flex
                                            size-[26px]
                                            shrink-0
                                            items-center
                                            justify-center

                                            rounded-[8px]

                                            bg-[#e6f3f1]

                                            text-[#0f766e]

                                            min-[400px]:size-7
                                        "
                                    >
                                        <HeartHandshake
                                            size={13}
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    <div>
                                        <p
                                            className="
                                                mb-[6px]

                                                text-[9px]
                                                font-semibold

                                                text-[#879692]

                                                min-[400px]:text-[9.5px]
                                            "
                                        >
                                            SP Assistant
                                        </p>

                                        <div
                                            className="
                                                flex
                                                h-9
                                                items-center
                                                gap-[5px]

                                                rounded-[11px]

                                                border
                                                border-[#e2e9e6]

                                                bg-white

                                                px-3.5
                                            "
                                        >
                                            <span
                                                className="
                                                    size-[5px]
                                                    rounded-full
                                                    bg-[#7d918b]

                                                    motion-safe:animate-[typingDot_1.2s_ease-in-out_infinite]
                                                "
                                            />

                                            <span
                                                className="
                                                    size-[5px]
                                                    rounded-full
                                                    bg-[#7d918b]

                                                    motion-safe:animate-[typingDot_1.2s_ease-in-out_150ms_infinite]
                                                "
                                            />

                                            <span
                                                className="
                                                    size-[5px]
                                                    rounded-full
                                                    bg-[#7d918b]

                                                    motion-safe:animate-[typingDot_1.2s_ease-in-out_300ms_infinite]
                                                "
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* =================================================
                        COMPOSER
                    ================================================== */}

                    <footer
                        className="
                            shrink-0

                            border-t
                            border-[#e5ebe8]

                            bg-white

                            px-3
                            pt-2.5
                            pb-[max(10px,env(safe-area-inset-bottom))]

                            min-[400px]:px-3.5
                            min-[400px]:pt-3

                            sm:px-4
                            sm:pb-3
                        "
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="
                                chatbot-composer

                                flex
                                items-end
                                gap-1.5

                                rounded-[15px]

                                border
                                border-[#d7e0dd]

                                bg-[#f8faf9]

                                p-[5px]

                                transition-all
                                duration-200

                                min-[400px]:gap-2

                                focus-within:border-[#9ebfb7]
                                focus-within:bg-white
                                focus-within:shadow-[0_0_0_3px_rgba(15,118,110,0.055)]
                            "
                        >
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={(event) =>
                                    setMessage(event.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="আপনার প্রশ্ন লিখুন..."
                                rows={1}
                                disabled={isLoading}
                                className="
                                    chatbot-input

                                    max-h-24
                                    min-h-10
                                    min-w-0
                                    flex-1
                                    resize-none

                                    !m-0
                                    !rounded-none
                                    !border-0
                                    !bg-transparent

                                    px-2.5
                                    py-[9px]

                                    font-bengali
                                    text-[13px]
                                    leading-[1.55]

                                    text-[#294641]

                                    !outline-none
                                    !ring-0
                                    !shadow-none

                                    placeholder:text-[#919d99]

                                    min-[400px]:px-3
                                    min-[400px]:py-[10px]

                                    sm:max-h-28
                                    sm:min-h-[42px]

                                    focus:!border-0
                                    focus:!outline-none
                                    focus:!ring-0
                                    focus:!shadow-none

                                    focus-visible:!border-0
                                    focus-visible:!outline-none
                                    focus-visible:!ring-0
                                    focus-visible:!shadow-none

                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            />

                            <button
                                type="submit"
                                disabled={!message.trim() || isLoading}
                                aria-label="বার্তা পাঠান"
                                className="
                                    flex
                                    size-10
                                    shrink-0
                                    items-center
                                    justify-center

                                    rounded-[11px]

                                    bg-[#134e4a]

                                    text-white

                                    transition-all
                                    duration-200

                                    min-[400px]:size-[42px]

                                    hover:bg-[#0f766e]
                                    hover:shadow-[0_5px_14px_rgba(15,118,110,0.16)]

                                    active:scale-[0.96]

                                    disabled:cursor-not-allowed
                                    disabled:bg-[#d7dfdc]
                                    disabled:text-[#98a5a1]
                                    disabled:shadow-none

                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-[#0f766e]/20
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

                        <p
                            className="
                                mt-[6px]

                                px-2

                                text-center

                                font-bengali
                                text-[8.5px]
                                leading-[1.45]

                                text-[#9aa6a2]

                                min-[400px]:mt-[7px]
                                min-[400px]:text-[9px]
                            "
                        >
                            SP Assistant প্রয়োজনীয় তথ্য ও দিকনির্দেশনা দিতে
                            সহায়তা করে
                        </p>
                    </footer>
                </section>
            )}

            {/* =========================================================
                LOCAL CHATBOT STYLES
            ========================================================== */}

            <style>{`
                /*
                 * Disable global form/input focus styles
                 * ONLY inside the chatbot textarea.
                 */
                .chatbot-composer .chatbot-input,
                .chatbot-composer .chatbot-input:hover,
                .chatbot-composer .chatbot-input:focus,
                .chatbot-composer .chatbot-input:focus-visible,
                .chatbot-composer .chatbot-input:active {
                    outline: none !important;
                    box-shadow: none !important;
                    border: 0 !important;
                    border-color: transparent !important;
                    background: transparent !important;
                    -webkit-appearance: none !important;
                    appearance: none !important;
                }

                /*
                 * Helps prevent iOS/browser form styling from leaking
                 * into this specific textarea.
                 */
                .chatbot-composer textarea.chatbot-input {
                    -webkit-tap-highlight-color: transparent;
                }

                /*
                 * Prevent horizontal overflow caused by long unbroken
                 * message content.
                 */
                [aria-label="SP Assistant"] p {
                    overflow-wrap: anywhere;
                    word-break: break-word;
                }

                @keyframes chatFloat {
                    0%,
                    100% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(-4px);
                    }
                }

                @keyframes chatPulse {
                    0% {
                        transform: scale(1);
                        opacity: 0.6;
                    }

                    70% {
                        transform: scale(1.25);
                        opacity: 0;
                    }

                    100% {
                        transform: scale(1.25);
                        opacity: 0;
                    }
                }

                @keyframes chatOpen {
                    from {
                        opacity: 0;
                        transform: translateY(14px) scale(0.97);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes suggestionsIn {
                    from {
                        opacity: 0;
                        transform: translateY(7px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes typingDot {
                    0%,
                    60%,
                    100% {
                        transform: translateY(0);
                        opacity: 0.4;
                    }

                    30% {
                        transform: translateY(-3px);
                        opacity: 1;
                    }
                }

                @media (max-height: 560px) {
                    [aria-label="SP Assistant"] {
                        height: calc(100dvh - 12px);
                        bottom: 6px;
                    }
                }

                @media (max-height: 450px) and (orientation: landscape) {
                    [aria-label="SP Assistant"] {
                        height: calc(100dvh - 8px);
                        bottom: 4px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .chatbot-composer *,
                    .chatbot-composer *::before,
                    .chatbot-composer *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>
        </>
    );
};

export default Chatbot;
