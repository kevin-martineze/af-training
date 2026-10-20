import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* Claimed as soon as this bundle executes. The inline guard in Layout.astro
   watches for this attribute and reveals the page if it never appears — a chunk
   that fails to download would otherwise leave every [data-reveal] sitting at
   opacity 0 with nothing left to turn it back on. */
document.documentElement.setAttribute('data-motion', '');

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The guard fired before this bundle arrived, so the page is already visible.
   Playing the enter animations now would hide the text and bring it back in,
   which reads as a flash — the reveals are skipped instead. */
const alreadyRevealed = document.documentElement.classList.contains('no-motion');
const skipReveals = reduced || alreadyRevealed;

/** Set by the smoothScroll feature; null under reduced motion. */
let lenis: Lenis | null = null;

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

  // The mobile drawer needs the page to hold still underneath it. Lenis owns
  // the scroll position, so `overflow: hidden` alone would not stop it.
  document.addEventListener('menu:open', () => lenis.stop());
  document.addEventListener('menu:close', () => lenis.start());

  return lenis;
}

/** Headline lines rising out of a clipping mask — the signature move of the site. */
function initSplitHeadings() {
  const headings = document.querySelectorAll<HTMLElement>('[data-split]');

  if (skipReveals) {
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
    // 130 rather than 115: the mask now clips 0.26em taller than the line box
    // (see .split-line-mask in global.css), so a shorter throw would leave the
    // tip of an accent showing before the line has started to rise.
    gsap.from(split.lines, {
      yPercent: 130,
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

  if (skipReveals) {
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
    const group = track?.querySelector<HTMLElement>('[data-marquee-group]');
    if (!track || !group) return;

    const speed = Number(el.dataset.marquee ?? 28);
    const direction = el.dataset.marqueeDirection === 'right' ? 1 : -1;
    let loop: gsap.core.Tween | null = null;

    /**
     * The strip travels exactly one group and repeats, so the seam is a group
     * boundary and never shows. What has to hold is that the copies trailing
     * the one being scrolled away still cover the container — otherwise the
     * tail end of the travel exposes empty track. How many copies that takes
     * depends on the rendered width of the text against the viewport, so it is
     * measured here rather than assumed in the markup.
     */
    const build = () => {
      loop?.kill();
      gsap.set(track, { x: 0 });
      track.replaceChildren(group);

      const width = group.offsetWidth;
      if (!width) return;

      const copies = Math.max(2, Math.ceil(el.offsetWidth / width) + 1);
      for (let i = 1; i < copies; i += 1) track.appendChild(group.cloneNode(true));

      // `speed` stays the seconds one group takes to pass, so adding copies
      // for a wider viewport does not change how fast the text reads.
      loop = gsap.to(track, {
        x: -width,
        duration: speed,
        ease: 'none',
        repeat: -1,
      });
      if (direction === 1) loop.progress(1).timeScale(-1);
      if (reduced) loop.pause();
    };

    build();

    // Fonts land after first paint and change every width in here.
    void document.fonts?.ready.then(build);

    let resizeId = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeId);
      resizeId = window.setTimeout(build, 200);
    });
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

    // The markup ships the real figure so it still reads correctly if this
    // never runs; zero it only now that the count-up is definitely happening.
    el.textContent = '0';

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

/** Scroll to a page offset through Lenis when it is running, natively otherwise. */
function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
}

/**
 * Kit band: three frames on one stage, played by scroll.
 *
 * The navy shot zooms toward its own crest while a circle opens on that spot
 * and the crest macro lands in it; an angled wipe turns to the back of the
 * shirt; then both renders wipe up from below. From
 * lg the section pins while that plays; below lg it scrubs as the stage
 * crosses the viewport. The step buttons jump to a frame — by scrolling to the
 * matching point when scroll drives the timeline, by seeking it otherwise.
 * Below lg only the stage pins, centred in the viewport.
 */
function initKit() {
  const root = document.querySelector<HTMLElement>('[data-kit]');
  const stage = root?.querySelector<HTMLElement>('[data-kit-stage]');
  if (!root || !stage) return;

  const [worn, crest, back, flats] = Array.from(
    stage.querySelectorAll<HTMLElement>('[data-kit-layer]'),
  );
  if (!worn || !crest || !back || !flats) return;

  const steps = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-kit-step]'));
  const counter = root.querySelector<HTMLElement>('[data-kit-counter]');
  const bar = root.querySelector<HTMLElement>('[data-kit-bar]');
  const year = root.querySelector<HTMLElement>('[data-kit-year]');
  const origin = stage.dataset.kitOrigin ?? '50% 50%';

  // Seconds on the timeline where each frame is fully in place.
  const frames = [0, 1.3, 2.6, 3.9];
  // 90% is enough for the circle to reach the far corner of a 2:3 stage from
  // any origin inside it (radius % is of the diagonal over √2).
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  gsap.set([worn, crest], { transformOrigin: origin });
  tl.to(worn, { scale: 1.6, duration: 1 }, 0.15)
    .fromTo(
      crest,
      { clipPath: `circle(0% at ${origin})`, scale: 1.45 },
      { clipPath: `circle(90% at ${origin})`, scale: 1, duration: 1 },
      0.15,
    )
    // Crest to back: an angled wipe from the left, the macro pushed away
    // under it, the back settling from a slight zoom.
    .fromTo(
      back,
      { clipPath: 'polygon(0% 0%, 0% 0%, -30% 100%, -30% 100%)', scale: 1.18 },
      { clipPath: 'polygon(0% 0%, 130% 0%, 100% 100%, 0% 100%)', scale: 1, duration: 1 },
      1.45,
    )
    // Filters are always tweened from an explicit value: from `none`, GSAP
    // interpolates through garbage and the frame flashes black mid-scroll.
    .fromTo(
      crest,
      { xPercent: 0, filter: 'brightness(1)' },
      { xPercent: -12, filter: 'brightness(0.55)', duration: 1, immediateRender: false },
      1.45,
    )
    .fromTo(
      flats,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9 },
      2.85,
    )
    .to(back, { yPercent: -14, scale: 0.94, duration: 0.9 }, 2.85)
    .to({}, { duration: 0.15 }, frames[3]);
  if (year) tl.fromTo(year, { xPercent: 4 }, { xPercent: -22, duration: tl.duration() }, 0);

  let active = -1;
  const setActive = (index: number) => {
    if (index === active) return;
    active = index;
    steps.forEach((step, i) => {
      if (i === index) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
    if (counter) counter.textContent = `0${index + 1}`;
  };
  const frameAt = (time: number) => (time < 0.75 ? 0 : time < 2 ? 1 : time < 3.3 ? 2 : 3);

  tl.eventCallback('onUpdate', () => {
    setActive(frameAt(tl.time()));
    if (bar) gsap.set(bar, { scaleY: tl.progress() });
  });

  let trigger: ScrollTrigger | null = null;

  steps.forEach((step) => {
    step.addEventListener('click', () => {
      const time = frames[Number(step.dataset.kitStep ?? 0)] ?? 0;
      if (trigger) {
        const share = time / tl.duration();
        scrollToY(trigger.start + (trigger.end - trigger.start) * share);
      } else if (reduced) {
        // Reduced motion still gets a fade — just no zoom or wipe in between.
        gsap
          .timeline()
          .to(stage, { opacity: 0, duration: 0.2, ease: 'power1.in' })
          .call(() => {
            // false: let onUpdate run, so the steps and counter follow.
            tl.seek(time, false);
          })
          .to(stage, { opacity: 1, duration: 0.35, ease: 'power1.out' });
      } else {
        tl.tweenTo(time, { duration: 1, ease: 'expo.inOut' });
      }
    });
  });

  if (reduced) return;

  gsap.matchMedia().add(
    { desktop: '(min-width: 1024px)', mobile: '(max-width: 1023.98px)' },
    (context) => {
      const desktop = Boolean(context.conditions?.desktop);
      const stageWrap = root.querySelector<HTMLElement>('[data-kit-pin]') ?? stage;
      trigger = ScrollTrigger.create({
        trigger: desktop ? root : stageWrap,
        start: desktop ? 'top top' : 'center center',
        end: desktop ? '+=230%' : '+=160%',
        pin: desktop ? true : stageWrap,
        scrub: 0.7,
        animation: tl,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
      return () => {
        trigger?.kill();
        trigger = null;
      };
    },
  );

  // Tilt and gloss under a fine pointer. The tilt is on a wrapper rather than
  // the stage so it never fights the timeline's transforms.
  const tilt = root.querySelector<HTMLElement>('[data-kit-tilt]');
  const gloss = root.querySelector<HTMLElement>('[data-kit-gloss]');
  if (!tilt || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const rotateX = gsap.quickTo(tilt, 'rotationX', { duration: 0.8, ease: 'power3.out' });
  const rotateY = gsap.quickTo(tilt, 'rotationY', { duration: 0.8, ease: 'power3.out' });

  tilt.addEventListener('pointermove', (event) => {
    const rect = tilt.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    rotateY((x - 0.5) * 9);
    rotateX((0.5 - y) * 7);
    if (gloss) {
      gloss.style.setProperty('--mx', `${x * 100}%`);
      gloss.style.setProperty('--my', `${y * 100}%`);
      gloss.style.opacity = '1';
    }
  });
  tilt.addEventListener('pointerleave', () => {
    rotateX(0);
    rotateY(0);
    if (gloss) gloss.style.opacity = '0';
  });
}

type StoryChapter = {
  title: string;
  speaker: string;
  role: string;
  duration: number;
  cues: [number, number, string][];
};

/**
 * "Día de entrega": a story player. Chapters play back to back, segmented
 * bars track them, a third of the frame on the left goes back and the rest
 * goes forward, holding pauses. Captions are timed to each chapter and rise
 * in word by word. A tiny canvas samples the playing frame for the glow
 * behind the card.
 *
 * Autoplay is muted and only with motion allowed; the play button is the way
 * in with sound, and the only way in under reduced motion.
 */
function initStories() {
  const root = document.querySelector<HTMLElement>('[data-stories]');
  const player = root?.querySelector<HTMLElement>('[data-story-player]');
  if (!root || !player) return;

  const videos = Array.from(player.querySelectorAll<HTMLVideoElement>('[data-story-video]'));
  const chapters: StoryChapter[] = JSON.parse(
    root.querySelector('[data-story-cues]')?.textContent ?? '[]',
  );
  if (!videos.length || videos.length !== chapters.length) return;

  const fills = Array.from(player.querySelectorAll<HTMLElement>('[data-story-fill]'));
  const minis = Array.from(root.querySelectorAll<HTMLElement>('[data-story-mini]'));
  const jumps = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-story-jump]'));
  const caption = player.querySelector<HTMLElement>('[data-story-caption]');
  const speaker = player.querySelector<HTMLElement>('[data-story-speaker]');
  const role = player.querySelector<HTMLElement>('[data-story-role]');
  const sound = player.querySelector<HTMLButtonElement>('[data-story-sound]');
  const iconMuted = player.querySelector<SVGElement>('[data-story-icon-muted]');
  const iconOn = player.querySelector<SVGElement>('[data-story-icon-on]');
  const play = player.querySelector<HTMLButtonElement>('[data-story-play]');
  const playLabel = player.querySelector<HTMLElement>('[data-story-play-label]');
  const prev = player.querySelector<HTMLButtonElement>('[data-story-prev]');
  const next = player.querySelector<HTMLButtonElement>('[data-story-next]');
  const ambient = root.querySelector<HTMLCanvasElement>('[data-story-ambient]');
  const ambientCtx = ambient?.getContext('2d') ?? null;

  const last = videos.length - 1;
  let index = 0;
  let muted = true;
  let started = false;
  let finished = false;
  let visible = false;
  let held = false;
  let swallowClick = false;
  let holdTimer = 0;
  let cueText: string | null = null;
  let frame = 0;

  const current = () => videos[index];

  const setMuted = (value: boolean) => {
    muted = value;
    videos.forEach((video) => (video.muted = value));
    sound?.setAttribute('aria-pressed', String(!value));
    sound?.setAttribute('aria-label', value ? 'Activar sonido' : 'Silenciar');
    iconMuted?.classList.toggle('hidden', !value);
    iconOn?.classList.toggle('hidden', value);
  };

  const playCurrent = () => {
    const video = current();
    video.preload = 'auto';
    video.muted = muted;
    return video.play().then(
      () => true,
      () => false,
    );
  };

  const showPlay = (label: string) => {
    play?.removeAttribute('data-hidden');
    if (playLabel) playLabel.textContent = label;
  };
  const hidePlay = () => play?.setAttribute('data-hidden', '');

  const renderCaption = (text: string) => {
    cueText = text;
    if (!caption) return;
    caption.replaceChildren();
    if (!text) return;

    const words = text.split(' ').map((word) => {
      const span = document.createElement('span');
      span.className = 'inline-block';
      span.textContent = word;
      return span;
    });
    words.forEach((span, i) => {
      caption.appendChild(span);
      if (i < words.length - 1) caption.appendChild(document.createTextNode(' '));
    });

    if (!reduced) {
      gsap.fromTo(
        words,
        { yPercent: 70, opacity: 0, filter: 'blur(6px)' },
        { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.55, stagger: 0.03, ease: 'expo.out' },
      );
    }
  };

  const updateMeta = () => {
    const chapter = chapters[index];
    if (speaker) speaker.textContent = chapter.speaker;
    if (role) role.textContent = chapter.role;
    if (!reduced && speaker && role) {
      gsap.fromTo([speaker, role], { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 });
    }
    jumps.forEach((jump, i) => jump.setAttribute('aria-current', String(i === index)));
  };

  const finish = () => {
    finished = true;
    current().pause();
    showPlay('Ver de nuevo');
  };

  const title = player.querySelector<HTMLElement>('[data-story-title]');
  const titleN = player.querySelector<HTMLElement>('[data-story-title-n]');
  const titleName = player.querySelector<HTMLElement>('[data-story-title-name]');
  const titleRule = player.querySelector<HTMLElement>('[data-story-title-rule]');
  let titleTl: gsap.core.Timeline | null = null;

  /** Number and speaker rise out of their masks mid-turn, hold, and leave upward. */
  const showTitle = (target: number) => {
    if (!title || !titleN || !titleName) return;
    titleTl?.kill();
    titleN.textContent = `0${target + 1} / 0${videos.length}`;
    titleName.textContent = chapters[target].title;

    if (reduced) {
      gsap.set([titleN, titleName], { yPercent: 0 });
      gsap.set(titleRule, { scaleX: 1 });
      titleTl = gsap
        .timeline()
        .fromTo(title, { opacity: 0 }, { opacity: 1, duration: 0.35 })
        .to(title, { opacity: 0, duration: 0.35 }, '+=1.1');
      return;
    }
    titleTl = gsap
      .timeline({ delay: 0.35 })
      .set(title, { opacity: 1 })
      .fromTo([titleN, titleName], { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.07, ease: 'expo.out' })
      .fromTo(titleRule, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, '<0.15')
      .to([titleN, titleName], { yPercent: -110, duration: 0.5, stagger: 0.05, ease: 'expo.in' }, '+=1')
      .to(titleRule, { scaleX: 0, duration: 0.4, ease: 'expo.in' }, '<')
      .set(title, { opacity: 0 });
  };

  /**
   * The cube. Both faces share an edge: the outgoing one swings back on it
   * while the incoming one swings in from it, and the edge itself travels the
   * width of the frame. Each face darkens as it turns away from the viewer,
   * which is most of what sells the depth.
   */
  const go = (target: number, direction = target > index ? 1 : -1) => {
    if (target === index || target < 0 || target > last) return;

    const from = current();
    const to = videos[target];
    from.pause();
    gsap.killTweensOf(videos);

    const hidden = {
      clipPath: 'inset(0% 0% 0% 100%)',
      rotationY: 0,
      xPercent: 0,
      filter: 'none',
      opacity: 1,
      zIndex: 0,
    };
    videos.forEach((video) => {
      if (video !== from && video !== to) gsap.set(video, hidden);
    });
    gsap.set(from, { zIndex: 1, clipPath: 'inset(0% 0% 0% 0%)' });
    gsap.set(to, { zIndex: 2, clipPath: 'inset(0% 0% 0% 0%)' });
    to.currentTime = 0;

    if (reduced) {
      // No turn, no travel: a short crossfade, which reduced motion allows.
      gsap.fromTo(
        to,
        { rotationY: 0, xPercent: 0, filter: 'none', opacity: 0 },
        { opacity: 1, duration: 0.45, ease: 'power1.out', onComplete: () => gsap.set(from, hidden) },
      );
      showTitle(target);
    } else {
      const turn = { duration: 0.95, ease: 'power3.inOut' };
      gsap.fromTo(
        from,
        { rotationY: 0, xPercent: 0, filter: 'brightness(1)', transformOrigin: direction > 0 ? '100% 50%' : '0% 50%' },
        {
          ...turn,
          rotationY: direction > 0 ? -90 : 90,
          xPercent: direction > 0 ? -100 : 100,
          filter: 'brightness(0.25)',
          onComplete: () => gsap.set(from, hidden),
        },
      );
      gsap.fromTo(
        to,
        {
          rotationY: direction > 0 ? 90 : -90,
          xPercent: direction > 0 ? 100 : -100,
          filter: 'brightness(0.25)',
          transformOrigin: direction > 0 ? '0% 50%' : '100% 50%',
        },
        { ...turn, rotationY: 0, xPercent: 0, filter: 'brightness(1)' },
      );
      // The card dips back while it turns, as if the cube were lifted off the page.
      gsap.fromTo(player, { scale: 1 }, { scale: 0.96, duration: 0.45, ease: 'power2.out', yoyo: true, repeat: 1 });
      showTitle(target);
    }

    index = target;
    finished = false;
    renderCaption('');
    updateMeta();
    if (started && visible) void playCurrent();
  };

  const restart = () => {
    finished = false;
    if (index === 0) {
      current().currentTime = 0;
      void playCurrent();
    } else {
      go(0, -1);
    }
  };

  // A hold that paused playback must not also count as a tap.
  const consumeHold = () => {
    if (!swallowClick) return false;
    swallowClick = false;
    return true;
  };

  prev?.addEventListener('click', () => {
    if (consumeHold()) return;
    if (index === 0 || current().currentTime > 1.5) {
      current().currentTime = 0;
      if (started) void playCurrent();
    } else {
      go(index - 1, -1);
    }
  });

  next?.addEventListener('click', () => {
    if (consumeHold()) return;
    if (index === last) finish();
    else go(index + 1, 1);
  });

  jumps.forEach((jump, i) =>
    jump.addEventListener('click', () => {
      started = true;
      hidePlay();
      if (i === index) {
        current().currentTime = 0;
        finished = false;
        void playCurrent();
      } else {
        go(i);
        if (!visible) void playCurrent();
      }
    }),
  );

  play?.addEventListener('click', () => {
    started = true;
    setMuted(false);
    hidePlay();
    if (finished) restart();
    else void playCurrent();
  });

  sound?.addEventListener('click', () => {
    setMuted(!muted);
    if (started && !finished && current().paused) void playCurrent();
  });

  player.addEventListener('pointerdown', (event) => {
    if ((event.target as HTMLElement).closest('[data-story-sound], [data-story-play]')) return;
    window.clearTimeout(holdTimer);
    holdTimer = window.setTimeout(() => {
      held = true;
      current().pause();
    }, 220);
  });
  const release = () => {
    window.clearTimeout(holdTimer);
    if (!held) return;
    held = false;
    swallowClick = true;
    if (started && !finished) void playCurrent();
  };
  player.addEventListener('pointerup', release);
  player.addEventListener('pointercancel', release);
  player.addEventListener('pointerleave', release);

  videos.forEach((video, i) => {
    video.addEventListener('ended', () => {
      if (i !== index) return;
      if (index < last) go(index + 1, 1);
      else finish();
    });
  });

  // Seed the glow from the first poster so it is there before anything plays.
  if (ambientCtx && videos[0].poster) {
    const poster = new Image();
    poster.onload = () => ambientCtx.drawImage(poster, 0, 0, 24, 42);
    poster.src = videos[0].poster;
  }

  gsap.ticker.add(() => {
    if (!visible) return;
    const video = current();
    const duration = video.duration || chapters[index].duration;
    const progress = duration ? Math.min(1, video.currentTime / duration) : 0;

    fills.forEach((fill, i) => {
      fill.style.transform = `scaleX(${i < index ? 1 : i === index ? progress : 0})`;
    });
    minis.forEach((mini, i) => {
      mini.style.transform = `scaleX(${i < index ? 1 : i === index ? progress : 0})`;
    });

    const cue = chapters[index].cues.find(([start, end]) => video.currentTime >= start && video.currentTime < end);
    const text = cue ? cue[2] : '';
    if (text !== cueText) renderCaption(text);

    // Warm the next chapter once this one is half done, so the cut is instant.
    if (progress > 0.5 && index < last && videos[index + 1].preload === 'none') {
      videos[index + 1].preload = 'auto';
    }

    frame += 1;
    if (ambientCtx && !reduced && !video.paused && video.readyState >= 2 && frame % 6 === 0) {
      ambientCtx.drawImage(video, 0, 0, 24, 42);
    }
  });

  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        current().pause();
        return;
      }
      if (finished) return;
      if (started) {
        void playCurrent();
      } else if (!reduced) {
        // Muted autoplay, like any feed. The play button stays the way to sound.
        void playCurrent().then((ok) => {
          if (!ok) return;
          started = true;
          hidePlay();
        });
      }
    },
    { threshold: 0.55 },
  ).observe(player);

  setMuted(true);
}

