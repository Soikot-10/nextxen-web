'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'

interface Service {
  id: string
  icon: string
  tag: string
  title: string
  shortDesc: string
  cardTag: string
  desc1: string
  desc2: string
  desc3: string
  feats: string[]
}

const services: Service[] = [
  {
    id: 'website', icon: '🌐', tag: 'Design + Development', title: 'Website Design',
    shortDesc: 'Stunning, fast, mobile-first websites that convert visitors into customers.',
    cardTag: 'Design + Dev',
    desc1: "Your website is your most powerful sales tool — and we build websites that actually convert. Every NEXTXEN website is custom-designed from scratch, built for speed, and optimised to turn visitors into paying customers. We don't use cheap templates or cookie-cutter designs.",
    desc2: 'Our websites are built mobile-first, load in under 2 seconds, and are structured for search engines from day one. Whether you need a simple landing page or a complex e-commerce store, we deliver a premium digital experience that reflects your brand\'s quality.',
    desc3: 'Every project includes a full discovery session, custom design mockups, development, SEO foundation, and training so you can manage your content confidently.',
    feats: ['Fully custom responsive design','Mobile-first development','PageSpeed 90+ guaranteed','On-page SEO built-in','CMS integration (WordPress/Webflow)','E-commerce ready','SSL, hosting & domain support','30-day post-launch support'],
  },
  {
    id: 'logo', icon: '✏️', tag: 'Branding', title: 'Logo Design',
    shortDesc: 'Professional, memorable logos that position your brand with authority.',
    cardTag: 'Branding',
    desc1: "Your logo is the face of your business. It's the first thing people see and the last thing they forget. We create logos that are distinctive, timeless, and built to work across every touchpoint — from your website to your van signage.",
    desc2: 'Our design process starts with deep brand discovery. We learn what makes your business unique, who your customers are, and what emotions you want to evoke. Then we craft multiple concepts for you to choose from, refining until perfect.',
    desc3: "You'll receive full vector files in every format you'll ever need, brand usage guidelines, and colour palette documentation.",
    feats: ['3 initial concept directions','Unlimited revisions','Vector files (AI, EPS, SVG)','PNG & JPG exports','Light & dark versions','Brand colour palette','Font selection','Logo usage guidelines'],
  },
  {
    id: 'poster', icon: '🎨', tag: 'Design', title: 'Poster & Banner Design',
    shortDesc: 'Eye-catching marketing materials that stop the scroll and drive action.',
    cardTag: 'Design',
    desc1: "Marketing materials that stop people in their tracks. Whether it's a social media banner, a print poster, a trade show display, or a digital billboard, we design visuals that communicate your message instantly and beautifully.",
    desc2: 'Every design is created to be on-brand, attention-grabbing, and optimised for its specific format. We understand the difference between what works in print vs. digital, and we deliver files ready for both.',
    desc3: 'Fast turnaround times mean you\'re never waiting weeks for your marketing materials. Most projects are completed within 3–5 business days.',
    feats: ['Social media graphics (all sizes)','Print-ready poster files (300dpi)','Trade show & exhibition displays','Email banner design','Web banner ads (all formats)','Brand-consistent visuals','Unlimited revisions','Source files included'],
  },
  {
    id: 'seo', icon: '🔍', tag: 'Traffic', title: 'SEO — Search Engine Optimisation',
    shortDesc: 'Rank higher on Google and get found by customers searching in NZ.',
    cardTag: 'Traffic',
    desc1: "Being found on Google is no longer optional — it's survival. Our SEO service puts your business in front of the customers who are actively searching for what you offer, right now, in your area.",
    desc2: "We use a comprehensive approach combining technical SEO, on-page optimisation, quality content, and authoritative link building. Our NZ-specific expertise means we understand local search behaviour and Google's preferences for NZ businesses.",
    desc3: 'SEO is a long-term investment that compounds over time. Most clients see meaningful ranking improvements within 90 days, with significant traffic growth by month 6.',
    feats: ['Full technical SEO audit','Keyword research & strategy','On-page optimisation','Local SEO & Google Business','Link building campaign','Content creation & optimisation','Monthly ranking reports','Competitor analysis'],
  },
  {
    id: 'facebook', icon: '📘', tag: 'Paid Advertising', title: 'Facebook & Instagram Ads',
    shortDesc: 'Laser-targeted Facebook and Instagram campaigns that generate leads at scale.',
    cardTag: 'Paid Ads',
    desc1: 'Facebook and Instagram advertising remains one of the highest-ROI channels for NZ businesses when done correctly. We create and manage campaigns that reach your exact target customer with the right message at the right time.',
    desc2: 'Our team handles everything from audience research and creative development to campaign setup, testing, and ongoing optimisation. We use advanced targeting including custom audiences, lookalike audiences, and retargeting to maximise your return.',
    desc3: 'We provide transparent monthly reporting so you always know exactly how your ad spend is performing, down to the cost per lead and cost per sale.',
    feats: ['Audience research & targeting','Ad creative design & copywriting','Campaign setup & launch','A/B split testing','Retargeting campaigns','Custom & lookalike audiences','Conversion tracking setup','Monthly performance reports'],
  },
  {
    id: 'google', icon: '🔴', tag: 'Paid Advertising', title: 'Google Ads',
    shortDesc: 'High-intent campaigns that capture customers who are ready to buy right now.',
    cardTag: 'Paid Ads',
    desc1: 'When someone searches for your product or service on Google, you need to be there. Google Ads puts your business at the top of search results for high-intent keywords — reaching customers who are actively ready to buy.',
    desc2: 'We manage Search, Display, Shopping, and Performance Max campaigns with a laser focus on ROI. Every campaign is built around your specific business goals, whether that\'s phone calls, form submissions, or online sales.',
    desc3: 'Unlike Facebook, Google captures demand that already exists. These are people typing "plumber Auckland" or "dentist near me" — and our campaigns make sure they find you first.',
    feats: ['Search, Display & Shopping campaigns','Keyword research & negative keywords','Ad copywriting & extensions','Bid strategy & budget management','Conversion tracking & call tracking','Monthly ROI reports','Competitor analysis','Landing page recommendations'],
  },
  {
    id: 'youtube', icon: '▶️', tag: 'Paid Advertising', title: 'YouTube Ads',
    shortDesc: 'Compelling video ad campaigns that build awareness and drive conversions.',
    cardTag: 'Paid Ads',
    desc1: 'YouTube is the second largest search engine in the world and an incredibly powerful — yet underutilised — advertising platform for NZ businesses. Video ads build brand awareness and trust at scale.',
    desc2: "We create and manage YouTube ad campaigns including skippable in-stream ads, bumper ads, and discovery ads. Our targeting capabilities mean your video is shown to exactly the right audience at the right moment in their buying journey.",
    desc3: "Video advertising has proven to dramatically accelerate the buyer journey — customers who've seen your video ads convert at significantly higher rates across all other channels.",
    feats: ['Campaign strategy & setup','Target audience definition','Skippable & non-skippable ads','Bumper ad campaigns','YouTube remarketing','View-through tracking','Channel optimisation tips','Monthly performance reporting'],
  },
  {
    id: 'social', icon: '📈', tag: 'Social Media', title: 'Social Media Growth',
    shortDesc: 'Organic strategies that build genuine audiences and turn followers into customers.',
    cardTag: 'Social',
    desc1: "Organic social media done right is one of the most powerful brand-building tools available to NZ businesses. We build genuine, engaged audiences that trust your brand and become loyal customers over time.",
    desc2: 'Our social media management service includes content strategy, community management, posting schedule management, and monthly analytics reporting. We handle Facebook, Instagram, TikTok, LinkedIn, and more.',
    desc3: "We don't chase vanity metrics — we focus on building an audience that actually buys from you. Every piece of content is created with your business goals in mind.",
    feats: ['Content strategy & calendar','Professional content creation','Daily/weekly posting management','Community engagement & replies','Hashtag strategy','Story & Reel creation','Monthly analytics report','Competitor benchmarking'],
  },
  {
    id: 'content', icon: '📸', tag: 'Content Creation', title: 'Content Creation',
    shortDesc: 'Professional photos and videos that showcase your business beautifully.',
    cardTag: 'Content',
    desc1: "In today's visual-first world, high-quality content is non-negotiable. Scroll-stopping photos and videos are what separate thriving businesses from those being ignored online. We create content that makes your business look world-class.",
    desc2: 'Our content team includes professional photographers, videographers, and editors who understand what performs on social media and your website. We plan, shoot, and produce everything — you just show up.',
    desc3: 'Content creation sessions are strategically planned to maximise output. A single half-day shoot produces months of content across photos, videos, reels, and stories.',
    feats: ['Professional photography','Video production & editing','Social media reels & stories','Product photography','Team & brand photography','Drone footage (where applicable)','Colour grading & editing','Content scheduling & distribution'],
  },
  {
    id: 'chatbot', icon: '🤖', tag: 'AI Technology', title: 'AI Chatbots',
    shortDesc: 'Intelligent bots that handle enquiries 24/7 and book appointments automatically.',
    cardTag: 'AI',
    desc1: 'Never miss another lead. Our AI chatbots work 24/7 to engage website visitors, answer questions, qualify leads, and book appointments — all without you lifting a finger. Most clients see 60–85% of enquiries handled automatically.',
    desc2: 'We build custom chatbots trained on your specific business, products, services, and FAQs. The result is a bot that sounds like your best team member — knowledgeable, helpful, and always available.',
    desc3: 'Our chatbots integrate with your CRM, booking system, email marketing, and more. Every conversation is logged, and hot leads are instantly notified to your team.',
    feats: ['Custom AI chatbot training','Website integration','Appointment booking capability','Lead capture & qualification','CRM integration','Email/SMS notifications','FAQ handling','Monthly conversation reports'],
  },
  {
    id: 'aiservice', icon: '🧠', tag: 'AI Technology', title: 'AI Customer Service',
    shortDesc: 'AI-powered systems that delight customers with instant, personalised support.',
    cardTag: 'AI',
    desc1: 'Transform your customer service operations with AI-powered support that delights customers with instant, personalised responses. Our AI customer service systems handle high volumes of enquiries across multiple channels simultaneously.',
    desc2: 'We implement intelligent support systems that understand context, remember customer history, and escalate complex issues to your human team automatically. The result is faster resolution times, happier customers, and a team that can focus on high-value work.',
    desc3: 'Built for NZ businesses of all sizes, our AI customer service solutions integrate with your existing tools and can be deployed across your website, Facebook Messenger, WhatsApp, and more.',
    feats: ['Multi-channel deployment','Natural language processing','Customer history integration','Smart escalation rules','Sentiment analysis','Performance analytics dashboard','Team notification system','Continuous learning & improvement'],
  },
  {
    id: 'automation', icon: '⚙️', tag: 'AI Technology', title: 'AI Automation',
    shortDesc: 'Automate follow-ups, data entry, reporting, and repetitive tasks.',
    cardTag: 'AI',
    desc1: 'Stop wasting hours on repetitive tasks. Our AI automation solutions identify the manual, time-consuming processes in your business and replace them with intelligent automated workflows that run perfectly every time.',
    desc2: 'From automated follow-up email sequences and CRM data entry to invoice generation, reporting, and appointment reminders — we map your business processes and build automations that save real hours every week.',
    desc3: 'Our clients typically save 10–25 hours per week through automation, allowing them to focus on growing their business rather than running it.',
    feats: ['Business process mapping','Email & SMS automation','CRM workflow automation','Invoice & document generation','Appointment reminders','Reporting & analytics automation','API integrations','Zapier/Make.com workflows'],
  },
  {
    id: 'app', icon: '📱', tag: 'Technology', title: 'App Development',
    shortDesc: 'Custom mobile apps for small businesses to streamline operations and grow revenue.',
    cardTag: 'Tech',
    desc1: "A custom mobile app can transform how your business operates and how customers engage with you. Whether it's a booking app, loyalty programme, or operational tool, we build apps that are intuitive, fast, and beautiful.",
    desc2: 'We develop native iOS and Android apps as well as cross-platform solutions using React Native. Every app is designed with your users in mind and built to the highest performance standards.',
    desc3: 'Our end-to-end service covers everything from initial concept and UX design through development, testing, App Store submission, and ongoing support.',
    feats: ['iOS & Android development','React Native cross-platform','Custom UX/UI design','Backend API development','Push notifications','App Store submission','Analytics integration','Ongoing maintenance & updates'],
  },
  {
    id: 'brand', icon: '💼', tag: 'Branding', title: 'Brand Identity',
    shortDesc: 'Complete brand systems — logos, colours, typography, and guidelines.',
    cardTag: 'Branding',
    desc1: 'Your brand is more than a logo — it\'s the total impression your business makes on every customer. A strong brand identity creates trust, commands premium pricing, and makes every marketing effort more effective.',
    desc2: 'Our brand identity packages include everything you need to present a consistent, professional image across all touchpoints. We start with deep brand strategy work to define your positioning, values, and personality before creating any visuals.',
    desc3: 'The result is a complete brand system that your whole team can use consistently — from your website to your staff uniforms to your social media posts.',
    feats: ['Brand strategy & positioning','Logo design (primary + variations)','Brand colour palette','Typography system','Brand guidelines document','Business card design','Social media templates','Letterhead & email signature'],
  },
  {
    id: 'strategy', icon: '🗺️', tag: 'Strategy', title: 'Marketing Strategy',
    shortDesc: 'Comprehensive strategies tailored to your goals and the NZ market.',
    cardTag: 'Strategy',
    desc1: "Random acts of marketing don't grow businesses — strategy does. Our marketing strategy service gives you a clear, data-driven roadmap that aligns your marketing investment with your business goals for maximum ROI.",
    desc2: 'We conduct thorough competitor analysis, audience research, and channel evaluation to identify exactly where your best opportunities lie. Then we build a prioritised action plan with clear KPIs and realistic timelines.',
    desc3: 'Our strategy engagements include an in-depth discovery session, comprehensive written strategy document, 90-day action plan, and a presentation to your team.',
    feats: ['Market & competitor analysis','Audience research & personas','Channel mix recommendation','Content strategy','Budget allocation framework','KPI setting & tracking plan','90-day action roadmap','Quarterly strategy reviews'],
  },
  {
    id: 'leads', icon: '🎯', tag: 'Growth', title: 'Lead Generation',
    shortDesc: 'Multi-channel systems that fill your sales pipeline with qualified prospects.',
    cardTag: 'Growth',
    desc1: 'A reliable lead pipeline is the lifeblood of any growing business. Our lead generation systems combine multiple channels — paid ads, SEO, social media, and email — to consistently fill your sales pipeline with qualified prospects.',
    desc2: 'We design and build complete lead generation ecosystems: landing pages that convert, lead magnets that attract, nurture sequences that warm prospects, and tracking systems that show you exactly where every lead comes from.',
    desc3: 'We focus on quality over quantity — delivering leads that match your ideal customer profile and are ready to have a buying conversation.',
    feats: ['Lead generation strategy','High-converting landing pages','Lead magnet creation','Email nurture sequences','Multi-channel campaigns','CRM integration & lead routing','Lead scoring setup','Monthly pipeline reporting'],
  },
  {
    id: 'local', icon: '🏪', tag: 'Local Marketing', title: 'Local Business Marketing',
    shortDesc: 'Hyper-local strategies to dominate your area and bring more customers in.',
    cardTag: 'Local',
    desc1: 'For businesses that serve a local area, dominating local search and community awareness is everything. Our local marketing strategies put you at the top of mind — and the top of Google — for customers in your area.',
    desc2: 'We combine Google Business Profile optimisation, local SEO, targeted local ads, and community-focused content to build your presence as the go-to business in your area. From Ponsonby to Papanui — we make you the local authority.',
    desc3: 'Local marketing is one of the fastest ways to see results. Many clients see measurable increases in foot traffic and phone calls within the first 30 days.',
    feats: ['Google Business Profile optimisation','Local citation building','Hyper-local ad targeting','Review generation strategy','Local content creation','Community social media','Local link building','Competitor gap analysis'],
  },
  {
    id: 'gmb', icon: '📍', tag: 'Local', title: 'Google Business Profile',
    shortDesc: 'Full optimisation to rank in local searches and attract nearby customers.',
    cardTag: 'Local',
    desc1: 'Your Google Business Profile is often the first thing a potential customer sees when they search for your business or a business like yours. An unoptimised profile is costing you customers every single day.',
    desc2: 'We fully optimise your Google Business Profile to maximise your visibility in local search results and Google Maps. This includes every detail from business information and categories to photos, posts, and Q&A.',
    desc3: 'A well-optimised Google Business Profile can appear in the coveted "local pack" — the top 3 map results that get the majority of clicks for local searches.',
    feats: ['Full profile setup & optimisation','Category & attribute optimisation','Professional photo uploads','Google Posts strategy & management','Review response management','Q&A monitoring & responses','Insights & analytics reporting','Local pack ranking strategy'],
  },
]

