import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import LivingSky, { SkyControls, useLivingSky } from './sky/LivingSky.jsx';

const profile = {
  name: 'Kishorebabu S',
  greeting: 'Hey, I’m',
  headline: 'Kishorebabu S.',
  location: 'Coimbatore, Tamil Nadu, India',
  email: 's.kishorebabu8@gmail.com',
  description: 'I build end-to-end web applications and AI-powered workflows, turning complex ideas into useful experiences.',
  portrait: '/assets/portrait.png',
  secondPortrait: '/assets/portrait-second.png',
};

const roles = [
  { title: 'Software Developer', article: 'a', font: 'clean' },
  { title: 'AI Engineer', article: 'an', font: 'pixel' },
  { title: 'MERN Stack Developer', article: 'a', font: 'rounded' },
  { title: 'React Developer', article: 'a', font: 'pixel' },
  { title: 'Software Engineer', article: 'a', font: 'clean' },
  { title: 'Junior Developer', article: 'a', font: 'handwritten' },
];

function RotatingRole({ description }) {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRoleIndex(index => (index + 1) % roles.length);
    }, 1500);
    return () => window.clearInterval(interval);
  }, []);

  const role = roles[roleIndex];
  return (
    <p className="hero-description hero-introduction">
      <span className="sr-only">I am a software developer working across AI engineering, the MERN stack, and React. </span>
      <span className="role-line" aria-hidden="true">
        {roles.map(item => (
          <span className="role-measure" key={item.title}>
            <span className="role-prefix">I am {item.article}</span>
            <span className={`role-text role-font-${item.font}`}>{item.title}</span>.
          </span>
        ))}
        <span className="role-current">
          <span className="role-prefix">I am {role.article}</span>
          <span key={roleIndex} className={`role-text rotating-role role-font-${role.font}`}>{role.title}</span>.
        </span>
      </span>{' '}{description}
    </p>
  );
}

