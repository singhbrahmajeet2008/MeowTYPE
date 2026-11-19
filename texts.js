// ==========================================================================
// meow-typing - Comprehensive Text Database & Procedural Paragraph Engine
// Guarantees a fresh, unseen, unique paragraph every single test!
// ==========================================================================

const TEXT_DATABASE = {
  quotes: {
    easy: [
      "Practice does not make perfect. Only perfect practice makes perfect. Focus on steady rhythm before raw speed, and allow muscle memory to guide each key smoothly.",
      "The quick brown fox jumps over the lazy dog, while swift paws dance across mechanical switches with gentle precision and calm composure.",
      "Small daily improvements over time lead to stunning results. Keep your eyes centered on the screen, relax your shoulders, and breathe naturally through every line.",
      "Consistency is the true foundation of typing mastery. Type with quiet confidence and let each keystroke flow into the next like clean musical notes.",
      "Every master was once a beginner. Keep your fingers resting on the home row, avoid glancing downward, and trust your subconscious mind to find the letters.",
      "Success is the sum of tiny efforts repeated day in and day out. Great typists never rush; they find a calm cadence that never falters.",
      "Creativity is intelligence having fun. Fluid typing lets your thoughts transfer directly into text at the speed of human imagination.",
      "A cat sits quietly on the sunlit windowsill, watching dust motes drift lazily through the afternoon air before taking a deep, satisfied stretch.",
      "Early morning light filters softly through the trees, casting gentle golden shadows across the quiet desk while the coffee brews nearby.",
      "The sound of mechanical keyboard clicks echoes softly in the calm evening room, creating a soothing rhythm that makes time slip away unnoticed.",
      "Patience and persistence can solve almost any puzzle. When you hit a tricky phrase, slow your tempo slightly and re-establish your clean streak.",
      "The cat blinked slowly from the warm desk cushion, judging every keystroke with affectionate indifference before curling up for another nap.",
      "Clear thinking leads to clear writing. When your fingers move without hesitation, your mental energy stays focused entirely on creative ideas.",
      "A curious kitten inspected the glowing spacebar with wide curious eyes, fascinated by the gentle tactile bounce under each eager tap.",
      "The secret to fast typing is not moving your hands quickly, but eliminating unnecessary pauses between words and staying completely relaxed.",
      "Walking through the silent autumn forest, the crunch of dry leaves underfoot creates a gentle cadence that calms a busy racing mind.",
      "A warm cup of green tea sits beside the notebook, steam rising in curling spirals while gentle rainfall taps against the glass pane.",
      "Keep your wrists floating gently above the desk. Ergonomic comfort and light finger pressure will protect your hands through hours of typing practice.",
      "No matter how many typos occur today, every single practice session sharpens your reflexes and reinforces your finger coordination.",
      "The domestic cat purrs at a low frequency between twenty and one hundred and forty Hertz, a soothing sound that promotes calm and rest."
    ],

    medium: [
      "The Heisenberg Uncertainty Principle states that one cannot know both precisely the position of a quantum particle and its momentum. The more precisely its position is known, the less precisely its momentum can be determined. This is not a flaw in measurement tools, but an intrinsic feature of wave-particle duality itself.",
      "In the middle of difficulty lies opportunity. When you make a typing mistake, do not panic or mash backspace frantically; maintain your composure, re-align your fingers on the home row, and let muscle memory recalibrate your next keystroke seamlessly.",
      "Computer keyboards evolved from early mechanical typewriters designed in the nineteenth century. Christopher Sholes engineered the QWERTY layout primarily to prevent metal typebars from colliding during rapid keystrokes, accidentally establishing a standard that has endured for over a century.",
      "Artificial intelligence represents the simulation of human cognition by algorithmic computer architectures, enabling neural networks to learn intricate patterns, decode human language, and solve complex mathematical riddles at breathtaking velocity.",
      "Curiosity is the engine of intellectual growth. When we explore unfamiliar disciplines, our brains synthesize novel neural connections that sharpen reflexes, expand our worldview, and cultivate a deep sense of lifelong wonder.",
      "The true beauty of touch typing is that your thoughts become direct extensions of the cursor on screen, bypassing conscious mechanical effort in favor of fluid creative expression where ideas materialize effortlessly.",
      "Felines possess extraordinary biomechanics: their flexible spines contain thirty vertebrae, allowing them to twist mid-air with acrobatic grace during the righting reflex to land cleanly on all four paws.",
      "Deep work requires eliminating digital distractions and cultivating unbroken focus. When you enter a state of complete immersion, mental friction vanishes and complex challenges yield to steady disciplined thought.",
      "Mechanical keyboard switches feature distinct acoustic signatures, from the crisp tactile click of blue switches to the smooth linear glide of lubed red stems, each providing distinct feedback to tactile typists.",
      "The psychology of the flow state, pioneered by Mihaly Csikszentmihalyi, occurs when an individual's skills perfectly match the challenge at hand, dissolving self-consciousness and warping the perception of time.",
      "Astronomers peer into deep cosmic history through space telescopes, capturing photons that began their journey billions of years ago across expanding voids of interstellar dust and ancient stellar nurseries.",
      "A cat's whiskers, or vibrissae, are deeply rooted sensory organs rich with nerve endings. They detect microscopic air currents, helping felines navigate narrow corridors and judge spatial clearance in pitch darkness.",
      "Software engineering is fundamentally the art of managing cognitive complexity. Writing clean, maintainable code requires structuring systems into small modular components with explicit boundaries and responsibilities.",
      "Neuroplasticity enables the human brain to rewire its synaptic pathways in response to deliberate practice. Every rhythmic sequence of keystrokes strengthens the motor cortex circuits governing fine finger control.",
      "The Library of Alexandria once represented the pinnacle of ancient scholarship, housing hundreds of thousands of papyrus scrolls that gathered philosophy, mathematics, astronomy, and medicine under one monumental roof.",
      "Cats sleep between twelve and sixteen hours each day to conserve metabolic energy for sudden bursts of predatory speed, alternating between light naps and rapid eye movement sleep filled with twitching paws.",
      "Cryptography protects digital civil liberties across modern telecommunications. Mathematical algorithms utilizing large prime numbers allow two distant parties to establish encrypted communications over untrusted public channels.",
      "The Renaissance ignited a transformative era in European art, science, and literature, proving that cross-pollination between disparate disciplines yields the most enduring breakthroughs in human history.",
      "Touch typing reduces cognitive load during professional work. When you no longer need to search for keys, your working memory remains completely free to draft arguments, solve bugs, and compose prose.",
      "The domestic feline skull features large eye sockets optimized for low-light binocular vision, granting them exceptional depth perception to track fleeting movements in the twilight hours of dusk and dawn."
    ],

    hard: [
      "To be, or not to be: that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles, and by opposing end them? To die: to sleep; no more; and by a sleep to say we end the heart-ache and the thousand natural shocks that flesh is heir to.",
      "Quantum electrodynamics describes how light and matter interact: specifically, it is the relativistic quantum field theory of electrodynamics that incorporates Maxwell's equations with relativistic mechanics, yielding predictions verified to eleven decimal places through precision spectroscopy.",
      "The algorithmic complexity O(n log n) represents the theoretical lower bound for comparison-based sorting routines—exemplified by MergeSort and HeapSort; contrastingly, QuickSort exhibits catastrophic O(n^2) worst-case degradation unless randomized pivots or median-of-three heuristics are employed.",
      "Synapses transmit chemical neuro-transmitters across a twenty-nanometer synaptic cleft; upon binding to postsynaptic ligand-gated ion channels, they trigger localized depolarization waves that govern motor reflexes, memory consolidation, and subconscious muscle cadence.",
      "Sophisticated cryptographic protocols leverage elliptic curve cryptography (ECC) over prime Galois fields GF(2^255 - 19), balancing computational efficiency with formidable 128-bit security margins resistant to conventional cryptanalytic factorization techniques.",
      "Consider the lobster: its nervous system lacks centralized cephalic architecture, yet exhibits intricate peripheral nociceptive signaling. When heated water initiates systemic neurochemical distress, behavioral reactions raise profound ethical inquiries regarding crustacean sentience.",
      "Ada Lovelace, working alongside Charles Babbage on the proposed Analytical Engine, realized that the mechanical contraption could manipulate symbols according to rules, effectively formulating the conceptual blueprint for modern universal Turing-complete computation.",
      "The thermodynamic arrow of time is irrevocably tethered to the Second Law: in any isolated system, entropy—a mathematical measure of microscopic molecular disorder—must monotonically increase over time, dictating why eggs shatter but never spontaneously reassemble.",
      "Wittgenstein famously observed in his Tractatus Logico-Philosophicus: 'Whereof one cannot speak, thereof one must be silent.' Language constructs the conceptual boundary of human reality; propositions that transcend empirical verification dwell outside formal logical discourse.",
      "Feline nocturnal predatory prowess hinges on the tapetum lucidum—a retroreflective cellular layer situated immediately behind the retina that reflects unabsorbed photons back through the photoreceptors, magnifying optical sensitivity six-fold in sub-lumen illumination.",
      "Epigenetic methylation patterns modulate chromatin condensation without altering underlying nucleotide sequences; environmental stressors can consequently silence tumor-suppressor alleles, propagating phenotypic adaptations across subsequent mitotic cell lineages.",
      "The phenomenological inquiry into subjective consciousness—often designated 'the hard problem' by David Chalmers—interrogates why physical neurobiological substrate computations should be accompanied by qualitative, first-person experiential qualia.",
      "Distributed consensus algorithms, such as Paxos and Raft, navigate the asynchronous Byzantine Generals Problem by establishing majority quorums across replicated state machines, guaranteeing deterministic consistency despite packet drops and network partitions.",
      "The cosmos does not merely contain complexity; it manifests an astonishing fine-tuning: if the strong nuclear coupling constant had differed by merely two percent, nucleosynthesis would have failed to forge carbon atoms, rendering organic biochemistry nonexistent.",
      "Feline purring emanates from rhythmic neural oscillations within the intrinsic laryngeal muscles, alternately constricting and dilating the glottis at twenty-five cycles per second, accompanied by vibroacoustic resonance throughout the thoracic cavity.",
      "Kantian deontology posits that moral imperatives must hold categorical validity independent of empirical consequences: 'Act only according to that maxim whereby you can at the same time will that it should become a universal law.'",
      "Gravitational wave interferometers, such as LIGO and Virgo, measure strain variations on the order of 10^-21 meters—less than one-thousandth the diameter of a single proton—as spacetime ripples from binary black hole coalescences traverse terrestrial detectors.",
      "The Sapir-Whorf hypothesis posits that the structural syntax and lexicon of a natural language subtly constrain the cognitive categorization and perceptual habits of its native speakers, orchestrating how temporal and spatial phenomena are mentally conceived.",
      "Neurological motor sequencing during high-speed typing involves predictive feed-forward neural loops: the motor cortex queues trigrams and bi-grams simultaneously, executing overlapping keystroke trajectories before sensory feedback confirms preceding impacts.",
      "Microservices architectures decouple monolithic codebases into independent network-accessible services; however, they introduce formidable operational overheads in distributed tracing, eventual consistency reconciliation, and inter-service telemetry orchestration."
    ]
  },

  words: {
    easy: [
      "time", "year", "people", "way", "day", "man", "thing", "woman", "life", "child",
      "world", "school", "state", "family", "student", "group", "country", "problem", "hand", "part",
      "place", "case", "week", "company", "system", "program", "question", "work", "government", "number",
      "night", "point", "home", "water", "room", "mother", "area", "money", "story", "fact",
      "month", "lot", "right", "study", "book", "eye", "job", "word", "business", "issue",
      "side", "kind", "head", "house", "service", "friend", "father", "power", "hour", "game",
      "line", "end", "member", "law", "car", "city", "community", "name", "president", "team",
      "minute", "idea", "kid", "body", "information", "back", "parent", "face", "others", "level",
      "office", "door", "health", "person", "art", "war", "history", "party", "result", "change",
      "morning", "reason", "research", "girl", "guy", "food", "moment", "air", "teacher", "force",
      "cat", "kitten", "purr", "paws", "fur", "tail", "claw", "nap", "mouse", "whiskers"
    ],

    medium: [
      "keyboard", "monitor", "rhythm", "velocity", "impulse", "tactile", "feedback", "switch",
      "mechanical", "acoustic", "frequency", "acceleration", "precision", "threshold", "accuracy",
      "percentage", "sequence", "buffer", "latency", "throughput", "cadence", "calibration",
      "ergonomic", "posture", "alignment", "efficiency", "benchmark", "performance", "milestone",
      "trophy", "champion", "algorithm", "dimension", "infrastructure", "equilibrium", "synchronize",
      "oscillation", "framework", "paradigm", "component", "asynchronous", "telemetry", "prototype",
      "architecture", "modularity", "validation", "cryptographic", "interface", "compilation", "directory",
      "resolution", "bandwidth", "cybernetics", "neural", "computation", "synthesis", "optimization",
      "concurrency", "distributed", "throughput", "parameter", "iteration", "abstraction", "polymorphism",
      "inheritance", "encapsulation", "refactoring", "diagnostic", "telemetry", "feline", "agility",
      "acrobatic", "biomechanics", "vibrissae", "nocturnal", "predatory", "reflexes", "equilibrium"
    ],

    hard: [
      "pneumonoultramicroscopicsilicovolcanoconiosis", "quintessential", "idiosyncratic", "serendipity",
      "obsequious", "antidisestablishmentarianism", "paraphernalia", "juxtaposition", "labyrinthine",
      "prestidigitation", "chronological", "ephemeral", "magnanimous", "ubiquitous", "pusillanimous",
      "sesquipedalian", "circumlocution", "grandiloquent", "tintinnabulation", "verisimilitude",
      "vicissitude", "incommensurable", "heterogeneous", "prolegomenon", "anachronistic",
      "supercilious", "perspicacious", "recalcitrant", "ineffable", "surreptitious",
      "epistemology", "phenomenology", "hermeneutics", "solipsism", "panpsychism",
      "metamorphosis", "thermodynamics", "electroencephalography", "cryopreservation", "crystallography",
      "paleontology", "bioluminescence", "photosynthesis", "chromatography", "spectrophotometry"
    ]
  },

  code: {
    easy: [
      "function calculateSpeed(words, minutes) { const wpm = Math.round(words / minutes); return wpm; }",
      "const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']; const active = colors.filter(c => Boolean(c));",
      "let highScores = JSON.parse(localStorage.getItem('scores')) || []; highScores.push({ wpm: 95, date: Date.now() });",
      "function greetCat(name) { return `Hello, ${name}! Time for typing practice.`; } console.log(greetCat('Whiskers'));",
      "const sum = (a, b) => a + b; const doubled = [1, 2, 3, 4].map(n => n * 2);",
      "if (accuracy >= 85) { awardBadge('Good Precision'); } else { triggerTip('Focus on accuracy over speed'); }",
      "for (let i = 0; i < 10; i++) { console.log(`Step ${i}: fingers on home row.`); }",
      "const isTyping = true; const currentKey = event.key.toLowerCase(); if (currentKey === ' ') advanceWord();"
    ],

    medium: [
      "async function fetchLeaderboard(limit = 10) { try { const res = await fetch(`/api/scores?top=${limit}`); return await res.json(); } catch (err) { console.error('Fetch error:', err); return []; } }",
      "document.addEventListener('keydown', (event) => { if (event.key === 'Escape') resetGame(); else if (event.key === ' ') handleSpace(); });",
      "export const useTimer = (duration) => { const [remaining, setRemaining] = useState(duration); useEffect(() => { const id = setInterval(() => setRemaining(r => r - 1), 1000); return () => clearInterval(id); }, []); };",
      "class TypingSession { constructor(duration) { this.duration = duration; this.errors = 0; this.startTime = Date.now(); } getElapsed() { return (Date.now() - this.startTime) / 1000; } }",
      "const sanitize = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');",
      "const calculateWpm = (chars, seconds) => Math.max(0, Math.round((chars / 5) / (seconds / 60)));",
      "const debounce = (fn, delay = 250) => { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; };",
      "const filterStruggles = (masteryMap) => Object.values(masteryMap).filter(item => item.errorsCount > 0).sort((a, b) => b.errorsCount - a.errorsCount);"
    ],

    hard: [
      "class PriorityQueue<T> { private heap: T[] = []; push(item: T): void { this.heap.push(item); this.bubbleUp(this.heap.length - 1); } pop(): T | undefined { const top = this.heap[0]; const end = this.heap.pop(); if (this.heap.length > 0 && end) { this.heap[0] = end; this.bubbleDown(0); } return top; } }",
      "const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => { let timer: ReturnType<typeof setTimeout>; return (...args: Parameters<T>) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; };",
      "type DeepReadonly<T> = T extends Function ? T : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T; interface TelemetryPayload { readonly timestamp: number; readonly metrics: DeepReadonly<Record<string, number>>; }",
      "function binarySearch<T>(arr: readonly T[], target: T, compare: (a: T, b: T) => number): number { let low = 0, high = arr.length - 1; while (low <= high) { const mid = (low + high) >>> 1; const cmp = compare(arr[mid], target); if (cmp === 0) return mid; else if (cmp < 0) low = mid + 1; else high = mid - 1; } return -1; }",
      "const pipe = <T>(...fns: Array<(arg: T) => T>) => (initialValue: T): T => fns.reduce((acc, fn) => fn(acc), initialValue);"
    ]
  },

  numbers: {
    easy: [
      "in 2026 there were 365 days, 52 weeks, and 12 months with 24 hours in every single day.",
      "item 1 costs $15, item 2 costs $45, and item 3 is priced at $99 with a 10% discount code.",
      "call line 800-555-0199 or office 415-820-9900 between 9:00 AM and 5:30 PM on Monday.",
      "the train leaves platform 4 at 10:15 AM and arrives at terminal 8 at 12:45 PM after 90 miles.",
      "speed check: 45 words per minute, 98% accuracy, 0 errors, and 240 keystrokes recorded.",
      "order #4812 includes 3 mechanical keyboards at $89 each, totaling $267 plus $15 shipping.",
      "set alarm for 6:30 AM, drink 8 glasses of water, walk 10,000 steps, and sleep for 8 hours."
    ],

    medium: [
      "The server responded with HTTP 200 OK in 14.8ms; CPU usage peaked at 78.4% across 8 cores at 3.6 GHz.",
      "coordinates: latitude 37.7749 N, longitude -122.4194 W; elevation 16m; timestamp 1794939039 (epoch).",
      "formula: y = 2.5 * x^2 + 14.8 * x - 92.1; test cases: 4/5 passed with 98.7% test coverage.",
      "financial audit: Q1 revenue $1,248,500 (+14.2% YoY); EBITDA margin 28.5%; net profit $355,820.",
      "telemetry log #9042: ping 12ms, jitter 0.85ms, packet loss 0.00%, bandwidth 942.5 Mbps downstream.",
      "benchmark summary: 104 WPM achieved at 99.4% accuracy across 60 seconds with 520 raw keystrokes."
    ],

    hard: [
      "IP 192.168.1.1:8080 subnet 255.255.255.0/24 MAC 00:1A:2B:3C:4D:5E hash: sha256(7f83b1657ff1fc53b92dc18148a1d65d)!",
      "SELECT id, wpm, accuracy FROM test_runs WHERE score >= 95.5 AND created_at > '2026-11-17 23:59:59' ORDER BY wpm DESC LIMIT 25;",
      "RFC 4122 UUID: 7d55677e-a1e9-4dda-b77d-6feba2846c13 | latency: 99.9th percentile at 2.45ms across 10,000 requests.",
      "constants: Planck h = 6.62607015e-34 J*s, speed of light c = 299792458 m/s, Avogadro N_A = 6.02214076e+23 mol^-1.",
      "hex dump: 0x4D 0x65 0x6F 0x77 0x20 0x54 0x79 0x70 0x69 0x6E 0x67 (UTF-8 binary length: 11 bytes, offset: 0x00FF)."
    ]
  }
};

