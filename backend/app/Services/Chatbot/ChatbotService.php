<?php

namespace App\Services\Chatbot;

class ChatbotService
{
    public function chat(
        string $message,
        ?array $pageContext = null
    ): array {
        $message = trim($message);

        if ($message === '') {
            return [
                'message' => 'Please enter a question.',
                'source' => 'local',
                'language' => 'en',
            ];
        }

        $knowledge = SpKnowledge::get();

        $language = $this->detectLanguage($message);

        return [
            'message' => $this->localResponse(
                $message,
                $knowledge,
                $language,
                $pageContext
            ),
            'source' => 'local',
            'language' => $language,
        ];
    }

    private function detectLanguage(string $message): string
    {
        /*
         * Bangla Unicode.
         */
        if (preg_match('/[\x{0980}-\x{09FF}]/u', $message)) {
            return 'bn';
        }

        /*
         * Conservative Banglish detection.
         *
         * Pure English questions should remain English.
         */
        $banglishPatterns = [
            'kivabe',
            'kibhabe',
            'ki vabe',
            'ki bhabe',
            'korbo',
            'korte',
            'parbo',
            'pabo',
            'pawa',
            'chai',
            'ache',
            'ase',
            'jonno',
            'niye',
            'niyom',
            'somorthon',
            'sahajjo',
            'sahayjo',
            'request kor',
            'help request kor',
            'volunteer hobo',
            'donation dibo',
            'donate korbo',
            'campaign e',
            'sp te',
            'tumi ke',
            'tumi ki',
            'toke ke',
            'tomake ke',
            'date e',
            'date kor',
            'hobo',
            'hobe',
            'banba',
            'banbe',
            'real naki',
            'ashol naki',
            'asole ki',
            'sotti ki',
            'taka',
            'help dorkar',
            'help lagbe',
            'help chai',
            'request dibo',
            'request dite',
            'submit korbo',
            'submit korte',
            'donation dibo',
            'donate korbo',
        ];

        $normalized = mb_strtolower($message);

        foreach ($banglishPatterns as $pattern) {
            if (str_contains($normalized, $pattern)) {
                return 'banglish';
            }
        }

        return 'en';
    }

