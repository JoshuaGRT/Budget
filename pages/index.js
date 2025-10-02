import React, { useState, useEffect } from 'react';
import { Menu, Home, CreditCard, Target, Settings, User, Plus, TrendingUp, TrendingDown, Wallet, Calendar, Trash2, Download, Upload, Search, Sun, Moon, BarChart3, PieChart, AlertCircle, CheckCircle } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BudgetApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [config, setConfig] = useState({
    devise: '€',
    langue: 'fr',
    theme: darkMode ? 'dark' : 'light'
  });
  
  const [profil, setProfil] = useState({
    nom: 'Jean Dupont',
    email: 'jean.dupont@example.com'
  });
  
  const [comptes, setComptes] = useState([
    { id: 1, nom: 'Compte courant', type: 'courant', soldeInitial: 2500, soldeActuel: 2500, couleur: '#3b82f6' },
    { id: 2, nom: 'Compte épargne', type: 'epargne', soldeInitial: 5000, soldeActuel: 5000, couleur: '#10b981' }
  ]);
  
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2025-10-01', libelle: 'Salaire', montant: 2500, type: 'REVENUS', categorie: 'Salaire', compteId: 1, tags: [] },
    { id: 2, date: '2025-10-01', libelle: 'Loyer', montant: -800, type: 'DÉPENSES', categorie: 'Logement', compteId: 1, tags: ['urgent'] },
    { id: 3, date: '2025-10-02', libelle: 'Courses Carrefour', montant: -120, type: 'DÉPENSES', categorie: 'Alimentation', compteId: 1, tags: ['personnel'] },
    { id: 4, date: '2025-09-28', libelle: 'Restaurant', montant: -45, type: 'DÉPENSES', categorie: 'Loisirs', compteId: 1, tags: [] },
    { id: 5, date: '2025-09-25', libelle: 'Essence', montant: -60, type: 'DÉPENSES', categorie: 'Transport', compteId: 1, tags: [] }
  ]);
  
  const [objectifs, setObjectifs] = useState([
    { id: 1, nom: 'Vacances d\'été', montantCible: 2000, montantActuel: 500, dateObjectif: '2025-07-01', categorie: 'Voyage' },
    { id: 2, nom: 'Nouvelle voiture', montantCible: 15000, montantActuel: 3000, dateObjectif: '2026-01-01', categorie: 'Transport' }
  ]);
  
  const [transactionsRecurrentes, setTransactionsRecurrentes] = useState([
    { id: 1, libelle: 'Loyer', montant: -800, type: 'DÉPENSES', categorie: 'Logement', jour: 1, actif: true },
    { id: 2, libelle: 'Salaire', montant: 2500, type: 'REVENUS', categorie: 'Salaire', jour: 1, actif: true },
    { id: 3, libelle: 'Abonnement Internet', montant: -35, type: 'DÉPENSES', categorie: 'Logement', jour: 5, actif: true }
  ]);
  
  const [budgets, setBudgets] = useState([
    { id: 1, categorie: 'Alimentation', montantMax: 400, mois: '2025-10' },
    { id: 2, categorie: 'Transport', montantMax: 200, mois: '2025-10' },
    { id: 3, categorie: 'Loisirs', montantMax: 150, mois: '2025-10' }
  ]);
  
  const [tags, setTags] = useState(['personnel', 'professionnel', 'urgent']);
  
  const categories = {
    depenses: [
      { id: 1, nom: 'Alimentation', icon: '🍕', color: '#ef4444' },
      { id: 2, nom: 'Logement', icon: '🏠', color: '#f59e0b' },
      { id: 3, nom: 'Transport', icon: '🚗', color: '#3b82f6' },
      { id: 4, nom: 'Santé', icon: '💊', color: '#ec4899' },
      { id: 5, nom: 'Loisirs', icon: '🎮', color: '#8b5cf6' },
      { id: 6, nom: 'Shopping', icon: '🛍️', color: '#06b6d4' }
    ],
    revenus: [
      { id: 1, nom: 'Salaire', icon: '💼', color: '#10b981' },
      { id: 2, nom: 'Freelance', icon: '💻', color: '#14b8a6' },
      { id: 3, nom: 'Investissements', icon: '📈', color: '#059669' },
      { id: 4, nom: 'Autres', icon: '💰', color: '#22c55e' }
    ],
    placements: [
      { id: 1, nom: 'Actions', icon: '📊', color: '#6366f1' },
      { id: 2, nom: 'Épargne', icon: '🏦', color: '#8b5cf6' },
      { id: 3, nom: 'Crypto', icon: '₿', color: '#a855f7' }
    ]
  };
  
  const typesComptes = [
    { value: 'courant', label: 'Compte courant', icon: '💳' },
    { value: 'epargne', label: 'Compte épargne', icon: '🏦' },
    { value: 'investissement', label: 'Investissement', icon: '📈' }
  ];
  
  const [showAddCompte, setShowAddCompte] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddObjectif, setShowAddObjectif] = useState(false);
  const [showAddRecurrente, setShowAddRecurrente] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  const [newCompte, setNewCompte] = useState({ nom: '', type: 'courant', soldeInitial: 0, couleur: '#3b82f6' });
  const [newTransaction, setNewTransaction] = useState({ date: new Date().toISOString().split('T')[0], libelle: '', montant: 0, type: 'DÉPENSES', categorie: '', compteId: 1, tags: [] });
  const [newObjectif, setNewObjectif] = useState({ nom: '', montantCible: 0, montantActuel: 0, dateObjectif: '', categorie: '' });
  const [newRecurrente, setNewRecurrente] = useState({ libelle: '', montant: 0, type: 'DÉPENSES', categorie: '', jour: 1 });
  const [newTag, setNewTag] = useState('');
  const [newBudget, setNewBudget] = useState({ categorie: '', montantMax: 0, mois: new Date().toISOString().slice(0, 7) });
  
  const [filtreType, setFiltreType] = useState('TOUS');
  const [filtreCategorie, setFiltreCategorie] = useState('');
  const [filtreCompte, setFiltreCompte] = useState('');
  
  useEffect(() => {
    const nouveauxComptes = comptes.map(compte => {
      const transactionsCompte = transactions.filter(t => t.compteId === compte.id);
      const solde = compte.soldeInitial + transactionsCompte.reduce((sum, t) => sum + t.montant, 0);
      return { ...compte, soldeActuel: solde };
    });
    setComptes(nouveauxComptes);
  }, [transactions]);
  
  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);
  
  const ajouterCompte = () => {
    if (!newCompte.nom) return showToast('Veuillez entrer un nom', 'error');
    const nouveauCompte = { id: Date.now(), ...newCompte, soldeActuel: newCompte.soldeInitial };
    setComptes([...comptes, nouveauCompte]);
    setNewCompte({ nom: '', type: 'courant', soldeInitial: 0, couleur: '#3b82f6' });
    setShowAddCompte(false);
    showToast('Compte créé avec succès', 'success');
  };
  
  const ajouterTransaction = () => {
    if (!newTransaction.libelle || !newTransaction.categorie) {
      return showToast('Veuillez remplir tous les champs', 'error');
    }
    const nouvelleTransaction = {
      id: Date.now(),
      ...newTransaction,
      montant: newTransaction.type === 'DÉPENSES' ? -Math.abs(newTransaction.montant) : Math.abs(newTransaction.montant)
    };
    setTransactions([nouvelleTransaction, ...transactions]);
    setNewTransaction({ date: new Date().toISOString().split('T')[0], libelle: '', montant: 0, type: 'DÉPENSES', categorie: '', compteId: comptes[0]?.id || 1, tags: [] });
    setShowAddTransaction(false);
    showToast('Transaction ajoutée', 'success');
  };
  
  const ajouterObjectif = () => {
    if (!newObjectif.nom || newObjectif.montantCible <= 0) {
      return showToast('Veuillez remplir tous les champs', 'error');
    }
    const nouvelObjectif = { id: Date.now(), ...newObjectif };
    setObjectifs([...objectifs, nouvelObjectif]);
    setNewObjectif({ nom: '', montantCible: 0, montantActuel: 0, dateObjectif: '', categorie: '' });
    setShowAddObjectif(false);
    showToast('Objectif créé', 'success');
  };
  
  const ajouterTransactionRecurrente = () => {
    if (!newRecurrente.libelle || !newRecurrente.categorie) {
      return showToast('Veuillez remplir tous les champs', 'error');
    }
    const nouvelleRecurrente = { id: Date.now(), ...newRecurrente, actif: true };
    setTransactionsRecurrentes([...transactionsRecurrentes, nouvelleRecurrente]);
    setNewRecurrente({ libelle: '', montant: 0, type: 'DÉPENSES', categorie: '', jour: 1 });
    setShowAddRecurrente(false);
    showToast('Transaction récurrente créée', 'success');
  };
  
  const ajouterTag = () => {
    if (!newTag || tags.includes(newTag)) {
      return showToast('Tag invalide ou déjà existant', 'error');
    }
    setTags([...tags, newTag]);
    setNewTag('');
    setShowAddTag(false);
    showToast('Tag créé', 'success');
  };
  
  const ajouterBudget = () => {
    if (!newBudget.categorie || newBudget.montantMax <= 0) {
      return showToast('Veuillez remplir tous les champs', 'error');
    }
    const nouveauBudget = { id: Date.now(), ...newBudget };
    setBudgets([...budgets, nouveauBudget]);
    setNewBudget({ categorie: '', montantMax: 0, mois: new Date().toISOString().slice(0, 7) });
    setShowAddBudget(false);
    showToast('Budget créé', 'success');
  };
  
  const supprimerTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    showToast('Transaction supprimée', 'success');
  };
  
  const supprimerObjectif = (id) => {
    setObjectifs(objectifs.filter(o => o.id !== id));
    showToast('Objectif supprimé', 'success');
  };
  
  const exporterDonnees = () => {
    const data = { comptes, transactions, objectifs, transactionsRecurrentes, budgets, tags, profil, config };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Données exportées', 'success');
  };
  
  const importerDonnees = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.comptes) setComptes(data.comptes);
        if (data.transactions) setTransactions(data.transactions);
        if (data.objectifs) setObjectifs(data.objectifs);
        if (data.transactionsRecurrentes) setTransactionsRecurrentes(data.transactionsRecurrentes);
        if (data.budgets) setBudgets(data.budgets);
        if (data.tags) setTags(data.tags);
        if (data.profil) setProfil(data.profil);
        if (data.config) setConfig(data.config);
        showToast('Données importées avec succès', 'success');
      } catch (error) {
        showToast('Erreur lors de l\'importation', 'error');
      }
    };
    reader.readAsText(file);
  };
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };
  
  const stats = {
    totalRevenus: transactions.filter(t => t.montant > 0).reduce((sum, t) => sum + t.montant, 0),
    totalDepenses: Math.abs(transactions.filter(t => t.montant < 0).reduce((sum, t) => sum + t.montant, 0)),
    soldeTotal: comptes.reduce((sum, c) => sum + c.soldeActuel, 0),
    nbTransactions: transactions.length
  };
  
  const transactionsFiltrees = transactions.filter(t => {
    if (filtreType !== 'TOUS' && t.type !== filtreType) return false;
    if (filtreCategorie && t.categorie !== filtreCategorie) return false;
    if (filtreCompte && t.compteId !== parseInt(filtreCompte)) return false;
    if (searchTerm && !t.libelle.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });
  
  const getDepensesParCategorie = () => {
    const depenses = transactions.filter(t => t.montant < 0);
    const parCategorie = {};
    depenses.forEach(t => {
      if (!parCategorie[t.categorie]) parCategorie[t.categorie] = 0;
      parCategorie[t.categorie] += Math.abs(t.montant);
    });
    return Object.entries(parCategorie).map(([name, value]) => ({ name, value }));
  };
  
  const getEvolutionSolde = () => {
    const sortedTrans = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let solde = comptes[0]?.soldeInitial || 0;
    return sortedTrans.map(t => {
      solde += t.montant;
      return { date: t.date, solde };
    });
  };
  
  const getRevenusDepensesMois = () => {
    const mois = {};
    transactions.forEach(t => {
      const moisKey = t.date.slice(0, 7);
      if (!mois[moisKey]) mois[moisKey] = { mois: moisKey, revenus: 0, depenses: 0 };
      if (t.montant > 0) mois[moisKey].revenus += t.montant;
      else mois[moisKey].depenses += Math.abs(t.montant);
    });
    return Object.values(mois).sort((a, b) => a.mois.localeCompare(b.mois));
  };
  
  const getBudgetAlerts = () => {
    const moisActuel = new Date().toISOString().slice(0, 7);
    return budgets.map(budget => {
      const depensesCat = transactions
        .filter(t => t.montant < 0 && t.categorie === budget.categorie && t.date.startsWith(budget.mois))
        .reduce((sum, t) => sum + Math.abs(t.montant), 0);
      const pourcentage = (depensesCat / budget.montantMax) * 100;
      return { ...budget, depenses: depensesCat, pourcentage, alerte: pourcentage >= 80 };
    });
  };
  
  const getStatsAvancees = () => {
    const depensesMoyennes = stats.totalDepenses / (transactions.filter(t => t.montant < 0).length || 1);
    const revenusMoyens = stats.totalRevenus / (transactions.filter(t => t.montant > 0).length || 1);
    const tauxEpargne = ((stats.totalRevenus - stats.totalDepenses) / stats.totalRevenus) * 100;
    return { depensesMoyennes, revenusMoyens, tauxEpargne };
  };
  
  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];
  
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-100';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900';
  const mutedClass = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  
  const DashboardView = () => (
    <div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-3xl font-bold ${textClass}`}>Tableau de bord</h2>
        <button onClick={() => setShowStats(true)} className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Statistiques avancées
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={`${cardClass} p-6 rounded-lg shadow transition-all hover:scale-105`}>
          <div className="flex items-center justify-between mb-2">
            <span className={mutedClass}>Solde total</span>
            <Wallet className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold">{stats.soldeTotal.toFixed(2)} {config.devise}</div>
        </div>
        
        <div className={`${cardClass} p-6 rounded-lg shadow transition-all hover:scale-105`}>
          <div className="flex items-center justify-between mb-2">
            <span className={mutedClass}>Revenus</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.totalRevenus.toFixed(2)} {config.devise}</div>
        </div>
        
        <div className={`${cardClass} p-6 rounded-lg shadow transition-all hover:scale-105`}>
          <div className="flex items-center justify-between mb-2">
            <span className={mutedClass}>Dépenses</span>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.totalDepenses.toFixed(2)} {config.devise}</div>
        </div>
        
        <div className={`${cardClass} p-6 rounded-lg shadow transition-all hover:scale-105`}>
          <div className="flex items-center justify-between mb-2">
            <span className={mutedClass}>Transactions</span>
            <CreditCard className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold">{stats.nbTransactions}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`${cardClass} p-6 rounded-lg shadow`}>
          <h3 className="text-xl font-bold mb-4">Dépenses par catégorie</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie data={getDepensesParCategorie()} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {getDepensesParCategorie().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>
        
        <div className={`${cardClass} p-6 rounded-lg shadow`}>
          <h3 className="text-xl font-bold mb-4">Évolution du solde</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={getEvolutionSolde()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="solde" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${cardClass} p-6 rounded-lg shadow`}>
          <h3 className="text-xl font-bold mb-4">Alertes budgets</h3>
          <div className="space-y-3">
            {getBudgetAlerts().map(budget => (
              <div key={budget.id} className={`p-3 rounded ${budget.alerte ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{budget.categorie}</span>
                  {budget.alerte ? <AlertCircle className="w-5 h-5 text-red-600" /> : <CheckCircle className="w-5 h-5 text-green-600" />}
                </div>
                <div className="text-sm">{budget.depenses.toFixed(2)} / {budget.montantMax} {config.devise} ({budget.pourcentage.toFixed(0)}%)</div>
                <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div className={`h-2 rounded-full ${budget.alerte ? 'bg-red-600' : 'bg-green-600'}`} style={{ width: `${Math.min(budget.pourcentage, 100)}%` }}></div>
                </div>
              </div>
            ))}
            <button onClick={() => setShowAddBudget(true)} className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Ajouter un budget
            </button>
          </div>
        </div>
        
        <div className={`${cardClass} p-6 rounded-lg shadow`}>
          <h3 className="text-xl font-bold mb-4">Comptes</h3>
          <div className="space-y-3">
            {comptes.map(compte => (
              <div key={compte.id} className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded`}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: compte.couleur }}></div>
                  <span className="font-medium">{compte.nom}</span>
                </div>
                <span className="font-bold">{compte.soldeActuel.toFixed(2)} {config.devise}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setShowAddCompte(true)} className="mt-4 w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter un compte
          </button>
        </div>
      </div>
    </div>
  );
  
  const TransactionsView = () => (
    <div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-3xl font-bold ${textClass}`}>Transactions</h2>
        <button onClick={() => setShowAddTransaction(true)} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvelle transaction
        </button>
      </div>
      
      <div className={`${cardClass} p-4 rounded-lg shadow mb-6`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher..." className={`w-full pl-10 px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`} />
          </div>
          <select value={filtreType} onChange={(e) => setFiltreType(e.target.value)} className={`px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}>
            <option value="TOUS">Tous les types</option>
            <option value="REVENUS">Revenus</option>
            <option value="DÉPENSES">Dépenses</option>
            <option value="PLACEMENTS">Placements</option>
          </select>
          <select value={filtreCategorie} onChange={(e) => setFiltreCategorie(e.target.value)} className={`px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}>
            <option value="">Toutes les catégories</option>
            {[...categories.depenses, ...categories.revenus, ...categories.placements].map(cat => (
              <option key={cat.id + cat.nom} value={cat.nom}>{cat.nom}</option>
            ))}
          </select>
          <select value={filtreCompte} onChange={(e) => setFiltreCompte(e.target.value)} className={`px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}>
            <option value="">Tous les comptes</option>
            {comptes.map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className={`${cardClass} rounded-lg shadow overflow-hidden`}>
        <table className="w-full">
          <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium ${mutedClass} uppercase`}>Date</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${mutedClass} uppercase`}>Libellé</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${mutedClass} uppercase`}>Catégorie</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${mutedClass} uppercase`}>Compte</th>
              <th className={`px-6 py-3 text-right text-xs font-medium ${mutedClass} uppercase`}>Montant</th>
              <th className={`px-6 py-3 text-right text-xs font-medium ${mutedClass} uppercase`}>Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${borderClass}`}>
            {transactionsFiltrees.map(t => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm">{t.date}</td>
                <td className="px-6 py-4 text-sm font-medium">{t.libelle}</td>
                <td className="px-6 py-4 text-sm">{t.categorie}</td>
                <td className="px-6 py-4 text-sm">{comptes.find(c => c.id === t.compteId)?.nom}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${t.montant > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {t.montant > 0 ? '+' : ''}{t.montant.toFixed(2)} {config.devise}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <button onClick={() => supprimerTransaction(t.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  const ObjectifsView = () => (
    <div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-3xl font-bold ${textClass}`}>Objectifs d'épargne</h2>
        <button onClick={() => setShowAddObjectif(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvel objectif
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {objectifs.map(obj => {
          const progression = (obj.montantActuel / obj.montantCible) * 100;
          return (
            <div key={obj.id} className={`${cardClass} p-6 rounded-lg shadow transition-all hover:scale-105`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">{obj.nom}</h3>
                  <p className={`text-sm ${mutedClass}`}>{obj.categorie}</p>
                </div>
                <button onClick={() => supprimerObjectif(obj.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{obj.montantActuel.toFixed(2)} {config.devise}</span>
                  <span>{obj.montantCible.toFixed(2)} {config.devise}</span>
                </div>
                <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                  <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(progression, 100)}%` }}></div>
                </div>
                <div className={`text-center text-sm ${mutedClass} mt-1`}>{progression.toFixed(0)}%</div>
              </div>
              
              <div className={`flex items-center text-sm ${mutedClass}`}>
                <Calendar className="w-4 h-4 mr-1" />
                Date cible: {obj.dateObjectif || 'Non définie'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  
  const ConfigView = () => (
    <div className="flex-1 p-8 overflow-auto">
      <h2 className={`text-3xl font-bold mb-6 ${textClass}`}>Configuration</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${cardClass} p-6 rounded-lg shadow`}>
          <h3 className="text-xl font-bold mb-4">Import / Export</h3>
          <div className="space-y-3">
            <button onClick={exporterDonnees} className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Exporter les données (JSON)
            </button>
            <label className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" /> Importer les données (JSON)
              <input type="file" accept=".json" onChange={importerDonnees} className="hidden" />
            </label>
          </div>
        </div>
        
        <div className={`${cardClass} p-6 rounded-lg shadow`}>
          <h3 className="text-xl font-bold mb-4">Transactions récurrentes</h3>
          <div className="space-y-2 mb-4">
            {transactionsRecurrentes.map(tr => (
              <div key={tr.id} className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded`}>
                <div>
                  <div className="font-medium">{tr.libelle}</div>
                  <div className={`text-xs ${mutedClass}`}>{tr.categorie} • Jour {tr.jour}</div>
                </div>
                <span className={`font-bold ${tr.montant > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tr.montant.toFixed(2)} {config.devise}
                </span>
              </div>
            ))}
          </div>
          <button onClick={() => setShowAddRecurrente(true)} className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
        
        <div className={`${cardClass} p-6 rounded-lg shadow`}>
          <h3 className="text-xl font-bold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span key={index} className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          <button onClick={() => setShowAddTag(true)} className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter un tag
          </button>
        </div>
        
        <div className={`${cardClass} p-6 rounded-lg shadow`}>
          <h3 className="text-xl font-bold mb-4">Paramètres généraux</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Devise</label>
              <select value={config.devise} onChange={(e) => setConfig({...config, devise: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <option value="€">Euro (€)</option>
                <option value="$">Dollar ($)</option>
                <option value="£">Livre (£)</option>
                <option value="CHF">Franc suisse (CHF)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const ProfilView = () => (
    <div className="flex-1 p-8 overflow-auto">
      <h2 className={`text-3xl font-bold mb-6 ${textClass}`}>Mon profil</h2>
      
      <div className={`${cardClass} p-6 rounded-lg shadow max-w-2xl`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {profil.nom.charAt(0)}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{profil.nom}</h3>
            <p className={mutedClass}>{profil.email}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input type="text" value={profil.nom} onChange={(e) => setProfil({...profil, nom: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={profil.email} onChange={(e) => setProfil({...profil, email: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
          </div>
          <button onClick={() => showToast('Profil mis à jour', 'success')} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className={`flex h-screen ${bgClass}`}>
      {toast.show && (
        <div className={`fixed top-4 right-4 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`}>
          {toast.message}
        </div>
      )}
      
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-orange-500 to-orange-600 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Budget App</h1>}
          <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-orange-700 rounded">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 mt-8">
          <button type="button" onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 transition-colors ${currentView === 'dashboard' ? 'bg-orange-700' : ''}`}>
            <Home className="w-5 h-5" />
            {sidebarOpen && <span>Tableau de bord</span>}
          </button>
          <button type="button" onClick={() => setCurrentView('transactions')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 transition-colors ${currentView === 'transactions' ? 'bg-orange-700' : ''}`}>
            <CreditCard className="w-5 h-5" />
            {sidebarOpen && <span>Transactions</span>}
          </button>
          <button type="button" onClick={() => setCurrentView('objectifs')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 transition-colors ${currentView === 'objectifs' ? 'bg-orange-700' : ''}`}>
            <Target className="w-5 h-5" />
            {sidebarOpen && <span>Objectifs</span>}
          </button>
          <button type="button" onClick={() => setCurrentView('config')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 transition-colors ${currentView === 'config' ? 'bg-orange-700' : ''}`}>
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>Configuration</span>}
          </button>
          <button type="button" onClick={() => setCurrentView('profil')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 transition-colors ${currentView === 'profil' ? 'bg-orange-700' : ''}`}>
            <User className="w-5 h-5" />
            {sidebarOpen && <span>Profil</span>}
          </button>
        </nav>

        <div className="p-4">
          <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-center gap-2 p-2 hover:bg-orange-700 rounded transition-colors">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {sidebarOpen && <span>Thème {darkMode ? 'clair' : 'sombre'}</span>}
          </button>
        </div>

        {sidebarOpen && (
          <div className="p-4 border-t border-orange-400">
            <div className="text-xs opacity-75">Connecté en tant que</div>
            <div className="font-semibold truncate">{profil.nom}</div>
            <div className="text-xs opacity-75 truncate">{profil.email}</div>
          </div>
        )}
      </div>

      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'transactions' && <TransactionsView />}
      {currentView === 'objectifs' && <ObjectifsView />}
      {currentView === 'config' && <ConfigView />}
      {currentView === 'profil' && <ProfilView />}

      {showAddCompte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className={`${cardClass} rounded-lg p-6 w-full max-w-md`}>
            <h3 className="text-xl font-bold mb-4">Nouveau compte</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom du compte</label>
                <input type="text" value={newCompte.nom} onChange={(e) => setNewCompte({ ...newCompte, nom: e.target.value })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} placeholder="Ex: Compte épargne" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={newCompte.type} onChange={(e) => setNewCompte({ ...newCompte, type: e.target.value })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  {typesComptes.map(type => (<option key={type.value} value={type.value}>{type.icon} {type.label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Solde initial ({config.devise})</label>
                <input type="number" step="0.01" value={newCompte.soldeInitial} onChange={(e) => setNewCompte({ ...newCompte, soldeInitial: parseFloat(e.target.value) || 0 })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Couleur</label>
                <input type="color" value={newCompte.couleur} onChange={(e) => setNewCompte({ ...newCompte, couleur: e.target.value })} className={`w-full h-10 px-2 py-1 border ${borderClass} rounded-lg`} />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="button" onClick={ajouterCompte} className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Créer</button>
              <button type="button" onClick={() => setShowAddCompte(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {showAddTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className={`${cardClass} rounded-lg p-6 w-full max-w-md`}>
            <h3 className="text-xl font-bold mb-4">Nouvelle transaction</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" value={newTransaction.date} onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Libellé</label>
                <input type="text" value={newTransaction.libelle} onChange={(e) => setNewTransaction({ ...newTransaction, libelle: e.target.value })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} placeholder="Ex: Courses" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Montant ({config.devise})</label>
                <input type="number" step="0.01" value={newTransaction.montant} onChange={(e) => setNewTransaction({ ...newTransaction, montant: parseFloat(e.target.value) || 0 })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={newTransaction.type} onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value, categorie: '' })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <option value="DÉPENSES">Dépenses</option>
                  <option value="REVENUS">Revenus</option>
                  <option value="PLACEMENTS">Placements</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <select value={newTransaction.categorie} onChange={(e) => setNewTransaction({ ...newTransaction, categorie: e.target.value })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <option value="">Sélectionner...</option>
                  {newTransaction.type === 'DÉPENSES' && categories.depenses.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
                  {newTransaction.type === 'REVENUS' && categories.revenus.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
                  {newTransaction.type === 'PLACEMENTS' && categories.placements.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Compte</label>
                <select value={newTransaction.compteId} onChange={(e) => setNewTransaction({ ...newTransaction, compteId: parseInt(e.target.value) })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  {comptes.map(c => (<option key={c.id} value={c.id}>{c.nom}</option>))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="button" onClick={ajouterTransaction} className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Créer</button>
              <button type="button" onClick={() => setShowAddTransaction(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {showAddObjectif && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className={`${cardClass} rounded-lg p-6 w-full max-w-md`}>
            <h3 className="text-xl font-bold mb-4">Nouvel objectif d'épargne</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom de l'objectif</label>
                <input type="text" value={newObjectif.nom} onChange={(e) => setNewObjectif({ ...newObjectif, nom: e.target.value })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} placeholder="Ex: Voyage en Italie" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Montant cible ({config.devise})</label>
                <input type="number" value={newObjectif.montantCible} onChange={(e) => setNewObjectif({ ...newObjectif, montantCible: parseFloat(e.target.value) || 0 })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Montant actuel ({config.devise})</label>
                <input type="number" value={newObjectif.montantActuel} onChange={(e) => setNewObjectif({ ...newObjectif, montantActuel: parseFloat(e.target.value) || 0 })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date objectif</label>
                <input type="date" value={newObjectif.dateObjectif} onChange={(e) => setNewObjectif({ ...newObjectif, dateObjectif: e.target.value })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <input type="text" value={newObjectif.categorie} onChange={(e) => setNewObjectif({ ...newObjectif, categorie: e.target.value })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} placeholder="Ex: Vacances" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="button" onClick={ajouterObjectif} className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Créer</button>
              <button type="button" onClick={() => setShowAddObjectif(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {showAddRecurrente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className={`${cardClass} rounded-lg p-6 w-full max-w-md`}>
            <h3 className="text-xl font-bold mb-4">Nouvelle transaction récurrente</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Libellé</label>
                <input type="text" value={newRecurrente.libelle} onChange={(e) => setNewRecurrente({ ...newRecurrente, libelle: e.target.value })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} placeholder="Ex: Abonnement" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Montant ({config.devise})</label>
                <input type="number" step="0.01" value={newRecurrente.montant} onChange={(e) => setNewRecurrente({ ...newRecurrente, montant: parseFloat(e.target.value) || 0 })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={newRecurrente.type} onChange={(e) => setNewRecurrente({ ...newRecurrente, type: e.target.value, categorie: '' })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <option value="DÉPENSES">Dépenses</option>
                  <option value="REVENUS">Revenus</option>
                  <option value="PLACEMENTS">Placements</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <select value={newRecurrente.categorie} onChange={(e) => setNewRecurrente({ ...newRecurrente, categorie: e.target.value })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <option value="">Sélectionner...</option>
                  {newRecurrente.type === 'DÉPENSES' && categories.depenses.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
                  {newRecurrente.type === 'REVENUS' && categories.revenus.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
                  {newRecurrente.type === 'PLACEMENTS' && categories.placements.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jour du mois (1-31)</label>
                <input type="number" min="1" max="31" value={newRecurrente.jour} onChange={(e) => setNewRecurrente({ ...newRecurrente, jour: parseInt(e.target.value) || 1 })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="button" onClick={ajouterTransactionRecurrente} className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">Créer</button>
              <button type="button" onClick={() => setShowAddRecurrente(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {showAddTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className={`${cardClass} rounded-lg p-6 w-full max-w-md`}>
            <h3 className="text-xl font-bold mb-4">Nouveau tag</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nom du tag</label>
              <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} placeholder="Ex: personnel" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={ajouterTag} className="flex-1 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">Créer</button>
              <button type="button" onClick={() => setShowAddTag(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {showAddBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className={`${cardClass} rounded-lg p-6 w-full max-w-md`}>
            <h3 className="text-xl font-bold mb-4">Nouveau budget</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <select value={newBudget.categorie} onChange={(e) => setNewBudget({ ...newBudget, categorie: e.target.value })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <option value="">Sélectionner...</option>
                  {categories.depenses.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Montant maximum ({config.devise})</label>
                <input type="number" value={newBudget.montantMax} onChange={(e) => setNewBudget({ ...newBudget, montantMax: parseFloat(e.target.value) || 0 })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mois</label>
                <input type="month" value={newBudget.mois} onChange={(e) => setNewBudget({ ...newBudget, mois: e.target.value })} className={`w-full px-3 py-2 border ${borderClass} rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="button" onClick={ajouterBudget} className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Créer</button>
              <button type="button" onClick={() => setShowAddBudget(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {showStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8 animate-fade-in overflow-auto">
          <div className={`${cardClass} rounded-lg p-6 w-full max-w-4xl max-h-full overflow-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Statistiques avancées</h3>
              <button onClick={() => setShowStats(false)} className="text-gray-500 hover:text-gray-700">
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                <div className={`text-sm ${mutedClass} mb-1`}>Dépense moyenne</div>
                <div className="text-xl font-bold">{getStatsAvancees().depensesMoyennes.toFixed(2)} {config.devise}</div>
              </div>
              <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                <div className={`text-sm ${mutedClass} mb-1`}>Revenu moyen</div>
                <div className="text-xl font-bold">{getStatsAvancees().revenusMoyens.toFixed(2)} {config.devise}</div>
              </div>
              <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                <div className={`text-sm ${mutedClass} mb-1`}>Taux d'épargne</div>
                <div className="text-xl font-bold">{getStatsAvancees().tauxEpargne.toFixed(1)}%</div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-bold mb-4">Revenus vs Dépenses par mois</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getRevenusDepensesMois()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenus" fill="#10b981" name="Revenus" />
                  <Bar dataKey="depenses" fill="#ef4444" name="Dépenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetApp;