// ==========================================================================
// Procedural Novel Paragraph Generator
// Synthesizes grammatically rich, novel paragraphs dynamically so the
// user can type indefinitely without ever encountering identical text.
// ==========================================================================

const PROCEDURAL_THEMES = {
  feline: {
    openers: [
      "A silent orange cat perches gracefully above the bookshelf,",
      "Under the soft amber glow of the desk lamp, a sleepy kitten stretches,",
      "With whiskers twitching in focused anticipation, the feline observer watches,",
      "High atop the climbing post, a sleek tabby cat monitors the room,",
      "Curled inside a cardboard box two sizes too small, the contented cat purrs,",
      "Padding soundlessly across the polished hardwood floor, a curious cat explores,"
    ],
    middles: [
      "tracking each energetic tap of the mechanical keyboard with dignified curiosity,",
      "marveling at the rhythmic flurry of flying fingers across the illuminated keycaps,",
      "judging every typing error with a slow, unimpressed blink of golden eyes,",
      "offering gentle moral support with an intermittent, comforting rumbling purr,",
      "preparing to swat playfully at the blinking cursor dancing across the bright screen,"
    ],
    closers: [
      "reminding us that true typing speed is nothing without graceful precision.",
      "before settling into an unbroken afternoon nap beside the warm laptop exhaust.",
      "proving that patience and composure will always conquer hurried keyboard mashing.",
      "as the evening sun sets quietly behind the peaceful silhouette of the window frame.",
      "giving silent feline approval to every clean keystroke and unbroken typing streak."
    ]
  },

  science: {
    openers: [
      "In the vast expanse of the cosmos, ancient stars forge heavy elements,",
      "Modern neuroscience reveals that deliberate practice reshapes synaptic architecture,",
      "At the quantum frontier, subatomic particles oscillate between wave and matter states,",
      "Distant galaxies drift silently through expanding spacetime like glowing islands,",
      "Deep inside biological cells, microscopic enzymes execute billions of chemical reactions,"
    ],
    middles: [
      "demonstrating that order and elegance emerge from microscopic interactions,",
      "proving that human cognition expands whenever we challenge our mental limits,",
      "reminding researchers that nature operates under subtle, beautifully consistent laws,",
      "inspiring thinkers to push beyond current boundaries and seek deeper universal truths,"
    ],
    closers: [
      "illuminating the extraordinary beauty woven into every layer of our physical reality.",
      "where patience, observation, and rigorous analysis unravel the greatest mysteries.",
      "uniting curious minds across generations in an ongoing quest for scientific clarity.",
      "expanding our perception of what is achievable through persistent, focused curiosity."
    ]
  },

  focus: {
    openers: [
      "Entering the flow state requires quieting the restless chatter of the modern mind,",
      "True craftsmanship emerges when mechanical tools become seamless extensions of thought,",
      "When your fingers rest comfortably on the home row with relaxed floating wrists,",
      "The rhythm of continuous typing creates a meditative bubble of quiet concentration,",
      "Mastery is not about reckless speed, but about eliminating wasted hesitation,"
    ],
    middles: [
      "allowing each phrase to materialize effortlessly without second-guessing or tension,",
      "transforming chaotic thoughts into a clean, disciplined cadence of productive output,",
      "fostering a tranquil state of hyper-focus where distractions simply dissolve away,",
      "harmonizing tactile feedback with subconscious reflexes for effortless accuracy,"
    ],
    closers: [
      "unlocking a satisfying sense of accomplishment that carries throughout the entire day.",
      "proving that sustained gentle focus accomplishes far more than frantic hurried effort.",
      "where every finished paragraph feels like a small work of handcrafted digital art.",
      "leaving you refreshed, sharper, and ready to tackle any creative challenge ahead."
    ]
  }
};