    private function localResponse(
        string $message,
        array $knowledge,
        string $language,
        ?array $pageContext = null
    ): string {
        $normalized = mb_strtolower(trim($message));

        /*
         * =========================================================
         * PAGE-AWARE SUMMARY
         * =========================================================
         *
         * This runs before the normal SP topic matching.
         *
         * The chatbot only uses explicitly supplied public page
         * context. It does not inspect the DOM or private data.
         */
        if (
            $pageContext !== null &&
            $this->isPageSummaryQuestion($normalized)
        ) {
            return $this->summarizePage(
                $pageContext,
                $language
            );
        }

        /*
         * =========================================================
         * ASSISTANT IDENTITY
         * =========================================================
         */
        if (
            str_contains($normalized, 'who are you') ||
            str_contains($normalized, 'what are you') ||
            str_contains($normalized, 'tumi ke') ||
            str_contains($normalized, 'আপনি কে') ||
            str_contains($normalized, 'তুমি কে') ||
            str_contains($normalized, 'তুমি কী') ||
            str_contains($normalized, 'কে তুমি')
        ) {
            if ($language === 'bn') {
                return 'আমি SP Assistant — Stand For People-এর ভার্চুয়াল সহকারী। আমি SP-এর বিভিন্ন সেবা, যেমন সাহায্যের অনুরোধ, ক্যাম্পেইন, বিভাগ, স্বেচ্ছাসেবক ও অনুদান সম্পর্কে আপনাকে তথ্য দিতে এবং সঠিক পথে গাইড করতে পারি।';
            }

            if ($language === 'banglish') {
                return 'Ami SP Assistant — Stand For People-er virtual assistant. Ami SP-er Help Request, Campaign, Category, Volunteer ebong Donation niye apnake information dite ebong platform-e guide korte pari.';
            }

            return 'I’m SP Assistant, the virtual assistant for Stand For People. I can help you understand SP, find the right services, learn how Help Requests work, explore Campaigns and Categories, and learn about Volunteering and Donations.';
        }

        /*
         * =========================================================
         * ASSISTANT CREATOR / OWNERSHIP
         * =========================================================
         */
        if (
            str_contains($normalized, 'who built you') ||
            str_contains($normalized, 'who created you') ||
            str_contains($normalized, 'who made you') ||
            str_contains($normalized, 'who developed you') ||
            str_contains($normalized, 'who is your owner') ||
            str_contains($normalized, 'who owns you') ||
            str_contains($normalized, 'তোমাকে কে বানিয়েছে') ||
            str_contains($normalized, 'তোমাকে কে বানিয়েছে') ||
            str_contains($normalized, 'কে তোমাকে তৈরি করেছে') ||
            str_contains($normalized, 'কে তোমাকে বানিয়েছে') ||
            str_contains($normalized, 'তোমার মালিক কে') ||
            str_contains($normalized, 'toke ke banayche') ||
            str_contains($normalized, 'toke ke banayse') ||
            str_contains($normalized, 'tomake ke banayche') ||
            str_contains($normalized, 'tomake ke create korse') ||
            str_contains($normalized, 'ke tomake banayche') ||
            str_contains($normalized, 'ke tomake create korse')
        ) {
            if ($language === 'bn') {
                return 'আমি Stand For People-এর জন্য তৈরি করা SP Assistant। আমি SP-এর ব্যবহারকারীদের প্ল্যাটফর্মের বিভিন্ন সেবা ও কার্যক্রম সম্পর্কে তথ্য দিতে এবং সঠিকভাবে গাইড করতে তৈরি হয়েছি।';
            }

            if ($language === 'banglish') {
                return 'Ami Stand For People-er jonno toiri kora SP Assistant. Ami SP-er users-der platform-er bibhinno service o activities niye information dite ebong thik vabe guide korte toiri hoyechi.';
            }

            return 'I’m SP Assistant, created for Stand For People. I’m designed to help SP users understand the platform, its services, and its humanitarian activities.';
        }

        /*
         * =========================================================
         * CASUAL / ODD / PERSONAL QUESTIONS
         * =========================================================
         */

        /*
         * Are you real / human?
         */
        if (
            str_contains($normalized, 'are you real') ||
            str_contains($normalized, 'are you a real person') ||
            str_contains($normalized, 'real person') ||
            str_contains($normalized, 'are you human') ||
            str_contains($normalized, 'tumi ki real') ||
            str_contains($normalized, 'tumi ki manush') ||
            str_contains($normalized, 'tumi ki ashol') ||
            str_contains($normalized, 'tumi ki sotti') ||
            str_contains($normalized, 'tumi ki real naki') ||
            str_contains($normalized, 'তুমি কি মানুষ') ||
            str_contains($normalized, 'তুমি কি সত্যি মানুষ') ||
            str_contains($normalized, 'তুমি কি আসল') ||
            str_contains($normalized, 'তুমি কি সত্যি') ||
            str_contains($normalized, 'তুমি কি রিয়েল') ||
            str_contains($normalized, 'তুমি কি রিয়েল')
        ) {
            if ($language === 'bn') {
                return 'আমি একজন AI-powered virtual assistant, মানুষ নই। 😄 তবে Stand For People সম্পর্কে তথ্য দিতে এবং আপনাকে গাইড করতে আমি এখানে আছি।';
            }

            if ($language === 'banglish') {
                return 'Ami ekjon AI-powered virtual assistant, manush noi. Tobe Stand For People niye information dite ebong apnake guide korte ami ekhane achi.';
            }

            return 'I’m an AI-powered virtual assistant, not a human. 😄 But I’m here to help you understand and use Stand For People.';
        }

        /*
         * Thanks
         */
        if (
            str_contains($normalized, 'thank you') ||
            str_contains($normalized, 'thanks') ||
            str_contains($normalized, 'thank u') ||
            str_contains($normalized, 'ধন্যবাদ') ||
            str_contains($normalized, 'অনেক ধন্যবাদ') ||
            str_contains($normalized, 'thanks bot') ||
            str_contains($normalized, 'thank you bot')
        ) {
            if ($language === 'bn') {
                return 'আপনাকেও ধন্যবাদ! 😊 Stand For People সম্পর্কে আর কিছু জানতে চাইলে আমাকে জিজ্ঞেস করতে পারেন।';
            }

            if ($language === 'banglish') {
                return 'Apnakeo dhonnobad! 😊 Stand For People niye aro kichu jante chaile amake jiggesh korte paren.';
            }

            return 'You’re welcome! 😊 If you have any other questions about Stand For People, feel free to ask.';
        }

        /*
         * Goodbye
         */
        if (
            $normalized === 'bye' ||
            str_contains($normalized, 'goodbye') ||
            str_contains($normalized, 'bye bye') ||
            str_contains($normalized, 'বিদায়') ||
            str_contains($normalized, 'বিদায়') ||
            str_contains($normalized, 'আবার দেখা হবে')
        ) {
            if ($language === 'bn') {
                return 'বিদায়! 👋 Stand For People-এর সাথে থাকার জন্য ধন্যবাদ। আবার কোনো সাহায্য দরকার হলে আমি এখানে আছি।';
            }

            if ($language === 'banglish') {
                return 'Bye! 👋 Stand For People-er sathe thakar jonno dhonnobad. Abar kono help dorkar hole ami ekhanei achi.';
            }

            return 'Goodbye! 👋 Thanks for being part of Stand For People. I’ll be here whenever you need help.';
        }

        /*
         * Date
         */
        if (
            str_contains($normalized, 'date with me') ||
            str_contains($normalized, 'go on a date') ||
            str_contains($normalized, 'date e jaba') ||
            str_contains($normalized, 'date e jabe') ||
            str_contains($normalized, 'date korba') ||
            str_contains($normalized, 'date korbe') ||
            str_contains($normalized, 'আমার সাথে ডেটে') ||
            str_contains($normalized, 'ডেটে যাবে') ||
            str_contains($normalized, 'ডেটে যাবা')
        ) {
            if ($language === 'bn') {
                return 'আমি SP Assistant—ডেটে যাওয়ার জন্য নয়, Stand For People সম্পর্কে আপনাকে সাহায্য করার জন্য তৈরি!';
            }

            if ($language === 'banglish') {
                return 'Ami SP Assistant — date-e jawar jonno noi, Stand For People niye apnake help korar jonno toiri!';
            }

            return '😄 I’m SP Assistant — I’m here to help you with Stand For People, not to go on dates!';
        }

        /*
         * Boyfriend / girlfriend
         */
        if (
            str_contains($normalized, 'boyfriend') ||
            str_contains($normalized, 'girlfriend') ||
            str_contains($normalized, 'bf hobe') ||
            str_contains($normalized, 'gf hobe') ||
            str_contains($normalized, 'bf banba') ||
            str_contains($normalized, 'gf banba') ||
            str_contains($normalized, 'বয়ফ্রেন্ড') ||
            str_contains($normalized, 'বয়ফ্রেন্ড') ||
            str_contains($normalized, 'গার্লফ্রেন্ড') ||
            str_contains($normalized, 'প্রেম করবে') ||
            str_contains($normalized, 'প্রেম করবা')
        ) {
            if ($language === 'bn') {
                return '😄 আমি আপনার SP Assistant হতে পারি, কিন্তু boyfriend বা girlfriend নয়। SP নিয়ে কোনো প্রশ্ন থাকলে অবশ্যই সাহায্য করতে পারি!';
            }

            if ($language === 'banglish') {
                return '😄 Ami apnar SP Assistant hote pari, kintu boyfriend ba girlfriend noi. SP niye kono question thakle obosshoi help korte pari!';
            }

            return '😄 I can be your SP Assistant, but not your boyfriend or girlfriend. I’d be happy to help with anything related to Stand For People!';
        }

        /*
         * =========================================================
         * SP PLATFORM
         * =========================================================
         */
        if (
            str_contains($normalized, 'what is sp') ||
            str_contains($normalized, 'what is stand for people') ||
            str_contains($normalized, 'what does sp do') ||
            str_contains($normalized, 'what does stand for people do') ||
            str_contains($normalized, 'how does sp work') ||
            str_contains($normalized, 'how does stand for people work') ||
            str_contains($normalized, 'sp ki') ||
            str_contains($normalized, 'sp কী') ||
            str_contains($normalized, 'sp আসলে কী') ||
            str_contains($normalized, 'sp কি করে') ||
            str_contains($normalized, 'sp কী করে') ||
            str_contains($normalized, 'sp কীভাবে কাজ করে') ||
            str_contains($normalized, 'sp কিভাবে কাজ করে') ||
            str_contains($normalized, 'stand for people কী') ||
            str_contains($normalized, 'stand for people কী করে') ||
            str_contains($normalized, 'stand for people কি করে') ||
            str_contains($normalized, 'sp te ki hoy') ||
            str_contains($normalized, 'sp te ki kora jay') ||
            str_contains($normalized, 'sp ki kore') ||
            str_contains($normalized, 'sp kivabe kaj kore') ||
            str_contains($normalized, 'sp kibhabe kaj kore') ||
            str_contains($normalized, 'stand for people ki kore')
        ) {
            if ($language === 'bn') {
                return 'Stand For People (SP) একটি centralized humanitarian coordination platform, যেখানে সাহায্যের প্রয়োজন আছে এমন মানুষ এবং সহায়তা করতে আগ্রহী ব্যক্তি ও প্রতিষ্ঠানকে একসাথে যুক্ত করা হয়। SP-এর মাধ্যমে Help Request, Campaign, Volunteer এবং Donation-এর মতো মানবিক কার্যক্রমের সঙ্গে যুক্ত হওয়া যায়।';
            }

            if ($language === 'banglish') {
                return 'Stand For People (SP) holo ekta centralized humanitarian coordination platform, jekhane jader help dorkar tader sathe help korte interested individual o organization-ke connect kora hoy. SP-te Help Request, Campaign, Volunteer ebong Donation-er moto humanitarian activities-er sathe jukto howa jay.';
            }

            return 'Stand For People (SP) is a centralized humanitarian coordination platform that connects people who need help with individuals and organizations that can contribute support. The platform supports activities such as Help Requests, Campaigns, Volunteering, and Donations.';
        }

        /*
         * =========================================================
         * FAKE / FALSE HELP REQUEST
         * =========================================================
         */
        if (
            str_contains($normalized, 'can i submit fake') ||
            str_contains($normalized, 'fake help request') ||
            str_contains($normalized, 'can i make a fake request') ||
            str_contains($normalized, 'can i submit a false') ||
            str_contains($normalized, 'false help request') ||
            str_contains($normalized, 'fake request') ||
            str_contains($normalized, 'fake help') ||
            str_contains($normalized, 'মিথ্যা help request') ||
            str_contains($normalized, 'ভুয়া সাহায্যের অনুরোধ') ||
            str_contains($normalized, 'ভুয়া সাহায্যের অনুরোধ') ||
            str_contains($normalized, 'মিথ্যা অনুরোধ') ||
            str_contains($normalized, 'ভুয়া অনুরোধ') ||
            str_contains($normalized, 'ভুয়া অনুরোধ') ||
            str_contains($normalized, 'fake request dibo') ||
            str_contains($normalized, 'mittha request') ||
            str_contains($normalized, 'mittha help request')
        ) {
            if ($language === 'bn') {
                return 'Help Request-এ সঠিক ও সত্য তথ্য দেওয়া গুরুত্বপূর্ণ। মিথ্যা বা বিভ্রান্তিকর তথ্য দেওয়া উচিত নয়। SP-এর বিদ্যমান verification workflow-এর মাধ্যমে জমা দেওয়া অনুরোধ পর্যালোচনা করা হয়।';
            }

            if ($language === 'banglish') {
                return 'Help Request-e shothik o true information deya important. Miththa ba misleading information deya uchit noy. SP-er existing verification workflow-er maddhome submit kora request review kora hoy.';
            }

            return 'It is important to provide accurate and truthful information in a Help Request. False or misleading information should not be submitted. Requests go through SP’s existing verification workflow.';
        }

        /*
         * =========================================================
         * HELP REQUEST
         * =========================================================
         */
        if (
            str_contains($normalized, 'help request') ||
            str_contains($normalized, 'request help') ||
            str_contains($normalized, 'ask for help') ||
            str_contains($normalized, 'need help') ||
            str_contains($normalized, 'সাহায্যের অনুরোধ') ||
            str_contains($normalized, 'সাহায্যের জন্য অনুরোধ') ||
            str_contains($normalized, 'সাহায্য চাই') ||
            str_contains($normalized, 'সাহায্য দরকার') ||
            str_contains($normalized, 'সহায়তা চাই') ||
            str_contains($normalized, 'সহায়তা চাই') ||
            str_contains($normalized, 'help chai') ||
            str_contains($normalized, 'help dorkar') ||
            str_contains($normalized, 'help lagbe') ||
            str_contains($normalized, 'help request korbo') ||
            str_contains($normalized, 'help request korte')
        ) {
            /*
             * How to submit.
             */
            if (
                str_contains($normalized, 'how') ||
                str_contains($normalized, 'kivabe') ||
                str_contains($normalized, 'kibhabe') ||
                str_contains($normalized, 'ki vabe') ||
                str_contains($normalized, 'কীভাবে') ||
                str_contains($normalized, 'কিভাবে') ||
                str_contains($normalized, 'করব') ||
                str_contains($normalized, 'করবো') ||
                str_contains($normalized, 'করতে পারি') ||
                str_contains($normalized, 'submit') ||
                str_contains($normalized, 'জমা')
            ) {
                if ($language === 'bn') {
                    return 'সাহায্যের অনুরোধ করতে প্রথমে আপনার SP অ্যাকাউন্টে লগইন করুন। এরপর “সাহায্যের অনুরোধ” পেজে আপনার পরিস্থিতি নিজের ভাষায় লিখুন। SP আপনার তথ্য বিশ্লেষণ করে কিছু তথ্য সাজেস্ট করবে। আপনি সেগুলো পর্যালোচনা ও প্রয়োজন অনুযায়ী পরিবর্তন করে অনুরোধটি জমা দিতে পারবেন।';
                }

                if ($language === 'banglish') {
                    return 'Help request korte prothome apnar SP account-e login korun. Tarpor “Request Help” page-e apnar situation nijer vashay likhun. SP apnar information analyze kore kichu information suggest korbe. Apni segulo review kore proyojon moto change kore request submit korte parben.';
                }

                return 'To submit a Help Request, log in to your SP account and describe your situation on the Request Help page. SP can analyze the description and suggest relevant information. You can review and edit the suggestions before submitting the request.';
            }

            /*
             * General Help Request explanation.
             */
            if ($language === 'bn') {
                return 'Help Request হলো SP-এর এমন একটি ব্যবস্থা, যার মাধ্যমে একজন individual user তার প্রয়োজনের পরিস্থিতি বর্ণনা করে মানবিক সহায়তার অনুরোধ করতে পারেন।';
            }

            if ($language === 'banglish') {
                return 'Help Request holo SP-er ekta system, jar maddhome ekjon individual user tar proyojoner situation describe kore humanitarian assistance-er request korte paren.';
            }

            return $knowledge['help_requests']['description'];
        }

        /*
         * =========================================================
         * CAMPAIGNS
         * =========================================================
         */

        /*
         * ---------------------------------------------------------
         * Current campaign page
         * ---------------------------------------------------------
         *
         * IMPORTANT:
         * This block must run BEFORE the generic CATEGORIES block.
         * Otherwise a question such as:
         *
         * "What category is this campaign?"
         *
         * would be caught by the generic category matcher first.
         */
        if (
            $pageContext !== null &&
            ($pageContext['type'] ?? null) === 'campaign'
        ) {
            /*
             * -----------------------------------------------------
             * Campaign category
             * -----------------------------------------------------
             */
            if (
                str_contains($normalized, 'what category is this campaign') ||
                str_contains($normalized, 'which category is this campaign') ||
                str_contains($normalized, 'what category does this campaign belong to') ||
                str_contains($normalized, 'which category does this campaign belong to') ||
                str_contains($normalized, 'tell me the category of this campaign') ||
                str_contains($normalized, 'এই ক্যাম্পেইনের বিভাগ কী') ||
                str_contains($normalized, 'এই ক্যাম্পেইন কোন বিভাগে') ||
                str_contains($normalized, 'এই ক্যাম্পেইন কোন বিভাগের') ||
                str_contains($normalized, 'ei campaign er category ki') ||
                str_contains($normalized, 'ei campaign kon category te') ||
                str_contains($normalized, 'ei campaign kon category-r')
            ) {
                $category = $this->cleanPageValue(
                    $pageContext['category'] ?? null
                );

                if ($language === 'bn') {
                    return $category
                        ? "এই ক্যাম্পেইনের বিভাগ হলো {$category}।"
                        : 'এই ক্যাম্পেইনের বিভাগের তথ্য বর্তমানে পাওয়া যাচ্ছে না।';
                }

                if ($language === 'banglish') {
                    return $category
                        ? "Ei campaign-er category holo {$category}."
                        : 'Ei campaign-er category-r tottho bortomane paoa jacche na.';
                }

                return $category
                    ? "This campaign belongs to the {$category} category."
                    : 'The category information for this campaign is not currently available.';
            }

            /*
             * -----------------------------------------------------
             * Campaign purpose / description
             * -----------------------------------------------------
             */
            if (
                str_contains($normalized, 'what is this campaign about') ||
                str_contains($normalized, 'what does this campaign do') ||
                str_contains($normalized, 'what is this campaign for') ||
                str_contains($normalized, 'tell me about this campaign') ||
                str_contains($normalized, 'explain this campaign') ||
                str_contains($normalized, 'about this campaign') ||
                str_contains($normalized, 'এই ক্যাম্পেইনটি কী নিয়ে') ||
                str_contains($normalized, 'এই ক্যাম্পেইনটা কী নিয়ে') ||
                str_contains($normalized, 'এই ক্যাম্পেইন কী নিয়ে') ||
                str_contains($normalized, 'এই ক্যাম্পেইন সম্পর্কে বলুন') ||
                str_contains($normalized, 'এই ক্যাম্পেইনটা সম্পর্কে বলুন') ||
                str_contains($normalized, 'এই ক্যাম্পেইন সম্পর্কে বলো') ||
                str_contains($normalized, 'এই ক্যাম্পেইনটা সম্পর্কে বলো') ||
                str_contains($normalized, 'ei campaign-ta ki niye') ||
                str_contains($normalized, 'ei campaign ta ki niye') ||
                str_contains($normalized, 'ei campaign ki niye') ||
                str_contains($normalized, 'ei campaign somporke bolo') ||
                str_contains($normalized, 'ei campaign somporke bolun')
            ) {
                $description = $this->cleanPageValue(
                    $pageContext['description'] ?? null
                );

                if ($language === 'bn') {
                    return $description
                        ? $this->shortenText($description, 500)
                        : 'এই ক্যাম্পেইনের বিস্তারিত বিবরণ বর্তমানে পাওয়া যাচ্ছে না।';
                }

                if ($language === 'banglish') {
                    return $description
                        ? $this->shortenText($description, 500)
                        : 'Ei campaign-er detailed description ekhon amar kache nei.';
                }

                return $description
                    ? $this->shortenText($description, 500)
                    : 'The detailed description for this campaign is not currently available.';
            }

            /*
             * -----------------------------------------------------
             * Other campaign-specific questions
             * -----------------------------------------------------
             *
             * Keep the full campaign summary as a fallback for
             * campaign questions that are page-specific but do not
             * yet have a dedicated field handler.
             */
            if (
                str_contains($normalized, 'campaign') ||
                str_contains($normalized, 'ক্যাম্পেইন') ||
                str_contains($normalized, 'ei campaign')
            ) {
                return $this->summarizePage(
                    $pageContext,
                    $language
                );
            }
        }

        /*
         * ---------------------------------------------------------
         * Generic campaign questions
         * ---------------------------------------------------------
         */
        if (
            str_contains($normalized, 'campaign') ||
            str_contains($normalized, 'ক্যাম্পেইন') ||
            str_contains($normalized, 'ক্যাম্পেইনগুলো') ||
            str_contains($normalized, 'campaign gulo')
        ) {
            if (
                str_contains($normalized, 'type') ||
                str_contains($normalized, 'types') ||
                str_contains($normalized, 'ধরন') ||
                str_contains($normalized, 'কত ধরনের') ||
                str_contains($normalized, 'ki ki type') ||
                str_contains($normalized, 'ki ki dhoroner')
            ) {
                if ($language === 'bn') {
                    return 'SP-তে তিন ধরনের Campaign রয়েছে: Local Case, Organization Proposed এবং Global Situation.';
                }

                if ($language === 'banglish') {
                    return 'SP-te tin dhoroner Campaign ache: Local Case, Organization Proposed ebong Global Situation.';
                }

                return 'SP has three campaign types: Local Case, Organization Proposed, and Global Situation.';
            }

            if ($language === 'bn') {
                return 'SP-তে মানবিক সহায়তার বিভিন্ন উদ্যোগ Campaign-এর মাধ্যমে পরিচালিত হয়। Campaign পেজ থেকে প্রকাশ্য তথ্য দেখে নির্দিষ্ট উদ্যোগ সম্পর্কে জানতে এবং প্রযোজ্য ক্ষেত্রে সহায়তা করতে পারেন.';
            }

            if ($language === 'banglish') {
                return 'SP-te humanitarian assistance-er bibhinno initiative Campaign-er maddhome manage kora hoy. Campaign page theke public information dekhe specific initiative niye jante ebong applicable hole support korte paren.';
            }

            return 'SP campaigns are humanitarian initiatives on the platform. You can view a campaign’s public information to learn about the initiative and, where applicable, provide support.';
        }

        /*
         * =========================================================
         * CATEGORIES
         * =========================================================
         */
        if (
            str_contains($normalized, 'category') ||
            str_contains($normalized, 'categories') ||
            str_contains($normalized, 'ক্যাটাগরি') ||
            str_contains($normalized, 'ক্যাটাগরিগুলো') ||
            str_contains($normalized, 'বিভাগ') ||
            str_contains($normalized, 'বিভাগগুলো') ||
            str_contains($normalized, 'কোন কোন বিভাগ') ||
            str_contains($normalized, 'কোন কোন ক্যাটাগরি') ||
            str_contains($normalized, 'kon kon category') ||
            str_contains($normalized, 'koyta category') ||
            str_contains($normalized, 'category ki ki') ||
            str_contains($normalized, 'category gulo ki')
        ) {
            if ($language === 'bn') {
                return 'SP-তে বিভিন্ন ধরনের মানবিক সহায়তার জন্য একাধিক বিভাগ রয়েছে: শিক্ষা, স্বাস্থ্যসেবা, খাদ্য, আশ্রয়, জীবিকা, দুর্যোগ সহায়তা, বিশুদ্ধ পানি, শিশু সহায়তা, নারী সহায়তা, প্রতিবন্ধী সহায়তা, জরুরি সহায়তা এবং অন্যান্য।';
            }

            if ($language === 'banglish') {
                return 'SP-te bibhinno dhoroner humanitarian assistance-er jonno category ache: শিক্ষা (shikkha), healthcare, food, shelter, livelihood, disaster relief, water and sanitation, child support, women support, disability support, emergency relief ebong other.';
            }

            return 'SP has several humanitarian assistance categories, including Education, Healthcare, Food, Shelter, Livelihood, Disaster Relief, Water and Sanitation, Child Support, Women Support, Disability Support, Emergency Relief, and Other.';
        }

        /*
         * =========================================================
         * VOLUNTEER + DONATION
         * =========================================================
         */
        if (
            (
                str_contains($normalized, 'volunteer') ||
                str_contains($normalized, 'volunteering')
            ) &&
            (
                str_contains($normalized, 'donor') ||
                str_contains($normalized, 'donate') ||
                str_contains($normalized, 'donation')
            )
        ) {
            if ($language === 'bn') {
                return 'হ্যাঁ। একজন individual user SP-তে volunteer হিসেবে মানবিক কার্যক্রমে অংশ নিতে পারেন এবং একইসাথে eligible campaign-এ অনুদানও দিতে পারেন। Volunteer হওয়ার জন্য verified individual account প্রয়োজন। অনুদান দিতে SP-এর নির্ধারিত donation flow ব্যবহার করতে হবে।';
            }

            if ($language === 'banglish') {
                return 'Haan. Ekjon individual user SP-te volunteer hisebe humanitarian activities-e participate korte paren ebong eki shathe eligible campaign-e donation-o dite paren. Volunteer howar jonno verified individual account proyojon. Donation dite SP-er nirdharito donation flow use korte hobe.';
            }

            return 'Yes. An individual user can participate in humanitarian activities as a volunteer and also donate to eligible campaigns. Volunteer participation requires a verified individual account, while donations are handled through SP’s designated donation flow.';
        }

        /*
         * =========================================================
         * VOLUNTEER
         * =========================================================
         */
        if (
            str_contains($normalized, 'volunteer') ||
            str_contains($normalized, 'স্বেচ্ছাসেবক') ||
            str_contains($normalized, 'স্বেচ্ছাসেবী') ||
            str_contains($normalized, 'volunteer hobo') ||
            str_contains($normalized, 'volunteer korbo') ||
            str_contains($normalized, 'volunteer korte') ||
            str_contains($normalized, 'volunteer kivabe') ||
            str_contains($normalized, 'volunteer kibhabe')
        ) {
            if (
                str_contains($normalized, 'how') ||
                str_contains($normalized, 'kivabe') ||
                str_contains($normalized, 'kibhabe') ||
                str_contains($normalized, 'কীভাবে') ||
                str_contains($normalized, 'কিভাবে') ||
                str_contains($normalized, 'হব') ||
                str_contains($normalized, 'করব')
            ) {
                if ($language === 'bn') {
                    return 'SP-তে স্বেচ্ছাসেবক হিসেবে অংশ নিতে একজন verified individual user হতে হয়। Volunteer অংশে গিয়ে উপলভ্য নির্দেশনা অনুসরণ করে অংশগ্রহণের প্রক্রিয়া শুরু করতে পারেন।';
                }

                if ($language === 'banglish') {
                    return 'SP-te volunteer hisebe participate korte ekjon verified individual user hote hoy. Volunteer section-e giye available instructions follow kore process-ta start korte paren.';
                }

                return 'To participate as a volunteer on SP, you need a verified individual account. You can use the Volunteer section and follow the available instructions to begin.';
            }

            if ($language === 'bn') {
                return 'SP-তে একজন ব্যক্তি স্বেচ্ছাসেবক হিসেবে মানবিক কার্যক্রমে অংশ নিতে পারেন। স্বেচ্ছাসেবক কার্যক্রমের জন্য verified individual account প্রয়োজন।';
            }

            if ($language === 'banglish') {
                return 'SP-te ekjon individual volunteer hisebe humanitarian activities-e participate korte paren. Volunteer activities-er jonno verified individual account proyojon.';
            }

            return $knowledge['volunteering']['description'];
        }

        /*
         * =========================================================
         * DONATION
         * =========================================================
         */
        if (
            str_contains($normalized, 'donat') ||
            str_contains($normalized, 'donation') ||
            str_contains($normalized, 'অনুদান') ||
            str_contains($normalized, 'দান করতে') ||
            str_contains($normalized, 'দান করব') ||
            str_contains($normalized, 'টাকা দিতে')
        ) {
            if (
                str_contains($normalized, 'how') ||
                str_contains($normalized, 'kivabe') ||
                str_contains($normalized, 'kibhabe') ||
                str_contains($normalized, 'কীভাবে') ||
                str_contains($normalized, 'কিভাবে') ||
                str_contains($normalized, 'করব') ||
                str_contains($normalized, 'করবো') ||
                str_contains($normalized, 'দেব')
            ) {
                if ($language === 'bn') {
                    return 'কোনো ক্যাম্পেইনে অনুদান দিতে সেই ক্যাম্পেইনের Donation flow ব্যবহার করুন। পেমেন্টের তথ্য শুধুমাত্র SP-এর নির্ধারিত Donation flow-এর মাধ্যমেই দিন।';
                }

                if ($language === 'banglish') {
                    return 'Kono campaign-e donation dite oi campaign-er Donation flow use korun. Payment information shudhu SP-er designated Donation flow-er maddhome din.';
                }

                return 'To donate to a campaign, use the Donation flow provided for that campaign. Enter payment information only through SP’s designated Donation flow.';
            }

            if ($language === 'bn') {
                return 'SP-এর মাধ্যমে যোগ্য ক্যাম্পেইনে অনুদান দেওয়া যায়। অনুদান দিতে নির্দিষ্ট ক্যাম্পেইনের Donation flow ব্যবহার করুন।';
            }

            if ($language === 'banglish') {
                return 'SP-r maddhome eligible campaign-e donation deya jay. Donation korte specific campaign-er Donation flow use korun.';
            }

            return $knowledge['donations']['description'];
        }

        /*
         * =========================================================
         * GENERAL SP QUESTIONS
         * =========================================================
         */

        /*
         * Does SP really help?
         */
        if (
            str_contains($normalized, 'does sp really help') ||
            str_contains($normalized, 'does sp actually help') ||
            str_contains($normalized, 'does stand for people really help') ||
            str_contains($normalized, 'is sp really helpful') ||
            str_contains($normalized, 'sp কি সত্যিই সাহায্য') ||
            str_contains($normalized, 'sp কি আসলেই সাহায্য') ||
            str_contains($normalized, 'sp ki really help') ||
            str_contains($normalized, 'sp ki asole help') ||
            str_contains($normalized, 'sp ki sotti help')
        ) {
            if ($language === 'bn') {
                return 'Stand For People-এর উদ্দেশ্য হলো সাহায্যের প্রয়োজন আছে এমন মানুষ এবং সহায়তা করতে আগ্রহী ব্যক্তি ও প্রতিষ্ঠানকে একটি কেন্দ্রীয় প্ল্যাটফর্মে যুক্ত করা। কোনো নির্দিষ্ট Help Request বা Campaign-এর ফলাফল সম্পর্কে আমি নিশ্চিত প্রতিশ্রুতি দিতে পারি না।';
            }

            if ($language === 'banglish') {
                return 'Stand For People-er uddeshho holo jader help dorkar tader sathe help korte interested individual o organization-ke ekta centralized platform-e connect kora. Tobe kono specific Help Request ba Campaign-er result niye ami guarantee dite pari na.';
            }

            return 'Stand For People is designed to connect people who need humanitarian support with individuals and organizations that can contribute support. I cannot guarantee the outcome of any specific Help Request or Campaign.';
        }

        /*
         * Is SP fake?
         */
        if (
            str_contains($normalized, 'is sp fake') ||
            str_contains($normalized, 'is stand for people fake') ||
            str_contains($normalized, 'sp fake') ||
            str_contains($normalized, 'sp কি fake') ||
            str_contains($normalized, 'sp কি ভুয়া') ||
            str_contains($normalized, 'sp কি ভুয়া') ||
            str_contains($normalized, 'sp ki fake') ||
            str_contains($normalized, 'sp ki vuya') ||
            str_contains($normalized, 'sp ashol naki') ||
            str_contains($normalized, 'sp ki ashol')
        ) {
            if ($language === 'bn') {
                return 'আমি কোনো নির্দিষ্ট ব্যক্তি বা ক্যাম্পেইনের সত্যতা যাচাই না করে সিদ্ধান্ত দিতে পারি না। কোনো Campaign বা Help Request সম্পর্কে জানতে হলে সেই পেজে থাকা প্রকাশ্য তথ্য দেখুন।';
            }

            if ($language === 'banglish') {
                return 'Ami kono specific person ba campaign-er authenticity verify na kore decision dite pari na. Kono Campaign ba Help Request niye jante hole oi page-er public information dekhun.';
            }

            return 'I cannot determine whether a specific person or campaign is genuine without verified information. For a Campaign or Help Request, please review the publicly available information on its page.';
        }

        /*
         * Fees / cost
         */
        if (
            str_contains($normalized, 'do i have to pay') ||
            str_contains($normalized, 'is there a fee') ||
            str_contains($normalized, 'does it cost money') ||
            str_contains($normalized, 'does sp charge') ||
            str_contains($normalized, 'টাকা লাগে') ||
            str_contains($normalized, 'কোনো ফি লাগে') ||
            str_contains($normalized, 'ফি দিতে হয়') ||
            str_contains($normalized, 'ফি দিতে হয়') ||
            str_contains($normalized, 'fee lage') ||
            str_contains($normalized, 'taka lage') ||
            str_contains($normalized, 'sp te taka lage')
        ) {
            if ($language === 'bn') {
                return 'SP-এর কোনো নির্দিষ্ট সেবা বা কার্যক্রমের জন্য ফি প্রযোজ্য কি না, তা সংশ্লিষ্ট পেজ বা প্ল্যাটফর্মে প্রদর্শিত তথ্যের ভিত্তিতে দেখুন। আমি এমন কোনো ফি সম্পর্কে নিশ্চিত তথ্য দিতে চাই না যা আমার কাছে সংরক্ষিত নেই।';
            }

            if ($language === 'banglish') {
                return 'SP-er kono specific service ba activity-r jonno fee applicable kina, seta related page ba platform-e dekhano information-er upor depend kore. Amar kache nei emon kono fee information ami guess korte chai na.';
            }

            return 'Whether a fee applies depends on the specific SP service or activity. Please check the relevant page or information shown on the platform. I don’t want to invent fee information that I cannot verify.';
        }

        /*
         * Helping without money
         */
        if (
            str_contains($normalized, 'can i help without money') ||
            str_contains($normalized, 'help without money') ||
            str_contains($normalized, 'without donating money') ||
            str_contains($normalized, 'how can i help without money') ||
            str_contains($normalized, 'টাকা ছাড়া কীভাবে সাহায্য') ||
            str_contains($normalized, 'টাকা ছাড়া কীভাবে সাহায্য') ||
            str_contains($normalized, 'টাকা না দিয়ে কীভাবে সাহায্য') ||
            str_contains($normalized, 'টাকা না দিয়ে কীভাবে সাহায্য') ||
            str_contains($normalized, 'টাকা ছাড়া সাহায্য') ||
            str_contains($normalized, 'টাকা ছাড়া সাহায্য') ||
            str_contains($normalized, 'taka chara kivabe help') ||
            str_contains($normalized, 'taka chara help') ||
            str_contains($normalized, 'taka na diye kivabe help')
        ) {
            if ($language === 'bn') {
                return 'মানবিক সহায়তা শুধু অর্থের মাধ্যমে সীমাবদ্ধ নয়। SP-তে স্বেচ্ছাসেবী হিসেবে অংশগ্রহণের সুযোগ রয়েছে। Volunteer সম্পর্কে বিস্তারিত জানতে SP-এর Volunteer অংশটি দেখুন।';
            }

            if ($language === 'banglish') {
                return 'Humanitarian support shudhu taka diyei korte hoy na. SP-te volunteer hisebe participate korar sujog ache. Volunteer niye details jante SP-er Volunteer section dekhun.';
            }

            return 'Humanitarian support is not limited to financial donations. SP also supports volunteer participation. Please visit the Volunteer section to learn more.';
        }

        /*
         * Volunteer + donor
         */
        if (
            str_contains($normalized, 'both volunteer and donor') ||
            str_contains($normalized, 'volunteer and donor') ||
            str_contains($normalized, 'can i be both') ||
            str_contains($normalized, 'volunteer আর donor') ||
            str_contains($normalized, 'volunteer এবং donor') ||
            str_contains($normalized, 'volunteer o donor') ||
            str_contains($normalized, 'volunteer ar donor') ||
            str_contains($normalized, 'volunteer ebong donor') ||
            str_contains($normalized, 'volunteer o donor hote')
        ) {
            if ($language === 'bn') {
                return 'SP-তে স্বেচ্ছাসেবী ও দাতা—দুই ধরনের অংশগ্রহণের সুযোগ সম্পর্কে জানতে সংশ্লিষ্ট Volunteer ও Donation অংশের নির্দেশনা অনুসরণ করুন।';
            }

            if ($language === 'banglish') {
                return 'SP-te volunteer ebong donor — dui vabe participate korar bishoye jante Volunteer o Donation section-er instructions follow korun.';
            }

            return 'You can learn about volunteer and donor participation from the relevant Volunteer and Donation sections of SP.';
        }

        /*
         * Who can request help?
         */
        if (
            str_contains($normalized, 'who can request help') ||
            str_contains($normalized, 'who can ask for help') ||
            str_contains($normalized, 'who can submit a help request') ||
            str_contains($normalized, 'কে সাহায্যের অনুরোধ করতে পারে') ||
            str_contains($normalized, 'কে সাহায্য চাইতে পারে') ||
            str_contains($normalized, 'কে help request করতে পারে') ||
            str_contains($normalized, 'ke help request korte pare') ||
            str_contains($normalized, 'ke help chaite pare')
        ) {
            if ($language === 'bn') {
                return 'SP-এর Help Request ব্যবস্থা individual users-এর জন্য তৈরি। একজন individual user নিজের প্রয়োজনের পরিস্থিতি বর্ণনা করে Help Request জমা দিতে পারেন।';
            }

            if ($language === 'banglish') {
                return 'SP-er Help Request system individual users-er jonno. Ekjon individual user nijer proyojoner situation describe kore Help Request submit korte paren.';
            }

            return 'SP’s Help Request system is designed for individual users. An individual user can describe their situation and submit a Help Request.';
        }

        /*
         * Who sees my request?
         */
        if (
            str_contains($normalized, 'who sees my request') ||
            str_contains($normalized, 'who will see my request') ||
            str_contains($normalized, 'who can see my request') ||
            str_contains($normalized, 'কে আমার request দেখবে') ||
            str_contains($normalized, 'কে আমার অনুরোধ দেখবে') ||
            str_contains($normalized, 'কে আমার সাহায্যের অনুরোধ দেখবে') ||
            str_contains($normalized, 'amar request ke dekhbe') ||
            str_contains($normalized, 'amar help request ke dekhbe')
        ) {
            if ($language === 'bn') {
                return 'Help Request জমা দেওয়ার পর এটি SP-এর বিদ্যমান verification workflow-এর মধ্যে যায়। আপনার ব্যক্তিগত তথ্য বা কারা আপনার তথ্য দেখতে পারবেন—এ ধরনের নির্দিষ্ট privacy detail জানতে SP-এর প্রযোজ্য privacy বা account information অনুসরণ করুন।';
            }

            if ($language === 'banglish') {
                return 'Help Request submit korar por eta SP-er existing verification workflow-er moddhe jay. Personal information ba kara apnar information dekhte parbe — ei specific privacy details-er jonno SP-er applicable privacy ba account information follow korun.';
            }

            return 'After submission, a Help Request enters SP’s existing verification workflow. For specific privacy details about personal information and who can access it, please refer to the applicable privacy or account information provided by SP.';
        }

        /*
         * Can SP give me money?
         */
        if (
            str_contains($normalized, 'can sp give me money') ||
            str_contains($normalized, 'will sp give me money') ||
            str_contains($normalized, 'can i get money from sp') ||
            str_contains($normalized, 'does sp give money') ||
            str_contains($normalized, 'sp কি আমাকে টাকা দেবে') ||
            str_contains($normalized, 'sp কি সরাসরি টাকা দেবে') ||
            str_contains($normalized, 'sp থেকে কি টাকা পাব') ||
            str_contains($normalized, 'sp কি টাকা দেয়') ||
            str_contains($normalized, 'sp কি টাকা দেয়') ||
            str_contains($normalized, 'sp ki amake taka dibe') ||
            str_contains($normalized, 'sp ki direct taka dibe') ||
            str_contains($normalized, 'sp theke taka pabo') ||
            str_contains($normalized, 'sp ki taka dey')
        ) {
            if ($language === 'bn') {
                return 'আমি কোনো ব্যবহারকারীকে আর্থিক সহায়তা পাওয়ার নিশ্চয়তা দিতে পারি না। Help Request জমা দিলে সেটি SP-এর বিদ্যমান verification workflow-এর মাধ্যমে পর্যালোচনার জন্য যায়।';
            }

            if ($language === 'banglish') {
                return 'Ami kono user-ke financial assistance pawar guarantee dite pari na. Help Request submit korle seta SP-er existing verification workflow-er maddhome review-er jonno jay.';
            }

            return 'I cannot guarantee that a user will receive financial assistance. A submitted Help Request enters SP’s existing verification workflow for review.';
        }

        /*
         * Is SP an emergency service?
         */
        if (
            str_contains($normalized, 'is sp an emergency service') ||
            str_contains($normalized, 'is sp an emergency') ||
            str_contains($normalized, 'sp কি emergency service') ||
            str_contains($normalized, 'sp কি জরুরি সেবা') ||
            str_contains($normalized, 'sp কি emergency') ||
            str_contains($normalized, 'sp ki emergency service') ||
            str_contains($normalized, 'sp ki emergency') ||
            str_contains($normalized, 'sp ki joruri')
        ) {
            if ($language === 'bn') {
                return 'SP একটি humanitarian coordination platform। এটি মানবিক সহায়তার তথ্য ও coordination-এর জন্য ব্যবহার করা যেতে পারে, তবে তাৎক্ষণিক জীবন-ঝুঁকির পরিস্থিতিতে স্থানীয় জরুরি সেবা বা সংশ্লিষ্ট কর্তৃপক্ষের সঙ্গে সরাসরি যোগাযোগ করা উচিত।';
            }

            if ($language === 'banglish') {
                return 'SP ekta humanitarian coordination platform. Eta humanitarian support-er information o coordination-er jonno use kora jete pare, kintu immediate life-threatening situation hole local emergency service ba relevant authority-r sathe directly contact kora uchit.';
            }

            return 'SP is a humanitarian coordination platform. It can support humanitarian coordination, but in an immediate life-threatening emergency, you should contact the appropriate local emergency service or authority directly.';
        }

        /*
         * Anonymous request
         */
        if (
            str_contains($normalized, 'can i submit anonymously') ||
            str_contains($normalized, 'can i make anonymous request') ||
            str_contains($normalized, 'anonymous help request') ||
            str_contains($normalized, 'anonymous request') ||
            str_contains($normalized, 'আমি কি anonymous') ||
            str_contains($normalized, 'আমি কি পরিচয় গোপন করে') ||
            str_contains($normalized, 'আমি কি পরিচয় গোপন করে') ||
            str_contains($normalized, 'anonymous vabe help') ||
            str_contains($normalized, 'anonymous vabe request') ||
            str_contains($normalized, 'anonymous request dite')
        ) {
            if ($language === 'bn') {
                return 'SP-তে anonymous Help Request করা যায় কি না, সে বিষয়ে আমি নিশ্চিত তথ্য না থাকলে অনুমান করতে চাই না। আপনার অ্যাকাউন্ট ও Help Request পেজে প্রদর্শিত তথ্য এবং প্রযোজ্য privacy policy অনুসরণ করুন।';
            }

            if ($language === 'banglish') {
                return 'SP-te anonymous Help Request kora jay kina, ei bishoye amar confirmed information na thakle ami guess korte chai na. Account o Help Request page-e dekhano information ebong applicable privacy policy follow korun.';
            }

            return 'I don’t want to guess about whether anonymous Help Requests are supported. Please follow the information shown on the Help Request page and the applicable privacy policy.';
        }

        /*
         * =========================================================
         * PRIVATE / INTERNAL INFORMATION
         * =========================================================
         */
        if ($this->isPrivateOrInternalQuestion($normalized)) {
            if ($language === 'bn') {
                return 'দুঃখিত, আমি SP-এর ব্যক্তিগত, প্রশাসনিক বা অভ্যন্তরীণ তথ্য প্রকাশ করতে পারি না। আমি শুধু Stand For People-এর প্রকাশ্য তথ্য ও সেবা সম্পর্কে গাইড করতে পারি।';
            }

            if ($language === 'banglish') {
                return 'Dukkhito, ami SP-er private, administrative ba internal information share korte pari na. Ami shudhu Stand For People-er public information o services niye guide korte pari.';
            }

            return 'Sorry, I cannot provide private, administrative, or internal information about SP. I can only guide you using publicly available information about Stand For People and its services.';
        }

        /*
         * =========================================================
         * OUT-OF-SCOPE QUESTIONS
         * =========================================================
         */
        if ($this->isClearlyOutsideSpScope($normalized)) {
            if ($language === 'bn') {
                return 'এই প্রশ্নটি Stand For People-এর সেবার সাথে সম্পর্কিত নয়। আমি SP-এর Help Request, Campaign, Category, Volunteer, Donation এবং প্ল্যাটফর্ম ব্যবহারের বিষয়ে গাইড করতে পারি।';
            }

            if ($language === 'banglish') {
                return 'Ei question-ta Stand For People-er service-er sathe related noy. Ami SP-er Help Request, Campaign, Category, Volunteer, Donation ebong platform use kora niye guide korte pari.';
            }

            return 'That question is outside the scope of Stand For People. I can help with Help Requests, Campaigns, Categories, Volunteering, Donations, and using the SP platform.';
        }

        /*
         * =========================================================
         * GENERAL SP FALLBACK
         * =========================================================
         */
        if ($language === 'bn') {
            return 'আমি Stand For People সম্পর্কে তথ্য, সাহায্যের অনুরোধ, ক্যাম্পেইন, বিভাগ, স্বেচ্ছাসেবক এবং অনুদান সম্পর্কে গাইড করতে পারি। আপনার প্রশ্নটি একটু বিস্তারিতভাবে লিখুন।';
        }

        if ($language === 'banglish') {
            return 'Ami Stand For People-er Help Request, Campaign, Category, Volunteer ebong Donation niye guide korte pari. Apnar question-ta ektu details-e likhun.';
        }

        return 'I can help you with Stand For People, Help Requests, Campaigns, Categories, Volunteering, Donations, and using the platform. Please describe your question in a little more detail.';
    }

