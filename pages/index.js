import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Menu, Home, CreditCard, Target, Settings, User, Plus, TrendingUp, TrendingDown, Wallet, Calendar, Trash2, Upload, Search, BarChart3, AlertCircle, CheckCircle, X, Edit, Zap, Award, Activity, Eye, Sparkles, ArrowUp, ArrowDown, ArrowRight, Layers, Sun, Moon, Download, Filter, Tag, Bell, Clock, FileText, Repeat } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => initialValue);
  const setValue = value => setStoredValue(value);
  return [storedValue, setValue];
};

const EMOJIS_COMPTES = ['💳', '📘', '👴', '🏡', '₿', '📊', '💰', '🏦', '💎', '🎯', '🚀', '🌟', '💵', '🏪', '🎁'];
const EMOJIS_CATEGORIES = ['🍕', '🏠', '🚗', '🎮', '✈️', '🏥', '📚', '🎬', '💼', '💻', '🎨', '⚽', '🍔', '👕', '🎵'];

// Logo animé pétillant
const SparklingLogo = memo(({ icon, color, size = 'md' }) => {
  const sizes = {
    sm: 'w-10 h-10 text-2xl',
    md: 'w-12 h-12 text-3xl',
    lg: 'w-16 h-16 text-4xl'
  };
  
  return (
    <div className={`${sizes[size]} rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer`}
      style={{ 
        background: `linear-gradient(135deg, ${color}40, ${color}60)`,
        boxShadow: `0 0 20px ${color}30`
      }}>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 animate-pulse-slow" style={{ background: `radial-gradient(circle at 50% 50%, ${color}20, transparent 70%)` }} />
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slow" />
      <span className="relative z-10 drop-shadow-lg">{icon}</span>
      <style>{`
        @keyframes shimmer-slow { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        .animate-shimmer-slow { animation: shimmer-slow 3s infinite; }
        .animate-pulse-slow { animation: pulse-slow 2s infinite; }
      `}</style>
    </div>
  );
});

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
    cyan: { from: 'from-cyan-500', to: 'to-blue-500', text: darkMode ? 'text-cyan-400' : 'text-cyan-600', hex: '#06b6d4' },
    emerald: { from: 'from-emerald-500', to: 'to-teal-500', text: darkMode ? 'text-emerald-400' : 'text-emerald-600', hex: '#10b981' },
    rose: { from: 'from-rose-500', to: 'to-pink-500', text: darkMode ? 'text-rose-400' : 'text-rose-600', hex: '#f43f5e' },
    purple: { from: 'from-purple-500', to: 'to-fuchsia-500', text: darkMode ? 'text-purple-400' : 'text-purple-600', hex: '#a855f7' }
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
        <SparklingLogo icon={<Icon className="w-6 h-6 text-white" />} color={c.hex} size="md" />
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
      <SparklingLogo icon={cat?.icon || '💰'} color={cat?.color || '#3b82f6'} size="sm" />
      <div className="flex-1 min-w-0">
        <div className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.libelle}</div>
        <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex-wrap`}>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {transaction.date}
          </span>
          <span className={`px-2 py-0.5 rounded-full ${darkMode ? 'bg-white/5' : 'bg-gray-200'}`}>{transaction.categorie}</span>
          {transaction.tags && transaction.tags.map(tag => (
            <span key={tag} className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {transaction.recurrente && (
            <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
              <Repeat className="w-3 h-3" />
              Récurrent
            </span>
          )}
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

const PatrimoineChart = memo(({ comptes, transactions, darkMode }) => {
  const evolutionData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const initial = comptes.reduce((sum, c) => sum + c.soldeInitial, 0);
    let patrimoine = initial;
    const monthlyData = { 'Initial': initial };
    
    sorted.forEach(t => {
      patrimoine += t.montant;
      const month = t.date.slice(0, 7);
      monthlyData[month] = patrimoine;
    });
    
    return Object.entries(monthlyData).slice(-6).map(([date, patrimoine]) => ({ date, patrimoine }));
  }, [comptes, transactions]);
  
  return (
    <GlassCard className="p-6" darkMode={darkMode}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Évolution du patrimoine</h3>
        <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={evolutionData}>
          <defs>
            <linearGradient id="patrimoineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="date" stroke={darkMode ? '#9ca3af' : '#6b7280'} tick={{ fontSize: 12 }} />
          <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              borderRadius: '12px'
            }}
          />
          <Area type="monotone" dataKey="patrimoine" stroke="#06b6d4" strokeWidth={3} fill="url(#patrimoineGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </GlassCard>
  );
});

const FABMenu = memo(({ onAction, darkMode, currentView }) => {
  const getActionForView = () => {
    switch(currentView) {
      case 'transactions':
        return { icon: Plus, label: 'Transaction', action: 'transaction', gradient: 'from-cyan-500 to-blue-500' };
      case 'comptes':
        return { icon: Wallet, label: 'Compte', action: 'compte', gradient: 'from-emerald-500 to-teal-500' };
      case 'objectifs':
        return { icon: Target, label: 'Objectif', action: 'objectif', gradient: 'from-purple-500 to-fuchsia-500' };
      case 'categories':
        return { icon: Tag, label: 'Catégorie', action: 'categorie', gradient: 'from-orange-500 to-rose-500' };
      case 'dashboard':
      case 'analytics':
        return null;
      default:
        return { icon: Plus, label: 'Transaction', action: 'transaction', gradient: 'from-cyan-500 to-blue-500' };
    }
  };
  
  const action = getActionForView();
  
  if (!action) return null;
  
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button onClick={() => onAction(action.action)}
        className={`flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r ${action.gradient} text-white font-semibold shadow-2xl hover:scale-110 transition-all backdrop-blur-xl border border-white/20 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
        <action.icon className="w-5 h-5 relative z-10" />
        <span className="relative z-10">{action.label}</span>
      </button>
      <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } } .animate-shimmer { animation: shimmer 2s infinite; }`}</style>
    </div>
  );
});

const ModernModal = memo(({ show, onClose, title, children, darkMode }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
      <GlassCard className="w-full max-w-md p-6 animate-scaleIn max-h-[90vh] overflow-y-auto" hover={false} darkMode={darkMode}>
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
    { value: 'autre', label: 'Autre', icon: '🏦' }
  ]);
  
  const [comptes, setComptes] = useLocalStorage('comptes', [
    { id: 1, nom: 'Compte courant', type: 'courant', soldeInitial: 2500, icon: '💳', color: '#3b82f6' },
    { id: 2, nom: 'PEA', type: 'trade_republic', soldeInitial: 5000, icon: '📊', color: '#10b981' },
    { id: 3, nom: 'Livret A', type: 'livret_a', soldeInitial: 3000, icon: '📘', color: '#06b6d4' }
  ]);
  
  const [transactions, setTransactions] = useLocalStorage('transactions', [
    { id: 1, date: '2025-10-01', libelle: 'Salaire', montant: 2500, type: 'REVENUS', categorie: 'Salaire', compteId: 1, tags: [], recurrente: true },
    { id: 2, date: '2025-10-01', libelle: 'Loyer', montant: -800, type: 'DÉPENSES', categorie: 'Logement', compteId: 1, tags: ['Fixe'], recurrente: true },
    { id: 3, date: '2025-10-02', libelle: 'Courses Carrefour', montant: -120, type: 'DÉPENSES', categorie: 'Alimentation', compteId: 1, tags: [] },
    { id: 4, date: '2025-10-03', libelle: 'Restaurant', montant: -45, type: 'DÉPENSES', categorie: 'Loisirs', compteId: 1, tags: ['Sortie'] }
  ]);
  
  const [objectifs, setObjectifs] = useLocalStorage('objectifs', [
    { id: 1, nom: 'Vacances été', montantCible: 2000, montantActuel: 1600, dateObjectif: '2025-07-01' },
    { id: 2, nom: 'Nouvelle voiture', montantCible: 15000, montantActuel: 8500, dateObjectif: '2026-01-01' }
  ]);
  
  const [budgets, setBudgets] = useLocalStorage('budgets', [
    { id: 1, categorie: 'Alimentation', montantMax: 400, mois: '2025-10' }
  ]);
  
  const [categories, setCategories] = useLocalStorage('categories', {
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
  const [showAddCategorie, setShowAddCategorie] = useState(false);
  const [categorieType, setCategorieType] = useState('depenses');
  const [selectedIcon, setSelectedIcon] = useState('💳');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isRecurrente, setIsRecurrente] = useState(false);
  const [showImportCSV, setShowImportCSV] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);
  
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
  
  const budgetAlerts = useMemo(() => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    return budgets.filter(b => {
      const depenses = Math.abs(transactions.filter(t => t.montant < 0 && t.categorie === b.categorie && t.date.startsWith(currentMonth)).reduce((s, t) => s + t.montant, 0));
      const pct = (depenses / b.montantMax) * 100;
      return pct >= 80;
    }).map(b => {
      const depenses = Math.abs(transactions.filter(t => t.montant < 0 && t.categorie === b.categorie && t.date.startsWith(currentMonth)).reduce((s, t) => s + t.montant, 0));
      return { ...b, depenses, pct: (depenses / b.montantMax) * 100 };
    });
  }, [budgets, transactions]);
  
  const topDepenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    return transactions
      .filter(t => t.montant < 0 && t.date.startsWith(currentMonth))
      .sort((a, b) => a.montant - b.montant)
      .slice(0, 5)
      .map(t => ({ ...t, montant: Math.abs(t.montant) }));
  }, [transactions]);
  
  const revenusVsDepenses = useMemo(() => {
    const monthlyData = {};
    transactions.forEach(t => {
      const month = t.date.slice(0, 7);
      if (!monthlyData[month]) monthlyData[month] = { month, revenus: 0, depenses: 0 };
      if (t.montant > 0) monthlyData[month].revenus += t.montant;
      else monthlyData[month].depenses += Math.abs(t.montant);
    });
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
  }, [transactions]);
  
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
    if (action === 'categorie') setShowAddCategorie(true);
  }, []);
  
  const ajouterTransaction = useCallback(() => {
    const date = document.getElementById('transDate')?.value;
    const libelle = document.getElementById('transLibelle')?.value;
    const montant = parseFloat(document.getElementById('transMontant')?.value) || 0;
    const type = document.getElementById('transType')?.value;
    const categorie = document.getElementById('transCategorie')?.value || 'Autre';
    const note = document.getElementById('transNote')?.value || '';
    
    if (!libelle) return;
    
    const nouvelle = {
      id: Date.now(),
      date: date || new Date().toISOString().split('T')[0],
      libelle,
      montant: type === 'DÉPENSES' ? -Math.abs(montant) : Math.abs(montant),
      type,
      categorie,
      compteId: comptes[0]?.id || 1,
      tags: selectedTags,
      recurrente: isRecurrente,
      note
    };
    setTransactions(prev => [nouvelle, ...prev]);
    setShowAddTransaction(false);
    setSelectedTags([]);
    setIsRecurrente(false);
  }, [setTransactions, selectedTags, isRecurrente, comptes]);
  
  const supprimerTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, [setTransactions]);
  
  const ajouterCompte = useCallback(() => {
    const nom = document.getElementById('compteNom')?.value;
    const type = document.getElementById('compteType')?.value || 'courant';
    const soldeInitial = parseFloat(document.getElementById('compteSolde')?.value) || 0;
    
    if (!nom) return;
    
    setComptes(prev => [...prev, { id: Date.now(), nom, type, soldeInitial, icon: selectedIcon, color: selectedColor }]);
    setShowAddCompte(false);
    setSelectedIcon('💳');
    setSelectedColor('#3b82f6');
  }, [setComptes, selectedIcon, selectedColor]);
  
  const modifierCompte = useCallback(() => {
    const nom = document.getElementById('editCompteNom')?.value;
    const type = document.getElementById('editCompteType')?.value;
    const soldeInitial = parseFloat(document.getElementById('editCompteSolde')?.value) || 0;
    
    if (!nom || !compteToEdit) return;
    
    setComptes(prev => prev.map(c => c.id === compteToEdit.id ? { ...c, nom, type, soldeInitial, icon: selectedIcon, color: selectedColor } : c));
    setShowEditCompte(false);
    setCompteToEdit(null);
  }, [setComptes, compteToEdit, selectedIcon, selectedColor]);
  
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
  
  const ajouterCategorie = useCallback(() => {
    const nom = document.getElementById('catNom')?.value;
    if (!nom) return;
    
    setCategories(prev => ({
      ...prev,
      [categorieType]: [...prev[categorieType], { id: Date.now(), nom, icon: selectedIcon, color: selectedColor }]
    }));
    setShowAddCategorie(false);
    setSelectedIcon('🍕');
    setSelectedColor('#ef4444');
  }, [setCategories, categorieType, selectedIcon, selectedColor]);
  
  const comptesAvecSoldes = useMemo(() => {
    return comptes.map(compte => {
      const transactionsCompte = transactions.filter(t => t.compteId === compte.id);
      const soldeActuel = compte.soldeInitial + transactionsCompte.reduce((sum, t) => sum + t.montant, 0);
      return { ...compte, soldeActuel };
    });
  }, [comptes, transactions]);
  
  const exportData = useCallback(() => {
    const data = { comptes, transactions, objectifs, categories, budgets };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  }, [comptes, transactions, objectifs, categories, budgets]);
  
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
              <SparklingLogo icon={<Layers className="w-5 h-5 text-white" />} color="#06b6d4" size="sm" />
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
            { id: 'categories', icon: Tag, label: 'Catégories', gradient: 'from-orange-500 to-rose-500' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics', gradient: 'from-pink-500 to-rose-500' }
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
              <div className="flex gap-2">
                <button onClick={() => setShowAlerts(!showAlerts)} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${darkMode ? 'bg-white/5 hover:bg-white/10 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
                  <Bell className="w-4 h-4" />
                  Alertes
                </button>
                <button onClick={exportData} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${darkMode ? 'bg-white/5 hover:bg-white/10 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
                  <Download className="w-4 h-4" />
                  Exporter
                </button>
              </div>
            </div>
            
            {showAlerts && budgetAlerts.length > 0 && (
              <div className="mb-6 space-y-3">
                {budgetAlerts.map(alert => (
                  <div key={alert.id} className={`flex items-center gap-4 p-4 rounded-2xl ${darkMode ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-100 border-orange-300'} border`}>
                    <AlertCircle className={darkMode ? 'text-orange-400' : 'text-orange-600'} />
                    <div className="flex-1">
                      <p className={`font-semibold ${textClass}`}>Budget {alert.categorie} dépassé à {alert.pct.toFixed(0)}%</p>
                      <p className={`text-sm ${mutedClass}`}>{alert.depenses.toFixed(0)}€ / {alert.montantMax}€</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
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
              <PatrimoineChart comptes={comptes} transactions={transactions} darkMode={darkMode} />
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
                <h3 className={`text-xl font-bold ${textClass} mb-6`}>Top 5 dépenses du mois</h3>
                <div className="space-y-3">
                  {topDepenses.map((t, index) => (
                    <div key={t.id} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${darkMode ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-700'}`}>{index + 1}</span>
                      <span className={`flex-1 ${textClass}`}>{t.libelle}</span>
                      <span className={`font-bold ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>{t.montant.toFixed(0)}€</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
            
            <GlassCard className="p-6" darkMode={darkMode}>
              <h3 className={`text-xl font-bold ${textClass} mb-6`}>Revenus vs Dépenses (6 derniers mois)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenusVsDepenses}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`, borderRadius: '12px' }} />
                  <Legend />
                  <Bar dataKey="revenus" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="depenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
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
                      <SparklingLogo icon={compte.icon || '💳'} color={compte.color || '#3b82f6'} size="lg" />
                      <div>
                        <h3 className={`font-bold ${textClass}`}>{compte.nom}</h3>
                        <p className={`text-xs ${mutedClass}`}>{typesComptes.find(t => t.value === compte.type)?.label}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setCompteToEdit(compte); setSelectedIcon(compte.icon || '💳'); setSelectedColor(compte.color || '#3b82f6'); setShowEditCompte(true); }} 
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
                      <SparklingLogo icon={<Target className="w-6 h-6 text-white" />} color="#a855f7" size="md" />
                    </div>
                    <div className={`relative h-4 rounded-full overflow-hidden mb-4 ${darkMode ? 'bg-white/5' : 'bg-gray-200'}`}>
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">{progress.toFixed(0)}%</div>
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
        
        {currentView === 'categories' && (
          <div className="p-6 md:p-10">
            <h2 className={`text-4xl font-bold ${textClass} mb-8`}>Gérer les catégories</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard className="p-6" darkMode={darkMode}>
                <h3 className={`text-xl font-bold ${textClass} mb-4`}>Catégories de dépenses</h3>
                <div className="space-y-3">
                  {categories.depenses.map(cat => (
                    <div key={cat.id} className={`flex items-center gap-4 p-4 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                      <SparklingLogo icon={cat.icon} color={cat.color} size="sm" />
                      <span className={`flex-1 font-medium ${textClass}`}>{cat.nom}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
              
              <GlassCard className="p-6" darkMode={darkMode}>
                <h3 className={`text-xl font-bold ${textClass} mb-4`}>Catégories de revenus</h3>
                <div className="space-y-3">
                  {categories.revenus.map(cat => (
                    <div key={cat.id} className={`flex items-center gap-4 p-4 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                      <SparklingLogo icon={cat.icon} color={cat.color} size="sm" />
                      <span className={`flex-1 font-medium ${textClass}`}>{cat.nom}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        )}
        
        {currentView === 'analytics' && (
          <div className="p-6 md:p-10">
            <h2 className={`text-4xl font-bold ${textClass} mb-8`}>Analytics avancés</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard className="p-6" darkMode={darkMode}>
                <h3 className={`text-xl font-bold ${textClass} mb-6`}>Évolution patrimoine (6 mois)</h3>
                <PatrimoineChart comptes={comptes} transactions={transactions} darkMode={darkMode} />
              </GlassCard>
              
              <GlassCard className="p-6" darkMode={darkMode}>
                <h3 className={`text-xl font-bold ${textClass} mb-6`}>Répartition dépenses</h3>
                {depensesParCategorie.length > 0 && (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={depensesParCategorie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                        {depensesParCategorie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </GlassCard>
            </div>
          </div>
        )}
      </div>
      
      <FABMenu onAction={handleFABAction} darkMode={darkMode} currentView={currentView} />
      
      <ModernModal show={showAddTransaction} onClose={() => setShowAddTransaction(false)} title="Nouvelle transaction" darkMode={darkMode}>
        <div className="space-y-4">
          <input type="date" id="transDate" defaultValue={new Date().toISOString().split('T')[0]} 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
          <input type="text" id="transLibelle" placeholder="Libellé" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
          <input type="number" id="transMontant" placeholder="Montant" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
          <select id="transType" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`}
            style={darkMode ? { colorScheme: 'dark' } : {}}>
            <option value="DÉPENSES">Dépense</option>
            <option value="REVENUS">Revenu</option>
          </select>
          <select id="transCategorie" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`}
            style={darkMode ? { colorScheme: 'dark' } : {}}>
            <option value="">Catégorie...</option>
            {categories.depenses.map(c => <option key={c.id} value={c.nom}>{c.icon} {c.nom}</option>)}
            {categories.revenus.map(c => <option key={c.id} value={c.nom}>{c.icon} {c.nom}</option>)}
          </select>
          <textarea id="transNote" placeholder="Note (optionnel)" rows={2}
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none`} />
          
          <label className={`flex items-center gap-2 cursor-pointer ${textClass}`}>
            <input type="checkbox" checked={isRecurrente} onChange={(e) => setIsRecurrente(e.target.checked)} className="w-4 h-4" />
            <Repeat className="w-4 h-4" />
            <span>Transaction récurrente</span>
          </label>
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
                <button key={emoji} onClick={() => setSelectedIcon(emoji)} type="button"
                  className={`text-3xl p-3 rounded-xl transition-all ${selectedIcon === emoji ? 'bg-gradient-to-r from-cyan-500 to-blue-500 scale-110' : (darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200')}`}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Couleur</label>
            <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} 
              className="w-full h-12 rounded-xl cursor-pointer" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={ajouterCompte} className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:scale-105 transition-all">Créer</button>
          <button onClick={() => { setShowAddCompte(false); setSelectedIcon('💳'); setSelectedColor('#3b82f6'); }} className={`px-6 py-3 rounded-2xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200'}`}>Annuler</button>
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
                <button key={emoji} onClick={() => setSelectedIcon(emoji)} type="button"
                  className={`text-3xl p-3 rounded-xl transition-all ${selectedIcon === emoji ? 'bg-gradient-to-r from-cyan-500 to-blue-500 scale-110' : (darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200')}`}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Couleur</label>
            <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} 
              className="w-full h-12 rounded-xl cursor-pointer" />
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
      
      <ModernModal show={showAddCategorie} onClose={() => setShowAddCategorie(false)} title="Nouvelle catégorie" darkMode={darkMode}>
        <div className="space-y-4">
          <select value={categorieType} onChange={(e) => setCategorieType(e.target.value)} 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`}>
            <option value="depenses">Dépense</option>
            <option value="revenus">Revenu</option>
          </select>
          
          <input type="text" id="catNom" placeholder="Nom de la catégorie" 
            className={`w-full px-4 py-3 border rounded-2xl ${inputClass} focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all`} />
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Choisir un emoji</label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJIS_CATEGORIES.map(emoji => (
                <button key={emoji} onClick={() => setSelectedIcon(emoji)} type="button"
                  className={`text-3xl p-3 rounded-xl transition-all ${selectedIcon === emoji ? 'bg-gradient-to-r from-orange-500 to-rose-500 scale-110' : (darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200')}`}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Couleur</label>
            <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} 
              className="w-full h-12 rounded-xl cursor-pointer" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={ajouterCategorie} className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold hover:scale-105 transition-all">Créer</button>
          <button onClick={() => { setShowAddCategorie(false); setSelectedIcon('🍕'); setSelectedColor('#ef4444'); }} className={`px-6 py-3 rounded-2xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200'}`}>Annuler</button>
        </div>
      </ModernModal>
    </div>
  );
};

export default BudgetApp;
