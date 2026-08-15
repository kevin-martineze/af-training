import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Smooth scroll. Lenis owns the scroll position, so ScrollTrigger has to read
 * from it instead of the native scroll event, and GSAP's ticker has to drive
 * the RAF loop — otherwise pinned sections drift a frame behind the content.
 */
function initSmoothScroll() {
  if (reduced) return null;

  const lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = link.getAttribute('href');
      if (!target || target === '#') return;
      const el = document.querySelector(target);
      if (!el) return;
      event.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -24 });
    });
  });

  return lenis;
}

/** Headline lines rising out of a clipping mask — the signature move of the site. */
function initSplitHeadings() {
  const headings = document.querySelectorAll<HTMLElement>('[data-split]');

  if (reduced) {
    gsap.set(headings, { opacity: 1 });
    return;
  }

  headings.forEach((el) => {
    const split = new SplitText(el, {
      type: 'lines',
      linesClass: 'split-line',
      mask: 'lines',
    });

    gsap.set(el, { opacity: 1 });
    gsap.from(split.lines, {
      yPercent: 115,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });
  });
}

/** Generic enter animation, opted into with `data-reveal` on any element. */
function initReveals() {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');

  if (reduced) {
    gsap.set(targets, { opacity: 1 });
    return;
  }

  targets.forEach((el) => {
    const kind = el.dataset.reveal || 'up';
    const delay = Number(el.dataset.revealDelay ?? 0);

    const from: gsap.TweenVars =
      kind === 'fade'
        ? { opacity: 0 }
        : kind === 'scale'
          ? { opacity: 0, scale: 1.08 }
          : kind === 'left'
            ? { opacity: 0, x: -40 }
            : { opacity: 0, y: 44 };

    gsap.fromTo(el, from, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 1.1,
      delay,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

/** Depth on the photo grids. Value is the travel distance as a % of the element. */
function initParallax() {
  if (reduced) return;

  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax ?? 12);
    gsap.fromTo(
      el,
      { yPercent: -amount / 2 },
      {
        yPercent: amount / 2,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
}

/** Seamless ticker. The track is duplicated in markup, so -50% is one full loop. */
function initMarquees() {
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((el) => {
    const track = el.querySelector<HTMLElement>('[data-marquee-track]');
    if (!track) return;

    const speed = Number(el.dataset.marquee ?? 28);
    const direction = el.dataset.marqueeDirection === 'right' ? 1 : -1;

    const loop = gsap.to(track, {
      xPercent: direction * -50,
      duration: speed,
      ease: 'none',
      repeat: -1,
    });
    if (direction === 1) loop.progress(1).timeScale(-1);

    if (reduced) loop.pause();
  });
}

/** Horizontal pinned rail used by the method section. */
function initHorizontalRails() {
  document.querySelectorAll<HTMLElement>('[data-rail]').forEach((section) => {
    const track = section.querySelector<HTMLElement>('[data-rail-track]');
    if (!track) return;

    // Below the pin breakpoint the rail stays a plain swipeable overflow list.
    // matchMedia reverts the tween and kills the trigger on the way out.
    gsap.matchMedia().add('(min-width: 1024px)', () => {
      const distance = () => track.scrollWidth - window.innerWidth + 96;

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    });
  });
}

/** Hero: the loop drifts and the overlay darkens as you scroll past it. */
function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero || reduced) return;

  const media = hero.querySelector<HTMLElement>('[data-hero-media]');
  const veil = hero.querySelector<HTMLElement>('[data-hero-veil]');

  gsap
    .timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
    .to(media, { scale: 1.14, yPercent: 8, ease: 'none' }, 0)
    .to(veil, { opacity: 0.9, ease: 'none' }, 0);

  // Decoding video costs power for something nobody is looking at. Pausing the
  // loop once the hero is offscreen is free on desktop and noticeable on phones.
  const video = hero.querySelector<HTMLVideoElement>('[data-hero-video]');
  if (!video) return;

  ScrollTrigger.create({
    trigger: hero,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      if (self.isActive) void video.play().catch(() => {});
      else video.pause();
    },
  });
}

/** Header collapses to a compact bar once the hero is behind you. */
function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => header.classList.toggle('is-stuck', self.scroll() > 80),
  });
}

/** Counters in the stat band. */
function initCounters() {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count ?? 0);
    const state = { value: 0 };

    gsap.to(state, {
      value: target,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => {
        el.textContent = Math.round(state.value).toString();
      },
    });
  });
}

/** Vertical reels play only while visible, so three videos never decode at once. */
function initReels() {
  document.querySelectorAll<HTMLVideoElement>('[data-reel]').forEach((video) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
  });
}

function boot() {
  initSmoothScroll();
  initHeader();
  initSplitHeadings();
  initReveals();
  initParallax();
  initMarquees();
  initHorizontalRails();
  initHero();
  initCounters();
  initReels();

  // Fonts change line boxes, which changes every trigger position.
  void document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

try {
  boot();
} catch (error) {
  // Never let an animation bug leave the page blank: reveal everything.
  document.documentElement.classList.add('no-motion');
  console.error('[motion] disabled after error', error);
}
