'use client'
import { useState } from 'react'
import Link from 'next/link'

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

  return (
    <section id="pricing">
      <div className="cnt">
        <div className="tc">
          <span className="slbl">Pricing</span>
          <h2 className="stit">Transparent <span className="gt">Pricing Plans</span></h2>
          <p className="ssub" style={{ margin: '0 auto' }}>No lock-in contracts. No hidden fees. Cancel anytime.</p>

          {/* Billing toggle */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'var(--bg3)',
            border: '1px solid var(--bd)',
            borderRadius: '50px',
            padding: '5px',
            marginTop: '1.8rem',
            gap: '4px',
            boxShadow: '0 2px 20px rgba(0,0,0,.3)',
          }}>
            <button
              onClick={() => setBilling('monthly')}
              style={{
                padding: '.5rem 1.6rem',
                borderRadius: '50px',
                border: 'none',
                fontFamily: 'var(--ff)',
                fontWeight: 600,
                fontSize: '.83rem',
                cursor: 'pointer',
                transition: 'all .25s',
                background: billing === 'monthly' ? 'var(--g1)' : 'transparent',
                color: billing === 'monthly' ? '#fff' : 'var(--tx2)',
                boxShadow: billing === 'monthly' ? '0 0 20px rgba(108,92,231,.45)' : 'none',
                letterSpacing: '.01em',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              style={{
                padding: '.5rem 1.6rem',
                borderRadius: '50px',
                border: 'none',
                fontFamily: 'var(--ff)',
                fontWeight: 600,
                fontSize: '.83rem',
                cursor: 'pointer',
                transition: 'all .25s',
                display: 'flex',
                alignItems: 'center',
                gap: '.5rem',
                background: billing === 'annual' ? 'var(--g1)' : 'transparent',
                color: billing === 'annual' ? '#fff' : 'var(--tx2)',
                boxShadow: billing === 'annual' ? '0 0 20px rgba(108,92,231,.45)' : 'none',
                letterSpacing: '.01em',
              }}
            >
              Annual
              <span style={{
                background: billing === 'annual'
                  ? 'rgba(255,255,255,.2)'
                  : 'linear-gradient(135deg,#00cec9,#55efc4)',
                color: '#fff',
                fontSize: '.6rem',
                fontWeight: 800,
                padding: '.18rem .52rem',
                borderRadius: '50px',
                letterSpacing: '.06em',
                textTransform: 'uppercase' as const,
                border: billing === 'annual' ? '1px solid rgba(255,255,255,.3)' : 'none',
              }}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="pgrid2" style={{ marginTop: '2rem' }}>
          {plans.map(p => {
            const price = billing === 'annual' ? p.annual : p.monthly
            const period = price === 'Custom'
              ? 'tailored pricing'
              : billing === 'annual'
              ? 'per month, billed annually'
              : 'per month'

            return (
              <div key={p.name} className={`pc ${p.cls}`} style={{ marginTop: p.badge ? '14px' : undefined }}>
                {p.badge && (p.cls === 'pop'
                  ? <div className="pbdg">{p.badge}</div>
                  : <div className="ebdg">{p.badge}</div>
                )}

                {/* Plan name + save pill on same row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.1rem' }}>
                  <div className="pname" style={{ margin: 0 }}>{p.name}</div>
                  {billing === 'annual' && p.annualSave && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '.28rem',
                      background: 'rgba(0,206,201,.08)',
                      border: '1px solid rgba(0,206,201,.22)',
                      borderRadius: '50px',
                      padding: '.22rem .65rem',
                    }}>
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                        <path d="M5 1L6.2 3.8L9 4.1L7 6L7.6 9L5 7.5L2.4 9L3 6L1 4.1L3.8 3.8Z"
                          fill="url(#sg)" />
                        <defs>
                          <linearGradient id="sg" x1="0" y1="0" x2="10" y2="10">
                            <stop stopColor="#00cec9" />
                            <stop offset="1" stopColor="#55efc4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span style={{
                        fontSize: '.63rem',
                        fontWeight: 700,
                        letterSpacing: '.05em',
                        background: 'linear-gradient(135deg,#00cec9,#55efc4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>
                        {p.annualSave}
                      </span>
                    </div>
                  )}
                </div>

                {/* Price with crossed-out monthly when on annual */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '.6rem', marginTop: '.5rem' }}>
                  <div className="pprice">{price}</div>
                  {billing === 'annual' && p.annualSave && (
                    <span style={{
                      fontSize: '.85rem',
                      color: 'var(--tx3)',
                      textDecoration: 'line-through',
                      fontWeight: 500,
                    }}>
                      {p.monthly}
                    </span>
                  )}
                </div>

                <div className="pperiod">{period}</div>
                <div className="pdesc">{p.desc}</div>
                <ul className="pfeats">
                  {p.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <Link href="/contact" className="pbtn">Get Started</Link>
              </div>
            )
          })}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--tx3)', fontSize: '.76rem', marginTop: '1.4rem' }}>
          All prices in NZD · No lock-in contracts · Cancel anytime
        </p>
      </div>
    </section>
  )
}