/**
 * "Visten el proceso": the lead photo is unveiled, then the hand is dealt.
 *
 * The deal is played, not scrubbed. Tied to the wheel it moved in steps, and
 * a deal that stutters reads as a glitch rather than as motion. So it runs on
 * its own clock once the row is well in view, in two overlapping beats: the
 * pile rises out of a soft blur, then opens into the fan from the centre
 * outwards on a long expo curve.
 *
 * The fan is the cards' resting place in CSS (left, rotate, translate), so
 * with no script it is already there. GSAP folds the CSS `rotate` and
 * `translate` properties into its own transform the first time it touches a
 * card, so the tween has to name the fan's tilt and drop as its end values
 * rather than tween back to zero — zero would flatten the hand into a row.
 *
 * Hover lives on a second layer ([data-fan-float]) so it never fights the
 * fan: the hovered card straightens and lifts, its neighbours lean away,
 * further ones less.
 */
function initFan() {
  if (reduced) return;

  const lead = document.querySelector<HTMLElement>('[data-fan-lead]');
  const leadImg = lead?.querySelector<HTMLElement>('[data-fan-lead-img]');
  if (lead) {
    const radius = getComputedStyle(lead).borderRadius;
    gsap
      .timeline({ scrollTrigger: { trigger: lead, start: 'top 85%', once: true } })
      .fromTo(
        lead,
        { clipPath: `inset(100% 0% 0% 0% round ${radius})` },
        { clipPath: `inset(0% 0% 0% 0% round ${radius})`, duration: 1.5, ease: 'expo.inOut' },
      )
      .fromTo(leadImg ?? [], { scale: 1.3 }, { scale: 1, duration: 2.2, ease: 'expo.out' }, 0.15);
  }

  const fan = document.querySelector<HTMLElement>('[data-fan]');
  if (!fan) return;

  const cards = Array.from(fan.querySelectorAll<HTMLElement>('[data-fan-card]'));
  const floats = cards.map((card) => card.querySelector<HTMLElement>('[data-fan-float]'));
  const floatEls = floats.filter((float): float is HTMLElement => Boolean(float));
  // Fixed rather than random, so the pile looks the same on every visit.
  const tilts = [-7, 4, -2, 6, -5, 2];
  const offset = (card: HTMLElement) => Number(card.style.getPropertyValue('--o') || 0);
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  // Degrees per card-step, set per breakpoint on the list.
  const tilt = () => parseFloat(getComputedStyle(fan).getPropertyValue('--tilt')) || 5;
  const pileX = (card: HTMLElement) => fan.offsetWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
  const fanY = (card: HTMLElement) => offset(card) ** 2 * 0.45 * rem;
  const fanRotation = (card: HTMLElement) => offset(card) * tilt();

  let dealt = false;

  // Park the hand as an invisible pile until the deal.
  const park = () =>
    gsap.set(cards, {
      x: (_: number, card: HTMLElement) => pileX(card),
      y: 120,
      rotation: (i: number) => tilts[i % tilts.length],
      scale: 0.86,
      opacity: 0,
      filter: 'blur(10px)',
    });
  park();

  const deal = () => {
    // Measured now, not at load: fonts and the lead image move the layout.
    park();
    gsap
      .timeline({ onComplete: () => void (dealt = true) })
      .to(cards, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        scale: 0.94,
        duration: 1.1,
        ease: 'power3.out',
        stagger: { each: 0.07, from: 'end' },
      })
      .to(
        cards,
        {
          x: 0,
          y: (_: number, card: HTMLElement) => fanY(card),
          rotation: (_: number, card: HTMLElement) => fanRotation(card),
          scale: 1,
          duration: 1.6,
          ease: 'expo.inOut',
          stagger: { each: 0.06, from: 'center' },
          clearProps: 'filter',
        },
        0.6,
      );
  };

  ScrollTrigger.create({ trigger: fan, start: 'top 68%', once: true, onEnter: deal });

  // A resize after the deal re-poses the fan for the new card step and tilt.
  let resizeId = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeId);
    resizeId = window.setTimeout(() => {
      if (!dealt) return;
      gsap.set(cards, {
        x: 0,
        y: (_: number, card: HTMLElement) => fanY(card),
        rotation: (_: number, card: HTMLElement) => fanRotation(card),
      });
    }, 200);
  });

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const spread = (hovered: number) => {
    floats.forEach((float, i) => {
      if (!float) return;
      const distance = i - hovered;
      const lean = distance === 0 ? 0 : Math.sign(distance) * Math.max(10, 46 - (Math.abs(distance) - 1) * 14);
      gsap.to(float, {
        x: lean,
        y: distance === 0 ? -26 : 0,
        rotation: distance === 0 ? -fanRotation(cards[i]) : 0,
        scale: distance === 0 ? 1.06 : 1,
        duration: 0.8,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  };

  cards.forEach((card, i) => card.addEventListener('pointerenter', () => dealt && spread(i)));
  fan.addEventListener('pointerleave', () =>
    gsap.to(floatEls, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.9, ease: 'power3.out', overwrite: 'auto' }),
  );
}

/* Booted one at a time. These used to be ten bare calls inside a single
   try/catch, so one throw skipped every feature after it and took the whole
   page's motion down with it. A broken counter should cost the counters. */
const features: [string, () => void][] = [
  [
    'smoothScroll',
    () => {
      lenis = initSmoothScroll();
    },
  ],
  ['header', initHeader],
  ['splitHeadings', initSplitHeadings],
  ['reveals', initReveals],
  ['parallax', initParallax],
  ['marquees', initMarquees],
  ['rails', initHorizontalRails],
  ['hero', initHero],
  ['counters', initCounters],
  ['reels', initReels],
  ['kit', initKit],
  ['stories', initStories],
  ['fan', initFan],
];

function boot() {
  let failures = 0;

  for (const [name, init] of features) {
    try {
      init();
    } catch (error) {
      failures += 1;
      console.error(`[motion] ${name} failed`, error);
    }
  }

  // Nothing came up at all, so the reveals never ran either — hand over to the
  // fallback rather than leave the page at opacity 0.
  if (failures === features.length) throw new Error('every feature failed');

  // Two sections pin now (the method rail and the kit), and a trigger measures
  // its start without the pin spacing of any pin refreshed after it. Triggers
  // refresh in creation order, which is feature order, not page order — so put
  // them in page order before the first refresh below.
  ScrollTrigger.sort();

  // Fonts change line boxes, which changes every trigger position.
  void document.fonts?.ready.then(() => ScrollTrigger.refresh());
  // So do images and videos that only report their size once they arrive. A
  // trigger measured against a shorter page can end up past its own start,
  // where it never fires and the text it was holding never appears.
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

try {
  boot();
} catch (error) {
  // Never let an animation bug leave the page blank: reveal everything.
  document.documentElement.classList.add('no-motion');
  console.error('[motion] disabled after error', error);
}
