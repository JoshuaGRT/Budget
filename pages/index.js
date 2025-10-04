import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Menu, Home, CreditCard, Target, Settings, User, Plus, TrendingUp, TrendingDown, Wallet, Calendar, Trash2, Upload, Search, BarChart3, AlertCircle, CheckCircle, X, Edit, Zap, Award, Activity, Eye, Sparkles, ArrowUp, ArrowDown, ArrowRight, Layers, Sun, Moon, Download, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => initialValue);
  const setValue = value => setStoredValue(value);
  return [storedValue, setValue];
};

const EMOJIS_COMPTES = ['💳', '📘', '👴', '🏡', '₿', '📊', '💰', '🏦', '💎', '🎯', '🚀', '🌟', '💵', '🏪', '🎁'];

const GlassCard = memo(({ children, className = "", hover = true, darkMode }) => (
  <div className={`
    backdrop-blur-xl ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-900/5 border-gray-300'} border rounded-3xl shadow-xl
    ${hover ? (darkMode ? 'hover:bg-white/10 hover:border-white/20' : 'hover:bg-gray-900/10 hover:border-gray-400') + ' hover:scale-[1.02]' : ''}
    transition-all duration-300 ${className}
  `}>
    {children}
  </div>
));

const TrendBadge = memo(({ value, darkMode }) => {
  const isPositive = value >= 0;
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
      ${isPositive 
        ? (darkMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-300')
        : (darkMode ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-rose-100 text-rose-700 border-rose-300')
      } backdrop-blur-xl border`}>
      {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      <span>{Math.abs(value).toFixed(1)}%</span>
    </div>
  );
});

const StatCard = memo(({ label, value, icon: Icon, trend, color = 'cyan', darkMode }) => {
  const colors = {
    cyan: { from: 'from-cyan-500', to: 'to-blue-500', text: darkMode ? 'text-cyan-400' : 'text-cyan-600' },
    emerald: { from: 'from-emerald-500', to: 'to-teal-500', text: darkMode ? 'text-emerald-400' : 'text-emerald-600' },
    rose: { from: 'from-rose-500', to: 'to-pink-500', text: darkMode ? 'text-rose-400' : 'text-rose-600' },
    purple: { from: 'from-purple-500', to: 'to-fuchsia-500', text: darkMode ? 'text-purple-400' : 'text-purple-600' }
  };
  const c = colors[color];
  
  return (
    <GlassCard className="p-6" darkMode={darkMode}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
            {trend !== undefined && <TrendBadge value={trend} darkMode={darkMode} />}
          </div>
          <div className={`text-4xl font-bold bg-gradient-to-r ${c.from} ${c.to} bg-clip-text text-transparent`}>{value}</div>
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${c.from} ${c.to} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </GlassCard>
  );
});

const TransactionItem = memo(({ transaction, categories, onDelete, darkMode }) => {
  const cat = [...categories.depenses, ...categories.revenus].find(c => c.nom === transaction.categorie);
  const isPositive = transaction.montant > 0;
  
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all group
      ${darkMode 
        ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20' 
        : 'bg-gray-100 hover:bg-gray-200 border-gray-300 hover:border-gray-400'
      }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-xl border ${darkMode ? 'border-white/10' : 'border-gray-300'}`} 
        style={{ backgroundColor: cat?.color + '20' }}>
        {cat?.icon || '💰'}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.libelle}</div>
        <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Calendar className="w-3 h-3" />
          <span>{transaction.date}</span>
          <span className={`px-2 py-0.5 rounded-full ${darkMode ? 'bg-white/5' : 'bg-gray-200'}`}>{transaction.categorie}</span>
        </div>
      </div>
      <div className={`text-lg font-bold ${isPositive ? (darkMode ? 'text-emerald-400' : 'text-emerald-600') : (darkMode ? 'text-rose-400' : 'text-rose-600')}`}>
        {isPositive ? '+' : ''}{transaction.montant.toFixed(0)}€
      </div>
      <button onClick={() => onDelete(transaction.id)} 
        className={`opacity-0 group-hover:opacity-100 p-2 rounded-xl transition-all
          ${darkMode ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-rose-100 text-rose-600'}`}>
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
});

