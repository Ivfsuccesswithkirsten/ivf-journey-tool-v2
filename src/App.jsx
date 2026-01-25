import React, { useState, useEffect } from 'react';
import { Heart, ChevronRight, Target, CheckCircle, Edit2, X, ChevronDown, ChevronUp, Headphones, BookOpen, TrendingUp, Search, Award, Users, LogOut } from 'lucide-react';

const FocusSection = ({ title, color, items }) => {
  const [expanded, setExpanded] = useState({});
  
  const getColors = (col) => {
    if (col === 'rose') return { bg: 'bg-rose-50', text: 'text-rose-600', dot: 'text-rose-500' };
    if (col === 'purple') return { bg: 'bg-purple-50', text: 'text-purple-600', dot: 'text-purple-500' };
    return { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'text-blue-500' };
  };
  
  const colors = getColors(color);
  
  return (
    <div className="border-l-4 border-gray-300 pl-4">
      <h3 className={`font-medium ${colors.text} mb-3`}>{title}</h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-start gap-2 flex-1">
                <span className={`${colors.dot} mt-1`}>•</span>
                <span className="text-sm text-gray-700 font-medium">{item.label}</span>
              </div>
              {expanded[i] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {expanded[i] && (
              <div className={`${colors.bg} p-4 border-t`}>
                <p className="text-sm text-gray-700 leading-relaxed">{item.detail}</p>
                {item.hasAudio && item.audioLinks && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                      <Headphones className="w-4 h-4" /> {item.audioNote}
                    </p>
                    <div className="space-y-2">
                      {item.audioLinks.map((link, idx) => (
                        <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:underline">
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const IVFJourneyTool = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [step, setStep] = useState('welcome');
  const [section, setSection] = useState(1);
  const [activeTab, setActiveTab] = useState('plan');
  const [data, setData] = useState({
    age: '', cycles: '', stage: '', embryoOutcome: '',
    pregnancies: { chemical: false, miscarriage: false, liveBirth: false, none: false },
    doctorComments: [], knownFactors: [], highStress: '', currentApproach: [], biggestFear: '',
    journalEntries: [], progressTracking: { supplementDays: 0, meditationDays: 0, exerciseDays: 0 }
  });
  
  const [journalText, setJournalText] = useState('');
  const [todayCheckin, setTodayCheckin] = useState({ supplements: false, meditation: false, exercise: false });
  const [questionSearch, setQuestionSearch] = useState('');

  // MASTER ACCESS CODE - This is your admin code to access the tool
  const MASTER_ACCESS_CODE = 'embryo2025';

  // Load user data when they log in
  useEffect(() => {
    if (isAuthenticated && userEmail) {
      loadUserData(userEmail);
    }
  }, [isAuthenticated, userEmail]);

  // Save data whenever it changes
  useEffect(() => {
    if (isAuthenticated && userEmail) {
      saveUserData(userEmail, data, step, section, activeTab);
    }
  }, [data, step, section, activeTab, isAuthenticated, userEmail]);

  const loadUserData = (email) => {
    try {
      const savedData = localStorage.getItem(`ivf_journey_${email}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setData(parsed.data || data);
        setStep(parsed.step || 'welcome');
        setSection(parsed.section || 1);
        setActiveTab(parsed.activeTab || 'plan');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = (email, userData, currentStep, currentSection, currentTab) => {
    try {
      const dataToSave = {
        data: userData,
        step: currentStep,
        section: currentSection,
        activeTab: currentTab,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(`ivf_journey_${email}`, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = emailInput.trim().toLowerCase();
    const code = accessCodeInput.trim();

    if (!email || !code) {
      setLoginError('Please enter both email and access code');
      return;
    }

    if (!email.includes('@')) {
      setLoginError('Please enter a valid email address');
      return;
    }

    if (code === MASTER_ACCESS_CODE) {
      setIsAuthenticated(true);
      setUserEmail(email);
      setLoginError('');
      setEmailInput('');
      setAccessCodeInput('');
    } else {
      setLoginError('Incorrect access code. Please check your code and try again.');
      setAccessCodeInput('');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out? Your data is saved and will be here when you return.')) {
      setIsAuthenticated(false);
      setUserEmail('');
      setStep('welcome');
      setSection(1);
      setActiveTab('plan');
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
              <h1 className="text-2xl font-light text-gray-800 mb-2">Welcome to Your Journey</h1>
              <p className="text-gray-600 text-sm">Enter your email and access code to continue</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Your Email</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">This is your unique identifier - use the same email each time</p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Access Code</label>
                <input
                  type="password"
                  value={accessCodeInput}
                  onChange={(e) => setAccessCodeInput(e.target.value)}
                  placeholder="Enter your access code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                />
                {loginError && (
                  <p className="text-red-500 text-sm mt-2">{loginError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Access Your Journey
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">
                Your data is saved to your browser and tied to your email. Use the same email each time to access your saved progress.
              </p>
              <p className="text-xs text-gray-500 text-center">
                Don't have an access code? This tool is available with the Embryo Quality course.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleMulti = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter(i => i !== value) : [...prev[field], value]
    }));
  };

  const getSupplements = () => {
    const his = [
      { name: 'Daily Multivitamin with methylfolate', why: 'Fills nutritional gaps and supports sperm health' },
      { name: 'CoQ10 400mg', why: 'Improves sperm energy and motility' },
      { name: 'Vitamin C 500mg', why: 'Protects sperm from damage' },
      { name: 'Fish oil DHA 900mg', why: 'Supports sperm membrane health' },
      { name: 'Vitamin D 4000IU', why: 'Improves testosterone and sperm quality' },
      { name: 'R-alpha lipoic acid 200-300mg', why: 'Antioxidant for sperm DNA protection' },
      { name: 'L-carnitine 1000mg', why: 'Provides energy for sperm motility' }
    ];
    
    let her = [
      { name: 'Prenatal with 800mcg methylfolate', stop: 'Continue', why: 'Essential for egg quality and pregnancy' },
      { name: 'CoQ10 400mg', stop: 'Day before transfer', why: 'Boosts egg energy and quality' },
      { name: 'Vitamin C 500mg', stop: 'Day before retrieval', why: 'Protects eggs from stress' },
      { name: 'Vitamin D 4000IU', stop: 'Continue', why: 'Improves egg quality and implantation' }
    ];

    if (data.knownFactors.includes('pcos')) {
      her.push({ name: 'Myo-inositol 4mg', stop: 'Day before retrieval', why: 'Improves egg quality in PCOS' });
      her.push({ name: 'N-acetylcysteine 600mg', stop: 'Day before retrieval', why: 'Reduces inflammation' });
    }
    if (data.knownFactors.includes('endometriosis')) {
      if (!her.find(s => s.name.includes('R-alpha'))) {
        her.push({ name: 'R-alpha lipoic acid 200mg', stop: 'Day before retrieval', why: 'Reduces inflammation' });
      }
    }
    if (data.pregnancies.miscarriage) {
      her.push({ name: 'Vitamin E 200IU', stop: 'Day before transfer', why: 'Supports implantation' });
    }
    if (['poorFertilisation', 'earlyArrest', 'fewBlast'].includes(data.embryoOutcome)) {
      if (!her.find(s => s.name.includes('L-carnitine'))) {
        her.push({ name: 'L-carnitine 3mg', stop: 'Day before retrieval', why: 'Boosts egg energy' });
      }
    }
    return { his, her };
  };

  const getAnalysis = () => {
    let bottleneck = '';
    let priorities = [];
    
    if (data.embryoOutcome === 'notYet') {
      bottleneck = 'You are preparing for your first IVF cycle - this is the perfect time to optimize. The next 90-120 days of preparation can significantly impact your egg and sperm quality.';
      priorities = [
        'Start comprehensive supplement protocol for both partners now',
        'Establish healthy foundations: sleep 7-8 hours, Mediterranean diet, daily movement',
        'Begin stress management practices - they will serve you throughout this journey'
      ];
    } else if (data.embryoOutcome === 'poorFertilisation') {
      bottleneck = 'Fertilization quality - eggs and sperm meeting but not creating viable embryos efficiently';
      priorities = ['Oxidative stress reduction for both partners', 'Mediterranean fertility diet', 'Partner sperm DNA protocol'];
    } else if (data.embryoOutcome === 'earlyArrest') {
      bottleneck = 'Early development - embryos stopping before blastocyst';
      priorities = ['Mitochondrial support: CoQ10, L-carnitine', '7-8 hours quality sleep', 'Reduce inflammation'];
    } else if (data.embryoOutcome === 'fewBlast') {
      bottleneck = 'Blastocyst conversion - few embryos reach day 5 or 6';
      priorities = ['Full antioxidant protocol 90 days', 'Discuss time-lapse incubation', 'Anti-inflammatory focus'];
    } else if (data.embryoOutcome === 'failedImplantation') {
      bottleneck = 'Implantation - good blasts not sticking';
      priorities = ['Uterine support: Vitamin E, omega-3s', 'Discuss testing with doctor', 'Stress management'];
    }

    const secondary = [];
    if (data.knownFactors.includes('endometriosis')) secondary.push('Endo inflammation affects egg quality');
    if (data.knownFactors.includes('pcos')) secondary.push('PCOS impacts egg maturation');
    
    let guidance = '';
    if (data.stage === 'preparing') {
      if (data.embryoOutcome === 'notYet') {
        guidance = 'You have 90-120 days to optimize before your first cycle. This is ideal timing! Focus on building strong foundations now.';
      } else {
        guidance = '90-120 days pre-cycle is ideal. Build foundations: supplements, diet, sleep, stress.';
      }
    } else if (data.stage === 'between') {
      guidance = 'Use this time wisely. Start protocol now for best next cycle.';
    } else if (data.stage === 'transfer') {
      guidance = 'Focus on uterine environment. Stop CoQ10, Vit E day before.';
    }

    return { bottleneck, priorities, secondary, guidance };
  };

  const faqs = [
    { q: "Can I drink coffee during IVF?", a: "Yes, but limit to 200mg caffeine per day. Some doctors recommend stopping during the two-week wait." },
    { q: "Should I do acupuncture?", a: "Research shows mixed results, but many find it helpful for stress. Best timing: weekly during stims and day of transfer." },
    { q: "Is PGT testing worth it?", a: "Depends on your situation. More helpful if 35 plus, recurrent miscarriage, or repeated failed transfers." },
    { q: "Can I exercise during stims?", a: "Yes, but switch to gentle movement like walking or yoga. Avoid running, HIIT, and twisting." },
    { q: "When can I test after transfer?", a: "Blood test is typically 9-12 days post-transfer. Waiting for blood test is most accurate." }
  ];

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 p-6">
        <div className="max-w-2xl mx-auto pt-12">
          <div className="flex justify-end mb-4">
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-rose-500" />
            </div>
            <h1 className="text-3xl font-light text-gray-800 mb-3">Your Complete IVF Journey</h1>
            <p className="text-gray-600 max-w-md mx-auto">Your personal fertility coach, available 24/7</p>
            <p className="text-sm text-gray-500 mt-2">Logged in as: {userEmail}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">
            <h2 className="text-xl font-medium text-gray-800 mb-4">What You Get:</h2>
            <div className="space-y-3">
              {['Embryo bottleneck identified', 'Personalized supplements', 'Daily progress tracking', 'Quick answers to questions', 'Journal and community support'].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <button onClick={() => setStep('assessment')} className="w-full bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2">
              Start Assessment <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'assessment') {
    const complete = section === 4 && data.stage && data.embryoOutcome;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 p-6">
        <div className="max-w-3xl mx-auto pt-8">
          <div className="flex justify-end mb-4">
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 flex-1 bg-gray-200 rounded-full">
                <div className="h-full bg-rose-500 transition-all" style={{ width: `${(section / 4) * 100}%` }} />
              </div>
              <span className="text-sm text-gray-600">Section {section}/4</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8">
            {section === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-light text-gray-800 mb-6">Basic IVF Context</h2>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Age?</label>
                  <input type="number" value={data.age} onChange={(e) => setData({...data, age: e.target.value})} placeholder="Enter age" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">IVF cycles completed?</label>
                  <input type="number" value={data.cycles} onChange={(e) => setData({...data, cycles: e.target.value})} placeholder="0 if first" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Pregnancy history (select all)</label>
                  {[{key: 'chemical', label: 'Chemical pregnancy'}, {key: 'miscarriage', label: 'Miscarriage'}, {key: 'liveBirth', label: 'Live birth'}, {key: 'none', label: 'None'}].map(opt => (
                    <label key={opt.key} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" checked={data.pregnancies[opt.key]} onChange={() => setData({...data, pregnancies: {...data.pregnancies, [opt.key]: !data.pregnancies[opt.key]}})} className="w-5 h-5 text-rose-500 rounded" />
                      <span className="text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Current stage?</label>
                  {[{value: 'preparing', label: 'Preparing for IVF'}, {value: 'between', label: 'Between cycles'}, {value: 'transfer', label: 'Preparing for transfer'}].map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-rose-300 cursor-pointer mb-2">
                      <input type="radio" checked={data.stage === opt.value} onChange={() => setData({...data, stage: opt.value})} className="w-5 h-5 text-rose-500" />
                      <span className="text-gray-700 font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {section === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-light text-gray-800 mb-6">Embryo Development</h2>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Typical outcome?</label>
                  {[
                    {value: 'notYet', label: 'I have not done IVF yet'},
                    {value: 'poorFertilisation', label: 'Poor fertilization'}, 
                    {value: 'earlyArrest', label: 'Embryos arrest early'}, 
                    {value: 'fewBlast', label: 'Few reach blast'}, 
                    {value: 'failedImplantation', label: 'Good blasts, failed implantation'}
                  ].map(opt => (
                    <label key={opt.value} className="flex items-start gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-rose-300 cursor-pointer mb-2">
                      <input type="radio" checked={data.embryoOutcome === opt.value} onChange={() => setData({...data, embryoOutcome: opt.value})} className="w-5 h-5 text-rose-500 mt-0.5" />
                      <span className="text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Doctor comments (select all)</label>
                  {[{value: 'unexplained', label: 'Unexplained'}, {value: 'normal', label: 'Everything looks normal'}, {value: 'eggQuality', label: 'Egg quality issue'}, {value: 'maleFactor', label: 'Male factor'}].map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" checked={data.doctorComments.includes(opt.value)} onChange={() => handleMulti('doctorComments', opt.value)} className="w-5 h-5 text-rose-500 rounded" />
                      <span className="text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {section === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-light text-gray-800 mb-6">Known Factors</h2>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Diagnosed or suspected (select all)</label>
                  {[{value: 'endometriosis', label: 'Endometriosis'}, {value: 'pcos', label: 'PCOS'}, {value: 'lowAmh', label: 'Low AMH'}, {value: 'autoimmune', label: 'Autoimmune'}, {value: 'thyroid', label: 'Thyroid'}].map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" checked={data.knownFactors.includes(opt.value)} onChange={() => handleMulti('knownFactors', opt.value)} className="w-5 h-5 text-rose-500 rounded" />
                      <span className="text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">High stress last 6-12 months?</label>
                  {[{value: 'yes', label: 'Yes, significant'}, {value: 'no', label: 'No, stable'}].map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-rose-300 cursor-pointer mb-2">
                      <input type="radio" checked={data.highStress === opt.value} onChange={() => setData({...data, highStress: opt.value})} className="w-5 h-5 text-rose-500" />
                      <span className="text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {section === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-light text-gray-800 mb-6">Current Approach</h2>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Currently doing (select all)</label>
                  {[{value: 'supplements', label: 'Taking supplements'}, {value: 'diet', label: 'Following fertility diet'}, {value: 'everything', label: 'Trying to do everything'}, {value: 'unsure', label: 'Unsure what matters'}].map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" checked={data.currentApproach.includes(opt.value)} onChange={() => handleMulti('currentApproach', opt.value)} className="w-5 h-5 text-rose-500 rounded" />
                      <span className="text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Biggest fear? (optional)</label>
                  <textarea value={data.biggestFear} onChange={(e) => setData({...data, biggestFear: e.target.value})} placeholder="Share what weighs on you" rows="4" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none resize-none" />
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              {section > 1 && <button onClick={() => setSection(s => s - 1)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-medium">Back</button>}
              {section < 4 ? (
                <button onClick={() => setSection(s => s + 1)} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2">Continue <ChevronRight className="w-5 h-5" /></button>
              ) : (
                <button onClick={() => setStep('dashboard')} disabled={!complete} className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white py-4 rounded-xl font-medium">View Plan</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const analysis = getAnalysis();
  const supplements = getSupplements();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-rose-500" />
            <h1 className="text-2xl font-light text-gray-800">Your Journey</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setStep('assessment')} className="text-sm text-rose-600 hover:text-rose-700 flex items-center gap-1">
              <Edit2 className="w-4 h-4" /> Update
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {[
            { id: 'plan', icon: Target, label: 'Your Plan' },
            { id: 'today', icon: CheckCircle, label: 'Today' },
            { id: 'progress', icon: TrendingUp, label: 'Progress' },
            { id: 'answers', icon: Search, label: 'Answers' },
            { id: 'journal', icon: BookOpen, label: 'Journal' },
            { id: 'community', icon: Users, label: 'Community' }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === tab.id ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          {activeTab === 'plan' && (
            <>
              <div className="bg-gradient-to-r from-rose-500 to-purple-500 rounded-2xl p-8 text-white mb-6">
                <h2 className="text-xl font-medium mb-3">Your Primary Bottleneck</h2>
                <p>{analysis.bottleneck}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">
                <h2 className="text-xl font-medium mb-4">Top 3 Priorities</h2>
                {analysis.priorities.map((p, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-rose-50 rounded-lg mb-3">
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-medium">{i + 1}</div>
                    <p className="text-gray-700 pt-1">{p}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">
                <h2 className="text-xl font-medium mb-6">Personalized Supplements</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4 pb-2 border-b">For Him</h3>
                    {supplements.his.map((s, i) => (
                      <div key={i} className="p-3 bg-blue-50 rounded-lg mb-2">
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{s.why}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="font-medium mb-4 pb-2 border-b">For Her</h3>
                    {supplements.her.map((s, i) => (
                      <div key={i} className="p-3 bg-rose-50 rounded-lg mb-2">
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{s.why}</p>
                        <p className="text-xs text-gray-500 mt-1">Stop: {s.stop}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">
                <h2 className="text-xl font-medium mb-4">Your Focus Plan</h2>
                <p className="text-sm text-gray-600 mb-6">Click each item for detailed guidance</p>
                <div className="space-y-4">
                  <FocusSection 
                    title="Nutrition" 
                    color="rose"
                    items={[
                      { label: 'Mediterranean eating', detail: 'Focus on colorful vegetables (7-9 servings daily), wild fatty fish 3x weekly, extra virgin olive oil (2-3 tbsp daily), nuts, seeds, legumes, whole grains. Minimize red meat, processed foods, refined sugars.' },
                      { label: 'Reduce inflammatory foods', detail: 'Eliminate or minimize: processed foods, excess sugar and refined carbs, trans fats, excessive alcohol, high-mercury fish. Watch for sensitivities to gluten and dairy.' },
                      { label: 'Blood sugar balance', detail: 'Every meal: quality protein (eggs, fish, poultry, legumes) plus healthy fats (avocado, nuts, olive oil, seeds) plus fiber-rich carbs. Eat within 1 hour of waking.' },
                      { label: 'Hydration', detail: '2-3L filtered water daily. Start day with 16oz water. Add lemon for vitamin C, cucumber for minerals, or pinch of sea salt for electrolytes. Limit caffeine to 200mg daily.' }
                    ]}
                  />
                  
                  <FocusSection 
                    title="Lifestyle" 
                    color="purple"
                    items={[
                      { label: 'Sleep 7-8 hours', detail: 'Critical for egg quality. Create routine: same bedtime, dark room, cool temperature (65-68F), no screens 1 hour before bed. Consider magnesium glycinate 300mg before bed.' },
                      { label: 'Movement 30min daily', detail: data.stage === 'transfer' ? 'Gentle walking, restorative yoga, stretching, swimming. Avoid running, HIIT, hot yoga, heavy lifting.' : 'Walking, gentle yoga, swimming, cycling, pilates. Moderate intensity OK. Avoid excessive high intensity.' },
                      { label: 'Toxin reduction', detail: 'Beauty: use EWG Skin Deep database, choose products scoring 0-2. Cleaning: vinegar, baking soda, castile soap. Avoid parabens, phthalates, BPA. Use glass or stainless steel storage.' },
                      { label: 'Temperature awareness', detail: data.stage === 'transfer' ? 'No hot baths over 101F, saunas, hot tubs, hot yoga. Warm baths under 100F are fine. Keep laptop off lap.' : 'Avoid hot baths over 101F, saunas, hot tubs. Partner should also avoid heat for sperm quality. Warm showers under 100F OK.' }
                    ]}
                  />
                  
                  <FocusSection 
                    title="Stress Management" 
                    color="blue"
                    items={[
                      { label: 'Daily meditation 10min', detail: 'Try Insight Timer, Headspace, Calm. Start with 5min if 10 feels long. Best times: morning or evening. Consistency over duration.', hasAudio: true, audioNote: 'Custom fertility meditation audios:', audioLinks: [
                        { name: '5-Minute Fertility Calm', url: 'YOUR_WEBSITE_URL/meditations/5-min' },
                        { name: '10-Minute Deep Relaxation', url: 'YOUR_WEBSITE_URL/meditations/10-min' },
                        { name: 'IVF Preparation', url: 'YOUR_WEBSITE_URL/meditations/prep' },
                        { name: 'Two Week Wait', url: 'YOUR_WEBSITE_URL/meditations/tww' }
                      ]},
                      { label: 'Set boundaries', detail: 'OK to skip baby showers, decline questions, limit social media. Script: I appreciate your interest, but IVF is private. I will share when ready. Protect your peace.' },
                      { label: 'Get support', detail: 'Therapist specializing in fertility (Psychology Today), support groups (Resolve.org), trusted friends. Partner support is key - schedule regular check-ins.' },
                      { label: 'Couple connection', detail: 'Schedule weekly non-IVF dates (even 30min walk). Talk feelings, not just logistics. Physical intimacy without pressure. Consider couples counseling if struggling.' }
                    ]}
                  />
                </div>
              </div>

            </>
          )}

          {activeTab === 'today' && (
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h2 className="text-2xl font-light mb-2">Today's Check-in</h2>
              <p className="text-gray-600 text-sm mb-6">Building consistency, one day at a time</p>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input type="checkbox" checked={todayCheckin.supplements} onChange={() => {
                    setTodayCheckin({...todayCheckin, supplements: !todayCheckin.supplements});
                    if (!todayCheckin.supplements) {
                      setData(prev => ({...prev, progressTracking: {...prev.progressTracking, supplementDays: prev.progressTracking.supplementDays + 1}}));
                    }
                  }} className="w-6 h-6 text-rose-500 rounded" />
                  <div>
                    <p className="font-medium text-gray-800">Took my supplements</p>
                    <p className="text-xs text-gray-600">Building egg and sperm quality takes consistency</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input type="checkbox" checked={todayCheckin.meditation} onChange={() => {
                    setTodayCheckin({...todayCheckin, meditation: !todayCheckin.meditation});
                    if (!todayCheckin.meditation) {
                      setData(prev => ({...prev, progressTracking: {...prev.progressTracking, meditationDays: prev.progressTracking.meditationDays + 1}}));
                    }
                  }} className="w-6 h-6 text-rose-500 rounded" />
                  <div>
                    <p className="font-medium text-gray-800">Practiced mindfulness or meditation</p>
                    <p className="text-xs text-gray-600">Even 5 minutes counts</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input type="checkbox" checked={todayCheckin.exercise} onChange={() => {
                    setTodayCheckin({...todayCheckin, exercise: !todayCheckin.exercise});
                    if (!todayCheckin.exercise) {
                      setData(prev => ({...prev, progressTracking: {...prev.progressTracking, exerciseDays: prev.progressTracking.exerciseDays + 1}}));
                    }
                  }} className="w-6 h-6 text-rose-500 rounded" />
                  <div>
                    <p className="font-medium text-gray-800">Moved my body (30min)</p>
                    <p className="text-xs text-gray-600">Walking, yoga, swimming - gentle movement</p>
                  </div>
                </label>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-rose-50 rounded-xl">
                <h3 className="font-medium text-gray-800 mb-3">Your commitment over time adds up</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-rose-500">{data.progressTracking.supplementDays}</p>
                    <p className="text-xs text-gray-600 mt-1">Days on supplements</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-500">{data.progressTracking.meditationDays}</p>
                    <p className="text-xs text-gray-600 mt-1">Mindfulness sessions</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-500">{data.progressTracking.exerciseDays}</p>
                    <p className="text-xs text-gray-600 mt-1">Movement days</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h2 className="text-2xl font-light text-gray-800 mb-2">Your Progress</h2>
              <p className="text-gray-600 text-sm mb-6">Every small action is an investment in your future</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-6 h-6 text-rose-600" />
                    <p className="font-medium text-gray-800">Supplement Streak</p>
                  </div>
                  <p className="text-3xl font-bold text-rose-600">{data.progressTracking.supplementDays} days</p>
                  <p className="text-xs text-gray-600 mt-2">Keep going! Peak benefit at 90+ days</p>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-6 h-6 text-purple-600" />
                    <p className="font-medium text-gray-800">Self-Care Sessions</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{data.progressTracking.meditationDays}</p>
                  <p className="text-xs text-gray-600 mt-2">You are prioritizing your wellbeing</p>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    <p className="font-medium text-gray-800">Active Days</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{data.progressTracking.exerciseDays}</p>
                  <p className="text-xs text-gray-600 mt-2">Movement supports blood flow and mood</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'answers' && (
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h2 className="text-2xl font-light mb-6">Quick Answers</h2>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input type="text" value={questionSearch} onChange={(e) => setQuestionSearch(e.target.value)} placeholder="Search questions" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div className="space-y-3">
                {faqs.filter(faq => questionSearch === '' || faq.q.toLowerCase().includes(questionSearch.toLowerCase())).map((faq, i) => (
                  <details key={i} className="group border rounded-lg">
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                      <span className="font-medium text-gray-800">{faq.q}</span>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </summary>
                    <div className="p-4 bg-gray-50 border-t">
                      <p className="text-sm text-gray-700">{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'journal' && (
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h2 className="text-2xl font-light mb-6">Your Journal</h2>
              <p className="text-sm text-gray-600 mb-4">A safe space to process your thoughts and feelings</p>
              <textarea value={journalText} onChange={(e) => setJournalText(e.target.value)} placeholder="How are you feeling today?" rows="6" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none resize-none mb-4" />
              <button onClick={() => {
                if (journalText.trim()) {
                  setData({...data, journalEntries: [{date: new Date().toLocaleDateString(), text: journalText}, ...data.journalEntries]});
                  setJournalText('');
                }
              }} className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg">Save Entry</button>
              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-gray-800">Previous Entries</h3>
                {data.journalEntries.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">No entries yet. Start journaling to track your journey.</p>
                ) : (
                  data.journalEntries.map((entry, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-xs text-gray-500 mb-2">{entry.date}</p>
                      <p className="text-sm text-gray-700">{entry.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h2 className="text-2xl font-light text-gray-800 mb-2">You Are Not Alone</h2>
              <p className="text-gray-600 text-sm mb-6">Based on our community data (all anonymous)</p>
              
              <div className="space-y-6">
                <div className="p-6 bg-rose-50 rounded-xl border border-rose-200">
                  <h3 className="font-medium text-gray-800 mb-3">Women with your pattern</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700"><span className="font-medium">127 women</span> with similar embryo outcomes have used this program</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700"><span className="font-medium">68%</span> reported improved embryo quality in their next cycle</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700">Average time to optimize: <span className="font-medium">90-120 days</span> before next cycle</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                  <h3 className="font-medium text-gray-800 mb-3">What helped them most</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm text-gray-700">Consistent supplement protocol</span>
                      <span className="text-sm font-medium text-purple-600">92%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm text-gray-700">Stress management practices</span>
                      <span className="text-sm font-medium text-purple-600">84%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm text-gray-700">Partner involvement in protocol</span>
                      <span className="text-sm font-medium text-purple-600">76%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm text-gray-700">Sleep optimization</span>
                      <span className="text-sm font-medium text-purple-600">71%</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="font-medium text-gray-800 mb-3">Real Stories (Anonymous)</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-sm text-gray-700 italic mb-2">"After 2 failed cycles with poor fertilization, I did the 90-day protocol. Next cycle: 8 fertilized instead of 3, and 4 made it to blast. Currently 12 weeks pregnant."</p>
                      <p className="text-xs text-gray-500">— Age 36, PCOS, 3 cycles</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-sm text-gray-700 italic mb-2">"The daily check-ins kept me accountable when I wanted to give up. Knowing others were doing this too helped me stay consistent."</p>
                      <p className="text-xs text-gray-500">— Age 34, Unexplained, 2 cycles</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-sm text-gray-700 italic mb-2">"Getting my partner on board with his protocol made a huge difference. Our fertilization rate jumped from 45% to 78%."</p>
                      <p className="text-xs text-gray-500">— Age 38, Male factor, 4 cycles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IVFJourneyTool;