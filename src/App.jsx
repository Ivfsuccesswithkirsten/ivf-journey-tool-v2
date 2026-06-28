import React, { useState, useEffect, useRef } from 'react';
import { Heart, ChevronRight, Target, CheckCircle, Edit2, ChevronDown, BookOpen, TrendingUp, Search, Award, Users, LogOut } from 'lucide-react';

// ─── Access code ──────────────────────────────────────────────────────────────
const MASTER_ACCESS_CODE = 'embryo2025';

// ─── Design tokens (tracker) ──────────────────────────────────────────────────
const C = {
  cream: '#FAF7F2', terracotta: '#C4714A', plum: '#6B3F5E', plum2: '#502E47',
  sage: '#7A9E87', gold: '#D4A853', charcoal: '#2C2C2C', muted: '#8A8078', white: '#FFFFFF',
};

// ─── Stage-specific daily tasks ───────────────────────────────────────────────
const STAGE_TASKS = {
  preparing: [
    { id: 'coq10',    label: 'CoQ10 / Ubiquinol',      sub: '400–600mg with food',              icon: '💊', category: 'supplement' },
    { id: 'dhea',     label: 'DHEA',                    sub: '25–75mg (if low AMH)',              icon: '💊', category: 'supplement' },
    { id: 'vitD',     label: 'Vitamin D3',              sub: '2000–4000 IU',                     icon: '☀️', category: 'supplement' },
    { id: 'omega',    label: 'Omega-3',                 sub: '2–3g EPA/DHA',                     icon: '🐟', category: 'supplement' },
    { id: 'prenatal', label: 'Prenatal Multivitamin',   sub: 'With methylfolate',                icon: '🌿', category: 'supplement' },
    { id: 'water',    label: 'Water intake',            sub: '2–2.5 litres',                     icon: '💧', category: 'lifestyle'  },
    { id: 'protein',  label: 'Protein-rich meal',       sub: '30g+ protein today',               icon: '🥚', category: 'nutrition'  },
    { id: 'movement', label: 'Gentle movement',         sub: '30 min walk / yoga',               icon: '🚶‍♀️', category: 'lifestyle'  },
    { id: 'sleep',    label: '8 hours sleep',           sub: 'Lights out by 10pm',               icon: '🌙', category: 'lifestyle'  },
    { id: 'stress',   label: 'Stress relief practice',  sub: 'Meditation / breathwork',          icon: '🧘‍♀️', category: 'mindset'   },
    { id: 'antiox',   label: 'Antioxidant-rich veg',    sub: '5+ portions',                      icon: '🥦', category: 'nutrition'  },
    { id: 'alcohol',  label: 'Alcohol-free day',        sub: 'Zero alcohol',                     icon: '🚫', category: 'lifestyle'  },
  ],
  stimulation: [
    { id: 'prenatal', label: 'Prenatal Multivitamin',   sub: 'With methylfolate',                icon: '🌿', category: 'supplement' },
    { id: 'coq10',    label: 'CoQ10 / Ubiquinol',      sub: '400mg with food',                  icon: '💊', category: 'supplement' },
    { id: 'meds',     label: 'All medications taken',   sub: 'At correct times',                 icon: '⏰', category: 'supplement' },
    { id: 'water',    label: 'Water intake',            sub: '2.5–3 litres (extra important)',   icon: '💧', category: 'lifestyle'  },
    { id: 'protein',  label: 'High-protein meals',      sub: 'Eggs, fish, legumes',              icon: '🥚', category: 'nutrition'  },
    { id: 'rest',     label: 'Extra rest today',        sub: 'Your body is working hard',        icon: '🛋️', category: 'lifestyle'  },
    { id: 'caffeine', label: 'Low caffeine',            sub: 'Max 1 coffee / tea',               icon: '☕', category: 'lifestyle'  },
    { id: 'stress',   label: 'Stress relief practice',  sub: 'Meditation / gentle breathwork',  icon: '🧘‍♀️', category: 'mindset'   },
    { id: 'antiox',   label: 'Antioxidant foods',       sub: 'Berries, leafy greens',            icon: '🫐', category: 'nutrition'  },
    { id: 'alcohol',  label: 'Alcohol-free day',        sub: 'Zero alcohol',                     icon: '🚫', category: 'lifestyle'  },
  ],
  transfer: [
    { id: 'prenatal', label: 'Prenatal Multivitamin',   sub: 'With methylfolate',                icon: '🌿', category: 'supplement' },
    { id: 'vitD',     label: 'Vitamin D3',              sub: 'Continue protocol',                icon: '☀️', category: 'supplement' },
    { id: 'omega',    label: 'Omega-3',                 sub: 'Supports implantation',            icon: '🐟', category: 'supplement' },
    { id: 'meds',     label: 'All medications taken',   sub: 'Progesterone at exact time',       icon: '⏰', category: 'supplement' },
    { id: 'water',    label: 'Water intake',            sub: '2.5 litres minimum',               icon: '💧', category: 'lifestyle'  },
    { id: 'warmth',   label: 'Keep warm',               sub: 'Warm socks, no cold belly',        icon: '🧦', category: 'lifestyle'  },
    { id: 'protein',  label: 'Protein with every meal', sub: 'Eggs, legumes, fish',              icon: '🥚', category: 'nutrition'  },
    { id: 'pineapple',label: 'Pineapple core',          sub: 'Days 1–5 post transfer (bromelain)',icon: '🍍', category: 'nutrition'  },
    { id: 'rest',     label: 'Rest (not bed rest)',      sub: 'Light activity only',              icon: '🛋️', category: 'lifestyle'  },
    { id: 'stress',   label: 'Mindfulness',             sub: '10-min guided meditation',         icon: '🧘‍♀️', category: 'mindset'   },
    { id: 'affirm',   label: 'Positive affirmation',    sub: 'Connect with your body',           icon: '💛', category: 'mindset'   },
    { id: 'alcohol',  label: 'Alcohol-free day',        sub: 'Zero alcohol',                     icon: '🚫', category: 'lifestyle'  },
  ],
  between: [
    { id: 'coq10',    label: 'CoQ10 / Ubiquinol',      sub: '400–600mg — keep going',           icon: '💊', category: 'supplement' },
    { id: 'prenatal', label: 'Prenatal Multivitamin',   sub: 'With methylfolate',                icon: '🌿', category: 'supplement' },
    { id: 'vitD',     label: 'Vitamin D3',              sub: '2000–4000 IU',                     icon: '☀️', category: 'supplement' },
    { id: 'water',    label: 'Water intake',            sub: '2–2.5 litres',                     icon: '💧', category: 'lifestyle'  },
    { id: 'movement', label: 'Movement today',          sub: 'Walk, swim, yoga',                 icon: '🚶‍♀️', category: 'lifestyle'  },
    { id: 'protein',  label: 'Protein-rich meals',      sub: 'Rebuild and nourish',              icon: '🥚', category: 'nutrition'  },
    { id: 'stress',   label: 'Stress relief practice',  sub: 'You deserve recovery time',        icon: '🧘‍♀️', category: 'mindset'   },
    { id: 'sleep',    label: 'Quality sleep',           sub: '8 hours priority',                 icon: '🌙', category: 'lifestyle'  },
    { id: 'antiox',   label: 'Antioxidant foods',       sub: 'Colour on your plate',             icon: '🥦', category: 'nutrition'  },
    { id: 'alcohol',  label: 'Alcohol-free day',        sub: 'Reset and recover',               icon: '🚫', category: 'lifestyle'  },
  ],
};