function Arrow({ className = '' }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

const experiences = [
  {
    company: 'Codingmart Technologies',
    role: 'Full Stack Developer',
    start: 'August 2026',
    startDate: '2026-08',
    end: 'Present',
    current: true,
    logo: '/assets/codingmart-logo.png',
    logoStyle: 'codingmart',
    summary: 'Building web applications and AI-powered workflows.',
    details: [
      'Continue development across web applications and AI-related projects.',
      'Build on full-stack experience to develop application workflows and integrate AI.',
    ],
    focus: ['Full-stack development', 'Application workflows', 'AI integration'],
  },
  {
    company: 'Finestcoder',
    role: 'Developer Intern',
    start: 'October 2025',
    startDate: '2025-10',
    end: 'August 2026',
    endDate: '2026-08',
    current: false,
    logo: '/assets/finestcoder-logo.png',
    logoStyle: 'finestcoder',
    summary: 'Built intern management and campus learning tools, and contributed to conversational AI workflows.',
    details: [
      'Developed features for intern management and campus learning tools.',
      'Contributed to conversational AI workflows.',
      'Owned assigned features independently and collaborated with development teams.',
    ],
    focus: ['Intern management', 'Campus learning', 'Conversational AI'],
  },
];

function ScrambleText({ text }) {
  const [displayText, setDisplayText] = useState(text);
  const textRef = useRef(null);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionPreference.matches) return;

    const letters = Array.from(text);
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let timer;
    let started = false;
    const renderFrame = lockedCount => setDisplayText(letters.map((letter, index) => {
      if (index < lockedCount || letter === ' ') return letter;
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      return letter === letter.toLowerCase() ? randomLetter.toLowerCase() : randomLetter;
    }).join(''));

    const observer = new IntersectionObserver(entries => {
      if (started || !entries.some(entry => entry.isIntersecting)) return;
      started = true;
      observer.disconnect();
      renderFrame(0);
      let tick = 0;
      timer = window.setInterval(() => {
        tick += 1;
        const lockedCount = Math.max(0, Math.floor((tick - 5) / 4));
        if (lockedCount >= letters.length) {
          window.clearInterval(timer);
          setDisplayText(text);
        } else {
          renderFrame(lockedCount);
        }
      }, 40);
    }, { threshold: .6, rootMargin: '0px 0px -32px 0px' });

    const finishForReducedMotion = () => {
      if (!motionPreference.matches) return;
      observer.disconnect();
      window.clearInterval(timer);
      setDisplayText(text);
    };

    observer.observe(textRef.current);
    motionPreference.addEventListener('change', finishForReducedMotion);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      motionPreference.removeEventListener('change', finishForReducedMotion);
    };
  }, [text]);

  return (
    <span className="scramble-text" ref={textRef}>
      <span className="sr-only">{text}</span>
      <span className="scramble-text-visual" aria-hidden="true">
        {Array.from(text).map((letter, index) => (
          <span className="scramble-letter" key={index}>
            <span className="scramble-letter-width">{letter}</span>
            <span className="scramble-letter-value">{displayText[index]}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

function ExperienceTimeline() {
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <section className="experience-section" aria-labelledby="experience-heading">
      <div
        className={`experience-layout${galleryOpen ? ' gallery-open' : ''}`}
        onPointerLeave={event => { if (event.pointerType === 'mouse') setGalleryOpen(false); }}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setGalleryOpen(false); }}
        onKeyDown={event => { if (event.key === 'Escape') setGalleryOpen(false); }}
      >
        <div className="experience-left">
          <h2 id="experience-heading"><ScrambleText text="Experience" /><span className="experience-heading-dot">.</span></h2>
          <ol className="timeline-list">
            {[...experiences].reverse().map(experience => (
              <li className="timeline-item" key={experience.company} onPointerEnter={() => { if (!experience.current) setGalleryOpen(false); }}>
                <span className="timeline-dot" aria-hidden="true" />
                <time className="experience-date" dateTime={experience.startDate}>{experience.start.replace(' ', ' — ')}</time>
                <div className="timeline-entry">
                  <h3>{experience.role}</h3>
                  {experience.current ? (
                    <a
                      href="https://www.linkedin.com/company/codingmart-technologies/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="experience-company-row company-gallery-trigger"
                      onPointerEnter={event => { if (event.pointerType === 'mouse') setGalleryOpen(true); }}
                      onFocus={() => setGalleryOpen(true)}
                    >
                      <span className="experience-company">{experience.company}</span>
                      <img className="company-logo company-logo-codingmart" src={experience.logo} alt="" width="128" height="128" />
                      <span className="sr-only"> (opens LinkedIn in a new tab)</span>
                    </a>
                  ) : (
                    <a
                      className="experience-company-row company-gallery-trigger finestcoder-link"
                      href="https://www.linkedin.com/company/finestcoder/posts/?feedView=all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="experience-company">{experience.company}</span>
                      <img className="company-logo company-logo-finestcoder" src={experience.logo} alt="Finestcoder logo" loading="lazy" width="1431" height="267" />
                      <span className="sr-only"> (opens LinkedIn in a new tab)</span>
                    </a>
                  )}
                  <p className="experience-description">{experience.summary}</p>
                </div>
              </li>
            ))}
            <li className="timeline-item timeline-now">
              <span className="timeline-dot" aria-hidden="true" />
              <span className="experience-date">Now</span>
            </li>
          </ol>
        </div>
        <div className="experience-right">
          <aside className="office-gallery" aria-label="Inside Codingmart Technologies">
            <div className="office-gallery-static-sky" aria-hidden="true">
              {['morning', 'day', 'evening', 'night'].map(scene => (
                <div key={scene} className={`office-gallery-sky-scene office-gallery-sky-scene-${scene}`}>
                  <img src={`/assets/sky-${scene}.png`} alt="" width="1536" height="1024" decoding="async" />
                </div>
              ))}
            </div>
            <div id="codingmart-gallery" className="gallery-content" aria-hidden={!galleryOpen} inert={!galleryOpen}>
            <span className="gallery-heading pixel">A LITTLE LOOK INSIDE</span>
            <button type="button" className="gallery-close" aria-label="Close office photos" onClick={() => setGalleryOpen(false)}>×</button>
            <figure className="office-photo office-photo-coding">
              <img src="/assets/codingmart-coding-wall.jpg" alt="Codingmart’s yellow office with a colorful coding mural and wooden desks" width="1728" height="1296" />
              <figcaption><span />The coding corner <span className="gallery-photo-index">01</span></figcaption>
            </figure>
            <figure className="office-photo office-photo-reception">
              <img src="/assets/codingmart-reception.jpg" alt="Codingmart reception with its logo on a purple wall" width="1728" height="1296" />
              <figcaption><span />A warm welcome <span className="gallery-photo-index">02</span></figcaption>
            </figure>
            <span className="gallery-location pixel">CODINGMART · COIMBATORE</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const technologies = [
                  { name: 'React', icon: 'react', color: '61DAFB' },
  { name: 'Astro', icon: 'astro', color: 'BC52EE' },
  { name: 'Tailwind CSS', icon: 'tailwindcss', color: '06B6D4' },
  { name: 'TanStack Query', icon: 'tanstack', color: 'FF4154' },
  { name: 'Axios', icon: 'axios', color: '5A29E4' },
  { name: 'Node.js', icon: 'nodedotjs', color: '5FA04E' },
  { name: 'Fastify', icon: 'fastify', color: '202020' },
  { name: 'PostgreSQL', icon: 'postgresql', color: '4169E1' },
  { name: 'AWS', icon: 'amazonaws', color: '232F3E' },
  { name: 'Python', icon: 'python', color: '3776AB' },
  { name: 'LangChain', icon: 'langchain', color: '1C3C3C' },
  { name: 'FastAPI', icon: 'fastapi', color: '009688' },
  { name: 'Hugging Face', icon: 'huggingface', color: 'FFD21E' },
  { name: 'Pandas', icon: 'pandas', color: '150458' },
  { name: 'NumPy', icon: 'numpy', color: '013243' },
  { name: 'Git', icon: 'git', color: 'F05032' },
  { name: 'GitHub', icon: 'github', color: '181717' },
];

function TechnologyStack() {
  return (
    <section className="technology-section" aria-label="Technology stack">
      <div className="technology-carousel" role="region" aria-label="Technology logos scrolling continuously">
        <div className="technology-track">
          {[0, 1].map(copy => (
            <ul className="technology-list" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
              {technologies.map(technology => (
                <li className="technology-card" key={technology.name}>
                  <img
                    src={technology.icon === 'amazonaws'
                      ? '/assets/aws-mark.svg'
                      : `https://cdn.simpleicons.org/${technology.icon}/${technology.color}`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width="28"
                    height="28"
                    onError={event => {
                      event.currentTarget.hidden = true;
                      event.currentTarget.nextElementSibling.hidden = false;
                    }}
                  />
                  <span className="technology-logo-fallback" aria-hidden="true" hidden>{technology.name.slice(0, 2).toUpperCase()}</span>
                  <span>{technology.name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

const projects = [
  {
    name: 'Interngo',
    category: 'Full-Stack Development',
    description: 'An intern management platform for performance tracking, attendance, resources, helpdesk, and analytics.',
    companies: [{ name: 'Finestcoder', logo: '/assets/finestcoder-logo.png', className: 'finestcoder' }],
    stack: ['React', 'Node.js', 'Fastify', 'PostgreSQL', 'AWS'],
    details: [
      'Built the frontend and backend end to end.',
      'Created workflows for intern performance, attendance, resource management, helpdesk, and analytics.',
      'Added daily end-of-day updates with automatic Slack posting.',
      'Integrated meeting scheduling with Google Meet and email invitations.',
      'Stored application data in PostgreSQL and deployed the application on AWS.',
    ],
    technologies: ['React', 'TanStack Query', 'Tailwind CSS', 'Axios', 'Node.js', 'Fastify', 'PostgreSQL', 'AWS', 'Slack', 'Google Meet'],
  },
  {
    name: 'FC Labs — College Administration Panel',
    category: 'Frontend Development',
    description: 'A college administration panel for tracking workshops, trainers, student participation, and learning progress.',
    companies: [
      { name: 'Finestcoder', logo: '/assets/finestcoder-logo.png', className: 'finestcoder' },
      { name: 'Codingmart Technologies', logo: '/assets/codingmart-logo.png', className: 'codingmart' },
    ],
    stack: ['Astro', 'React', 'Fastify', 'PostgreSQL'],
    details: [
      'Built the administration panel as part of a four-person team.',
      'Created views for trainers, workshops, elapsed workshop days, and students yet to complete workshops.',
      'Added analytics to help administrators identify top-performing students.',
      'Improved visibility into student learning and workshop participation.',
    ],
    technologies: ['Astro', 'React', 'Axios', 'Node.js', 'Fastify', 'PostgreSQL'],
  },
  {
    name: 'AOKAH',
    category: 'AI Engineering',
    description: 'A conversational AI platform that retrieves context about capability centers, projects, milestones, and tasks.',
    companies: [{ name: 'Codingmart Technologies', logo: '/assets/codingmart-logo.png', className: 'codingmart' }],
    stack: ['Python', 'LangChain', 'FastAPI', 'Hugging Face'],
    details: [
      'Built Python workflows to extract, clean, and transform information from PDF and CSV files.',
      'Structured unorganized source data for retrieval using NLP and text processing.',
      'Contributed to retrieval-augmented generation workflows to improve contextual relevance.',
      'Worked with large language models and prompt engineering to generate structured responses.',
      'Supported integration through Python, FastAPI, and REST APIs.',
      'Collaborated on data quality, retrieval accuracy, and conversational reliability.',
    ],
    technologies: ['Python', 'Generative AI', 'LLMs', 'LangChain', 'RAG', 'FastAPI', 'REST APIs', 'NLP', 'Hugging Face', 'Pandas', 'NumPy', 'SQL'],
  },
];

function ProjectSection() {
  const [openProject, setOpenProject] = useState(null);
  const closeTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const openOnHover = (event, name) => {
    if (event.pointerType !== 'mouse') return;
    window.clearTimeout(closeTimer.current);
    setOpenProject(name);
  };
  const closeOnLeave = (event, name) => {
    if (event.pointerType !== 'mouse') return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setOpenProject(current => current === name ? null : current);
    }, 120);
  };

  const toggleProject = name => setOpenProject(current => current === name ? null : name);
  const handleProjectKeyDown = (event, name) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      window.clearTimeout(closeTimer.current);
      toggleProject(name);
    }
  };

  return (
    <section className="projects-section" aria-labelledby="projects-heading">
      <div className="projects-inner">
        <h2 id="projects-heading">Projects<span>.</span></h2>
        <div className="projects-table-wrap">
          <table className="projects-table" aria-label="Projects, main technology stacks, descriptions, and details">
            {projects.map(project => {
              const isOpen = openProject === project.name;
              const panelId = `project-details-${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
              return (
                <tbody
                  className="project-group"
                  key={project.name}
                  onPointerEnter={event => openOnHover(event, project.name)}
                  onPointerLeave={event => closeOnLeave(event, project.name)}
                >
                  <tr
                    className={`project-summary-row${isOpen ? ' is-open' : ''}`}
                    tabIndex={0}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => {
                      window.clearTimeout(closeTimer.current);
                      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                        setOpenProject(project.name);
                      } else {
                        toggleProject(project.name);
                      }
                    }}
                    onKeyDown={event => handleProjectKeyDown(event, project.name)}
                  >
                    <td className="project-name-cell">
                      <span className="project-name">{project.name}</span>
                      <span className="project-companies" aria-label={`Worked on at ${project.companies.map(company => company.name).join(' and ')}`}>
                        {project.companies.map(company => (
                          <img
                            className={`project-company-logo project-company-logo-${company.className}`}
                            key={company.name}
                            src={company.logo}
                            alt={company.name}
                            title={company.name}
                            loading="lazy"
                          />
                        ))}
                      </span>
                    </td>
                    <td className="project-stack-cell" aria-label={`Main technologies: ${project.stack.join(', ')}`}>
                      <div className="project-stack-logos">
                        {project.stack.map(name => {
                          const technology = technologies.find(item => item.name === name);
                          return (
                            <span className="project-stack-item" key={name}>
                              <img
                                src={technology.icon === 'amazonaws' ? '/assets/aws-mark.svg' : `https://cdn.simpleicons.org/${technology.icon}/171717`}
                                alt=""
                                title={name}
                                loading="lazy"
                              />
                              <span>{name}</span>
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="project-description-cell">
                      <span className="project-category">{project.category}</span>
                      <span className="project-description">{project.description}</span>
                    </td>
                  </tr>
                  <tr className="project-accordion-panel-row">
                    <td colSpan={3}>
                      <div className={`project-accordion-collapse${isOpen ? ' is-open' : ''}`} id={panelId} role="region" aria-label={`${project.name} details`} aria-hidden={!isOpen} inert={!isOpen}>
                        <div className="project-accordion-clip">
                          <div className="project-accordion-panel">
                            <div className="project-accordion-overview">
                              <span className="project-category">ABOUT THIS PROJECT</span>
                              <p>{project.description}</p>
                              <div className="project-accordion-companies">
                                {project.companies.map(company => (
                                  <img key={company.name} className={`project-company-logo project-company-logo-${company.className}`} src={company.logo} alt={company.name} title={company.name} />
                                ))}
                              </div>
                            </div>
                            <div className="project-accordion-work">
                              <span className="project-category">WHAT I WORKED ON</span>
                              <ul className="project-accordion-details">
                                {project.details.map(detail => <li key={detail}>{detail}</li>)}
                              </ul>
                            </div>
                            <div className="project-accordion-technologies">
                              <span className="project-category">TECHNOLOGIES</span>
                              <div className="project-accordion-tags">
                                {project.technologies.map(name => <span key={name}>{name}</span>)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
      </div>
    </section>
  );
}

const personalProjects = [
  {
    name: 'Tokenizer',
    type: 'LLM learning tool',
    description: 'Explore how text is split into tokens and understand how language models process input.',
    icon: 'tokenizer',
  },
  {
    name: 'LeetCode Grid Viewer',
    type: 'Grid and terrain visualizer',
    description: 'Explore LeetCode problems as a 2D grid, with a terrain view in the same app.',
    icon: 'grid',
  },
  {
    name: 'React Component Library',
    type: 'Reusable UI components',
    description: 'A personal collection of ready-made React components built and organized for reuse.',
    icon: 'components',
  },
];

function PersonalProjectIcon({ type }) {
  return (
    <svg className={`personal-project-icon personal-project-icon-${type}`} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {type === 'tokenizer' && <>
        <path d="M17 19h30M17 27h12m6 0h12M17 35h7m6 0h12m6 0h4M17 43h16m6 0h8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="13" y="12" width="38" height="40" rx="9" stroke="currentColor" strokeWidth="1.6" opacity=".35" />
        <rect x="30" y="23" width="7" height="8" rx="2" fill="currentColor" opacity=".22" />
        <rect x="25" y="31" width="8" height="8" rx="2" fill="currentColor" opacity=".22" />
      </>}
      {type === 'grid' && <>
        <path d="m32 12 20 11.5v17L32 52 12 40.5v-17L32 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" opacity=".48" />
        <path d="M12.5 23.7 32 35l19.5-11.3M32 35v16M22 18l20 11.4v17M42 18 22 29.4v17" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" opacity=".6" />
        <path d="m32 26 6 3.5-6 3.4-6-3.4 6-3.5Z" fill="currentColor" />
        <path d="m42 37 5 2.8-5 2.9-5-2.9 5-2.8Z" fill="currentColor" opacity=".55" />
      </>}
      {type === 'components' && <>
        <rect x="13" y="14" width="17" height="17" rx="4" stroke="currentColor" strokeWidth="2" />
        <rect x="34" y="14" width="17" height="17" rx="4" fill="currentColor" opacity=".18" />
        <rect x="13" y="35" width="17" height="17" rx="4" fill="currentColor" opacity=".18" />
        <rect x="34" y="35" width="17" height="17" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M21.5 20v5m-2.5-2.5h5m19-1v3m-3.5 13.5h7m-3.5-3.5v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>}
    </svg>
  );
}

function PersonalProjects() {
  return (
    <section className="personal-projects-section" aria-labelledby="personal-projects-heading">
      <div className="personal-projects-inner">
        <div className="personal-projects-heading">
          <span className="personal-projects-eyebrow pixel">BUILT ON MY OWN TIME</span>
          <h2 id="personal-projects-heading">Personal projects<span>.</span></h2>
        </div>
        <div className="personal-projects-grid">
          {personalProjects.map(project => (
            <article className="personal-project-card" key={project.name}>
              <div className={`personal-project-art personal-project-art-${project.icon}`}>
                <PersonalProjectIcon type={project.icon} />
              </div>
              <div className="personal-project-copy">
                <span className="personal-project-type pixel">{project.type}</span>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const contactLinks = [
  { label: 'GitHub', value: 'S-KishoreBabu', href: 'https://github.com/S-KishoreBabu', icon: 'github', external: true },
  { label: 'LinkedIn', value: 'Kishore Babu S', href: 'https://www.linkedin.com/in/kishorebabu-s-3a0186263', icon: 'linkedin', external: true },
  { label: 'LeetCode', value: 'Ukq3azNqMM', href: 'https://leetcode.com/u/Ukq3azNqMM/', icon: 'leetcode', external: true },
  { label: 'Email', value: 's.kishorebabu8@gmail.com', href: 'mailto:s.kishorebabu8@gmail.com', icon: 'email' },
  { label: 'Location', value: 'Coimbatore, Tamil Nadu, India', href: 'https://maps.google.com/?q=Coimbatore%2C%20Tamil%20Nadu%2C%20India', icon: 'location', external: true },
];

function ContactIcon({ type }) {
  const brandColors = { github: '181717', linkedin: '0A66C2', leetcode: 'FFA116' };
  if (type === 'github' || type === 'leetcode') {
    return <img src={`https://cdn.simpleicons.org/${type}/${brandColors[type]}`} alt="" />;
  }
  if (type === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#0A66C2" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
    );
  }
  if (type === 'email') {
    return <img src="https://cdn.simpleicons.org/gmail/EA4335" alt="" />;
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {type === 'email' && <>
        <path fill="#4285F4" d="M4 7.4v10.1c0 .8.6 1.5 1.4 1.5h2.5V9.6L4 7.4Z" />
        <path fill="#34A853" d="M16.1 9.6V19h2.5c.8 0 1.4-.7 1.4-1.5V7.4l-3.9 2.2Z" />
        <path fill="#FBBC04" d="M7.9 9.6V19h8.2V9.6L12 12.5 7.9 9.6Z" />
        <path fill="#EA4335" d="M5.4 5h13.2C19.4 5 20 5.7 20 6.5v.9l-8 5.6-8-5.6v-.9C4 5.7 4.6 5 5.4 5Z" />
      </>}
      {type === 'location' && <>
        <path fill="#DB6B52" d="M12 2.5a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7Zm0 9.7a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Z" />
      </>}
    </svg>
  );
}

function ContactSection() {
  return (
    <section className="contact-section" aria-labelledby="contact-heading">
      <div className="contact-inner">
        <div className="contact-portrait-wrap">
          <figure className="contact-portrait-card">
            <img src="/assets/contact-scribble.png" alt="A childlike pencil and colored-pencil portrait of Kishorebabu" loading="lazy" />
            <figcaption className="pixel">A LITTLE SKETCH OF ME</figcaption>
          </figure>
          <span className="contact-doodle contact-doodle-one" aria-hidden="true">~</span>
          <svg className="contact-doodle contact-doodle-two" viewBox="0 0 80 48" aria-hidden="true"><path d="M3 30c14-24 19 14 33-7S59 2 76 17M13 39c16-16 22 7 34-3" /></svg>
        </div>
        <div className="contact-copy">
          <span className="contact-eyebrow pixel">FIND ME AROUND THE INTERNET</span>
          <h2 id="contact-heading">Let’s connect<span>.</span></h2>
          <p className="contact-intro">Have a question, an idea, or just want to say hello? Find me here.</p>
          <nav className="contact-links" aria-label="Social profiles and contact details">
            {contactLinks.map(link => (
              <a
                className="contact-link"
                href={link.href}
                key={link.label}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
              >
                <span className={`contact-link-icon contact-link-icon-${link.icon}`}><ContactIcon type={link.icon} /></span>
                <span className="contact-link-copy"><span className="contact-link-label">{link.label}</span><span className="contact-link-value">{link.value}</span></span>
                {link.external && <span className="contact-link-arrow" aria-hidden="true">↗</span>}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

function App() {
  const sky = useLivingSky();
  const [cardsReady, setCardsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Start the entrance only once both photographs are ready to display.
    Promise.allSettled([profile.portrait, profile.secondPortrait].map(src => {
      const image = new Image();
      image.src = src;
      return image.decode();
    })).then(() => {
      if (!cancelled) setCardsReady(true);
    });
    return () => { cancelled = true; };
  }, []);
  return (
    <main className={sky.paused ? 'is-sky-paused' : ''} style={sky.style} data-sky-period={sky.period} data-sky-lighting={sky.dark ? 'dark' : 'light'}>
      <div className="sky-page">
      <LivingSky />
      <div className="grain" aria-hidden="true" />
      <div className="page-shell">
        <header className="page-top">
          <a className="cv-download-button" href="/assets/Kishorebabu-S-CV.pdf" download="Kishorebabu-S-CV.pdf">
            <span>Download CV</span>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.5v9m0 0 3.5-3.5M10 11.5 6.5 8M3.5 13.5v3h13v-3" /></svg>
          </a>
        </header>

        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <div className="intro-tag"><span className="tag-dot" /><span className="pixel">HEY THERE, WELCOME TO MY SPACE</span></div>
            <h1 id="hero-heading">{profile.greeting}<br /><span className="headline-bottom">{profile.headline}</span></h1>
            <RotatingRole description={profile.description} />
            <a className="hello-button" href={`mailto:${profile.email}`}><span>Let’s talk</span><span className="button-arrow"><Arrow /></span></a>
            <div className="little-note"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" /></svg><span>{profile.location}</span></div>
          </div>

          <div className={`portrait-scene${cardsReady ? ' cards-ready' : ''}`}>
            <div className="handwritten top-note">a face to the name<svg viewBox="0 0 86 74" aria-hidden="true"><path d="M8 7c35-13 67 4 54 44M49 42l12 13 15-9" /></svg></div>

            <div className="photo-drop photo-drop-back">
              <figure className="polaroid polaroid-back">
                <div className="photo-window"><img src={profile.secondPortrait} alt="A second AI-generated portrait of me outdoors in a sage green shirt" fetchPriority="high" /></div>
                <figcaption><span className="handwritten">a different day, same me.</span><span className="photo-index pixel">002</span></figcaption>
              </figure>
            </div>
            <div className="photo-drop photo-drop-front">
            <figure className="polaroid polaroid-front">
              <div className="tape" aria-hidden="true" />
              <div className="photo-window"><img src={profile.portrait} alt="AI-generated portrait based on my reference photos" fetchPriority="high" width="1086" height="1448" /></div>
              <figcaption><span className="handwritten">Hey, I’m {profile.name} <span className="caption-smile">☺</span></span><span className="photo-index pixel">001</span></figcaption>
            </figure>
            </div>
            <div className="portrait-label pixel"><span className="label-cross">✦</span> HUMAN, AFTER ALL.</div>
            <svg className="doodle-star" viewBox="0 0 60 60" aria-hidden="true"><path d="m30 4 5 19 19-7-13 16 13 13-20-4-6 16-3-20-19 1 17-11-8-16 14 10Z" /></svg>
          </div>
        </section>

        <footer className="page-bottom">
          <span className="bottom-note">A small space. Endless possibilities.</span>
          <span className="made-with pixel">MADE OF IDEAS & A LITTLE DAYDREAMING</span>
          <SkyControls sky={sky} />
        </footer>
      </div>
      </div>
      <ExperienceTimeline />
      <TechnologyStack />
      <ProjectSection />
      <PersonalProjects />
      <ContactSection />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
