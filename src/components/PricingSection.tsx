'use client'
import { useState, type CSSProperties } from 'react'
import Link from 'next/link'
import Icon from '@/components/Icon'
import { Words } from '@/components/ScrollReveal'

const plans = [
  {
    name: 'Starter', pop: false,
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
    name: 'Growth', pop: false,
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
    name: 'Premium', pop: true,
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
    name: 'Ultimate', pop: false,
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
]

// Matte tile badges: Starter sprout, Growth rising chart, Premium award, Ultimate rocket
const TILE_ICONS = ['leaf', 'trend', 'award', 'rocket'] as const

const enterprise = {
  name: 'Enterprise',
  desc: 'Multi-location or enterprise-level solution. Tailored scope and pricing.',
  features: ['Everything in Ultimate', 'Multi-location management', 'Custom AI solutions', 'API integrations', 'White-glove onboarding', 'SLA guarantee', 'C-suite reporting'],
}

export default function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <section id="pricing" className="sec pricing-v6">
      <div className="wrap">
        <div className="grid12 shead">
          <div className="shead-l">
            <p className="eyebrow rv rv-up">Pricing</p>
            <h2 className="h2 rv"><Words text="Clear plans." /> <em><Words text="No lock-in." delay={140} /></em></h2>
          </div>
          <div className="shead-r rv rv-up" style={{ '--d': '200ms' } as CSSProperties}>
            <p className="body">Month-to-month plans that scale with your business. Every plan includes monthly reporting and onboarding in 5–7 days.</p>
            <div className={`bill${billing === 'annual' ? ' ann' : ''}`} role="group" aria-label="Billing period">
              <span className="bill-pill" aria-hidden="true" />
              <button className={billing === 'monthly' ? 'on' : ''} onClick={() => setBilling('monthly')} aria-pressed={billing === 'monthly'}>Monthly</button>
              <button className={billing === 'annual' ? 'on' : ''} onClick={() => setBilling('annual')} aria-pressed={billing === 'annual'}>Annual <em>save up to 20%</em></button>
            </div>
          </div>
        </div>

        <div className="price-grid">
          {plans.map((p, i) => {
            const price = billing === 'annual' ? p.annual : p.monthly
            return (
              <div key={p.name} className="rv rv-up" style={{ '--d': `${i * 80}ms` } as CSSProperties}>
                <div className={`plan tile tile-${i}${p.pop ? ' pop' : ''}`}>
                  {p.pop && <div className="plan-badge">Most popular</div>}
                  <span className="tile-badge" aria-hidden="true"><Icon name={TILE_ICONS[i]} size={24} stroke={1.6} /></span>
                  <div className="plan-name">{p.name}</div>
                  <div className="plan-price">
                    <span key={price} className="plan-amt">{price}</span>
                    {billing === 'annual' && <span className="plan-was">{p.monthly}</span>}
                  </div>
                  <div className="plan-per">NZD / month{billing === 'annual' ? ` · billed annually · ${p.annualSave}` : ''}</div>
                  <p className="plan-desc">{p.desc}</p>
                  <Link href="/contact" className="btn btn-block tile-btn">
                    <span className="btn-l">Get started</span>
                    <span className="btn-ic"><Icon name="arrow" size={14} stroke={2} /></span>
                  </Link>
                  <ul className="ticks sm">
                    {p.features.map(f => <li key={f}><Icon name="check" size={14} stroke={2} />{f}</li>)}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        <div className="rv rv-up">
          <div className="ent card spot">
            <div>
              <div className="plan-name">{enterprise.name}</div>
              <h3 className="h3">Built around your <em>organisation.</em></h3>
              <p>{enterprise.desc}</p>
            </div>
            <ul className="ticks two">
              {enterprise.features.map(f => <li key={f}><Icon name="check" size={14} stroke={2} />{f}</li>)}
            </ul>
            <Link href="/contact" className="btn btn-ghost" data-magnetic>
              <span className="btn-l">Talk to us</span>
              <span className="btn-ic"><Icon name="arrow" size={14} stroke={2} /></span>
            </Link>
          </div>
        </div>

        <p className="fine">All prices in NZD · No lock-in contracts · Cancel anytime</p>
      </div>
    </section>
  )
}