export default function ServicesSection() {
  const [active, setActive] = useState<Service | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setActive(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [active])

  return (
    <>
      <div className="sgrid">
        {services.map((s, i) => (
          <ScrollReveal key={s.id} delay={i * 40}>
            <div className="sc2" onClick={() => setActive(s)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setActive(s)}>
              <span className="si">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.shortDesc}</p>
              <span className="stag">{s.cardTag}</span>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Modal */}
      <div
        className={`smodal-overlay${active ? ' open' : ''}`}
        onClick={e => { if (e.target === e.currentTarget) setActive(null) }}
      >
        {active && (
          <div className="smodal">
            <button className="smodal-close" onClick={() => setActive(null)}>✕</button>
            <div className="smodal-icon">{active.icon}</div>
            <span className="smodal-tag">{active.tag}</span>
            <h2>{active.title}</h2>
            <p>{active.desc1}</p>
            <p>{active.desc2}</p>
            <p>{active.desc3}</p>
            <h3 style={{ fontSize: '.9rem', fontWeight: 700, marginBottom: '.8rem', color: 'var(--ac2)' }}>What&apos;s Included</h3>
            <ul className="smodal-feats">
              {active.feats.map(f => <li key={f}>{f}</li>)}
            </ul>
            <Link href="/contact" className="btn1" onClick={() => setActive(null)} style={{ width: '100%', justifyContent: 'center' }}>
              Book Free Consultation 🚀
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
