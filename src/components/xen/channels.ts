import type { IconName } from '@/components/Icon'

// What Xen does on each channel. Copy is drawn from the studio's existing
// AI chatbot, automation and 24/7 lead-capture services; the examples are
// illustrative and labelled as such in the UI.
export type Channel = {
  short: string
  name: string
  icon: IconName
  desc: string
  chat?: { from: 'visitor' | 'xen'; text: string }[]
  card: { title: string; sub: string; icon: IconName }
}

export const CHANNELS: Channel[] = [
  {
    short: 'Website', name: 'On your website', icon: 'globe',
    desc: 'Xen greets every visitor, answers questions about your services and books consultations straight into your calendar, even at 3am.',
    chat: [
      { from: 'visitor', text: 'Hi, can I book a consultation this week?' },
      { from: 'xen', text: 'Absolutely. I have Thursday at 10am or Friday at 2pm. Which suits you?' },
      { from: 'visitor', text: 'Thursday works.' },
    ],
    card: { title: 'New consultation booked', sub: 'Captured by Xen on your website', icon: 'calendar' },
  },
  {
    short: 'Google', name: 'From Google', icon: 'target',
    desc: 'When someone clicks your Google ad or finds you in search, Xen picks up the conversation instantly, so paid clicks become enquiries instead of bounces.',
    card: { title: 'New enquiry from Google Ads', sub: 'Qualified by Xen and sent to your team', icon: 'click' },
  },
  {
    short: 'Facebook / IG', name: 'On Facebook & Instagram', icon: 'megaphone',
    desc: 'Xen replies to Messenger and Instagram messages, answers common questions and passes ready-to-buy leads to your team.',
    chat: [
      { from: 'visitor', text: 'Do you have availability this weekend?' },
      { from: 'xen', text: 'We do. Would you like me to hold a spot for Saturday morning?' },
      { from: 'visitor', text: 'Yes please!' },
    ],
    card: { title: 'Lead passed to your team', sub: 'From an Instagram message', icon: 'users' },
  },
  {
    short: 'Email', name: 'By email', icon: 'mail',
    desc: 'Every enquiry gets a timely, personalised follow-up sequence, so no lead goes cold while you are busy running the business.',
    card: { title: 'Follow-up sent', sub: 'Personalised email triggered by Xen', icon: 'mail' },
  },
  {
    short: 'Chatbot', name: 'As your AI chatbot', icon: 'bot',
    desc: 'One AI chatbot trained on your business: it handles FAQs around the clock, qualifies enquiries and captures contact details for your team.',
    chat: [
      { from: 'visitor', text: 'What areas do you cover?' },
      { from: 'xen', text: 'We cover the whole region. Can I take your name and number so the team can confirm?' },
    ],
    card: { title: 'Lead captured', sub: 'Name, contact details and service of interest', icon: 'checkCircle' },
  },
]
