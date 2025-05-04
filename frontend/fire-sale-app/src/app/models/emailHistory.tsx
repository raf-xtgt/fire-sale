export interface EmailHistory {
    guid: string;
    user_id: string;
    sender_email: string;
    recipient_email: string;
    email_direction: string;
    email_subject: string;
    email_body: string;
    email_time: Date | string;
}
  