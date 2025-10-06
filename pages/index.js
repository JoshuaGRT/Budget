import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Menu, Home, CreditCard, Target, Wallet, TrendingUp, TrendingDown, Plus, X, ArrowRight, Calendar, Trash2, Edit, Tag, Bell, Download, Search, BarChart3, Sun, Moon, Repeat, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => initialValue);
  const setValue = value => setStoredValue(value);
  return [storedValue, setValue];
};

const EMOJIS_COMPTES = ['💳', '📘', '👴', '🏡', '₿', '📊', '💰', '🏦', '💎', '🎯', '🚀', '🌟', '💵', '🏪', '🎁'];
const EMOJIS_CATEGORIES = ['🍕', '🏠', '🚗', '🎮', '✈️', '🏥', '📚', '🎬', '💼', '💻', '🎨', '⚽', '🍔', '👕', '🎵'];

const MinimalIcon = memo(({ icon, color }) => (
  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all" style={{ background: `${color}08` }}>
    <span className="text-xl">{icon}</span>
  </div>
));

const StatCard = memo(({ label, value, trend, isPositive, darkMode }) => (
  <div className={`rounded-3xl p-6 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-lg'} hover:scale-105 transition-all cursor-pointer`}>
    <div className={`text-sm mb-2 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
    <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</div>
    {trend !== undefined && (
      <div className={`text-sm flex items-center gap-1 font-semibold ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {Math.abs(trend).toFixed(1)}%
      </div>
    )}
  </div>
));