function generateProceduralParagraph(difficulty = 'medium', minWords = 35) {
  const themeKeys = Object.keys(PROCEDURAL_THEMES);
  const sentences = [];
  let totalWordCount = 0;

  // Build 2 to 4 diverse sentences
  let attempts = 0;
  while ((totalWordCount < minWords || sentences.length < 2) && attempts < 10) {
    attempts++;
    const themeKey = themeKeys[(attempts + Math.floor(Math.random() * themeKeys.length)) % themeKeys.length];
    const theme = PROCEDURAL_THEMES[themeKey];

    const op = theme.openers[Math.floor(Math.random() * theme.openers.length)];
    const mid = theme.middles[Math.floor(Math.random() * theme.middles.length)];
    const cl = theme.closers[Math.floor(Math.random() * theme.closers.length)];

    let sentence = `${op} ${mid} ${cl}`;
    if (difficulty === 'hard') {
      sentence = sentence.replace(/,/g, ';').replace(/\./g, '—an enduring testament to deliberate mastery.');
    }

    sentences.push(sentence);
    totalWordCount += sentence.split(/\s+/).length;
  }

  return sentences.join(' ');
}

// ==========================================================================
// Anti-Repetition Engine
// Remembers recent paragraph fingerprints so the user never sees duplicates
// ==========================================================================