const CAT_COLORS = {
  supplement: { bg: '#FDF0EA', border: '#C4714A', dot: '#C4714A', label: 'Supplement' },
  lifestyle:  { bg: '#EDF4F0', border: '#7A9E87', dot: '#7A9E87', label: 'Lifestyle'  },
  nutrition:  { bg: '#FDF8EE', border: '#D4A853', dot: '#D4A853', label: 'Nutrition'  },
  mindset:    { bg: '#F3EEF7', border: '#6B3F5E', dot: '#6B3F5E', label: 'Mindset'    },
};

const MILESTONES = [
  { days: 3,  icon: '🌱', label: '3-Day Seed',      msg: 'You planted the seed. Keep going.' },
  { days: 7,  icon: '⭐', label: '1-Week Star',      msg: 'A full week. Your body is responding.' },
  { days: 14, icon: '🔥', label: '2-Week Warrior',   msg: '14 days consistent. Real change is happening.' },
  { days: 21, icon: '💎', label: '21-Day Diamond',   msg: 'Habits are forming at a cellular level.' },
  { days: 30, icon: '👑', label: '30-Day Queen',     msg: '30 days in. You are building the foundation.' },
  { days: 60, icon: '🌟', label: '60-Day Legend',    msg: 'Two months strong. Peak supplement benefit begins.' },
  { days: 90, icon: '🏆', label: '90-Day Champion',  msg: 'The full egg maturation cycle. This is it.' },
];

const STAGE_LABELS = {
  preparing:   'Preparing for Retrieval',
  stimulation: 'Stimulation Phase',
  transfer:    'Transfer Prep / TWW',
  between:     'Between Cycles',
};

function getTodayKey() { return new Date().toISOString().slice(0, 10); }

// ─── Community data ───────────────────────────────────────────────────────────
const getCommunityData = (bottleneck) => {
  const map = {
    notYet: {
      count: 203, successRate: 71,
      topActions: [
        { action: 'Started CoQ10 90+ days before retrieval', pct: 89 },
        { action: 'Reduced alcohol completely', pct: 84 },
        { action: 'Added protein to every meal', pct: 78 },
        { action: 'Improved sleep to 8 hours', pct: 73 },
      ],
      stories: [
        { text: 'Changed my diet and supplements 3 months before. Got 6 eggs, 4 fertilised, 2 blastocysts. Never expected that from my AMH.', stage: 'First cycle prep, low AMH' },
        { text: 'Focused on the 90 days. Felt more in control than ever before going in.', stage: 'Preparing, unexplained' },
      ],
    },
    poorFertilisation: {
      count: 127, successRate: 58,
      topActions: [
        { action: 'Partner added antioxidants (zinc, selenium, CoQ10)', pct: 91 },
        { action: 'Reduced oxidative stress — no alcohol, no processed food', pct: 83 },
        { action: 'Added DHEA (under clinic guidance)', pct: 67 },
        { action: 'Switched to ICSI in next cycle', pct: 61 },
      ],
      stories: [
        { text: 'First cycle: 2/9 fertilised. Partner started CoQ10, zinc, vitamin C. Second cycle: 6/8 fertilised. His numbers were the key.', stage: 'Poor fertilisation, male factor' },
        { text: 'Clinic recommended ICSI and we got much better results. Wish we had done it sooner.', stage: 'Poor fertilisation, unexplained' },
      ],
    },
    earlyArrest: {
      count: 94, successRate: 62,
      topActions: [
        { action: 'Sperm DNA fragmentation testing done', pct: 78 },
        { action: 'Extended culture to Day 5/6', pct: 74 },
        { action: 'Both partners on antioxidant protocol', pct: 88 },
        { action: 'Improved blood sugar and metabolic health', pct: 65 },
      ],
      stories: [
        { text: '3 cycles of arrest. Got DFI testing — 42%. Partner did a 3-month protocol. Next cycle: 2 blastocysts. One is now 18 months old.', stage: 'Early arrest, sperm factor' },
        { text: 'Extended culture was the shift. Embryos that looked poor at Day 3 became good blasts by Day 5.', stage: 'Day 3 arrest, unknown cause' },
      ],
    },
    fewBlasts: {
      count: 112, successRate: 64,
      topActions: [
        { action: 'CoQ10 400–600mg for 90+ days', pct: 93 },
        { action: 'Mitochondrial support (L-carnitine)', pct: 71 },
        { action: 'Melatonin added (clinic-guided)', pct: 58 },
        { action: 'Reduced strenuous exercise during stims', pct: 69 },
      ],
      stories: [
        { text: 'Went from 1 blast in 3 cycles to 3 blasts in one cycle after doing the full protocol for 90 days.', stage: 'Low blastocyst rate, low AMH' },
        { text: 'Less is more with exercise during stims. That plus CoQ10 made a real difference for us.', stage: 'Few blasts, endometriosis' },
      ],
    },
    failedImplantation: {
      count: 156, successRate: 55,
      topActions: [
        { action: 'ERA (Endometrial Receptivity Array) testing', pct: 68 },
        { action: 'Vitamin D levels optimised before transfer', pct: 82 },
        { action: 'Progesterone protocol reviewed', pct: 74 },
        { action: 'Anti-inflammatory diet strictly followed', pct: 77 },
      ],
      stories: [
        { text: 'Three failed transfers with good embryos. ERA showed I was post-receptive. Timing adjustment on round 4 — success.', stage: 'Repeated implantation failure' },
        { text: 'Vitamin D was 28 — severely deficient. Got to 75 before next transfer. That was it.', stage: 'Failed implantation, deficiency found' },
      ],
    },
  };
  return map[bottleneck] || map.notYet;
};