const HealthScore = memo(({ score, darkMode }) => {
  const getColor = () => {
    if (score >= 70) return { from: '#10b981', to: '#059669', text: darkMode ? 'text-emerald-400' : 'text-emerald-600' };
    if (score >= 40) return { from: '#f59e0b', to: '#d97706', text: darkMode ? 'text-orange-400' : 'text-orange-600' };
    return { from: '#ef4444', to: '#dc2626', text: darkMode ? 'text-rose-400' : 'text-rose-600' };
  };
  const color = getColor();
  
  return (
    <GlassCard className="p-6" darkMode={darkMode}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Santé Financière</h3>
        <Award className={`w-5 h-5 ${color.text}`} />
      </div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={[{ value: score }]} startAngle={90} endAngle={-270}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={color.from} />
                <stop offset="100%" stopColor={color.to} />
              </linearGradient>
            </defs>
            <RadialBar dataKey="value" cornerRadius={10} fill="url(#scoreGradient)" />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-5xl font-bold ${color.text}`}>{score}</div>
            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>/ 100</div>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <span className={`text-sm font-semibold ${color.text}`}>
          {score >= 70 ? 'Excellente santé' : score >= 40 ? 'Santé correcte' : 'À améliorer'}
        </span>
      </div>
    </GlassCard>
  );
});

const FABMenu = memo(({ onAction, darkMode }) => {
  const [open, setOpen] = useState(false);
  const actions = [
    { icon: Plus, label: 'Transaction', action: 'transaction', gradient: 'from-cyan-500 to-blue-500' },
    { icon: Wallet, label: 'Compte', action: 'compte', gradient: 'from-emerald-500 to-teal-500' },
    { icon: Target, label: 'Objectif', action: 'objectif', gradient: 'from-purple-500 to-fuchsia-500' }
  ];
  
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="flex flex-col-reverse items-end gap-3">
        {open && actions.map((action, i) => (
          <button key={action.action} onClick={() => { onAction(action.action); setOpen(false); }}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r ${action.gradient} text-white font-semibold shadow-2xl hover:scale-110 transition-all backdrop-blur-xl border border-white/20`}
            style={{ animation: `slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both` }}>
            <action.icon className="w-5 h-5" />
            <span>{action.label}</span>
          </button>
        ))}
        <button onClick={() => setOpen(!open)}
          className={`p-5 rounded-2xl text-white font-bold shadow-2xl hover:scale-110 transition-all backdrop-blur-xl border border-white/20 relative overflow-hidden ${open ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
          {open ? <X className="w-6 h-6 relative z-10" /> : <Zap className="w-6 h-6 relative z-10" />}
        </button>
      </div>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 2s infinite; }
      `}</style>
    </div>
  );
});

