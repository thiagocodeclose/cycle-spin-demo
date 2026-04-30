// @ts-nocheck
'use client';
import { useEffect, useRef, useState } from 'react';
import { siteData } from '@/lib/site-data';

/* ─── CSS ─────────────────────────────────────────────────────────── */
const css = `
  :root {
    --cy-bg: #0A0A0A;
    --cy-surface: #141414;
    --cy-card: #1A1A1A;
    --cy-primary: #FF4500;
    --cy-primary-dim: rgba(255,69,0,0.15);
    --cy-text: #F0F0F0;
    --cy-muted: #888;
    --cy-border: rgba(255,69,0,0.2);
    --font-display: var(--font-bebas), 'Bebas Neue', sans-serif;
    --font-body: var(--font-barlow), 'Barlow', sans-serif;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); background: var(--cy-bg); color: var(--cy-text); overflow-x: hidden; }

  /* NAV */
  .cy-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 64px;
    transition: background 0.3s, backdrop-filter 0.3s;
  }
  .cy-nav.scrolled { background: rgba(10,10,10,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid var(--cy-border); }
  .cy-logo { font-family: var(--font-display); font-size: 1.6rem; letter-spacing: 0.08em; color: var(--cy-text); text-decoration: none; }
  .cy-logo span { color: var(--cy-primary); }
  .cy-nav-links { display: flex; gap: 2rem; list-style: none; }
  .cy-nav-links a { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--cy-muted); text-decoration: none; transition: color 0.2s; }
  .cy-nav-links a:hover { color: var(--cy-text); }
  .cy-nav-cta { background: var(--cy-primary); color: #fff; font-family: var(--font-body); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; border: none; padding: 0.6rem 1.4rem; cursor: pointer; transition: opacity 0.2s; }
  .cy-nav-cta:hover { opacity: 0.85; }

  /* HERO */
  .cy-hero { position: relative; height: 100vh; min-height: 600px; display: flex; align-items: flex-end; overflow: hidden; }
  .cy-hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .cy-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.2) 100%); }
  .cy-hero-content { position: relative; z-index: 2; padding: 4rem 2rem 5rem; width: 100%; max-width: 900px; }
  .cy-hero-eyebrow { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--cy-primary); margin-bottom: 1rem; }
  .cy-hero-title { font-family: var(--font-display); font-size: clamp(4rem, 12vw, 9rem); line-height: 0.9; letter-spacing: 0.02em; color: var(--cy-text); margin-bottom: 1.5rem; }
  .cy-hero-title span { color: var(--cy-primary); }
  .cy-hero-sub { font-size: 1.05rem; font-weight: 300; color: rgba(240,240,240,0.7); max-width: 480px; line-height: 1.6; margin-bottom: 2.5rem; }
  .cy-hero-actions { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
  .cy-btn-primary { background: var(--cy-primary); color: #fff; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 1rem 2.5rem; border: none; cursor: pointer; transition: opacity 0.2s; }
  .cy-btn-primary:hover { opacity: 0.85; }
  .cy-btn-ghost { background: transparent; color: var(--cy-text); font-weight: 600; font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 1rem 2rem; border: 1px solid rgba(240,240,240,0.3); cursor: pointer; transition: border-color 0.2s, color 0.2s; }
  .cy-btn-ghost:hover { border-color: var(--cy-primary); color: var(--cy-primary); }
  .cy-hero-scroll { position: absolute; bottom: 1.5rem; right: 2rem; z-index: 2; display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--cy-muted); }
  .cy-scroll-line { width: 40px; height: 1px; background: var(--cy-primary); }

  /* STATS */
  .cy-stats { background: var(--cy-primary); display: grid; grid-template-columns: repeat(4,1fr); }
  .cy-stat { padding: 2rem 1.5rem; text-align: center; border-right: 1px solid rgba(0,0,0,0.15); }
  .cy-stat:last-child { border-right: none; }
  .cy-stat-value { font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 3.5rem); letter-spacing: 0.02em; color: #000; line-height: 1; margin-bottom: 0.25rem; }
  .cy-stat-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(0,0,0,0.6); }

  /* SECTION */
  .cy-section { padding: 5rem 2rem; max-width: 1200px; margin: 0 auto; }
  .cy-section-full { padding: 5rem 0; background: var(--cy-surface); }
  .cy-section-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
  .cy-eyebrow { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--cy-primary); margin-bottom: 0.75rem; }
  .cy-heading { font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); letter-spacing: 0.02em; line-height: 1; color: var(--cy-text); margin-bottom: 1rem; }
  .cy-heading span { color: var(--cy-primary); }
  .cy-body { font-size: 1rem; font-weight: 300; color: rgba(240,240,240,0.65); line-height: 1.7; max-width: 520px; }

  /* RIDE TYPES */
  .cy-rides { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5px; margin-top: 3rem; }
  .cy-ride { background: var(--cy-card); padding: 2.5rem 2rem; border: 1px solid var(--cy-border); transition: border-color 0.3s, transform 0.3s; }
  .cy-ride:hover { border-color: var(--cy-primary); transform: translateY(-4px); }
  .cy-ride-icon { font-size: 2rem; margin-bottom: 1rem; }
  .cy-ride-header { display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.5rem; }
  .cy-ride-name { font-family: var(--font-display); font-size: 1.6rem; letter-spacing: 0.05em; color: var(--cy-text); }
  .cy-ride-intensity { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; padding: 0.25rem 0.6rem; background: var(--cy-primary-dim); color: var(--cy-primary); }
  .cy-ride-duration { font-size: 0.75rem; color: var(--cy-muted); letter-spacing: 0.1em; margin-bottom: 1rem; }
  .cy-ride-desc { font-size: 0.9rem; font-weight: 300; color: rgba(240,240,240,0.6); line-height: 1.6; }

  /* SCHEDULE */
  .cy-schedule { display: flex; flex-direction: column; gap: 1px; margin-top: 3rem; }
  .cy-schedule-row { display: grid; grid-template-columns: 3rem 6rem 1fr auto auto; align-items: center; gap: 1.5rem; padding: 1.2rem 1.5rem; background: var(--cy-card); border-left: 3px solid transparent; transition: border-color 0.2s, background 0.2s; }
  .cy-schedule-row:hover { border-left-color: var(--cy-primary); background: #1f1f1f; }
  .cy-day { font-family: var(--font-display); font-size: 1rem; letter-spacing: 0.1em; color: var(--cy-primary); }
  .cy-time { font-size: 0.85rem; font-weight: 600; color: var(--cy-text); }
  .cy-class-name { font-size: 0.95rem; font-weight: 500; color: var(--cy-text); }
  .cy-coach { font-size: 0.8rem; color: var(--cy-muted); }
  .cy-spots { font-size: 0.75rem; font-weight: 700; padding: 0.3rem 0.75rem; }
  .cy-spots.open { background: var(--cy-primary-dim); color: var(--cy-primary); }
  .cy-spots.full { background: rgba(255,255,255,0.05); color: var(--cy-muted); }

  /* COACHES */
  .cy-coaches { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 3rem; }
  .cy-coach-card { background: var(--cy-card); border: 1px solid var(--cy-border); padding: 2.5rem 2rem; position: relative; overflow: hidden; }
  .cy-coach-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--cy-primary); }
  .cy-coach-number { font-family: var(--font-display); font-size: 3rem; color: rgba(255,69,0,0.08); position: absolute; top: 1rem; right: 1.5rem; line-height: 1; }
  .cy-coach-name { font-family: var(--font-display); font-size: 1.8rem; letter-spacing: 0.05em; color: var(--cy-text); margin-bottom: 0.25rem; }
  .cy-coach-role { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--cy-primary); margin-bottom: 1rem; }
  .cy-coach-bio { font-size: 0.9rem; font-weight: 300; color: rgba(240,240,240,0.6); line-height: 1.65; margin-bottom: 1.25rem; }
  .cy-coach-rides { font-size: 0.75rem; letter-spacing: 0.08em; color: var(--cy-muted); }
  .cy-coach-rides strong { color: var(--cy-primary); font-weight: 700; }

  /* PRICING */
  .cy-pricing { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
  .cy-plan { background: var(--cy-card); border: 1px solid var(--cy-border); padding: 2.5rem 2rem; position: relative; transition: border-color 0.3s, transform 0.3s; }
  .cy-plan:hover { transform: translateY(-4px); }
  .cy-plan.featured { border-color: var(--cy-primary); }
  .cy-plan-badge { position: absolute; top: -1px; left: 50%; transform: translateX(-50%); background: var(--cy-primary); color: #fff; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.3rem 1rem; }
  .cy-plan-name { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.08em; color: var(--cy-text); margin-bottom: 0.5rem; margin-top: 0.5rem; }
  .cy-plan-price { font-family: var(--font-display); font-size: 3.5rem; letter-spacing: 0.02em; color: var(--cy-primary); line-height: 1; }
  .cy-plan-period { font-size: 0.8rem; color: var(--cy-muted); margin-bottom: 1.5rem; }
  .cy-plan-features { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 2rem; }
  .cy-plan-features li { font-size: 0.9rem; color: rgba(240,240,240,0.7); display: flex; align-items: center; gap: 0.5rem; }
  .cy-plan-features li::before { content: '–'; color: var(--cy-primary); font-weight: 700; }

  /* CTA BANNER */
  .cy-cta { background: var(--cy-primary); padding: 5rem 2rem; text-align: center; }
  .cy-cta-title { font-family: var(--font-display); font-size: clamp(3rem, 8vw, 6rem); letter-spacing: 0.03em; color: #000; line-height: 0.95; margin-bottom: 1.5rem; }
  .cy-cta-sub { font-size: 1.05rem; color: rgba(0,0,0,0.65); margin-bottom: 2.5rem; font-weight: 400; }
  .cy-btn-dark { background: #000; color: #fff; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 1.1rem 3rem; border: none; cursor: pointer; transition: opacity 0.2s; }
  .cy-btn-dark:hover { opacity: 0.8; }

  /* FOOTER */
  .cy-footer { background: #050505; padding: 3rem 2rem; border-top: 1px solid var(--cy-border); display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
  .cy-footer-brand { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.08em; }
  .cy-footer-brand span { color: var(--cy-primary); }
  .cy-footer-info { font-size: 0.8rem; color: var(--cy-muted); line-height: 1.6; }
  .cy-footer-copy { font-size: 0.75rem; color: rgba(136,136,136,0.5); }

  /* REVEAL */
  .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: none; }

  /* MOBILE */
  @media (max-width: 768px) {
    .cy-nav-links { display: none; }
    .cy-stats { grid-template-columns: repeat(2,1fr); }
    .cy-stat { border-right: none; border-bottom: 1px solid rgba(0,0,0,0.15); }
    .cy-stat:nth-child(2n) { border-bottom: 1px solid rgba(0,0,0,0.15); }
    .cy-schedule-row { grid-template-columns: 3rem 1fr auto; gap: 0.75rem; }
    .cy-coach { display: none; }
    .cy-footer { flex-direction: column; text-align: center; }
  }
`;

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function CyclePage() {
  const [scrolled, setScrolled] = useState(false);
  const videoRef = useRef(null);
  useReveal();
  const d = siteData;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav className={`cy-nav${scrolled ? ' scrolled' : ''}`}>
        <a href="#" className="cy-logo">CYCLE<span>.</span>HOUSE</a>
        <ul className="cy-nav-links">
          <li><a href="#rides">Rides</a></li>
          <li><a href="#schedule">Schedule</a></li>
          <li><a href="#coaches">Coaches</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
        <button className="cy-nav-cta">Book a Ride</button>
      </nav>

      {/* HERO */}
      <section className="cy-hero">
        <video
          ref={videoRef}
          className="cy-hero-video"
          autoPlay muted loop playsInline
          poster={d.gym.hero_poster}
        >
          <source src={d.gym.hero_video} type="video/mp4" />
        </video>
        <div className="cy-hero-overlay" />
        <div className="cy-hero-content">
          <p className="cy-hero-eyebrow">{d.gym.location} · Indoor Cycling Studio</p>
          <h1 className="cy-hero-title">
            RIDE.<br /><span>PUSH.</span><br />REPEAT.
          </h1>
          <p className="cy-hero-sub">{d.gym.name} delivers elite indoor cycling experiences designed to push every rider — regardless of level — to their absolute limit.</p>
          <div className="cy-hero-actions">
            <button className="cy-btn-primary">Claim Your Free Ride</button>
            <button className="cy-btn-ghost">View Schedule</button>
          </div>
        </div>
        <div className="cy-hero-scroll">
          <div className="cy-scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* STATS */}
      <div className="cy-stats">
        {d.stats.map((s) => (
          <div key={s.label} className="cy-stat">
            <div className="cy-stat-value">{s.value}</div>
            <div className="cy-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* RIDE TYPES */}
      <section className="cy-section" id="rides">
        <p className="cy-eyebrow reveal">What We Offer</p>
        <h2 className="cy-heading reveal" style={{ transitionDelay: '0.1s' }}>FOUR WAYS<br /><span>TO RIDE</span></h2>
        <p className="cy-body reveal" style={{ transitionDelay: '0.2s' }}>Every class at Cycle House is engineered around a specific goal. Pick your weapon.</p>
        <div className="cy-rides">
          {d.rideTypes.map((r, i) => (
            <div key={r.name} className="cy-ride reveal" style={{ transitionDelay: `${0.1 * i}s` }}>
              <div className="cy-ride-icon">{r.icon}</div>
              <div className="cy-ride-header">
                <span className="cy-ride-name">{r.name}</span>
                <span className="cy-ride-intensity">{r.intensity}</span>
              </div>
              <div className="cy-ride-duration">{r.duration}</div>
              <p className="cy-ride-desc">{r.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SCHEDULE */}
      <div className="cy-section-full" id="schedule">
        <div className="cy-section-inner">
          <p className="cy-eyebrow reveal">This Week</p>
          <h2 className="cy-heading reveal" style={{ transitionDelay: '0.1s' }}>RIDE<br /><span>SCHEDULE</span></h2>
          <div className="cy-schedule">
            {d.schedule.map((s, i) => (
              <div key={i} className="cy-schedule-row reveal" style={{ transitionDelay: `${0.05 * i}s` }}>
                <span className="cy-day">{s.day}</span>
                <span className="cy-time">{s.time}</span>
                <span className="cy-class-name">{s.name}</span>
                <span className="cy-coach">with {s.coach}</span>
                <span className={`cy-spots ${s.spots === 0 ? 'full' : 'open'}`}>
                  {s.spots === 0 ? 'FULL' : `${s.spots} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COACHES */}
      <section className="cy-section" id="coaches">
        <p className="cy-eyebrow reveal">The Team</p>
        <h2 className="cy-heading reveal" style={{ transitionDelay: '0.1s' }}>YOUR<br /><span>COACHES</span></h2>
        <p className="cy-body reveal" style={{ transitionDelay: '0.2s' }}>Our coaches don't just teach — they ride, compete, and live the sport. Your results are their mission.</p>
        <div className="cy-coaches">
          {d.coaches.map((c, i) => (
            <div key={c.name} className="cy-coach-card reveal" style={{ transitionDelay: `${0.1 * i}s` }}>
              <div className="cy-coach-number">0{i + 1}</div>
              <div className="cy-coach-name">{c.name}</div>
              <div className="cy-coach-role">{c.role}</div>
              <p className="cy-coach-bio">{c.bio}</p>
              <div className="cy-coach-rides"><strong>{c.rides}</strong> classes led</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <div className="cy-section-full" id="pricing">
        <div className="cy-section-inner">
          <p className="cy-eyebrow reveal">Investment</p>
          <h2 className="cy-heading reveal" style={{ transitionDelay: '0.1s' }}>RIDE<br /><span>PRICING</span></h2>
          <div className="cy-pricing">
            {d.pricing.map((p, i) => (
              <div key={p.name} className={`cy-plan reveal ${p.highlight ? 'featured' : ''}`} style={{ transitionDelay: `${0.1 * i}s` }}>
                {p.highlight && <div className="cy-plan-badge">Most Popular</div>}
                <div className="cy-plan-name">{p.name}</div>
                <div className="cy-plan-price">{p.price}</div>
                <div className="cy-plan-period">{p.period}</div>
                <ul className="cy-plan-features">
                  {p.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <button className={p.highlight ? 'cy-btn-primary' : 'cy-btn-ghost'} style={{ width: '100%' }}>
                  {p.highlight ? 'Get Started' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cy-cta">
        <h2 className="cy-cta-title">YOUR FIRST<br />RIDE IS FREE</h2>
        <p className="cy-cta-sub">No experience needed. Just show up, clip in, and ride.</p>
        <button className="cy-btn-dark">Claim Your Free Ride →</button>
      </div>

      {/* FOOTER */}
      <footer className="cy-footer">
        <div>
          <div className="cy-footer-brand">CYCLE<span>.</span>HOUSE</div>
          <div className="cy-footer-info">{d.gym.address}<br />{d.gym.phone} · {d.gym.email}</div>
        </div>
        <div className="cy-footer-copy">© {new Date().getFullYear()} {d.gym.name}. Powered by Koriva.</div>
      </footer>
    </>
  );
}