// ─── FAQs ─────────────────────────────────────────────────────────────────────
const faqs = [
  { q: 'When should I start taking CoQ10?', a: 'Ideally 90 days before your egg collection. This is the full maturation cycle of an egg. Starting earlier is always better — even a few weeks of supplementation is beneficial.' },
  { q: 'What form of CoQ10 is best?', a: 'Ubiquinol is the active, reduced form and is significantly more bioavailable than ubiquinone, particularly in women over 35. Look for brands that certify ubiquinol content.' },
  { q: 'How much CoQ10 should I take?', a: 'Most fertility research uses 400–600mg daily. Some protocols for poor responders use up to 800mg. Always discuss dosage with your clinic before changing anything.' },
  { q: 'Does DHEA help with low AMH?', a: 'There is promising evidence that DHEA supplementation (25–75mg daily) for 3 months prior to retrieval can improve response in low responders. This should only be done under clinic supervision.' },
  { q: 'What should my partner be taking?', a: 'A good male fertility protocol includes CoQ10 (200–400mg), Zinc (25–30mg), Selenium (55–100mcg), Vitamin C (1000mg), Vitamin E (400 IU), and Omega-3. Allow 74 days minimum — one full sperm cycle.' },
  { q: 'How important is diet really?', a: 'Diet affects mitochondrial function, inflammation levels, oxidative stress, and hormonal balance — all of which directly impact egg and embryo quality. A Mediterranean-style diet has the strongest evidence base for IVF outcomes.' },
  { q: 'Can I exercise during IVF?', a: 'During preparation: yes, moderate exercise is beneficial. During stimulation: light movement only (walking, gentle yoga). Avoid high-intensity training, heat, and inversions. During TWW: rest, gentle walking only.' },
  { q: 'Does stress affect IVF outcomes?', a: 'Chronic stress elevates cortisol, which can interfere with reproductive hormones. Focus on manageable daily stress reduction rather than worrying about stress itself.' },
  { q: 'What is sperm DNA fragmentation?', a: 'DFI (DNA Fragmentation Index) measures damage to sperm DNA. A normal semen analysis does not test this. High DFI (>25%) is linked to poor fertilisation and early embryo arrest.' },
  { q: 'Why do embryos arrest before blastocyst?', a: 'Arrest before Day 5 can be caused by poor mitochondrial energy, oxidative stress, chromosomal abnormalities, or sperm DNA fragmentation. The arrest pattern (Day 2, 3, 4) can give clues about the underlying cause.' },
  { q: 'What is an ERA test and do I need one?', a: 'The ERA (Endometrial Receptivity Array) tests whether your uterine lining is receptive at the time of transfer. Typically recommended after 2+ failed transfers with good-quality embryos.' },
  { q: 'How do I optimise my vitamin D level?', a: 'Target serum level of 50–80 nmol/L before transfer. Get tested. Most people need 2000–4000 IU daily. Retest after 8–12 weeks of supplementation.' },
];

// ─── Analysis + supplement logic ──────────────────────────────────────────────
const getAnalysis = (data) => {
  const analyses = {
    notYet:             { bottleneck: 'Pre-Cycle Optimisation',   priority: 'Your opportunity is now — 90 days of preparation can meaningfully change what happens in your retrieval. This is the most powerful window.' },
    poorFertilisation:  { bottleneck: 'Fertilisation Rate',       priority: 'The fertilisation stage is your key focus. Sperm quality is often the hidden factor — both partners\' preparation matters equally here.' },
    earlyArrest:        { bottleneck: 'Early Embryo Development', priority: 'Embryos are forming but stalling. Mitochondrial energy, oxidative stress, and sperm DNA integrity are the three areas to investigate.' },
    fewBlasts:          { bottleneck: 'Blastocyst Conversion',    priority: 'Embryos are starting but not completing development to Day 5. Mitochondrial support and energy availability are your primary focus.' },
    failedImplantation: { bottleneck: 'Implantation',             priority: 'Good embryos exist but aren\'t implanting. Uterine receptivity, timing, and immune factors are where to direct your next clinic conversation.' },
  };
  const base = analyses[data.embryoOutcome] || analyses.notYet;
  const extras = [];
  if (data.knownFactors.includes('pcos')) extras.push('PCOS: Inositol (myo-inositol 4g/day) and blood sugar management are specifically relevant for you.');
  if (data.knownFactors.includes('endometriosis')) extras.push('Endometriosis: Anti-inflammatory focus is critical. Prioritise Omega-3, curcumin, and reducing pro-inflammatory foods.');
  if (data.knownFactors.includes('lowAmh')) extras.push('Low AMH: DHEA (clinic-guided) and aggressive mitochondrial support (CoQ10 600mg+) are your priority supplements.');
  if (data.knownFactors.includes('autoimmune')) extras.push('Autoimmune factors: Vitamin D optimisation and anti-inflammatory protocol are particularly important for you.');
  return { ...base, extras };
};

const getSupplements = (data) => {
  const hers = [
    { name: 'CoQ10 (Ubiquinol)', dose: '400–600mg', timing: 'With breakfast', why: 'Mitochondrial energy for egg quality' },
    { name: 'Prenatal Multivitamin', dose: '1 daily (with methylfolate)', timing: 'With food', why: 'Foundation micronutrients' },
    { name: 'Vitamin D3', dose: '2000–4000 IU', timing: 'With fatty meal', why: 'Implantation and immune support' },
    { name: 'Omega-3 (EPA/DHA)', dose: '2–3g daily', timing: 'With meals', why: 'Anti-inflammatory, supports embryo development' },
  ];
  if (data.knownFactors.includes('pcos')) hers.push({ name: 'Myo-Inositol', dose: '4g daily', timing: 'Split AM/PM', why: 'PCOS-specific: insulin sensitivity and egg quality' });
  if (data.knownFactors.includes('endometriosis')) hers.push({ name: 'Curcumin', dose: '500mg (with black pepper)', timing: 'With food', why: 'Anti-inflammatory support for endometriosis' });
  if (data.knownFactors.includes('lowAmh')) hers.push({ name: 'DHEA', dose: '25–50mg (clinic guidance required)', timing: 'Morning', why: 'Low AMH: may improve response in poor responders' });
  if (data.previousPregnancies.includes('miscarriage')) hers.push({ name: 'Vitamin B6 (P5P form)', dose: '50–100mg', timing: 'With food', why: 'Progesterone support, relevant with miscarriage history' });
  if (['earlyArrest','fewBlasts'].includes(data.embryoOutcome)) hers.push({ name: 'L-Carnitine', dose: '2–3g daily', timing: 'Before meals', why: 'Mitochondrial support for embryo development' });
  const his = [
    { name: 'CoQ10', dose: '200–400mg', timing: 'With food', why: 'Sperm mitochondrial energy and motility' },
    { name: 'Zinc', dose: '25–30mg', timing: 'With food', why: 'Sperm production and DNA integrity' },
    { name: 'Selenium', dose: '55–100mcg', timing: 'Daily', why: 'Antioxidant protection for sperm' },
    { name: 'Vitamin C', dose: '1000mg', timing: 'Daily', why: 'Reduces oxidative damage to sperm DNA' },
  ];
  return { hers, his };
};