const ModernModal = memo(({ show, onClose, title, children, darkMode }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
      <GlassCard className="w-full max-w-md p-6 animate-scaleIn" hover={false} darkMode={darkMode}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <button onClick={onClose} className={`p-2 rounded-xl transition-all ${darkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </GlassCard>
      <style>{`@keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } } .animate-scaleIn { animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }`}</style>
    </div>
  );
});

const BudgetApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [modeFocus, setModeFocus] = useState(false);
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSidebarOpen(window.innerWidth > 768);
    }
  }, []);
  
  const [typesComptes] = useState([
    { value: 'courant', label: 'Compte courant', icon: '💳' },
    { value: 'livret_a', label: 'Livret A', icon: '📘' },
    { value: 'per', label: 'PER', icon: '👴' },
    { value: 'pel', label: 'PEL', icon: '🏡' },
    { value: 'crypto', label: 'Crypto', icon: '₿' },
    { value: 'trade_republic', label: 'Trade Republic', icon: '📊' },
    { value: 'mon_petit_placement', label: 'Mon Petit Placement', icon: '💰' },
    { value: 'autre', label: 'Autre', icon: '🏦' }
  ]);
  
  const [comptes, setComptes] = useLocalStorage('comptes', [
    { id: 1, nom: 'Compte courant', type: 'courant', soldeInitial: 2500, icon: '💳' },
    { id: 2, nom: 'PEA', type: 'trade_republic', soldeInitial: 5000, icon: '📊' },
    { id: 3, nom: 'Livret A', type: 'livret_a', soldeInitial: 3000, icon: '📘' }
  ]);
  
  const [transactions, setTransactions] = useLocalStorage('transactions', [
    { id: 1, date: '2025-10-01', libelle: 'Salaire', montant: 2500, type: 'REVENUS', categorie: 'Salaire', compteId: 1 },
    { id: 2, date: '2025-10-01', libelle: 'Loyer', montant: -800, type: 'DÉPENSES', categorie: 'Logement', compteId: 1 },
    { id: 3, date: '2025-10-02', libelle: 'Courses Carrefour', montant: -120, type: 'DÉPENSES', categorie: 'Alimentation', compteId: 1 },
    { id: 4, date: '2025-10-03', libelle: 'Restaurant', montant: -45, type: 'DÉPENSES', categorie: 'Alimentation', compteId: 1 }
  ]);
  
  const [objectifs, setObjectifs] = useLocalStorage('objectifs', [
    { id: 1, nom: 'Vacances été', montantCible: 2000, montantActuel: 1600, dateObjectif: '2025-07-01' },
    { id: 2, nom: 'Nouvelle voiture', montantCible: 15000, montantActuel: 8500, dateObjectif: '2026-01-01' }
  ]);
  
  const [budgets] = useLocalStorage('budgets', [
    { id: 1, categorie: 'Alimentation', montantMax: 400, mois: '2025-10' }
  ]);
  
  const [categories] = useState({
    depenses: [
      { id: 1, nom: 'Alimentation', icon: '🍕', color: '#ef4444' },
      { id: 2, nom: 'Logement', icon: '🏠', color: '#f59e0b' },
      { id: 3, nom: 'Transport', icon: '🚗', color: '#3b82f6' },
      { id: 4, nom: 'Loisirs', icon: '🎮', color: '#8b5cf6' }
    ],
    revenus: [
      { id: 1, nom: 'Salaire', icon: '💼', color: '#10b981' },
      { id: 2, nom: 'Freelance', icon: '💻', color: '#14b8a6' }
    ]
  });
  
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddCompte, setShowAddCompte] = useState(false);
  const [showEditCompte, setShowEditCompte] = useState(false);
  const [compteToEdit, setCompteToEdit] = useState(null);
  const [showAddObjectif, setShowAddObjectif] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('💳');
  
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);
    
    const currentRevenus = transactions.filter(t => t.montant > 0 && t.date.startsWith(currentMonth)).reduce((s, t) => s + t.montant, 0);
    const lastRevenus = transactions.filter(t => t.montant > 0 && t.date.startsWith(lastMonth)).reduce((s, t) => s + t.montant, 0);
    const currentDepenses = Math.abs(transactions.filter(t => t.montant < 0 && t.date.startsWith(currentMonth)).reduce((s, t) => s + t.montant, 0));
    const lastDepenses = Math.abs(transactions.filter(t => t.montant < 0 && t.date.startsWith(lastMonth)).reduce((s, t) => s + t.montant, 0));
    
    const soldeTotal = comptes.reduce((sum, c) => {
      const transCompte = transactions.filter(t => t.compteId === c.id);
      return sum + c.soldeInitial + transCompte.reduce((s, t) => s + t.montant, 0);
    }, 0);
    
    return {
      soldeTotal,
      totalRevenus: currentRevenus,
      totalDepenses: currentDepenses,
      epargne: currentRevenus - currentDepenses,
      trendRevenus: lastRevenus > 0 ? ((currentRevenus - lastRevenus) / lastRevenus) * 100 : 0,
      trendDepenses: lastDepenses > 0 ? ((currentDepenses - lastDepenses) / lastDepenses) * 100 : 0
    };
  }, [transactions, comptes]);
  
  const healthScore = useMemo(() => {
    let points = 0;
    const revenus = transactions.filter(t => t.montant > 0).reduce((s, t) => s + t.montant, 0);
    const depenses = Math.abs(transactions.filter(t => t.montant < 0).reduce((s, t) => s + t.montant, 0));
    const tauxEpargne = revenus > 0 ? ((revenus - depenses) / revenus) * 100 : 0;
    points += Math.min(40, tauxEpargne * 2);
    const budgetsRespect = budgets.filter(b => {
      const depensesCat = Math.abs(transactions.filter(t => t.montant < 0 && t.categorie === b.categorie).reduce((s, t) => s + t.montant, 0));
      return depensesCat <= b.montantMax;
    }).length;
    points += budgets.length > 0 ? (budgetsRespect / budgets.length) * 30 : 15;
    const objectifsProgress = objectifs.filter(o => (o.montantActuel / o.montantCible) > 0.5).length;
    points += objectifs.length > 0 ? (objectifsProgress / objectifs.length) * 30 : 15;
    return Math.round(points);
  }, [transactions, budgets, objectifs]);
  
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (searchTerm) {
      filtered = filtered.filter(t => t.libelle.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterPeriod !== 'all') {
      const now = new Date();
      if (filterPeriod === 'month') {
        const currentMonth = now.toISOString().slice(0, 7);
        filtered = filtered.filter(t => t.date.startsWith(currentMonth));
      } else if (filterPeriod === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
      }
    }
    return filtered;
  }, [transactions, searchTerm, filterPeriod]);
  
  const depensesParCategorie = useMemo(() => {
    const depenses = transactions.filter(t => t.montant < 0);
    const parCategorie = {};
    depenses.forEach(t => {
      if (!parCategorie[t.categorie]) parCategorie[t.categorie] = 0;
      parCategorie[t.categorie] += Math.abs(t.montant);
    });
    return Object.entries(parCategorie).map(([name, value]) => ({ name, value }));
  }, [transactions]);
  
  const handleFABAction = useCallback((action) => {
    if (action === 'transaction') setShowAddTransaction(true);
    if (action === 'compte') setShowAddCompte(true);
    if (action === 'objectif') setShowAddObjectif(true);
  }, []);
  
  const ajouterTransaction = useCallback(() => {
    const date = document.getElementById('transDate')?.value;
    const libelle = document.getElementById('transLibelle')?.value;
    const montant = parseFloat(document.getElementById('transMontant')?.value) || 0;
    const type = document.getElementById('transType')?.value;
    const compteId = parseInt(document.getElementById('transCompte')?.value) || 1;
    const categorie = document.getElementById('transCategorie')?.value || 'Autre';
    
    if (!libelle) return;
    
    const nouvelle = {
      id: Date.now(),
      date: date || new Date().toISOString().split('T')[0],
      libelle,
      montant: type === 'DÉPENSES' ? -Math.abs(montant) : Math.abs(montant),
      type,
      categorie,
      compteId
    };
    setTransactions(prev => [nouvelle, ...prev]);
    setShowAddTransaction(false);
  }, [setTransactions]);
  
  const supprimerTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, [setTransactions]);
  
  const ajouterCompte = useCallback(() => {
    const nom = document.getElementById('compteNom')?.value;
    const type = document.getElementById('compteType')?.value || 'courant';
    const soldeInitial = parseFloat(document.getElementById('compteSolde')?.value) || 0;
    
    if (!nom) return;
    
    setComptes(prev => [...prev, { id: Date.now(), nom, type, soldeInitial, icon: selectedIcon }]);
    setShowAddCompte(false);
    setSelectedIcon('💳');
  }, [setComptes, selectedIcon]);
  
  const modifierCompte = useCallback(() => {
    const nom = document.getElementById('editCompteNom')?.value;
    const type = document.getElementById('editCompteType')?.value;
    const soldeInitial = parseFloat(document.getElementById('editCompteSolde')?.value) || 0;
    
    if (!nom || !compteToEdit) return;
    
    setComptes(prev => prev.map(c => c.id === compteToEdit.id ? { ...c, nom, type, soldeInitial, icon: selectedIcon } : c));
    setShowEditCompte(false);
    setCompteToEdit(null);
  }, [setComptes, compteToEdit, selectedIcon]);
  
  const supprimerCompte = useCallback((id) => {
    setComptes(prev => prev.filter(c => c.id !== id));
  }, [setComptes]);
  
  const ajouterObjectif = useCallback(() => {
    const nom = document.getElementById('objNom')?.value;
    const montantCible = parseFloat(document.getElementById('objCible')?.value) || 0;
    const montantActuel = parseFloat(document.getElementById('objActuel')?.value) || 0;
    const dateObjectif = document.getElementById('objDate')?.value;
    
    if (!nom) return;
    
    setObjectifs(prev => [...prev, { id: Date.now(), nom, montantCible, montantActuel, dateObjectif }]);
    setShowAddObjectif(false);
  }, [setObjectifs]);
  
  const comptesAvecSoldes = useMemo(() => {
    return comptes.map(compte => {
      const transactionsCompte = transactions.filter(t => t.compteId === compte.id);
      const soldeActuel = compte.soldeInitial + transactionsCompte.reduce((sum, t) => sum + t.montant, 0);
      return { ...compte, soldeActuel };
    });
  }, [comptes, transactions]);
  
  const exportData = useCallback(() => {
    const data = { comptes, transactions, objectifs };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  }, [comptes, transactions, objectifs]);
  
  const bgClass = darkMode 
    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
    : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50';
  
  const sidebarClass = darkMode
    ? 'backdrop-blur-2xl bg-white/5 border-white/10'
    : 'backdrop-blur-2xl bg-gray-900/5 border-gray-300';
  
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const mutedClass = darkMode ? 'text-gray-400' : 'text-gray-600';
  
  const inputClass = darkMode
    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';
  
  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];
  
  return (
    <div className={`flex h-screen ${bgClass} overflow-hidden`}>
      {!darkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-300/10 rounded-full blur-[120px]" />
        </div>
      )}
      {darkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
        </div>
      )}
      
      <div className={`${sidebarOpen ? 'w-72' : 'w-0 md:w-20'} ${sidebarClass} border-r transition-all flex flex-col fixed md:relative h-full z-30`}>
        <div className={`p-6 flex items-center justify-between border-b ${darkMode ? 'border-white/10' : 'border-gray-300'}`}>
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={textClass + ' text-xl font-bold'}>Budget Pro</h1>
                <p className={mutedClass + ' text-xs'}>Version 2.0</p>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 rounded-xl transition-all ${darkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}>
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard', gradient: 'from-cyan-500 to-blue-500' },
            { id: 'transactions', icon: CreditCard, label: 'Transactions', gradient: 'from-emerald-500 to-teal-500' },
            { id: 'comptes', icon: Wallet, label: 'Mes Comptes', gradient: 'from-blue-500 to-indigo-500' },
            { id: 'objectifs', icon: Target, label: 'Objectifs', gradient: 'from-purple-500 to-fuchsia-500' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics', gradient: 'from-orange-500 to-rose-500' }
          ].map(item => (
            <button key={item.id} onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentView === item.id ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` : (darkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200')}`}>
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
              {currentView === item.id && sidebarOpen && <ArrowRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        <div className={`p-4 border-t ${darkMode ? 'border-white/10' : 'border-gray-300'} space-y-2`}>
          <button onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all ${darkMode ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10' : 'bg-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-300'}`}>
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {sidebarOpen && <span className="text-sm font-medium">{darkMode ? 'Mode clair' : 'Mode sombre'}</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative z-10">
        {currentView === 'dashboard' && (
          <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className={`text-4xl font-bold ${textClass} mb-2`}>Dashboard</h2>
                <p className={mutedClass}>Votre situation financière en temps réel</p>
              </div>
              <button onClick={exportData} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${darkMode ? 'bg-white/5 hover:bg-white/10 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard label="Patrimoine total" value={`${stats.soldeTotal.toFixed(0)}€`} icon={Wallet} color="cyan" darkMode={darkMode} />
              <StatCard label="Revenus du mois" value={`${stats.totalRevenus.toFixed(0)}€`} icon={TrendingUp} color="emerald" trend={stats.trendRevenus} darkMode={darkMode} />
              <StatCard label="Dépenses du mois" value={`${stats.totalDepenses.toFixed(0)}€`} icon={TrendingDown} color="rose" trend={stats.trendDepenses} darkMode={darkMode} />
              <StatCard label="Épargne" value={`${stats.epargne.toFixed(0)}€`} icon={Sparkles} color="purple" darkMode={darkMode} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <GlassCard className="p-6" darkMode={darkMode}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-xl font-bold ${textClass}`}>Transactions récentes</h3>
                    <button onClick={() => setCurrentView('transactions')} className={`text-sm flex items-center gap-1 ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'}`}>
                      Voir tout <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map(t => (
                      <TransactionItem key={t.id} transaction={t} categories={categories} onDelete={supprimerTransaction} darkMode={darkMode} />
                    ))}
                  </div>
                </GlassCard>
              </div>
              <HealthScore score={healthScore} darkMode={darkMode} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <GlassCard className="p-6" darkMode={darkMode}>
                <h3 className={`text-xl font-bold ${textClass} mb-6`}>Dépenses par catégorie</h3>
                {depensesParCategorie.length > 0 && (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={depensesParCategorie} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                        {depensesParCategorie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </GlassCard>
              
              <GlassCard className="p-6" darkMode={darkMode}>
                <h3 className={`text-xl font-bold ${textClass} mb-6`}>Objectifs financiers</h3>
                <div className="space-y-4">
                  {objectifs.slice(0, 3).map(obj => {
                    const progress = (obj.montantActuel / obj.montantCible) * 100;
                    return (
                      <div key={obj.id} className={`p-4 rounded-2xl ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-300'} border`}>
                        <div className="flex items-start justify-between mb-3">
                          <h4 className={`font-bold ${textClass}`}>{obj.nom}</h4>
                          <span className={`text-xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{progress.toFixed(0)}%</span>
                        </div>
                        <div className={`relative h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-gray-200'}`}>
                          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>
          </div>
        )}
        
        {currentView === 'transactions' && (
          <div className="p-6 md:p-10">
            <h2 className={`text-4xl font-bold ${textClass} mb-8`}>Toutes les transactions</h2>
            
            <GlassCard className="p-4 mb-6" darkMode={darkMode}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className={`absolute left-3 top-3 w-4 h-4 ${mutedClass}`} />
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher..." 
                    className={`w-full pl-10 px-4 py-2 border rounded-xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
                </div>
                <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)} 
                  className={`px-4 py-2 border rounded-xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`}>
                  <option value="all">Toutes les périodes</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                </select>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6" darkMode={darkMode}>
              <div className="space-y-3">
                {filteredTransactions.map(t => (
                  <TransactionItem key={t.id} transaction={t} categories={categories} onDelete={supprimerTransaction} darkMode={darkMode} />
                ))}
              </div>
            </GlassCard>
          </div>
        )}
        
        {currentView === 'comptes' && (
          <div className="p-6 md:p-10">
            <h2 className={`text-4xl font-bold ${textClass} mb-8`}>Mes Comptes & Placements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comptesAvecSoldes.map(compte => (
                <GlassCard key={compte.id} className="p-6" darkMode={darkMode}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{compte.icon || '💳'}</span>
                      <div>
                        <h3 className={`font-bold ${textClass}`}>{compte.nom}</h3>
                        <p className={`text-xs ${mutedClass}`}>{typesComptes.find(t => t.value === compte.type)?.label}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setCompteToEdit(compte); setSelectedIcon(compte.icon || '💳'); setShowEditCompte(true); }} 
                        className={`p-2 rounded-xl transition-all ${darkMode ? 'hover:bg-blue-500/20 text-blue-400' : 'hover:bg-blue-100 text-blue-600'}`}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => supprimerCompte(compte.id)} 
                        className={`p-2 rounded-xl transition-all ${darkMode ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-rose-100 text-rose-600'}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${textClass} mb-2`}>{compte.soldeActuel.toFixed(2)}€</div>
                  <div className={`text-sm ${mutedClass}`}>Solde initial: {compte.soldeInitial.toFixed(2)}€</div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
        
        {currentView === 'objectifs' && (
          <div className="p-6 md:p-10">
            <h2 className={`text-4xl font-bold ${textClass} mb-8`}>Mes objectifs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {objectifs.map(obj => {
                const progress = (obj.montantActuel / obj.montantCible) * 100;
                return (
                  <GlassCard key={obj.id} className="p-8 hover:scale-105" darkMode={darkMode}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className={`text-2xl font-bold ${textClass} mb-2`}>{obj.nom}</h3>
                        <p className={`text-sm ${mutedClass} flex items-center gap-2`}>
                          <Calendar className="w-4 h-4" />
                          {obj.dateObjectif}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className={`relative h-4 rounded-full overflow-hidden mb-4 ${darkMode ? 'bg-white/5' : 'bg-gray-200'}`}>
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                    <div className="text-center mb-4">
                      <div className={`text-5xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent`}>{progress.toFixed(0)}%</div>
                    </div>
                    <div className={`flex items-center justify-between pt-4 border-t ${darkMode ? 'border-white/10' : 'border-gray-300'}`}>
                      <div>
                        <p className={`text-xs ${mutedClass} mb-1`}>Actuel</p>
                        <p className={`font-bold ${textClass}`}>{obj.montantActuel.toFixed(0)}€</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs ${mutedClass} mb-1`}>Objectif</p>
                        <p className={`font-bold ${textClass}`}>{obj.montantCible.toFixed(0)}€</p>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        )}
        
        {currentView === 'analytics' && (
          <div className="p-6 md:p-10">
            <h2 className={`text-4xl font-bold ${textClass} mb-8`}>Analytics</h2>
            <GlassCard className="p-12 text-center" darkMode={darkMode}>
              <BarChart3 className={`w-24 h-24 mx-auto mb-6 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <h3 className={`text-2xl font-bold ${textClass} mb-3`}>Bientôt disponible</h3>
              <p className={mutedClass}>Analytics avancés en cours de développement</p>
            </GlassCard>
          </div>
        )}
      </div>
      
      <FABMenu onAction={handleFABAction} darkMode={darkMode} />
      
      <ModernModal show={showAddTransaction} onClose={() => setShowAddTransaction(false)} title="Nouvelle transaction" darkMode={darkMode}>
        <div className="space-y-4">
          <input type="date" id="transDate" defaultValue={new Date().toISOString().split('T')[0]} 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
          <input type="text" id="transLibelle" placeholder="Libellé" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
          <input type="number" id="transMontant" placeholder="Montant" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
          <select id="transType" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`}>
            <option value="DÉPENSES">Dépense</option>
            <option value="REVENUS">Revenu</option>
          </select>
          <select id="transCategorie" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`}>
            <option value="">Catégorie...</option>
            {categories.depenses.map(c => <option key={c.id} value={c.nom}>{c.icon} {c.nom}</option>)}
            {categories.revenus.map(c => <option key={c.id} value={c.nom}>{c.icon} {c.nom}</option>)}
          </select>
          <select id="transCompte" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`}>
            {comptes.map(c => <option key={c.id} value={c.id}>{c.icon} {c.nom}</option>)}
          </select>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={ajouterTransaction} className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:scale-105 transition-all">Ajouter</button>
          <button onClick={() => setShowAddTransaction(false)} className={`px-6 py-3 rounded-2xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200'}`}>Annuler</button>
        </div>
      </ModernModal>
      
      <ModernModal show={showAddCompte} onClose={() => setShowAddCompte(false)} title="Nouveau compte" darkMode={darkMode}>
        <div className="space-y-4">
          <input type="text" id="compteNom" placeholder="Nom du compte" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
          <select id="compteType" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`}>
            {typesComptes.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
          </select>
          <input type="number" id="compteSolde" placeholder="Solde initial" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Choisir un logo</label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJIS_COMPTES.map(emoji => (
                <button key={emoji} onClick={() => setSelectedIcon(emoji)}
                  className={`text-3xl p-3 rounded-xl transition-all ${selectedIcon === emoji ? 'bg-gradient-to-r from-cyan-500 to-blue-500 scale-110' : (darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200')}`}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={ajouterCompte} className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:scale-105 transition-all">Créer</button>
          <button onClick={() => { setShowAddCompte(false); setSelectedIcon('💳'); }} className={`px-6 py-3 rounded-2xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200'}`}>Annuler</button>
        </div>
      </ModernModal>
      
      <ModernModal show={showEditCompte} onClose={() => { setShowEditCompte(false); setCompteToEdit(null); }} title="Modifier le compte" darkMode={darkMode}>
        <div className="space-y-4">
          <input type="text" id="editCompteNom" defaultValue={compteToEdit?.nom} placeholder="Nom du compte" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
          <select id="editCompteType" defaultValue={compteToEdit?.type} 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`}>
            {typesComptes.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
          </select>
          <input type="number" id="editCompteSolde" defaultValue={compteToEdit?.soldeInitial} placeholder="Solde initial" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Choisir un logo</label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJIS_COMPTES.map(emoji => (
                <button key={emoji} onClick={() => setSelectedIcon(emoji)}
                  className={`text-3xl p-3 rounded-xl transition-all ${selectedIcon === emoji ? 'bg-gradient-to-r from-cyan-500 to-blue-500 scale-110' : (darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200')}`}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={modifierCompte} className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:scale-105 transition-all">Modifier</button>
          <button onClick={() => { setShowEditCompte(false); setCompteToEdit(null); }} className={`px-6 py-3 rounded-2xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200'}`}>Annuler</button>
        </div>
      </ModernModal>
      
      <ModernModal show={showAddObjectif} onClose={() => setShowAddObjectif(false)} title="Nouvel objectif" darkMode={darkMode}>
        <div className="space-y-4">
          <input type="text" id="objNom" placeholder="Nom de l'objectif" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
          <input type="number" id="objCible" placeholder="Montant cible" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
          <input type="number" id="objActuel" placeholder="Montant actuel" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
          <input type="date" id="objDate" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={ajouterObjectif} className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold hover:scale-105 transition-all">Créer</button>
          <button onClick={() => setShowAddObjectif(false)} className={`px-6 py-3 rounded-2xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200'}`}>Annuler</button>
        </div>
      </ModernModal>
    </div>
  );
};

export default BudgetApp;