const RECENT_HISTORY_KEY = 'meow_recent_paragraph_hashes';
let inMemoryRecentHashes = [];

function getRecentHashes() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(RECENT_HISTORY_KEY);
      if (stored) return JSON.parse(stored);
    } else if (typeof localStorage !== 'undefined' && localStorage.getItem) {
      const stored = localStorage.getItem(RECENT_HISTORY_KEY);
      if (stored) return JSON.parse(stored);
    }
  } catch (e) {}
  return inMemoryRecentHashes;
}

function recordRecentHash(hash) {
  if (!hash) return;
  inMemoryRecentHashes.unshift(hash);
  if (inMemoryRecentHashes.length > 80) inMemoryRecentHashes = inMemoryRecentHashes.slice(0, 80);

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      let list = getRecentHashes();
      if (!list.includes(hash)) list.unshift(hash);
      if (list.length > 80) list = list.slice(0, 80);
      window.localStorage.setItem(RECENT_HISTORY_KEY, JSON.stringify(list));
    } else if (typeof localStorage !== 'undefined' && localStorage.setItem) {
      let list = getRecentHashes();
      if (!list.includes(hash)) list.unshift(hash);
      if (list.length > 80) list = list.slice(0, 80);
      localStorage.setItem(RECENT_HISTORY_KEY, JSON.stringify(list));
    }
  } catch (e) {}
}

