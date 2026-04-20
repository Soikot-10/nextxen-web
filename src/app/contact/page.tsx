'use client'
import { useState } from 'react'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'

const services = ['Website Design','SEO','Facebook Ads','Google Ads','Social Media Management','AI Chatbot','AI Automation','Content Creation','Brand Identity','Lead Generation','Full-Service Package','Other']
const budgets = ['Under $500/month','$500 – $1,000/month','$1,000 – $2,500/month','$2,500 – $5,000/month','$5,000+/month','Not sure yet']

export default function ContactPage() {
  const [form, setForm] = useState({ name:'',email:'',phone:'',business:'',service:'',budget:'',message:'' })
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [submitted, setSubmitted] = useState(false)

  function validate() {
    const errs: Record<string,string> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address'
    if (!form.business.trim()) errs.business = 'Business name is required'
    if (!form.service) errs.service = 'Please select a service'
    if (!form.message.trim()) errs.message = 'Message is required'
    else if (form.message.trim().length < 20) errs.message = 'Please provide a bit more detail (20+ characters)'
    return errs
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ minHeight: '44vh', paddingTop: '10rem', paddingBottom: '3rem' }}>
        <div className="orb orb1" style={{ opacity: .6 }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span className="slbl" style={{ display: 'block' }}>Get In Touch</span>
          <h1 style={{ fontSize: 'clamp(1.9rem,4.5vw,3.4rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-.03em', marginBottom: '.9rem' }}>
            Start Your <span className="gt">Growth Journey</span>
          </h1>
          <p style={{ color: 'var(--tx2)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.72 }}>
            Fill in the form below and one of our specialists will be in touch within 24 hours. No obligation — just genuine advice about how we can help your business grow.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section style={{ background: 'var(--bg2)' }}>
        <div className="cnt">
          <div className="cgrid2">
            {/* Contact info */}
            <div>
              <ScrollReveal>
                <span className="slbl">Contact Info</span>
                <h2 className="stit" style={{ fontSize: '1.5rem' }}>Talk to a real NZ team</h2>
                <p style={{ color: 'var(--tx2)', fontSize: '.86rem', lineHeight: 1.72, marginBottom: '2rem' }}>
                  We&apos;re a NZ-based team that understands the local market. No offshore call centres — just real people who care about your results.
                </p>
              </ScrollReveal>

              {[
                { icon: '📧', label: 'Email', val: 'hello@nextxen.co.nz' },
                { icon: '📞', label: 'Phone', val: '+64 (0) 00 000 0000' },
                { icon: '📍', label: 'Location', val: 'Auckland, New Zealand' },
                { icon: '⏰', label: 'Hours', val: 'Mon–Fri: 9am–6pm NZST' },
              ].map((item, i) => (
                <ScrollReveal key={item.label} delay={i * 80}>
                  <div className="ci2">
                    <div className="cic">{item.icon}</div>
                    <div>
                      <div className="cil">{item.label}</div>
                      <div className="civ">{item.val}</div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}

              <ScrollReveal delay={400}>
                <div style={{ marginTop: '1.8rem', background: 'rgba(108,92,231,.07)', border: '1px solid rgba(108,92,231,.18)', borderRadius: '12px', padding: '1.3rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '.82rem', marginBottom: '.75rem' }}>🚀 What happens next?</div>
                  <ol style={{ paddingLeft: '1rem', color: 'var(--tx2)', fontSize: '.8rem', lineHeight: 1.75 }}>
                    <li>We review your enquiry within 24 hours</li>
                    <li>A specialist calls to discuss your goals</li>
                    <li>We send a tailored proposal within 48 hours</li>
                    <li>You decide — zero pressure, zero obligation</li>
                  </ol>
                </div>
              </ScrollReveal>
            </div>

            {/* Form */}
            <ScrollReveal>
              {submitted ? (
                <div className="cform" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '.65rem' }}>Thanks, {form.name.split(' ')[0]}!</h2>
                  <p style={{ color: 'var(--tx2)', fontSize: '.9rem', lineHeight: 1.72, marginBottom: '1.8rem' }}>
                    Your enquiry has been received. One of our specialists will be in touch within 24 business hours.
                  </p>
                  <Link href="/" className="btn1">Back to Home</Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="cform" noValidate>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Tell Us About Your Business</h2>
                  <div className="frow">
                    {[{id:'name',label:'Full Name *',type:'text',ph:'John Smith'},{id:'email',label:'Email Address *',type:'email',ph:'john@business.co.nz'}].map(f => (
                      <div key={f.id} className="fg">
                        <label>{f.label}</label>
                        <input type={f.type} value={form[f.id as keyof typeof form]} onChange={e => setForm(v=>({...v,[f.id]:e.target.value}))} placeholder={f.ph} style={errors[f.id] ? {borderColor:'#e17055'} : {}} />
                        {errors[f.id] && <p style={{ color: '#e17055', fontSize: '.72rem', marginTop: '.3rem' }}>{errors[f.id]}</p>}
                      </div>
                    ))}
                  </div>
                  <div className="frow">
                    {[{id:'phone',label:'Phone Number',type:'tel',ph:'+64 21 000 0000'},{id:'business',label:'Business Name *',type:'text',ph:'Your Business Ltd'}].map(f => (
                      <div key={f.id} className="fg">
                        <label>{f.label}</label>
                        <input type={f.type} value={form[f.id as keyof typeof form]} onChange={e => setForm(v=>({...v,[f.id]:e.target.value}))} placeholder={f.ph} style={errors[f.id] ? {borderColor:'#e17055'} : {}} />
                        {errors[f.id] && <p style={{ color: '#e17055', fontSize: '.72rem', marginTop: '.3rem' }}>{errors[f.id]}</p>}
                      </div>
                    ))}
                  </div>
                  <div className="frow">
                    <div className="fg">
                      <label>Service Interested In *</label>
                      <select value={form.service} onChange={e => setForm(v=>({...v,service:e.target.value}))} style={errors.service ? {borderColor:'#e17055'} : {}}>
                        <option value="">Select a service...</option>
                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.service && <p style={{ color: '#e17055', fontSize: '.72rem', marginTop: '.3rem' }}>{errors.service}</p>}
                    </div>
                    <div className="fg">
                      <label>Monthly Budget</label>
                      <select value={form.budget} onChange={e => setForm(v=>({...v,budget:e.target.value}))}>
                        <option value="">Select budget range...</option>
                        {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="fg">
                    <label>Tell Us About Your Goals *</label>
                    <textarea value={form.message} onChange={e => setForm(v=>({...v,message:e.target.value}))} placeholder="Tell us about your business, current challenges, and what you're hoping to achieve with digital marketing..." style={errors.message ? {borderColor:'#e17055'} : {}} />
                    {errors.message && <p style={{ color: '#e17055', fontSize: '.72rem', marginTop: '.3rem' }}>{errors.message}</p>}
                  </div>
                  <button type="submit" className="btn1" style={{ width: '100%', justifyContent: 'center', letterSpacing: '.03em' }}>
                    🚀 Send My Enquiry — We&apos;ll Reply Within 24 Hours
                  </button>
                  <p style={{ textAlign: 'center', color: 'var(--tx3)', fontSize: '.74rem', marginTop: '1rem' }}>
                    No spam. No lock-in contracts. Just genuine advice from a real NZ team.
                  </p>
                </form>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}