    /*
     * =============================================================
     * PAGE SUMMARY DETECTION
     * =============================================================
     */
    private function isPageSummaryQuestion(string $normalized): bool
    {
        $summaryPatterns = [
            'summarize this page',
            'summarise this page',
            'summary of this page',
            'summarize the page',
            'summarise the page',
            'give me a summary',
            'give me summary',
            'what is this page about',
            'what is this page',
            'explain this page',
            'explain the page',
            'tell me about this page',
            'tell me what this page is about',
            'page summary',

            'এই পেজের সারাংশ',
            'এই পেজটা কী নিয়ে',
            'এই পেজটি কী নিয়ে',
            'এই পেজ সম্পর্কে বলুন',
            'এই পেজটা সম্পর্কে বলুন',
            'এই পেজটি সম্পর্কে বলুন',
            'পেজটা সংক্ষেপে বলুন',
            'পেজটি সংক্ষেপে বলুন',
            'এই পেজটা বুঝিয়ে বলুন',
            'এই পেজটি বুঝিয়ে বলুন',

            'ei page-er summary',
            'ei page er summary',
            'ei page-ta ki niye',
            'ei page ta ki niye',
            'ei page-ti ki niye',
            'ei page ti ki niye',
            'ei page somporke bolo',
            'ei page somporke bolun',
            'page-ta summarize koro',
            'page ta summarize koro',
            'page-ta ki niye',
            'page ta ki niye',
        ];

        foreach ($summaryPatterns as $pattern) {
            if (str_contains($normalized, $pattern)) {
                return true;
            }
        }

        return false;
    }