const TransactionItem = memo(({ transaction, categories, onDelete, darkMode }) => {
  const cat = [...categories.depenses, ...categories.revenus].find(c => c.nom === transaction.categorie);
  const isPositive = transaction.montant > 0;
  
  return (
    <div className={`group flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
      <div className="flex items-center gap-4 flex-1">
        <MinimalIcon icon={cat?.icon || '💰'} color={cat?.color || '#8B3DFF'} />
        <div className="flex-1 min-w-0">
          <div className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.libelle}</div>
          <div className={`text-sm flex items-center gap-2 flex-wrap ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(transaction.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>{transaction.categorie}</span>
            {transaction.tags && transaction.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs flex items-center gap-1 font-medium">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {transaction.recurrente && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center gap-1 font-medium">
                <Repeat className="w-3 h-3" />
                Récurrent
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className={`text-lg font-bold ${isPositive ? 'text-emerald-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>
          {isPositive ? '+' : ''}{transaction.montant.toFixed(0)}€
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(transaction.id); }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-500 transition-all p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

const Modal = memo(({ show, onClose, title, children, darkMode }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={`w-full max-w-md rounded-3xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl`}>
        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <button onClick={onClose} className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-900'} transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
});

const BudgetApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [showAlerts, setShowAlerts] = useState(true);
  
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddCompte, setShowAddCompte] = useState(false);
  const [showEditCompte, setShowEditCompte] = useState(false);
  const [compteToEdit, setCompteToEdit] = useState(null);
  const [showAddObjectif, setShowAddObjectif] = useState(false);
  const [showAddCategorie, setShowAddCategorie] = useState(false);
  const [showEditCategorie, setShowEditCategorie] = useState(false);
  const [categorieToEdit, setCategorieToEdit] = useState(null);
  const [categorieType, setCategorieType] = useState('depenses');
  const [selectedIcon, setSelectedIcon] = useState('💳');
  const [selectedColor, setSelectedColor] = useState('#8B3DFF');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isRecurrente, setIsRecurrente] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  
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
    { id: 1, nom: 'Compte courant', type: 'courant', soldeInitial: 2500, icon: '💳', color: '#8B3DFF' },
    { id: 2, nom: 'PEA', type: 'trade_republic', soldeInitial: 5000, icon: '📊', color: '#10b981' },
    { id: 3, nom: 'Livret A', type: 'livret_a', soldeInitial: 3000, icon: '📘', color: '#3b82f6' }
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
      { id: 4, nom: 'Loisirs', icon: '🎮', color: '#a855f7' }
    ],
    revenus: [
      { id: 1, nom: 'Salaire', icon: '💼', color: '#10b981' },
      { id: 2, nom: 'Freelance', icon: '💻', color: '#14b8a6' }
    ]
  });
  
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
    
    const sorted = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
    
    if (selectedPeriod === '6months') {
      return sorted.slice(-6).map(d => ({ ...d, month: d.month.split('-').reverse().join('/') }));
    } else if (selectedPeriod === 'year') {
      return sorted.slice(-12).map(d => ({ ...d, month: d.month.split('-').reverse().join('/') }));
    } else {
      return sorted.map(d => ({ ...d, month: d.month.split('-').reverse().join('/') }));
    }
  }, [transactions, selectedPeriod]);
  
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
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
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
  
  const chartData = useMemo(() => {
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
    
    if (!libelle || montant === 0) return;
    
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
    setSelectedColor('#8B3DFF');
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
    
    if (!nom || montantCible === 0) return;
    
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
    setSelectedColor('#8B3DFF');
  }, [setCategories, categorieType, selectedIcon, selectedColor]);
  
  const modifierCategorie = useCallback(() => {
    const nom = document.getElementById('editCatNom')?.value;
    if (!nom || !categorieToEdit) return;
    
    const type = categorieToEdit.type;
    setCategories(prev => ({
      ...prev,
      [type]: prev[type].map(c => c.id === categorieToEdit.id ? { ...c, nom, icon: selectedIcon, color: selectedColor } : c)
    }));
    setShowEditCategorie(false);
    setCategorieToEdit(null);
  }, [setCategories, categorieToEdit, selectedIcon, selectedColor]);
  
  const supprimerCategorie = useCallback((id, type) => {
    setCategories(prev => ({
      ...prev,
      [type]: prev[type].filter(c => c.id !== id)
    }));
  }, [setCategories]);
  
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
  
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Accueil' },
    { id: 'transactions', icon: CreditCard, label: 'Transactions' },
    { id: 'comptes', icon: Wallet, label: 'Comptes' },
    { id: 'objectifs', icon: Target, label: 'Objectifs' },
    { id: 'categories', icon: Tag, label: 'Catégories' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' }
  ];
  
  const COLORS = ['#8B3DFF', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  
  const bgClass = darkMode ? 'bg-gray-950' : 'bg-gray-50';
  const sidebarClass = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const mutedClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputClass = `w-full rounded-2xl px-4 py-3 outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'} border-2`;
  
  return (
    <div className={`flex h-screen ${bgClass}`}>
      <div className={`${sidebarOpen ? 'w-64' : 'w-0 md:w-20'} ${sidebarClass} border-r flex flex-col transition-all fixed md:relative h-full z-30`}>
        <div className={`p-6 flex items-center justify-between border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          {sidebarOpen && (
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Budget Pro
              </div>
              <div className={`${mutedClass} text-sm mt-1`}>Gestion financière</div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`${mutedClass} hover:${textClass} transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl`}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-2 transition-all ${
                currentView === item.id 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                  : `${mutedClass} ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} hover:${textClass}`
              }`}>
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
              {currentView === item.id && sidebarOpen && <ArrowRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>
        
        <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <button onClick={() => setDarkMode(!darkMode)} className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} gap-2 px-4 py-3 rounded-2xl transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} ${mutedClass}`}>
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {sidebarOpen && <span className="text-sm font-medium">{darkMode ? 'Mode clair' : 'Mode sombre'}</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {currentView === 'dashboard' && (
          <div className="max-w-7xl mx-auto p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className={`text-4xl font-bold ${textClass} mb-2`}>Bonjour 👋</h1>
                <p className={mutedClass}>Voici votre situation financière</p>
              </div>
              <div className="flex gap-2">
                {budgetAlerts.length > 0 && (
                  <button onClick={() => setShowAlerts(!showAlerts)} className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-md'} ${mutedClass}`}>
                    <Bell className="w-4 h-4" />
                    {budgetAlerts.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {budgetAlerts.length}
                      </span>
                    )}
                    Alertes
                  </button>
                )}
                <button onClick={exportData} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-md'} ${mutedClass}`}>
                  <Download className="w-4 h-4" />
                  Exporter
                </button>
              </div>
            </div>
            
            {showAlerts && budgetAlerts.length > 0 && (
              <div className="mb-6 space-y-3">
                {budgetAlerts.map(alert => (
                  <div key={alert.id} className={`flex items-center gap-4 p-4 rounded-2xl ${darkMode ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-200'} border-2 animate-slideUp`}>
                    <Bell className="text-orange-500 animate-bounce" />
                    <div className="flex-1">
                      <p className={`font-semibold ${textClass}`}>Budget {alert.categorie} dépassé à {alert.pct.toFixed(0)}%</p>
                      <p className={`text-sm ${mutedClass}`}>{alert.depenses.toFixed(0)}€ / {alert.montantMax}€</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard label="Patrimoine total" value={`${stats.soldeTotal.toFixed(0)}€`} darkMode={darkMode} />
              <StatCard label="Revenus du mois" value={`${stats.totalRevenus.toFixed(0)}€`} trend={stats.trendRevenus} isPositive={true} darkMode={darkMode} />
              <StatCard label="Dépenses du mois" value={`${stats.totalDepenses.toFixed(0)}€`} trend={stats.trendDepenses} isPositive={false} darkMode={darkMode} />
              <StatCard label="Épargne" value={`${stats.epargne.toFixed(0)}€`} isPositive={stats.epargne >= 0} darkMode={darkMode} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className={`lg:col-span-2 rounded-3xl p-6 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-lg'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${textClass}`}>Transactions récentes</h2>
                  <button onClick={() => setCurrentView('transactions')} className="text-purple-600 text-sm flex items-center gap-1 hover:gap-2 transition-all font-medium">
                    Voir tout <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {transactions.slice(0, 5).map(t => (
                    <TransactionItem key={t.id} transaction={t} categories={categories} onDelete={supprimerTransaction} darkMode={darkMode} />
                  ))}
                </div>
              </div>
              
              <div className={`rounded-3xl p-6 ${darkMode ? 'bg-gradient-to-br from-purple-900 to-blue-900' : 'bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Évolution</h3>
                  <TrendingUp className="w-5 h-5 text-white/80" />
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#ffffff80" tick={{ fill: '#ffffff', fontSize: 12 }} />
                    <YAxis stroke="#ffffff80" tick={{ fill: '#ffffff', fontSize: 12 }} />
                    <Area type="monotone" dataKey="patrimoine" stroke="#ffffff" strokeWidth={2} fill="url(#gradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className={`rounded-3xl p-6 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-lg'}`}>
                <h3 className={`text-xl font-bold ${textClass} mb-6`}>Dépenses par catégorie</h3>
                {depensesParCategorie.length > 0 && (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={depensesParCategorie} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                        {depensesParCategorie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              
              <div className={`rounded-3xl p-6 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-lg'}`}>
                <h3 className={`text-xl font-bold ${textClass} mb-6`}>Top 5 dépenses</h3>
                <div className="space-y-3">
                  {topDepenses.map((t, index) => (
                    <div key={t.id} className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>{index + 1}</span>
                      <span className={`flex-1 ${textClass} truncate`}>{t.libelle}</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t.montant.toFixed(0)}€</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={`rounded-3xl p-6 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-lg'}`}>
              <h3 className={`text-xl font-bold ${textClass} mb-6`}>Revenus vs Dépenses</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenusVsDepenses}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Bar dataKey="revenus" fill="#10b981" radius={[12, 12, 0, 0]} />
                  <Bar dataKey="depenses" fill="#ef4444" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {currentView === 'transactions' && (
          <div className="max-w-7xl mx-auto p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className={`text-4xl font-bold ${textClass} mb-2`}>Transactions</h1>
                <p className={mutedClass}>Historique complet de vos opérations</p>
              </div>
              <button onClick={() => setShowAddTransaction(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nouvelle transaction
              </button>
            </div>
            
            <div className={`rounded-3xl p-4 mb-6 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-lg'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className={`absolute left-3 top-3.5 w-5 h-5 ${mutedClass}`} />
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher une transaction..." className={`${inputClass} pl-11`} />
                </div>
                <div className="relative">
                  <Filter className={`absolute left-3 top-3.5 w-5 h-5 ${mutedClass}`} />
                  <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)} className={`${inputClass} pl-11`} style={darkMode ? { colorScheme: 'dark' } : {}}>
                    <option value="all">Toutes les périodes</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className={`rounded-3xl p-6 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-lg'}`}>
              <div className="space-y-2">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map(t => (
                    <TransactionItem key={t.id} transaction={t} categories={categories} onDelete={supprimerTransaction} darkMode={darkMode} />
                  ))
                ) : (
                  <div className={`text-center py-12 ${mutedClass}`}>
                    <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Aucune transaction trouvée</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'comptes' && (
          <div className="max-w-7xl mx-auto p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className={`text-4xl font-bold ${textClass} mb-2`}>Mes comptes</h1>
                <p className={mutedClass}>Gérez tous vos comptes en un seul endroit</p>
              </div>
              <button onClick={() => setShowAddCompte(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nouveau compte
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comptesAvecSoldes.map(compte => (
                <div key={compte.id} className={`rounded-3xl p-6 hover:scale-105 transition-all ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-lg'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${compte.color}15` }}>
                        {compte.icon}
                      </div>
                      <div>
                        <div className={`font-bold ${textClass}`}>{compte.nom}</div>
                        <div className={`text-sm ${mutedClass}`}>{typesComptes.find(t => t.value === compte.type)?.label}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setCompteToEdit(compte); setSelectedIcon(compte.icon || '💳'); setSelectedColor(compte.color || '#8B3DFF'); setShowEditCompte(true); }} className={`${mutedClass} hover:text-blue-500 transition-colors p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl`}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => supprimerCompte(compte.id)} className={`${mutedClass} hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className={`text-3xl font-bold mb-2 ${textClass}`}>{compte.soldeActuel.toFixed(2)}€</div>
                  <div className={`text-sm ${mutedClass}`}>Solde initial: {compte.soldeInitial.toFixed(2)}€</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {currentView === 'objectifs' && (
          <div className="max-w-7xl mx-auto p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className={`text-4xl font-bold ${textClass} mb-2`}>Objectifs</h1>
                <p className={mutedClass}>Atteignez vos objectifs financiers</p>
              </div>
              <button onClick={() => setShowAddObjectif(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nouvel objectif
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {objectifs.map(obj => {
                const progress = (obj.montantActuel / obj.montantCible) * 100;
                return (
                  <div key={obj.id} className={`rounded-3xl p-8 hover:scale-105 transition-all ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-lg'}`}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className={`text-2xl font-bold mb-2 ${textClass}`}>{obj.nom}</div>
                        <div className={`${mutedClass} flex items-center gap-2`}>
                          <Calendar className="w-4 h-4" />
                          {new Date(obj.dateObjectif).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className={`relative h-3 rounded-full mb-4 overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{progress.toFixed(0)}%</div>
                    </div>
                    <div className={`flex items-center justify-between pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                      <div>
                        <p className={`text-xs ${mutedClass} mb-1`}>Actuel</p>
                        <p className={`font-bold ${textClass}`}>{obj.montantActuel.toFixed(0)}€</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs ${mutedClass} mb-1`}>Objectif</p>
                        <p className={`font-bold ${textClass}`}>{obj.montantCible.toFixed(0)}€</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {currentView === 'categories' && (
          <div className="max-w-7xl mx-auto p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className={`text-4xl font-bold ${textClass} mb-2`}>Catégories</h1>
                <p className={mutedClass}>Organisez vos transactions</p>
              </div>
              <button onClick={() => setShowAddCategorie(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nouvelle catégorie
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`rounded-3xl p-6 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-lg'}`}>
                <h3 className={`text-xl font-bold ${textClass} mb-4`}>Dépenses</h3>
                <div className="space-y-3">
                  {categories.depenses.map(cat => (
                    <div key={cat.id} className={`flex items-center gap-4 p-4 rounded-2xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} transition-all`}>
                      <MinimalIcon icon={cat.icon} color={cat.color} />
                      <span className={`flex-1 font-medium ${textClass}`}>{cat.nom}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`rounded-3xl p-6 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-lg'}`}>
                <h3 className={`text-xl font-bold ${textClass} mb-4`}>Revenus</h3>
                <div className="space-y-3">
                  {categories.revenus.map(cat => (
                    <div key={cat.id} className={`flex items-center gap-4 p-4 rounded-2xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} transition-all`}>
                      <MinimalIcon icon={cat.icon} color={cat.color} />
                      <span className={`flex-1 font-medium ${textClass}`}>{cat.nom}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'analytics' && (
          <div className="max-w-7xl mx-auto p-8">
            <div className="mb-8">
              <h1 className={`text-4xl font-bold ${textClass} mb-2`}>Analytics</h1>
              <p className={mutedClass}>Analyses détaillées de vos finances</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`rounded-3xl p-6 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-lg'}`}>
                <h3 className={`text-xl font-bold ${textClass} mb-6`}>Évolution patrimoine</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B3DFF" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#8B3DFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="date" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="patrimoine" stroke="#8B3DFF" strokeWidth={3} fill="url(#gradient2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className={`rounded-3xl p-6 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-lg'}`}>
                <h3 className={`text-xl font-bold ${textClass} mb-6`}>Répartition dépenses</h3>
                {depensesParCategorie.length > 0 && (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={depensesParCategorie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                        {depensesParCategorie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {['transactions', 'comptes', 'objectifs', 'categories'].includes(currentView) && (
        <button 
          onClick={() => handleFABAction(currentView === 'transactions' ? 'transaction' : currentView === 'comptes' ? 'compte' : currentView === 'objectifs' ? 'objectif' : 'categorie')} 
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-5 rounded-full font-semibold hover:shadow-2xl hover:scale-110 transition-all shadow-lg">
          <Plus className="w-6 h-6" />
        </button>
      )}
      
      <Modal show={showAddTransaction} onClose={() => setShowAddTransaction(false)} title="Nouvelle transaction" darkMode={darkMode}>
        <div className="space-y-4">
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Date</label>
            <input type="date" id="transDate" defaultValue={new Date().toISOString().split('T')[0]} className={inputClass} />
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Libellé</label>
            <input type="text" id="transLibelle" placeholder="Ex: Courses Carrefour" className={inputClass} />
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Montant (€)</label>
            <input type="number" id="transMontant" placeholder="0.00" step="0.01" className={inputClass} />
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Type</label>
            <select id="transType" className={inputClass} style={darkMode ? { colorScheme: 'dark' } : {}}>
              <option value="DÉPENSES">Dépense</option>
              <option value="REVENUS">Revenu</option>
            </select>
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Catégorie</label>
            <select id="transCategorie" className={inputClass} style={darkMode ? { colorScheme: 'dark' } : {}}>
              <option value="">Choisir...</option>
              {categories.depenses.map(c => <option key={c.id} value={c.nom}>{c.icon} {c.nom}</option>)}
              {categories.revenus.map(c => <option key={c.id} value={c.nom}>{c.icon} {c.nom}</option>)}
            </select>
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Note (optionnel)</label>
            <textarea id="transNote" placeholder="Ajouter une note..." rows={2} className={inputClass} />
          </div>
          <label className={`flex items-center gap-2 cursor-pointer ${textClass}`}>
            <input type="checkbox" checked={isRecurrente} onChange={(e) => setIsRecurrente(e.target.checked)} className="w-5 h-5 rounded accent-purple-600" />
            <Repeat className="w-4 h-4" />
            <span className="font-medium">Transaction récurrente</span>
          </label>
          <button onClick={ajouterTransaction} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all">
            Ajouter la transaction
          </button>
        </div>
      </Modal>
      
      <Modal show={showAddCompte} onClose={() => setShowAddCompte(false)} title="Nouveau compte" darkMode={darkMode}>
        <div className="space-y-4">
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Nom du compte</label>
            <input type="text" id="compteNom" placeholder="Ex: Compte courant" className={inputClass} />
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Type</label>
            <select id="compteType" className={inputClass} style={darkMode ? { colorScheme: 'dark' } : {}}>
              {typesComptes.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Solde initial (€)</label>
            <input type="number" id="compteSolde" placeholder="0.00" step="0.01" className={inputClass} />
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Choisir un logo</label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJIS_COMPTES.map(emoji => (
                <button key={emoji} onClick={() => setSelectedIcon(emoji)} type="button" className={`text-3xl p-3 rounded-xl transition-all ${selectedIcon === emoji ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-110' : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Couleur</label>
            <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer" />
          </div>
          <button onClick={ajouterCompte} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all">
            Créer le compte
          </button>
        </div>
      </Modal>
      
      <Modal show={showEditCompte} onClose={() => { setShowEditCompte(false); setCompteToEdit(null); }} title="Modifier le compte" darkMode={darkMode}>
        <div className="space-y-4">
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Nom du compte</label>
            <input type="text" id="editCompteNom" defaultValue={compteToEdit?.nom} placeholder="Ex: Compte courant" className={inputClass} />
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Type</label>
            <select id="editCompteType" defaultValue={compteToEdit?.type} className={inputClass} style={darkMode ? { colorScheme: 'dark' } : {}}>
              {typesComptes.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Solde initial (€)</label>
            <input type="number" id="editCompteSolde" defaultValue={compteToEdit?.soldeInitial} placeholder="0.00" step="0.01" className={inputClass} />
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Choisir un logo</label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJIS_COMPTES.map(emoji => (
                <button key={emoji} onClick={() => setSelectedIcon(emoji)} type="button" className={`text-3xl p-3 rounded-xl transition-all ${selectedIcon === emoji ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-110' : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Couleur</label>
            <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer" />
          </div>
          <button onClick={modifierCompte} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all">
            Modifier le compte
          </button>
        </div>
      </Modal>
      
      <Modal show={showAddObjectif} onClose={() => setShowAddObjectif(false)} title="Nouvel objectif" darkMode={darkMode}>
        <div className="space-y-4">
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Nom de l'objectif</label>
            <input type="text" id="objNom" placeholder="Ex: Vacances été" className={inputClass} />
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Montant cible (€)</label>
            <input type="number" id="objCible" placeholder="0.00" step="0.01" className={inputClass} />
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Montant actuel (€)</label>
            <input type="number" id="objActuel" placeholder="0.00" step="0.01" className={inputClass} />
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Date objectif</label>
            <input type="date" id="objDate" className={inputClass} />
          </div>
          <button onClick={ajouterObjectif} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all">
            Créer l'objectif
          </button>
        </div>
      </Modal>
      
      <Modal show={showAddCategorie} onClose={() => setShowAddCategorie(false)} title="Nouvelle catégorie" darkMode={darkMode}>
        <div className="space-y-4">
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Type</label>
            <select value={categorieType} onChange={(e) => setCategorieType(e.target.value)} className={inputClass} style={darkMode ? { colorScheme: 'dark' } : {}}>
              <option value="depenses">Dépense</option>
              <option value="revenus">Revenu</option>
            </select>
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Nom de la catégorie</label>
            <input type="text" id="catNom" placeholder="Ex: Alimentation" className={inputClass} />
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Choisir un emoji</label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJIS_CATEGORIES.map(emoji => (
                <button key={emoji} onClick={() => setSelectedIcon(emoji)} type="button" className={`text-3xl p-3 rounded-xl transition-all ${selectedIcon === emoji ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-110' : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={`${mutedClass} text-sm mb-2 block font-medium`}>Couleur</label>
            <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer" />
          </div>
          <button onClick={ajouterCategorie} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all">
            Créer la catégorie
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BudgetApp;
