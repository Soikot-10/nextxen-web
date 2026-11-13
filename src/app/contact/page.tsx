'use client'
import { useState } from 'react'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import Icon, { type IconName } from '@/components/Icon'

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
    // No form backend is configured yet, so hand the enquiry to the visitor's email app
    // rather than showing a success message for a message that was never sent.
    const body = [
      `Name: ${form.name}`, `Email: ${form.email}`, `Phone: ${form.phone || '-'}`,
      `Business: ${form.business}`, `Service: ${form.service}`, `Budget: ${form.budget || '-'}`, '', form.message,
    ].join('\n')
    window.location.href = `mailto:hello@nextxen.co.nz?subject=${encodeURIComponent(`New enquiry: ${form.business}`)}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ minHeight: '52vh' }}>
        <div className="orb orb1" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="slbl">Contact</span>
          <h1>Start your <span className="gt">growth story.</span></h1>
          <p className="hero-sub" style={{ marginBottom: 0 }}>
            Tell us a little about your business and a specialist will be in touch within one business day. No obligation, just honest advice.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section>
        <div className="cnt">
          <div className="cgrid2">
            {/* Contact info */}
            <div>
              <ScrollReveal>
                <span className="slbl">Talk to a real team</span>
                <h2 className="stit" style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}>Based in Auckland, working <span className="gt">nationwide.</span></h2>
                <p style={{ color: 'var(--tx2)', lineHeight: 1.7, marginBottom: '2rem' }}>
                  We&apos;re a NZ-based team that understands the local market. No offshore call centres — just real people who care about your results.
                </p>
              </ScrollReveal>

              {([
                { icon: 'mail', label: 'Email', val: <a href="mailto:hello@nextxen.co.nz">hello@nextxen.co.nz</a> },
                { icon: 'pin', label: 'Location', val: 'Auckland, New Zealand' },
                { icon: 'clock', label: 'Hours', val: 'Mon–Fri, 9am–6pm NZT' },
              ] as { icon: IconName; label: string; val: React.ReactNode }[]).map((item, i) => (
                <ScrollReveal key={item.label} delay={i * 80}>
                  <div className="ci2">
                    <div className="cic"><Icon name={item.icon} size={19} /></div>
                    <div>
                      <div className="cil">{item.label}</div>
                      <div className="civ">{item.val}</div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}

              <ScrollReveal delay={400}>
                <div className="next-box">
                  <h3>What happens next</h3>
                  <ol>
                    <li>We review your enquiry within one business day</li>
                    <li>A specialist calls to discuss your goals</li>
                    <li>You receive a tailored proposal within 48 hours</li>
                    <li>You decide. Zero pressure, zero obligation</li>
                  </ol>
                </div>
              </ScrollReveal>
            </div>

            {/* Form */}
            <ScrollReveal>
              {submitted ? (
                <div className="cform" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <div className="smodal-icon" style={{ margin: '0 auto 1.6rem' }}><Icon name="checkCircle" size={24} /></div>
                  <h2 style={{ fontSize: '2.4rem', marginBottom: '.8rem' }}>Thanks, {form.name.split(' ')[0]}.</h2>
                  <p style={{ color: 'var(--tx2)', lineHeight: 1.7, marginBottom: '1.8rem', maxWidth: 420, marginInline: 'auto' }}>
                    Your email app should have opened with your enquiry ready to send. If it didn&apos;t, email us directly at <a href="mailto:hello@nextxen.co.nz" style={{ color: 'var(--tx)' }}>hello@nextxen.co.nz</a>.
                  </p>
                  <Link href="/" className="btn2">Back to home</Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="cform" noValidate>
                  <h2 style={{ fontSize: '2rem', marginBottom: '1.8rem' }}>Tell us about your business</h2>
                  <div className="frow">
                    {[{id:'name',label:'Full name *',type:'text',ph:'John Smith'},{id:'email',label:'Email *',type:'email',ph:'john@business.co.nz'}].map(f => (
                      <div key={f.id} className="fg">
                        <label>{f.label}</label>
                        <input type={f.type} value={form[f.id as keyof typeof form]} onChange={e => setForm(v=>({...v,[f.id]:e.target.value}))} placeholder={f.ph} style={errors[f.id] ? {borderColor:'#f0866b'} : {}} />
                        {errors[f.id] && <p className="ferr">{errors[f.id]}</p>}
                      </div>
                    ))}
                  </div>
                  <div className="frow">
                    {[{id:'phone',label:'Phone',type:'tel',ph:'+64 21 000 0000'},{id:'business',label:'Business name *',type:'text',ph:'Your Business Ltd'}].map(f => (
                      <div key={f.id} className="fg">
                        <label>{f.label}</label>
                        <input type={f.type} value={form[f.id as keyof typeof form]} onChange={e => setForm(v=>({...v,[f.id]:e.target.value}))} placeholder={f.ph} style={errors[f.id] ? {borderColor:'#f0866b'} : {}} />
                        {errors[f.id] && <p className="ferr">{errors[f.id]}</p>}
                      </div>
                    ))}
                  </div>
                  <div className="frow">
                    <div className="fg">
                      <label>Service of interest *</label>
                      <select value={form.service} onChange={e => setForm(v=>({...v,service:e.target.value}))} style={errors.service ? {borderColor:'#f0866b'} : {}}>
                        <option value="">Select a service...</option>
                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.service && <p className="ferr">{errors.service}</p>}
                    </div>
                    <div className="fg">
                      <label>Monthly budget</label>
                      <select value={form.budget} onChange={e => setForm(v=>({...v,budget:e.target.value}))}>
                        <option value="">Select budget range...</option>
                        {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="fg">
                    <label>Your goals *</label>
                    <textarea value={form.message} onChange={e => setForm(v=>({...v,message:e.target.value}))} placeholder="Tell us about your business, current challenges, and what you're hoping to achieve with digital marketing..." style={errors.message ? {borderColor:'#f0866b'} : {}} />
                    {errors.message && <p className="ferr">{errors.message}</p>}
                  </div>
                  <button type="submit" className="btn1" style={{ width: '100%', marginTop: '.4rem' }}>
                    Send enquiry <Icon name="arrow" size={16} />
                  </button>
                  <p style={{ textAlign: 'center', color: 'var(--tx3)', fontSize: '.8rem', marginTop: '1rem' }}>
                    No spam and no lock-in contracts. Just genuine advice from a real NZ team.
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