    /*
     * =============================================================
     * PAGE SUMMARY
     * =============================================================
     */
    private function summarizePage(
        array $pageContext,
        string $language
    ): string {
        $type = $pageContext['type'] ?? null;

        /*
         * ---------------------------------------------------------
         * Campaign page
         * ---------------------------------------------------------
         */
        if ($type === 'campaign') {
            $title = $this->cleanPageValue(
                $pageContext['title'] ?? null
            );

            $description = $this->cleanPageValue(
                $pageContext['description'] ?? null
            );

            $category = $this->cleanPageValue(
                $pageContext['category'] ?? null
            );

            $district = $this->cleanPageValue(
                $pageContext['district'] ?? null
            );

            $status = $this->cleanPageValue(
                $pageContext['status'] ?? null
            );

            if ($language === 'bn') {
                $parts = [];

                if ($title !== null) {
                    $parts[] = "এই ক্যাম্পেইনটি “{$title}” নামে পরিচালিত হচ্ছে।";
                }

                if ($description !== null) {
                    $parts[] = $this->shortenText(
                        $description,
                        500
                    );
                }

                $details = [];

                if ($category !== null) {
                    $details[] = "বিভাগ: {$category}";
                }

                if ($district !== null) {
                    $details[] = "জেলা: {$district}";
                }

                if ($status !== null) {
                    $details[] = "স্ট্যাটাস: {$status}";
                }

                if (!empty($details)) {
                    $parts[] = implode(' • ', $details);
                }

                if (empty($parts)) {
                    return 'এই পেজের পর্যাপ্ত প্রকাশ্য তথ্য বর্তমানে আমার কাছে নেই।';
                }

                return implode(' ', $parts);
            }

            if ($language === 'banglish') {
                $parts = [];

                if ($title !== null) {
                    $parts[] = "Ei campaign-ta “{$title}” name-e porichalito hocche.";
                }

                if ($description !== null) {
                    $parts[] = $this->shortenText(
                        $description,
                        500
                    );
                }

                $details = [];

                if ($category !== null) {
                    $details[] = "Category: {$category}";
                }

                if ($district !== null) {
                    $details[] = "District: {$district}";
                }

                if ($status !== null) {
                    $details[] = "Status: {$status}";
                }

                if (!empty($details)) {
                    $parts[] = implode(' • ', $details);
                }

                if (empty($parts)) {
                    return 'Ei page-er jothesto public information ekhon amar kache nei.';
                }

                return implode(' ', $parts);
            }

            $parts = [];

            if ($title !== null) {
                $parts[] = "This campaign is titled “{$title}”.";
            }

            if ($description !== null) {
                $parts[] = $this->shortenText(
                    $description,
                    500
                );
            }

            $details = [];

            if ($category !== null) {
                $details[] = "Category: {$category}";
            }

            if ($district !== null) {
                $details[] = "District: {$district}";
            }

            if ($status !== null) {
                $details[] = "Status: {$status}";
            }

            if (!empty($details)) {
                $parts[] = implode(' • ', $details);
            }

            if (empty($parts)) {
                return 'There is not enough public information in the supplied page context to summarize this page.';
            }

            return implode(' ', $parts);
        }

        /*
         * ---------------------------------------------------------
         * Generic public page
         * ---------------------------------------------------------
         */
        $title = $this->cleanPageValue(
            $pageContext['title'] ?? null
        );

        $description = $this->cleanPageValue(
            $pageContext['description'] ?? null
        );

        if ($language === 'bn') {
            if ($title !== null && $description !== null) {
                return "এই পেজটি “{$title}” সম্পর্কে। " .
                    $this->shortenText($description, 600);
            }

            if ($description !== null) {
                return $this->shortenText($description, 600);
            }

            if ($title !== null) {
                return "এই পেজটি “{$title}” সম্পর্কে।";
            }

            return 'এই পেজের পর্যাপ্ত প্রকাশ্য তথ্য বর্তমানে আমার কাছে নেই।';
        }

        if ($language === 'banglish') {
            if ($title !== null && $description !== null) {
                return "Ei page-ta “{$title}” somporke. " .
                    $this->shortenText($description, 600);
            }

            if ($description !== null) {
                return $this->shortenText($description, 600);
            }

            if ($title !== null) {
                return "Ei page-ta “{$title}” somporke.";
            }

            return 'Ei page-er jothesto public information ekhon amar kache nei.';
        }

        if ($title !== null && $description !== null) {
            return "This page is about “{$title}”. " .
                $this->shortenText($description, 600);
        }

        if ($description !== null) {
            return $this->shortenText($description, 600);
        }

        if ($title !== null) {
            return "This page is about “{$title}”.";
        }

        return 'There is not enough public information in the supplied page context to summarize this page.';
    }

