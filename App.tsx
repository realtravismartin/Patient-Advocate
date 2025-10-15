import React, { useMemo, useState } from 'react'
import './App.css'
import { createClient } from '@supabase/supabase-js'

type LeadPayload = {
  fullName: string
  email: string
  insurance: string
  summary: string
}

function App() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const supabase = useMemo(() => {
    const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
    if (url && key) {
      return createClient(url, key)
    }
    return null
  }, [])

  const webhookUrl = (import.meta.env.VITE_LEADS_WEBHOOK_URL as string | undefined) || ''

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    const values = Object.fromEntries(formData.entries()) as Record<string, string>
    const payload: LeadPayload = {
      fullName: values.fullName?.trim() || '',
      email: values.email?.trim() || '',
      insurance: values.insurance?.trim() || '',
      summary: values.summary?.trim() || '',
    }

    if (!payload.fullName || !payload.email || !payload.insurance || !payload.summary) {
      setError('Please fill in all fields.')
      return
    }

    try {
      // 1) Store in Supabase if configured
      if (supabase) {
        const { error: dbError } = await supabase.from('leads').insert([
          {
            full_name: payload.fullName,
            email: payload.email,
            insurance: payload.insurance,
            summary: payload.summary,
            created_at: new Date().toISOString(),
          },
        ])
        if (dbError) throw dbError
      }

      // 2) Send to optional webhook (e.g., Zapier) for email backup
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'lead',
            to: 'tm@travismartin.io',
            payload,
            source: 'patient-advocacy-service',
            timestamp: new Date().toISOString(),
          }),
        })
      }

      setSubmitted(true)
      form.reset()
    } catch (err: any) {
      setError('We could not submit your request. Please try again or contact us.')
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }

  return (
    <div className="App" data-loc="src/App.tsx:5:5">
      <header className="App-header hero-gradient" data-loc="src/App.tsx:6:7">
        <h1 data-loc="src/App.tsx:7:9">We get your care approved — fast.</h1>
        <p data-loc="src/App.tsx:8:9">
          Insurance shouldn’t stand between you and your health. We fight denials so medically necessary
          procedures, medications, and expert guidance get approved. Flat fee. No charge if we’re unsuccessful.
        </p>
        <a className="primary-button cta-hero" href="#get-started">Apply for a case review</a>
      </header>

      <main className="page-content">
        <section className="stats-strip">
          <div className="stat-card">
            <div className="stat-value">1,200+</div>
            <div className="stat-label">Cases approved</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">92%</div>
            <div className="stat-label">Success rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">7 days</div>
            <div className="stat-label">Avg. insurer response</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">$2.3M</div>
            <div className="stat-label">Out‑of‑pocket avoided</div>
          </div>
        </section>

        <section className="section-grid">
          <article className="info-card">
            <h2 className="section-title">What we do</h2>
            <p>
              We assemble medical evidence, coordinate with your providers, and submit strong appeals to
              insurers to reverse denials for treatments, imaging, medications, and other care.
            </p>
          </article>
          <article className="info-card">
            <h2 className="section-title">Flat-fee pricing</h2>
            <p>
              One clear flat fee covers the complete appeal process for a case—no hourly surprises, no add‑on charges.
            </p>
          </article>
          <article className="info-card">
            <h2 className="section-title">No‑win, no‑fee</h2>
            <p>
              If we are not successful in getting an approval, you don’t pay the fee. We align our incentives with you.
            </p>
          </article>
        </section>

        <section className="section-block">
          <h2 className="section-title">How it works</h2>
          <ol className="steps-list">
            <li>
              <span className="step-badge">1</span>
              Share your denial letter and a brief summary of the needed care.
            </li>
            <li>
              <span className="step-badge">2</span>
              We review medical necessity, plan language, and prior auth rules.
            </li>
            <li>
              <span className="step-badge">3</span>
              We prepare and file a comprehensive appeal with supporting evidence.
            </li>
            <li>
              <span className="step-badge">4</span>
              We follow through with the insurer until a final decision is issued.
            </li>
          </ol>
        </section>

        <section className="section-block">
          <h2 className="section-title">What we help get approved</h2>
          <ul className="bulleted-list">
            <li>Procedures and surgeries</li>
            <li>Specialist visits and diagnostics</li>
            <li>Medications and step‑therapy overrides</li>
            <li>Durable medical equipment and therapies</li>
          </ul>
        </section>

        <section className="section-block pricing">
          <h2 className="section-title">Pricing</h2>
          <p className="section-subtitle">Simple. Transparent. No hidden fees.</p>
          <div className="pricing-grid">
            <article className="pricing-card">
              <h3 className="pricing-title">Patients</h3>
              <div className="pricing-price">Flat fee per appeal</div>
              <ul className="pricing-list">
                <li>Case review and strategy</li>
                <li>Appeal letter and evidence</li>
                <li>Follow‑through to decision</li>
              </ul>
              <a className="primary-button" href="#get-started">Start your appeal</a>
            </article>
            <article className="pricing-card">
              <h3 className="pricing-title">Providers</h3>
              <div className="pricing-price">Bundle pricing</div>
              <ul className="pricing-list">
                <li>Multiple appeals per month</li>
                <li>Prior‑auth and peer‑to‑peer support</li>
                <li>EMR‑friendly workflows</li>
              </ul>
              <a className="primary-button" href="#get-started">Talk to us</a>
            </article>
            <article className="pricing-card">
              <h3 className="pricing-title">Employers</h3>
              <div className="pricing-price">Program pricing</div>
              <ul className="pricing-list">
                <li>Member advocacy program</li>
                <li>Cost‑avoidance reporting</li>
                <li>Dedicated advocate team</li>
              </ul>
              <a className="primary-button" href="#get-started">Request a demo</a>
            </article>
          </div>
        </section>

        <section className="section-block testimonials">
          <h2 className="section-title">What our clients say</h2>
          <ul className="testimonial-list">
            <li className="testimonial-card">
              <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote>
                “They overturned my medication denial in under two weeks. I couldn’t have done it without them.”
              </blockquote>
              <div className="attribution">— A.M., Patient</div>
            </li>
            <li className="testimonial-card">
              <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote>
                “Our clinic saves hours per week and gets faster approvals. The flat fee is a no‑brainer.”
              </blockquote>
              <div className="attribution">— J.S., Practice Manager</div>
            </li>
          </ul>
        </section>

        <section className="section-block faq">
          <h2 className="section-title">Frequently asked questions</h2>
          <ul className="faq-list">
            <li className={`faq-item ${openFaq === 0 ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === 0 ? null : 0)} aria-expanded={openFaq === 0}>
                Do you charge if the appeal is unsuccessful?
              </button>
              {openFaq === 0 && (
                <div className="faq-answer">
                  No. We only charge our flat fee when we obtain an approval.
                </div>
              )}
            </li>
            <li className={`faq-item ${openFaq === 1 ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === 1 ? null : 1)} aria-expanded={openFaq === 1}>
                How long does an appeal take?
              </button>
              {openFaq === 1 && (
                <div className="faq-answer">
                  Many appeals resolve in 7–21 days depending on insurer timelines and case complexity.
                </div>
              )}
            </li>
            <li className={`faq-item ${openFaq === 2 ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === 2 ? null : 2)} aria-expanded={openFaq === 2}>
                What do you need from me?
              </button>
              {openFaq === 2 && (
                <div className="faq-answer">
                  Your denial letter, basic medical history, and any supporting notes from your provider.
                </div>
              )}
            </li>
          </ul>
        </section>

        <section id="get-started" className="section-block">
          <h2 className="section-title">Request a case review</h2>
          <p className="section-subtitle">
            Provide a few details and we’ll assess your case. No charge unless we’re successful.
          </p>
          {error && <div className="error-banner" role="alert">{error}</div>}
          {submitted ? (
            <div className="success-banner" role="status" aria-live="polite">
              Your request was received. We’ll reach out to the email provided to discuss next steps.
            </div>
          ) : (
            <form className="intake-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <label htmlFor="fullName">Full name</label>
                <input id="fullName" name="fullName" type="text" required autoComplete="name" />
              </div>
              <div className="form-row">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="form-row">
                <label htmlFor="insurance">Insurance provider</label>
                <input id="insurance" name="insurance" type="text" required />
              </div>
              <div className="form-row">
                <label htmlFor="summary">Brief summary of the denial</label>
                <textarea id="summary" name="summary" rows={4} required />
              </div>
              <div className="form-actions">
                <button className="primary-button cta-hero" type="submit">Submit request</button>
              </div>
            </form>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <p>Patient-first advocacy. Transparent flat fee. No charge if we’re unsuccessful.</p>
      </footer>
    </div>
  )
}

export default App
