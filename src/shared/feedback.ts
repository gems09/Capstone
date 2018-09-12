export interface Feedback {
    firstname: string;
    lastname: string;
    telname: string;
    email: string;
    agree: string;
    contacttype: string;
    message: string;
}

export const ContactType = ['None', 'Tel', 'Email'];