function computeSimpleHash(str) {
  if (!str) return '0';
  let h = 0;
  const sample = str.slice(0, 160);
  for (let i = 0; i < sample.length; i++) {
    h = ((h << 5) - h) + sample.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

// ==========================================================================
// Public API
// ==========================================================================

/**
 * Returns a guaranteed fresh, unrepeated paragraph tailored to category, difficulty,
 * and duration or target word count.
 */
function getRandomText(category = 'quotes', difficulty = 'medium', durationOrTarget = 60) {
  const cat = TEXT_DATABASE[category] || TEXT_DATABASE.quotes;
  const list = cat[difficulty] || cat.medium || TEXT_DATABASE.quotes.medium;
  const recents = getRecentHashes();

  // If code or numbers, select a fresh unrepeated item
  if (category === 'code' || category === 'numbers') {
    let pool = list.filter(item => !recents.includes(computeSimpleHash(item)));
    if (pool.length === 0) pool = list;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    recordRecentHash(computeSimpleHash(selected));
    return selected;
  }

  // Calculate required words:
  // For time tests, ensure generous word supply (approx 2.5 to 3.0 words per second)
  let targetWordCount = 45;
  if (typeof durationOrTarget === 'number') {
    if (durationOrTarget <= 15) targetWordCount = 60;
    else if (durationOrTarget <= 30) targetWordCount = 110;
    else if (durationOrTarget <= 60) targetWordCount = 190;
    else if (durationOrTarget <= 120) targetWordCount = 360;
    else targetWordCount = Math.max(60, Math.ceil(durationOrTarget * 2.8));
  }

  // 1. Filter out recently seen paragraphs from curated database
  let availableCurated = list.filter(p => !recents.includes(computeSimpleHash(p)));

  // If all curated paragraphs have been seen recently, generate a completely unique procedural paragraph!
  if (availableCurated.length === 0) {
    const proceduralBase = generateProceduralParagraph(difficulty, targetWordCount);
    recordRecentHash(computeSimpleHash(proceduralBase));
    return proceduralBase;
  }

  // 2. Select a fresh curated base paragraph
  const chosenIndex = Math.floor(Math.random() * availableCurated.length);
  let baseParagraph = availableCurated[chosenIndex];
  recordRecentHash(computeSimpleHash(baseParagraph));

  let currentWords = baseParagraph.trim().split(/\s+/);

  // 3. If target word count requires more text (e.g. 60s or 120s test),
  // seamlessly stitch additional unseen paragraphs or procedural text
  if (currentWords.length < targetWordCount) {
    let remainingCurated = availableCurated.filter((_, idx) => idx !== chosenIndex);
    while (currentWords.length < targetWordCount && remainingCurated.length > 0) {
      const nextIdx = Math.floor(Math.random() * remainingCurated.length);
      const nextPara = remainingCurated.splice(nextIdx, 1)[0];
      recordRecentHash(computeSimpleHash(nextPara));
      baseParagraph += ' ' + nextPara;
      currentWords = baseParagraph.trim().split(/\s+/);
    }

    // If still need more words, synthesize procedural paragraph
    if (currentWords.length < targetWordCount) {
      const neededWords = targetWordCount - currentWords.length;
      const proceduralAddon = generateProceduralParagraph(difficulty, neededWords);
      baseParagraph += ' ' + proceduralAddon;
    }
  }

  return baseParagraph.trim();
}

/**
 * Returns a completely new collection of words for Words mode or drills,
 * guaranteeing clean paragraph structure and exactly `count` words.
 */
function getWordsCollection(category = 'words', difficulty = 'medium', count = 25) {
  if (category === 'numbers') {
    const nums = [];
    for (let i = 0; i < count; i++) {
      nums.push(String(Math.floor(Math.random() * 900) + 10));
    }
    return nums.join(' ');
  }

  if (category === 'quotes') {
    // Return a sliced completely new paragraph with exactly `count` words
    const freshParagraph = getRandomText('quotes', difficulty, count);
    const words = freshParagraph.trim().split(/\s+/);
    if (words.length >= count) {
      const result = words.slice(0, count).join(' ');
      recordRecentHash(computeSimpleHash(result));
      return result;
    }
    // If paragraph was shorter, append procedural words
    const addon = generateProceduralParagraph(difficulty, count - words.length);
    const combined = [...words, ...addon.trim().split(/\s+/)];
    const result = combined.slice(0, count).join(' ');
    recordRecentHash(computeSimpleHash(result));
    return result;
  }

  // Pure words mode (vocabulary drills)
  const cat = TEXT_DATABASE.words;
  const list = cat[difficulty] || cat.medium || TEXT_DATABASE.words.medium;
  const recents = getRecentHashes();

  // Fisher-Yates shuffle a cloned copy of the word pool
  const pool = [...list];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Draw words
  const selected = [];
  let poolIdx = 0;
  while (selected.length < count) {
    if (poolIdx >= pool.length) poolIdx = 0;
    selected.push(pool[poolIdx++]);
  }

  const resultStr = selected.join(' ');
  recordRecentHash(computeSimpleHash(resultStr.slice(0, 40)));
  return resultStr;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TEXT_DATABASE,
    PROCEDURAL_THEMES,
    generateProceduralParagraph,
    getRandomText,
    getWordsCollection,
    getRecentHashes,
    recordRecentHash
  };
}