    /*
     * =============================================================
     * PAGE VALUE SANITIZATION
     * =============================================================
     */
    private function cleanPageValue(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }

        $value = trim($value);

        if ($value === '') {
            return null;
        }

        return $value;
    }

    /*
     * =============================================================
     * KEEP SUMMARY CONTROLLED
     * =============================================================
     */
    private function shortenText(
        string $text,
        int $maxLength
    ): string {
        $text = trim(
            preg_replace('/\s+/u', ' ', $text)
        );

        if (mb_strlen($text) <= $maxLength) {
            return $text;
        }

        $shortened = mb_substr(
            $text,
            0,
            $maxLength
        );

        $lastSpace = mb_strrpos(
            $shortened,
            ' '
        );

        if ($lastSpace !== false && $lastSpace > 100) {
            $shortened = mb_substr(
                $shortened,
                0,
                $lastSpace
            );
        }

        return rtrim(
            $shortened,
            " \t\n\r\0\x0B.,!?;:"
        ) . '…';
    }

    private function isPrivateOrInternalQuestion(
        string $normalized
    ): bool {
        $privatePatterns = [
            'password',
            'passcode',
            'admin password',
            'database',
            'db password',
            'api key',
            'secret key',
            'access token',
            'private key',
            'admin account',
            'admin login',
            'admin users',
            'user data',
            'users data',
            'personal information',
            'private information',
            'internal information',
            'internal data',
            'database information',
            'database data',
            'show me users',
            'show users',
            'show admin',
            'staff information',
            'staff data',
            'employee information',
            'employee data',
            'অ্যাডমিন পাসওয়ার্ড',
            'অ্যাডমিন পাসওয়ার্ড',
            'পাসওয়ার্ড',
            'পাসওয়ার্ড',
            'ডাটাবেস',
            'ডেটাবেস',
            'ব্যক্তিগত তথ্য',
            'গোপন তথ্য',
            'অভ্যন্তরীণ তথ্য',
            'ইউজারের তথ্য',
            'ব্যবহারকারীর তথ্য',
            'অ্যাডমিনের তথ্য',
        ];

        foreach ($privatePatterns as $pattern) {
            if (str_contains($normalized, $pattern)) {
                return true;
            }
        }

        return false;
    }

    private function isClearlyOutsideSpScope(
        string $normalized
    ): bool {
        $outsidePatterns = [
            'weather',
            'temperature today',
            'stock price',
            'stock market',
            'bitcoin',
            'cryptocurrency',
            'crypto price',
            'recipe',
            'football score',
            'football match',
            'cricket score',
            'cricket match',
            'movie recommendation',
            'recommend a movie',
            'song recommendation',
            'recommend a song',
            'write me a poem',
            'write a story',
            'tell me a joke',
            'translate this',
            'translation',
            'math problem',
            'solve this equation',
            'who is the president',
            'politics',
            'election',
            'programming',
            'javascript',
            'python code',
            'php code',
            'coding help',
            'write code',
            'unrelated question',
        ];

        foreach ($outsidePatterns as $pattern) {
            if (str_contains($normalized, $pattern)) {
                return true;
            }
        }

        return false;
    }
}
