'use client'
import { useState } from 'react'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import Icon from '@/components/Icon'

const plans = [
  {
    name: 'Starter', cls: '', badge: '',
    desc: 'Perfect for getting started with digital marketing.',
    monthly: '$399', annual: '$379', annualSave: '5% off',
    features: [
      '5 professional photos/month',
      '5 social media posts/month',
      '1 promotional video/month',
      'Social media posting (3×/week)',
      'Google Business Profile optimisation',
      'Google review optimisation & reputation boost',
      'Organic social media growth strategies',
      'Ongoing audience growth optimisation',
      'Monthly performance report',
      'Email support',
    ],
  },
  {
    name: 'Growth', cls: '', badge: '',
    desc: 'For businesses ready to accelerate their growth.',
    monthly: '$699', annual: '$664', annualSave: '5% off',
    features: [
      '10 professional photos/month',
      '10 social media posts/month',
      '4 promotional videos/month',
      'Daily social media posting',
      'Facebook OR Google Ads',
      'Basic SEO setup',
      'Google review optimisation & reputation boost',
      'Organic social media growth strategies',
      'Ongoing audience growth optimisation',
      'Fortnightly strategy call',
    ],
  },
  {
    name: 'Premium', cls: 'pop', badge: 'Most Popular',
    desc: 'Best value — everything most businesses need to dominate.',
    monthly: '$1,249', annual: '$999', annualSave: '20% off',
    features: [
      '15 professional photos/month',
      '15 social media posts/month',
      '8 promotional videos/month',
      'Daily social media posting',
      'Facebook + Instagram + TikTok',
      'Professional ad campaigns',
      'Advanced SEO',
      'AI chatbot setup',
      'Google review optimisation & reputation boost',
      'Organic social media growth strategies',
      'Ongoing audience growth optimisation',
      'Monthly strategy call',
    ],
  },
  {
    name: 'Ultimate', cls: '', badge: '',
    desc: 'For businesses serious about aggressive scaling.',
    monthly: '$1,999', annual: '$1,699', annualSave: '15% off',
    features: [
      '30 professional photos/month',
      '30 social media posts/month',
      '11 promotional videos/month',
      'YouTube channel management',
      'All ad platforms managed',
      'Full SEO domination',
      'AI automation suite',
      'Google review optimisation & reputation boost',
      'Organic social media growth strategies',
      'Ongoing audience growth optimisation',
      'Weekly strategy calls',
      'Dedicated account manager',
    ],
  },
  {
    name: 'Enterprise', cls: 'eli', badge: 'Premium',
    desc: 'Multi-location or enterprise-level solution.',
    monthly: 'Custom', annual: 'Custom', annualSave: '',
    features: [
      'Everything in Ultimate',
      'Multi-location management',
      'Custom AI solutions',
      'API integrations',
      'White-glove onboarding',
      'SLA guarantee',
      'C-suite reporting',
    ],
  },
]

export default function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const tiers = plans.filter(p => p.monthly !== 'Custom')
  const ent = plans.find(p => p.monthly === 'Custom')

  return (
    <section id="pricing">
      <div className="cnt">
        <div className="shead">
          <div>
            <span className="slbl">Pricing</span>
            <h2 className="stit">Clear plans. <span className="gt">No lock-in.</span></h2>
          </div>
          <div>
            <p className="ssub">Month-to-month plans that scale with your business. Every plan includes monthly reporting and onboarding in 5–7 days.</p>
            <div className="bill" role="group" aria-label="Billing period">
              <button className={billing === 'monthly' ? 'on' : ''} onClick={() => setBilling('monthly')} aria-pressed={billing === 'monthly'}>Monthly</button>
              <button className={billing === 'annual' ? 'on' : ''} onClick={() => setBilling('annual')} aria-pressed={billing === 'annual'}>Annual <em>Save up to 20%</em></button>
            </div>
          </div>
        </div>

        <div className="pgrid2">
          {tiers.map((p, i) => {
            const price = billing === 'annual' ? p.annual : p.monthly
            return (
              <ScrollReveal key={p.name} delay={i * 70}>
                <div className={`pc ${p.cls}`} style={{ height: '100%' }}>
                  {p.badge && <div className="pbdg">{p.badge}</div>}
                  <div className="pname">{p.name}</div>
                  <div className="pprice">
                    {price}
                    {billing === 'annual' && p.annualSave && <span className="pstrike">{p.monthly}</span>}
                  </div>
                  <div className="pperiod">NZD per month{billing === 'annual' ? ', billed annually' : ''}</div>
                  <div className="pdesc">{p.desc}</div>
                  <ul className="pfeats">
                    {p.features.map(f => <li key={f}>{f}</li>)}
                  </ul>
                  <Link href="/contact" className="pbtn">Get started <Icon name="arrow" size={15} /></Link>
                </div>
              </ScrollReveal>
            )
          })}

          {ent && (
            <ScrollReveal className="pent-wrap" delay={100}>
              <div className="pent">
                <div>
                  <h3>{ent.name}</h3>
                  <p>{ent.desc} Tailored scope and pricing.</p>
                </div>
                <ul>{ent.features.map(f => <li key={f}>{f}</li>)}</ul>
                <Link href="/contact" className="btn2">Talk to us <Icon name="arrow" size={15} /></Link>
              </div>
            </ScrollReveal>
          )}
        </div>

        <p className="pnote">All prices in NZD · No lock-in contracts · Cancel anytime</p>
      </div>
    </section>
  )
}
