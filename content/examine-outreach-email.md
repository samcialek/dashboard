# Cold Email to Kamal Patel — Examine Partnership

**To:** Kamal Patel (Examine.com)
**From:** Sam Cialek (sam@serif.life)
**Subject:** Examine's evidence base as Bayesian priors -- a methodological question

---

Hi Kamal,

Your systematic review work -- particularly the evidence synthesis methodology behind Examine -- is the closest thing I've found to what I've been building on the inference side. I'll explain what I mean.

I run a company called Serif that generates personalized health recommendations from wearable and biomarker data. The core idea is borrowed from Richard McElreath's *Statistical Rethinking* approach: use population-level evidence as Bayesian priors, then update those priors with individual-level data via partial pooling. So instead of telling someone "magnesium helps with sleep" (the population average), we'd say "given *your* HRV patterns, chronotype, and dietary intake, here's the posterior estimate of magnesium's effect on *your* sleep architecture -- and here's the uncertainty band around that estimate."

The bottleneck has always been the priors. Building robust prior distributions from the research literature is enormously labor-intensive -- you have to systematically map the relationships between interventions and outcomes, weight them by study quality, account for effect heterogeneity across populations. Which is, of course, exactly what Examine has been doing for 15 years.

I'll note that we actually referenced the Examine partnership in a December meeting with our clinical team as a key data source for mapping these relationships (the example we used was caffeine timing and sleep quality). But I realized I'd never actually reached out to you directly -- which felt like the wrong order of operations.

What I'd love to explore is whether there's a structured way to use Examine's evidence base as the foundation for these prior distributions. Not as a marketing play -- as a methodological integration. Your team has already done the hard work of systematic evidence synthesis. We've built the inference layer that updates those population estimates with individual data. The combination seems like it should exist.

A few proof points on the Serif side, since I'm writing cold: we're running a 350-user executive wellness pilot in India (Human Edge), retention went from 60% to 92% after we switched to the Bayesian personalization approach, and we've compressed program generation from 80 hours to about 10 minutes per patient. The clinical outcomes are real -- but the methodology is the part I think you'd actually find interesting.

Happy to send over a brief on the technical integration if that's useful, or just talk through the approach. I know you've spent time at evidence-based practice centers doing meta-analysis work -- I suspect we're thinking about similar problems from adjacent angles.

Best,
Sam

Sam Cialek
Serif · serif.life