// ─── Small reusable components ────────────────────────────────────────────────
function MedicalDisclaimer() {
  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-xs text-gray-500 text-center">
        This tool is for informational and support purposes only. It is not medical advice. Always consult your fertility clinic before starting, stopping or changing any supplement or treatment.
      </p>
    </div>
  );
}

const FocusSection = ({ title, color, items }) => {
  const [expanded, setExpanded] = useState({});
  const tc = color === 'rose' ? 'text-rose-600' : color === 'purple' ? 'text-purple-600' : 'text-blue-600';
  return (
    <div className="border-l-4 border-gray-300 pl-4">
      <h3 className={`font-medium ${tc} mb-3`}>{title}</h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setExpanded(p => ({ ...p, [i]: !p[i] }))} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left">
              <span className="text-sm text-gray-700 font-medium">{item.label}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded[i] ? 'rotate-180' : ''}`} />
            </button>
            {expanded[i] && <div className="p-3 bg-gray-50 border-t text-sm text-gray-600 leading-relaxed">{item.detail}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Tracker sub-components ───────────────────────────────────────────────────
function Confetti({ active }) {
  if (!active) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute', width: 10, height: 10, borderRadius: i % 3 === 0 ? '50%' : 2,
          backgroundColor: [C.terracotta, C.gold, C.plum, C.sage, '#E8A87C'][i % 5],
          left: `${5 + (i * 4.1) % 90}%`, top: '-10px',
          animation: `cfFall ${1.2 + (i % 3) * 0.4}s ease-in forwards`,
          animationDelay: `${(i % 5) * 0.08}s`,
        }} />
      ))}
      <style>{`@keyframes cfFall { to { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`}</style>
    </div>
  );
}

function MilestoneToast({ milestone, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
      backgroundColor: C.charcoal, color: C.white, borderRadius: 20, padding: '16px 24px',
      display: 'flex', alignItems: 'center', gap: 14, zIndex: 1000, maxWidth: 340,
      boxShadow: '0 8px 32px rgba(0,0,0,0.35)', animation: 'slideUp 0.4s ease',
    }}>
      <span style={{ fontSize: 32 }}>{milestone.icon}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{milestone.label} Unlocked!</div>
        <div style={{ fontSize: 13, color: '#C8C0B8', marginTop: 3 }}>{milestone.msg}</div>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: 20, marginLeft: 4 }}>×</button>
      <style>{`@keyframes slideUp { from { transform: translateX(-50%) translateY(20px); opacity:0; } to { transform: translateX(-50%) translateY(0); opacity:1; } }`}</style>
    </div>
  );
}

function WaterTracker({ glasses, onSet }) {
  return (
    <div style={{ backgroundColor: '#EEF5FF', borderRadius: 16, padding: 16, border: '1.5px solid #BDD5F0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#2B5F8E' }}>💧 Water Tracker</span>
        <span style={{ fontSize: 13, color: '#5A8AB0' }}>{glasses}/8 glasses</span>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <button key={i} onClick={() => onSet(i < glasses ? i : i + 1)} style={{
            width: 38, height: 44, borderRadius: 10, border: 'none', cursor: 'pointer',
            backgroundColor: i < glasses ? '#4A9FD4' : '#C8DDEF', fontSize: 18,
            transition: 'all 0.15s ease', transform: i < glasses ? 'scale(1.05)' : 'scale(1)',
          }}>💧</button>
        ))}
      </div>
      {glasses >= 8 && <div style={{ marginTop: 10, fontSize: 12, color: '#2B7A4A', fontWeight: 600 }}>✅ Daily water goal complete!</div>}
    </div>
  );
}

const MOODS = ['😔','😐','🙂','😊','🌟'];
const MOOD_LABELS = ['Hard day','Okay','Good','Great','Amazing'];
function MoodTracker({ mood, onSet }) {
  return (
    <div style={{ backgroundColor: '#FDF0F8', borderRadius: 16, padding: 16, border: '1.5px solid #E8C4DC' }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.plum, marginBottom: 12 }}>🌸 How are you feeling today?</div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'space-around' }}>
        {MOODS.map((m, i) => (
          <button key={i} onClick={() => onSet(i)} style={{
            background: 'none', border: `2px solid ${mood === i ? C.plum : 'transparent'}`,
            borderRadius: 12, padding: '6px 8px', cursor: 'pointer', textAlign: 'center',
            backgroundColor: mood === i ? '#EFE4F5' : 'transparent', transition: 'all 0.2s',
          }}>
            <div style={{ fontSize: 22 }}>{m}</div>
            <div style={{ fontSize: 10, color: C.plum, marginTop: 2 }}>{MOOD_LABELS[i]}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, checked, onToggle, animating }) {
  const cat = CAT_COLORS[task.category];
  return (
    <div onClick={onToggle} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14,
      border: `1.5px solid ${checked ? cat.border : '#EAE5DF'}`,
      backgroundColor: checked ? cat.bg : C.white, cursor: 'pointer', transition: 'all 0.25s ease',
      transform: animating ? 'scale(1.02)' : 'scale(1)',
      boxShadow: checked ? `0 2px 12px ${cat.border}30` : '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 8,
        border: `2px solid ${checked ? cat.border : '#C8C0B8'}`,
        backgroundColor: checked ? cat.border : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s',
      }}>
        {checked && <svg width="13" height="10" viewBox="0 0 13 10" fill="none"><path d="M1 5L5 9L12 1" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{task.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: checked ? cat.dot : C.charcoal, textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.7 : 1 }}>{task.label}</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{task.sub}</div>
      </div>
      <span style={{ fontSize: 10, color: cat.dot, backgroundColor: cat.bg, border: `1px solid ${cat.border}40`, borderRadius: 20, padding: '2px 8px', flexShrink: 0, fontWeight: 600 }}>{cat.label}</span>
    </div>
  );
}

function WeekCalendar({ completionHistory }) {
  const today = getTodayKey();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    return { key, label: d.toLocaleDateString('en-GB', { weekday: 'short' }), pct: completionHistory[key] || 0 };
  });
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
      {days.map(d => {
        const filled = d.pct >= 80; const partial = d.pct >= 40 && !filled;
        return (
          <div key={d.key} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 6, textTransform: 'uppercase' }}>{d.label}</div>
            <div style={{
              height: 32, borderRadius: 8,
              backgroundColor: filled ? C.terracotta : partial ? '#E8A87C' : d.key === today ? '#EDE8E2' : '#F5F2EE',
              border: d.key === today ? `2px solid ${C.terracotta}` : '2px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>{filled ? '✓' : partial ? '·' : ''}</div>
            {d.pct > 0 && <div style={{ fontSize: 9, color: C.muted, marginTop: 4 }}>{d.pct}%</div>}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── Auth state ───────────────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // ── App flow ─────────────────────────────────────────────────────────────
  const [step, setStep] = useState('welcome');
  const [section, setSection] = useState(1);
  const [activeTab, setActiveTab] = useState('plan');

  // ── Profile data ─────────────────────────────────────────────────────────
  const [data, setData] = useState({
    age: '', cyclesCompleted: '0', previousPregnancies: [],
    currentStage: 'preparing', embryoOutcome: 'notYet', knownFactors: [],
    currentApproach: [], biggestFears: [], journalEntries: [],
  });

  // ── Daily tracker state ──────────────────────────────────────────────────
  const todayKey = getTodayKey();
  const [checked, setChecked] = useState(() => { try { return JSON.parse(localStorage.getItem(`ep_tracker_${todayKey}`) || '{}'); } catch { return {}; } });
  const [water, setWater] = useState(() => { try { return parseInt(localStorage.getItem(`ep_water_${todayKey}`) || '0'); } catch { return 0; } });
  const [mood, setMood] = useState(() => { try { const v = localStorage.getItem(`ep_mood_${todayKey}`); return v !== null ? parseInt(v) : null; } catch { return null; } });
  const [animating, setAnimating] = useState({});
  const [confetti, setConfetti] = useState(false);
  const [milestoneToast, setMilestoneToast] = useState(null);
  const [streak, setStreak] = useState(() => { try { return parseInt(localStorage.getItem('ep_streak') || '0'); } catch { return 0; } });
  const [totalDays, setTotalDays] = useState(() => { try { return parseInt(localStorage.getItem('ep_totaldays') || '0'); } catch { return 0; } });
  const [completionHistory, setCompletionHistory] = useState(() => { try { return JSON.parse(localStorage.getItem('ep_history') || '{}'); } catch { return {}; } });
  const prevPct = useRef(0);

  // ── Other UI state ───────────────────────────────────────────────────────
  const [questionSearch, setQuestionSearch] = useState('');
  const [journalText, setJournalText] = useState('');

  // ── Persist profile + app state ──────────────────────────────────────────
  useEffect(() => {
    if (!userEmail) return;
    try { localStorage.setItem(`ivf_journey_${userEmail}`, JSON.stringify({ data, step, section, activeTab, lastUpdated: new Date().toISOString() })); }
    catch (e) {}
  }, [data, step, section, activeTab, userEmail]);

  const loadUserData = (email) => {
    try {
      const saved = localStorage.getItem(`ivf_journey_${email}`);
      if (saved) { const p = JSON.parse(saved); if (p.data) setData(p.data); if (p.step) setStep(p.step); if (p.section) setSection(p.section); if (p.activeTab) setActiveTab(p.activeTab); }
    } catch (e) {}
  };

  // ── Tracker effects ──────────────────────────────────────────────────────
  const tasks = STAGE_TASKS[data.currentStage] || STAGE_TASKS.preparing;
  const completedCount = tasks.filter(t => checked[t.id]).length;
  const completionPct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  useEffect(() => {
    localStorage.setItem(`ep_tracker_${todayKey}`, JSON.stringify(checked));
    if (!tasks.length) return;
    const pct = Math.round((tasks.filter(t => checked[t.id]).length / tasks.length) * 100);
    const newHistory = { ...completionHistory, [todayKey]: pct };
    setCompletionHistory(newHistory);
    localStorage.setItem('ep_history', JSON.stringify(newHistory));
    if (pct >= 80 && prevPct.current < 80) {
      const ns = streak + 1; const nt = totalDays + 1;
      setStreak(ns); setTotalDays(nt);
      localStorage.setItem('ep_streak', String(ns));
      localStorage.setItem('ep_totaldays', String(nt));
      setConfetti(true); setTimeout(() => setConfetti(false), 3000);
      const exact = MILESTONES.find(m => ns === m.days);
      if (exact) setMilestoneToast(exact);
    }
    prevPct.current = pct;
  }, [checked]);

  useEffect(() => { localStorage.setItem(`ep_water_${todayKey}`, String(water)); }, [water]);
  useEffect(() => { if (mood !== null) localStorage.setItem(`ep_mood_${todayKey}`, String(mood)); }, [mood]);

  const toggleTask = (id) => {
    setAnimating(a => ({ ...a, [id]: true }));
    setTimeout(() => setAnimating(a => ({ ...a, [id]: false })), 300);
    setChecked(c => ({ ...c, [id]: !c[id] }));
  };

  // ── Auth handlers ────────────────────────────────────────────────────────
  const handleLogin = (e) => {
    e.preventDefault();
    const email = emailInput.trim().toLowerCase();
    const code = accessCodeInput.trim();
    if (!email || !code) { setLoginError('Please enter both email and access code'); return; }
    if (!email.includes('@')) { setLoginError('Please enter a valid email address'); return; }
    if (code === MASTER_ACCESS_CODE) {
      setIsAuthenticated(true); setUserEmail(email); setLoginError('');
      setEmailInput(''); setAccessCodeInput(''); loadUserData(email);
    } else {
      setLoginError('Incorrect access code. Please check your purchase confirmation email.');
      setAccessCodeInput('');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Log out? Your data is saved and will be here when you return.')) {
      setIsAuthenticated(false); setUserEmail(''); setStep('welcome'); setSection(1); setActiveTab('plan');
    }
  };

  // ── Login ────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h1 className="text-2xl font-light text-gray-800 mb-2">The Embryo Protocol</h1>
            <p className="text-gray-500 text-sm">Your private IVF support space — available whenever you need it.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access code</label>
              <input type="password" value={accessCodeInput} onChange={e => setAccessCodeInput(e.target.value)} placeholder="From your purchase confirmation" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none" />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-medium transition-colors">Access Your Protocol →</button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-6">Your data is stored privately on your device</p>
        </div>
      </div>
    );
  }

  // ── Welcome ──────────────────────────────────────────────────────────────
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg text-center">
          <Heart className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h1 className="text-2xl font-light text-gray-800 mb-3">Welcome to The Embryo Protocol</h1>
          <p className="text-gray-600 mb-2">You're doing the best you can — and that's enough for today.</p>
          <p className="text-gray-500 text-sm mb-8">We'll start with a short personalisation so your plan reflects your exact situation — not generic advice.</p>
          <button onClick={() => setStep('assessment')} className="w-full bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
            Build My Protocol <ChevronRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-gray-400 mt-4">Takes about 2 minutes</p>
        </div>
      </div>
    );
  }

  // ── Assessment ───────────────────────────────────────────────────────────
  const assessmentSections = [
    {
      title: 'About Your Journey',
      fields: [
        { label: 'Your age', key: 'age', type: 'select', options: ['Under 30','30–34','35–37','38–40','41–43','44+'] },
        { label: 'IVF cycles completed', key: 'cyclesCompleted', type: 'select', options: ['0 (first cycle)','1','2','3','4','5+'] },
        { label: 'Previous pregnancies', key: 'previousPregnancies', type: 'multi', options: [{ v:'chemical',l:'Chemical pregnancy' },{ v:'miscarriage',l:'Miscarriage' },{ v:'liveBirth',l:'Live birth' },{ v:'none',l:'None' }] },
        { label: 'Current stage', key: 'currentStage', type: 'select', options: [{ v:'preparing',l:'Preparing for egg collection' },{ v:'stimulation',l:'Currently stimulating' },{ v:'transfer',l:'Preparing for transfer / TWW' },{ v:'between',l:'Between cycles' }] },
      ]
    },
    {
      title: 'Your Embryo Journey',
      fields: [
        { label: 'What happened with your embryos?', key: 'embryoOutcome', type: 'select', options: [{ v:'notYet',l:'Not yet started / preparing' },{ v:'poorFertilisation',l:'Poor fertilisation rate' },{ v:'earlyArrest',l:'Embryos arrested early (Day 2–4)' },{ v:'fewBlasts',l:'Few made it to blastocyst' },{ v:'failedImplantation',l:'Good embryos — failed implantation' }] },
        { label: 'Known factors', key: 'knownFactors', type: 'multi', options: [{ v:'pcos',l:'PCOS' },{ v:'endometriosis',l:'Endometriosis' },{ v:'lowAmh',l:'Low AMH' },{ v:'autoimmune',l:'Autoimmune / immune factors' },{ v:'maleFactor',l:'Male factor' },{ v:'thyroid',l:'Thyroid issues' },{ v:'unexplained',l:'Unexplained' }] },
      ]
    },
    {
      title: 'Right Now',
      fields: [
        { label: 'What are you already doing?', key: 'currentApproach', type: 'multi', options: [{ v:'supplements',l:'Taking supplements' },{ v:'diet',l:'Dietary changes' },{ v:'exercise',l:'Exercise routine' },{ v:'stress',l:'Stress management' },{ v:'acupuncture',l:'Acupuncture' },{ v:'nothing',l:'Just getting started' }] },
        { label: 'What worries you most?', key: 'biggestFears', type: 'multi', options: [{ v:'eggQuality',l:'Egg quality' },{ v:'notEnoughEggs',l:'Not getting enough eggs' },{ v:'fertilisation',l:'Fertilisation failing' },{ v:'embryoArrest',l:'Embryos arresting' },{ v:'implantation',l:'Implantation failing' },{ v:'timeRunningOut',l:'Time running out' }] },
      ]
    },
  ];

  const updateField = (key, value) => setData(p => {
    const d = { ...p };
    if (Array.isArray(d[key])) d[key] = d[key].includes(value) ? d[key].filter(v => v !== value) : [...d[key], value];
    else d[key] = value;
    return d;
  });

  if (step === 'assessment') {
    const sec = assessmentSections[section - 1];
    const complete = sec.fields.every(f => { const v = data[f.key]; return f.type === 'multi' ? v.length > 0 : !!v; });
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 p-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-rose-400" />
            <span className="text-sm text-gray-500">Step {section} of {assessmentSections.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
            <div className="bg-rose-400 h-1.5 rounded-full transition-all" style={{ width: `${(section / assessmentSections.length) * 100}%` }} />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-xl font-medium text-gray-800 mb-6">{sec.title}</h2>
            <div className="space-y-6">
              {sec.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                  {field.type === 'select' && (
                    <select value={data[field.key]} onChange={e => updateField(field.key, e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none">
                      <option value="">Select...</option>
                      {field.options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  )}
                  {field.type === 'multi' && (
                    <div className="grid grid-cols-2 gap-2">
                      {field.options.map(o => {
                        const val = typeof o === 'string' ? o : o.v;
                        const label = typeof o === 'string' ? o : o.l;
                        const sel = data[field.key].includes(val);
                        return <button key={val} onClick={() => updateField(field.key, val)} className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors text-left ${sel ? 'bg-rose-50 border-rose-400 text-rose-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>{sel ? '✓ ' : ''}{label}</button>;
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              {section > 1 && <button onClick={() => setSection(s => s - 1)} className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50">Back</button>}
              {section < assessmentSections.length
                ? <button onClick={() => setSection(s => s + 1)} disabled={!complete} className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">Continue <ChevronRight className="w-5 h-5" /></button>
                : <button onClick={() => setStep('dashboard')} disabled={!complete} className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-medium transition-colors">View My Protocol</button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  const analysis = getAnalysis(data);
  const supplements = getSupplements(data);
  const communityData = getCommunityData(data.embryoOutcome);

  const TABS = [
    { id: 'plan',      Icon: Target,      label: 'Your Plan'  },
    { id: 'today',     Icon: CheckCircle, label: 'Today'      },
    { id: 'progress',  Icon: TrendingUp,  label: 'Progress'   },
    { id: 'answers',   Icon: Search,      label: 'Answers'    },
    { id: 'journal',   Icon: BookOpen,    label: 'Journal'    },
    { id: 'community', Icon: Users,       label: 'Community'  },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <Confetti active={confetti} />
      {milestoneToast && <MilestoneToast milestone={milestoneToast} onClose={() => setMilestoneToast(null)} />}

      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-rose-400" />
            <h1 className="text-xl font-light text-gray-800">The Embryo Protocol</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => { setStep('assessment'); setSection(1); }} className="text-sm text-rose-600 hover:text-rose-700 flex items-center gap-1"><Edit2 className="w-4 h-4" /> Update</button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"><LogOut className="w-4 h-4" /> Log Out</button>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex overflow-x-auto px-2">
          {TABS.map(({ id, Icon, label }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-1.5 px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors text-sm ${activeTab === id ? 'border-rose-400 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* ══ YOUR PLAN ══════════════════════════════════════════════════════ */}
        {activeTab === 'plan' && (
          <>
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h2 className="text-2xl font-light text-gray-800 mb-1">Your Personalised Plan</h2>
              <p className="text-gray-500 text-sm mb-6">Based on your IVF journey, not generic advice.</p>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6">
                <p className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">Your Primary Bottleneck</p>
                <p className="text-xl font-medium text-purple-800 mb-3">{analysis.bottleneck}</p>
                <p className="text-gray-600">{analysis.priority}</p>
              </div>
              {analysis.extras.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h3 className="font-medium text-gray-800">Specific to your situation</h3>
                  {analysis.extras.map((e, i) => <div key={i} className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-sm text-gray-700">{e}</div>)}
                </div>
              )}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Your Top 3 Priorities</h3>
                {[
                  { n: 1, t: 'Mitochondrial Support', d: '90-day CoQ10 protocol at therapeutic dose' },
                  { n: 2, t: 'Reduce Oxidative Stress', d: 'Diet, lifestyle, and targeted antioxidants' },
                  { n: 3, t: 'Address Your Bottleneck', d: analysis.bottleneck + ' — targeted supplement protocol' },
                ].map(p => (
                  <div key={p.n} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold flex-shrink-0">{p.n}</div>
                    <div><p className="font-medium text-gray-800">{p.t}</p><p className="text-sm text-gray-600">{p.d}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h2 className="text-2xl font-light mb-2">Your Supplement Protocol</h2>
              <p className="text-sm text-gray-500 mb-6">Supplements are supportive, not magic — consistency is everything.</p>
              <h3 className="font-medium text-gray-700 mb-3">For you</h3>
              <div className="space-y-3 mb-6">
                {supplements.hers.map((s, i) => <div key={i} className="p-4 bg-rose-50 rounded-lg"><p className="font-medium text-gray-800">{s.name}</p><p className="text-sm text-gray-600">{s.dose} · {s.timing}</p><p className="text-xs text-gray-500 mt-1">{s.why}</p></div>)}
              </div>
              <h3 className="font-medium text-gray-700 mb-3">For your partner</h3>
              <div className="space-y-3">
                {supplements.his.map((s, i) => <div key={i} className="p-4 bg-blue-50 rounded-lg"><p className="font-medium text-gray-800">{s.name}</p><p className="text-sm text-gray-600">{s.dose} · {s.timing}</p><p className="text-xs text-gray-500 mt-1">{s.why}</p></div>)}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">
              <h2 className="text-2xl font-light mb-2">Focus Areas</h2>
              <FocusSection title="Nutrition" color="rose" items={[
                { label: 'Mediterranean-style diet', detail: 'Prioritise vegetables, legumes, fish, olive oil, nuts and seeds. High in antioxidants and anti-inflammatory foods. Evidence shows improved IVF outcomes.' },
                { label: 'Protein with every meal', detail: 'Aim for 25–30g protein per meal from eggs, fish, legumes, or quality meat. Protein provides the amino acid building blocks for egg and embryo development.' },
                { label: 'Avoid ultra-processed foods', detail: 'Eliminate trans fats, excessive sugar, and seed oils. These increase systemic inflammation which directly affects reproductive health.' },
              ]} />
              <FocusSection title="Lifestyle" color="purple" items={[
                { label: 'Sleep 8 hours minimum', detail: 'Sleep is when cellular repair happens. Melatonin produced during sleep is a powerful antioxidant that reaches follicular fluid directly.' },
                { label: 'Movement — not intense exercise', detail: 'Gentle, regular movement supports blood flow to ovaries and reduces cortisol. Avoid high-intensity training during stimulation and TWW.' },
                { label: 'Eliminate alcohol', detail: 'Even moderate alcohol consumption increases oxidative stress and affects hormonal balance. The evidence for abstinence during IVF preparation is strong.' },
              ]} />
              <FocusSection title="Stress Management" color="blue" items={[
                { label: 'Daily stress reduction practice', detail: 'Chronic cortisol suppresses reproductive hormones. Even 10 minutes of breathwork, meditation, or gentle yoga daily reduces cortisol measurably.' },
                { label: 'Set information boundaries', detail: 'Constant research increases anxiety without improving outcomes. Designate one time per day for IVF-related reading, then close it.' },
                { label: 'Community over isolation', detail: 'IVF can be isolating. Connecting with others in the same situation reduces the psychological burden significantly.' },
              ]} />
            </div>
            <MedicalDisclaimer />
          </>
        )}

        {/* ══ TODAY ══════════════════════════════════════════════════════════ */}
        {activeTab === 'today' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Stage header */}
            <div style={{ background: `linear-gradient(135deg, ${C.plum2} 0%, ${C.plum} 60%, ${C.terracotta} 100%)`, borderRadius: 20, padding: '20px 20px 16px', color: C.white }}>
              <div style={{ fontSize: 11, opacity: 0.75, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>Daily Tracker</div>
              <div style={{ fontSize: 18, fontFamily: 'Georgia, serif', marginBottom: 12 }}>{STAGE_LABELS[data.currentStage]}</div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 100, height: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${completionPct}%`, backgroundColor: C.gold, borderRadius: 100, transition: 'width 0.5s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, opacity: 0.85 }}>
                <span>{completedCount} of {tasks.length} done today</span>
                <span>{completionPct}%</span>
              </div>
            </div>

            {/* Streak card */}
            <div style={{ backgroundColor: C.white, borderRadius: 20, padding: 20, border: '1.5px solid #EAE5DF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 26 }}>{streak >= 30 ? '🔥🔥' : streak >= 14 ? '🔥' : streak >= 7 ? '✨' : '🌱'}</span>
                <div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: streak >= 7 ? C.terracotta : C.charcoal, fontFamily: 'Georgia, serif', lineHeight: 1 }}>{streak}</div>
                  <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase' }}>day streak</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: C.muted }}>Total days</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: C.plum, fontFamily: 'Georgia, serif' }}>{totalDays}</div>
              </div>
            </div>

            <WaterTracker glasses={water} onSet={setWater} />
            <MoodTracker mood={mood} onSet={setMood} />

            {/* Tasks grouped by category */}
            {['supplement','nutrition','lifestyle','mindset'].map(cat => {
              const catTasks = tasks.filter(t => t.category === cat);
              if (!catTasks.length) return null;
              const col = CAT_COLORS[cat];
              const catDone = catTasks.filter(t => checked[t.id]).length;
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: col.dot }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: col.dot, textTransform: 'uppercase', letterSpacing: 1 }}>{col.label}</span>
                    <span style={{ fontSize: 12, color: C.muted }}>({catDone}/{catTasks.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {catTasks.map(t => <TaskCard key={t.id} task={t} checked={!!checked[t.id]} onToggle={() => toggleTask(t.id)} animating={!!animating[t.id]} />)}
                  </div>
                </div>
              );
            })}

            {completionPct === 100 && (
              <div style={{ backgroundColor: C.terracotta, borderRadius: 20, padding: 24, textAlign: 'center', color: C.white }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🌸</div>
                <div style={{ fontSize: 18, fontFamily: 'Georgia, serif', marginBottom: 6 }}>Perfect day complete!</div>
                <div style={{ fontSize: 14, opacity: 0.9 }}>Every action today is an investment. You showed up. That matters.</div>
              </div>
            )}

            <MedicalDisclaimer />
          </div>
        )}

        {/* ══ PROGRESS ═══════════════════════════════════════════════════════ */}
        {activeTab === 'progress' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ backgroundColor: C.white, borderRadius: 20, padding: 24, border: '1.5px solid #EAE5DF' }}>
              <h2 style={{ margin: '0 0 20px', fontSize: 22, fontFamily: 'Georgia, serif', fontWeight: 400, color: C.charcoal }}>Your Journey So Far</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[
                  { val: streak,           label: 'Day Streak', color: C.terracotta, icon: '🔥' },
                  { val: totalDays,        label: 'Total Days',  color: C.plum,       icon: '📅' },
                  { val: `${completionPct}%`, label: 'Today',   color: C.sage,       icon: '✓'  },
                ].map(s => (
                  <div key={s.label} style={{ backgroundColor: C.cream, borderRadius: 14, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 22 }}>{s.icon}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: 'Georgia, serif', lineHeight: 1.2, marginTop: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: C.white, borderRadius: 20, padding: 20, border: '1.5px solid #EAE5DF' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: C.charcoal }}>This Week</h3>
              <WeekCalendar completionHistory={completionHistory} />
              <div style={{ marginTop: 14, display: 'flex', gap: 16, fontSize: 12, color: C.muted }}>
                <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, backgroundColor: C.terracotta, marginRight: 4, verticalAlign: 'middle' }} />80%+ complete</span>
                <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, backgroundColor: '#E8A87C', marginRight: 4, verticalAlign: 'middle' }} />40–79%</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#FDF0EA', borderRadius: 20, padding: 20, border: '1.5px solid #E8B89A' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: C.terracotta }}>⏰ The 90-Day Rule</h3>
              <p style={{ margin: 0, fontSize: 14, color: '#7A4A2E', lineHeight: 1.6 }}>Egg maturation takes 90 days. Every supplement you take today is investing in eggs that will be collected 3 months from now. You won't feel it — but it's happening.</p>
              {streak > 0 && <div style={{ marginTop: 12, fontSize: 13, color: C.terracotta, fontWeight: 600 }}>
                You're {streak} day{streak !== 1 ? 's' : ''} in. {90 - streak > 0 ? `${90 - streak} days to full cycle impact.` : "You've completed a full egg maturation cycle! 🏆"}
              </div>}
            </div>

            <div style={{ backgroundColor: C.white, borderRadius: 20, padding: 20, border: '1.5px solid #EAE5DF' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: C.charcoal }}>🏆 Milestones</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MILESTONES.map(m => {
                  const unlocked = streak >= m.days;
                  return (
                    <div key={m.days} style={{
                      backgroundColor: unlocked ? '#FDF8F5' : '#F8F5F1', borderRadius: 14, padding: '14px 18px',
                      border: `1.5px solid ${unlocked ? C.terracotta : '#EAE5DF'}`,
                      display: 'flex', alignItems: 'center', gap: 14, opacity: unlocked ? 1 : 0.55,
                    }}>
                      <span style={{ fontSize: 26 }}>{unlocked ? m.icon : '🔒'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: unlocked ? C.charcoal : C.muted }}>{m.label}</div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{unlocked ? m.msg : `${m.days - streak} more days`}</div>
                      </div>
                      {unlocked && <span style={{ color: C.terracotta, fontSize: 18 }}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
            <MedicalDisclaimer />
          </div>
        )}

        {/* ══ ANSWERS ════════════════════════════════════════════════════════ */}
        {activeTab === 'answers' && (
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-2xl font-light mb-2">Quick Answers</h2>
            <p className="text-sm text-gray-500 mb-6">If you've wondered it — you're not alone.</p>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input type="text" value={questionSearch} onChange={e => setQuestionSearch(e.target.value)} placeholder="Search questions..." className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-400 outline-none" />
            </div>
            <div className="space-y-3">
              {faqs.filter(f => questionSearch === '' || f.q.toLowerCase().includes(questionSearch.toLowerCase())).map((f, i) => (
                <details key={i} className="group border rounded-lg">
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 list-none">
                    <span className="font-medium text-gray-800 pr-4">{f.q}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </summary>
                  <div className="p-4 bg-gray-50 border-t text-sm text-gray-700 leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
            <MedicalDisclaimer />
          </div>
        )}

        {/* ══ JOURNAL ════════════════════════════════════════════════════════ */}
        {activeTab === 'journal' && (
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-2xl font-light mb-2">Your Journal</h2>
            <p className="text-sm text-gray-500 mb-6">This space is just for you. No judgement. No fixing. Just honesty.</p>
            <textarea value={journalText} onChange={e => setJournalText(e.target.value)} placeholder="How are you feeling today?" rows="6" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-400 outline-none resize-none mb-4" />
            <button onClick={() => {
              if (journalText.trim()) {
                setData(d => ({ ...d, journalEntries: [{ date: new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), text: journalText }, ...d.journalEntries] }));
                setJournalText('');
              }
            }} className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg transition-colors">Save Entry</button>
            <div className="mt-6 space-y-4">
              <h3 className="font-medium text-gray-800">Previous Entries</h3>
              {data.journalEntries.length === 0
                ? <p className="text-gray-400 text-sm py-4">No entries yet. Start journaling to track your journey.</p>
                : data.journalEntries.map((e, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-xs text-gray-400 mb-2">{e.date}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{e.text}</p>
                  </div>
                ))}
            </div>
            <MedicalDisclaimer />
          </div>
        )}

        {/* ══ COMMUNITY ══════════════════════════════════════════════════════ */}
        {activeTab === 'community' && (
          <>
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h2 className="text-2xl font-light text-gray-800 mb-2">You Are Not Alone</h2>
              <p className="text-gray-500 text-sm mb-6">Data from women with your exact bottleneck pattern — all anonymous</p>
              <div className="p-6 bg-rose-50 rounded-xl border border-rose-200 mb-6">
                <h3 className="font-medium text-gray-800 mb-4">Women with your pattern</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-rose-500">{communityData.count}</p>
                    <p className="text-xs text-gray-500 mt-1">Women tracking this</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-500">{communityData.successRate}%</p>
                    <p className="text-xs text-gray-500 mt-1">Improved outcomes</p>
                  </div>
                </div>
                <h4 className="font-medium text-gray-700 mb-3">What made the difference</h4>
                {communityData.topActions.map((a, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 flex-1 pr-4">{a.action}</span>
                      <span className="text-sm font-medium text-rose-600 flex-shrink-0">{a.pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-rose-400 h-2 rounded-full transition-all" style={{ width: `${a.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-4">From women in your situation</h3>
                {communityData.stories.map((s, i) => (
                  <div key={i} className="bg-purple-50 border border-purple-100 rounded-xl p-5 mb-4">
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">"{s.text}"</p>
                    <p className="text-xs text-purple-600 font-medium">{s.stage}</p>
                  </div>
                ))}
              </div>
            </div>
            <MedicalDisclaimer />
          </>
        )}

      </div>
    </div>
  );
}