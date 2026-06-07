# CLAUDE.md — AI Context
# TMI-page Repository
#
# ════════════════════════════════════════════════════════════════
#  THIS FILE IS FOR MACHINE INTELLIGENCE USE ONLY
#  Read automatically by Claude Code at session start.
# ════════════════════════════════════════════════════════════════

## IDENTITY

Repository: rickeybennett87-stack/TMI-page
Organization: Thessalonian Mandate Institute (TMI)
Entity Type: 508(c)(1)(a) Faith-Based Organization
EIN: 42-2419586
Founded: 2026 — Austin, Texas
Founder: Minister Rickey Jay Bennett II
Primary Contact: shepherd_jade@thessalonian-mandate-institute.org

---

## PURPOSE OF THIS REPO

This is the public-facing website for The Thessalonian Mandate Institute.
It is a static HTML/CSS site — no framework, no build step, no package manager.
Files are served directly via GitHub Pages at the custom domain below.

---

## HOSTING & DOMAIN

- Host: GitHub Pages (main branch, root directory)
- Custom Domain: thessalonian-mandate-institute.org
- DNS: Cloudflare (nameservers transferred from GoDaddy; GoDaddy remains registrar)
- CNAME file: present in repo root — contains `thessalonian-mandate-institute.org`
- SSL: handled by GitHub Pages / Cloudflare
- Cloudflare proxy (orange cloud): OFF on A records — GitHub Pages handles SSL directly

GitHub Pages A records pointing to:
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
CNAME www → rickeybennett87-stack.github.io

---

## REPOSITORY STRUCTURE

```
TMI-page/
├── index.html          # Main landing page (~55KB)
├── donors.html         # Donor/support page
├── grantors.html       # Foundations & grantors packet (~35KB)
├── style.css           # Shared stylesheet for all pages
├── sky.png             # Fixed background (parallax hero)
├── shepherd.png        # Section background (mission section)
├── schoolhouse.png     # Section background (pathways section)
├── CNAME               # GitHub Pages custom domain file
├── CLAUDE.md           # THIS FILE
└── README.md
```

---

## DESIGN SYSTEM

**Fonts:** Cormorant Garamond (body/headings) + DM Mono (labels, UI, mono elements)
Loaded via Google Fonts.

**Color palette:**
```
--ink:        #1a1410   (near-black body text)
--parchment:  #f5f0e8   (warm off-white background)
--gold:       #b8912a   (primary accent)
--gold-light: #d4aa4a   (hover states)
--ash:        #5a5450   (secondary/muted text)
--rule:       #c8b89a   (borders, dividers)
--white:      #faf7f2   (card backgrounds)
--sky-blue:   #2a5a8c   (hero headline accent)
```

**Pattern:** Fade-up scroll animations via IntersectionObserver (`.fade-up` / `.visible`)
**Forms:** All mailto/Gmail-based — no backend, no server-side processing
**Responsive breakpoints:** 680px and 440px

---

## PAGES

### index.html — Main Landing Page
- Sticky dark nav
- Hero with sky.png parallax background
- Scripture band (2 Thess 3:10)
- Mission / four pillars section (shepherd.png parallax)
- Pathways section — 5 featured tracks (schoolhouse.png parallax)
- Cohort model section
- Participant feedback form (opens Gmail to shepherd_jade@)
- Apply Free form (opens Gmail to shepherd_jade@)
- Footer

### donors.html — Support Page
- Page header: "Support the Work"
- Case for giving (4 cards: Cohort Operations, Case Management, Job Placement, Device Access)
- "Giving Infrastructure Coming Soon" section with mailto button
- Tax/legal band (EIN, 508(c)(1)(a) status)
- Footer

**Note:** Formal giving portal (bank embed code) not yet integrated.
When the bank provides an embed/iframe snippet, it goes into the
"How to Give" section of donors.html, replacing or supplementing
the "Coming Soon" copy.

### grantors.html — Grantor Packet
- Org profile grid (legal name, EIN, status, founder, contacts)
- Minister biography (full narrative, includes identity statement)
- Mission statement
- Cohort model description
- 16 programs across 4 categories:
  - Technology (7): IT Support, Cybersecurity, Cloud, Data Analytics,
    AI Tools & Automation, Project Management, Digital Marketing
  - Administrative & Foundational (5): Microsoft Office, Digital Literacy,
    Workplace Readiness, Resume & Job Search, Customer Service,
    English Language & Communication
  - Life & Economic (2): Financial Literacy, Small Business & Self-Employment
  - Wraparound Services (1): Cohort Support & Job Placement (all participants)
- Population served section (outcomes placeholder — no data yet)
- Grant inquiry form (opens Gmail to shepherd_jade@)
- Footer

---

## EMAIL ROUTING

**All** contact points on every page route to a single address:

```
shepherd_jade@thessalonian-mandate-institute.org
```

This includes: application form, feedback form, donor contact,
grant inquiry form, all footer links, and all mailto hrefs.
The addresses `applications@` and `feedback@` previously existed
and have been fully replaced. Do not reintroduce them.

---

## GIT PRACTICES

- Branch: **main only** — this repo has no feature branches
- Push directly to main for all changes
- Do not create feature branches unless explicitly instructed

---

## CONTEXT NOTES

```
2026-05-XX | SITE ESTABLISHED
  - Static HTML/CSS site built for TMI public web presence.
  - Three pages: index, donors, grantors.
  - All forms are Gmail mailto-based (no backend).

2026-06-07 | DNS & DOMAIN
  - Cloudflare placed in control of DNS (nameservers transferred from GoDaddy).
  - CNAME file added to repo for GitHub Pages custom domain.
  - Site resolves at thessalonian-mandate-institute.org.

2026-06-07 | EMAIL CONSOLIDATION
  - All email addresses across all pages consolidated to shepherd_jade@.
  - applications@ and feedback@ addresses removed entirely.
```
