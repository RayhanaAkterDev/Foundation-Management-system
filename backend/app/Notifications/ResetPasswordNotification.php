<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    /**
     * The password reset token.
     */
    public function __construct(
        protected string $token
    ) {}

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = rtrim(
            config('app.frontend_url', env('FRONTEND_URL')),
            '/'
        );

        $resetUrl = $frontendUrl
            . '/reset-password?token='
            . urlencode($this->token)
            . '&email='
            . urlencode($notifiable->getEmailForPasswordReset());

        return (new MailMessage)
            ->subject('পাসওয়ার্ড রিসেট করুন — Stand For People')
            ->greeting('হ্যালো ' . $notifiable->name . ',')
            ->line('আপনার Stand For People অ্যাকাউন্টের পাসওয়ার্ড রিসেট করার জন্য এই অনুরোধটি করা হয়েছে।')
            ->line('নতুন পাসওয়ার্ড সেট করতে নিচের বাটনে ক্লিক করুন।')
            ->action('পাসওয়ার্ড রিসেট করুন', $resetUrl)
            ->line('এই লিংকটি ৬০ মিনিটের জন্য কার্যকর থাকবে।')
            ->line('আপনি যদি পাসওয়ার্ড রিসেটের অনুরোধ না করে থাকেন, তাহলে এই ইমেইলটি উপেক্ষা করতে পারেন।')
            ->salutation('ধন্যবাদ, Stand For People');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [];
    }
}
