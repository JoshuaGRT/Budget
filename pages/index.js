import { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CreditCard, Settings, FileText, Plus, Home, Target, User, Camera, Trash2, Edit2, Save, X, TrendingUp, AlertCircle, Download, Upload, Search, Repeat, CheckCircle, XCircle, ArrowUpCircle, ArrowDownCircle, Menu } from 'lucide-react';

export default function BudgetDashboard() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(2025);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [vueConsolidee, setVueConsolidee] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [notifications, setNotifications] = useState([]);
  
  const showNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const [profil, setProfil] = useState({
    nom: 'Joshua GRILLOT',
    email: 'joshua.h.grillot@gmail.com',
    dateNaissance: '1995-06-15',
    photo: null
  });

  const [config, setConfig] = useState({
    carteBancaire: '9743',
    anneeDebut: 2025,
    devise: '€',
    modeSombre: false
  });

  const [comptes, setComptes] = useState([
    { id: 1, nom: 'Compte courant', soldeInitial: 3500, type: 'courant', couleur: '#3b82f6', locked: false },
    { id: 2, nom: 'Livret A', soldeInitial: 5000, type: 'epargne', couleur: '#22c55e', locked: false },
    { id: 3, nom: 'PEA', soldeInitial: 3000, type: 'investissement', couleur: '#f59e0b', locked: false }
  ]);

  const [compteActif, setCompteActif] = useState(1);
  const [showAddCompte, setShowAddCompte] = useState(false);
  const [editingCompte, setEditingCompte] = useState(null);
  const [newCompte, setNewCompte] = useState({
    nom: '',
    soldeInitial: 0,
    type: 'courant',
    couleur: '#3b82f6'
  });

  const typesComptes = [
    { value: 'courant', label: 'Compte courant', icon: '🏦' },
    { value: 'epargne', label: 'Livret épargne', icon: '💰' },
    { value: 'investissement', label: 'Investissement', icon: '📈' },
    { value: 'crypto', label: 'Crypto', icon: '₿' },
    { value: 'autre', label: 'Autre', icon: '💳' }
  ];

  const [tagsDisponibles, setTagsDisponibles] = useState([
    'travail', 'fixe', 'variable', 'exceptionnel', 'vacances', 'santé', 'urgent', 'prévu'
  ]);
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTag, setNewTag] = useState('');

  const [categories, setCategories] = useState({
    revenus: [
      { id: 1, nom: 'Salaires', budget: 2500, couleur: '#22c55e', sousCategories: ['Salaire principal', 'Primes', 'Heures sup'] },
      { id: 2, nom: 'Freelance', budget: 800, couleur: '#10b981', sousCategories: ['Missions', 'Consulting', 'Formations'] },
      { id: 3, nom: 'Investissements', budget: 200, couleur: '#059669', sousCategories: ['Dividendes', 'Plus-values', 'Intérêts'] },
      { id: 4, nom: 'Autres revenus', budget: 100, couleur: '#047857', sousCategories: ['Remboursements', 'Cadeaux'] }
    ],
    depenses: [
      { id: 1, nom: 'Logement', budget: 800, couleur: '#ef4444', sousCategories: ['Loyer', 'Charges', 'Assurance habitation'], essentiel: true },
      { id: 2, nom: 'Alimentation', budget: 400, couleur: '#dc2626', sousCategories: ['Courses', 'Restaurants', 'Cantines'], essentiel: true },
      { id: 3, nom: 'Transport', budget: 200, couleur: '#b91c1c', sousCategories: ['Carburant', 'Péages', 'Transports publics', 'Entretien'], essentiel: true },
      { id: 4, nom: 'Santé', budget: 100, couleur: '#991b1b', sousCategories: ['Pharmacie', 'Médecin', 'Mutuelle'], essentiel: true },
      { id: 5, nom: 'Loisirs', budget: 150, couleur: '#a855f7', sousCategories: ['Sorties', 'Sport', 'Abonnements', 'Cinéma'], essentiel: false },
      { id: 6, nom: 'Shopping', budget: 150, couleur: '#9333ea', sousCategories: ['Vêtements', 'Électronique', 'Déco'], essentiel: false },
      { id: 7, nom: 'Assurances', budget: 150, couleur: '#7c3aed', sousCategories: ['Auto', 'Santé', 'Habitation'], essentiel: true }
    ],
    placements: [
      { id: 1, nom: 'Épargne de précaution', budget: 300, couleur: '#3b82f6', sousCategories: ['Livret A', 'LDDS', 'LEP'] },
      { id: 2, nom: 'Investissements', budget: 400, couleur: '#2563eb', sousCategories: ['PEA', 'Assurance-vie', 'Crypto', 'Actions'] },
      { id: 3, nom: 'Projets', budget: 200, couleur: '#1d4ed8', sousCategories: ['Vacances', 'Voiture', 'Immobilier', 'Travaux'] }
    ]
  });

  const [editingSousCategories, setEditingSousCategories] = useState(null);
  const [newSousCategorie, setNewSousCategorie] = useState('');

  const ajouterSousCategorie = (type, catId) => {
    if (!newSousCategorie.trim()) return;
    setCategories({
      ...categories,
      [type]: categories[type].map(cat =>
        cat.id === catId
          ? { ...cat, sousCategories: [...cat.sousCategories, newSousCategorie.trim()] }
          : cat
      )
    });
    setNewSousCategorie('');
    showNotification('success', 'Sous-catégorie ajoutée');
  };

  const supprimerSousCategorie = (type, catId, sousCategorie) => {
    setCategories({
      ...categories,
      [type]: categories[type].map(cat =>
        cat.id === catId
          ? { ...cat, sousCategories: cat.sousCategories.filter(sc => sc !== sousCategorie) }
          : cat
      )
    });
    showNotification('success', 'Sous-catégorie supprimée');
  };

  const [objectifs, setObjectifs] = useState({
    essentiels: 50,
    loisirs: 30,
    epargne: 20,
    alertes: {
      depassementBudget: true,
      objectifAtteint: true,
      soldeBasSeuil: 500
    }
  });

  const totalPourcentage = parseInt(objectifs.essentiels) + parseInt(objectifs.loisirs) + parseInt(objectifs.epargne);
  const regleBudgetaireValide = totalPourcentage === 100;

  const [objectifsEpargne, setObjectifsEpargne] = useState([
    { id: 1, nom: 'Voyage au Japon', montantCible: 3000, montantActuel: 1200, dateObjectif: '2025-08-01', categorie: 'Vacances' },
    { id: 2, nom: 'Nouvelle voiture', montantCible: 15000, montantActuel: 5000, dateObjectif: '2025-12-31', categorie: 'Voiture' }
  ]);

  const [showAddObjectif, setShowAddObjectif] = useState(false);
  const [editingObjectif, setEditingObjectif] = useState(null);
  const [newObjectif, setNewObjectif] = useState({
    nom: '',
    montantCible: 0,
    montantActuel: 0,
    dateObjectif: '',
    categorie: 'Autre'
  });

  const ajouterObjectif = () => {
    if (!newObjectif.nom || newObjectif.montantCible <= 0) {
      showNotification('error', 'Veuillez remplir tous les champs');
      return;
    }
    setObjectifsEpargne([...objectifsEpargne, { ...newObjectif, id: Date.now() }]);
    setNewObjectif({ nom: '', montantCible: 0, montantActuel: 0, dateObjectif: '', categorie: 'Autre' });
    setShowAddObjectif(false);
    showNotification('success', 'Objectif créé');
  };

  const modifierObjectif = (id, champ, valeur) => {
    setObjectifsEpargne(objectifsEpargne.map(obj =>
      obj.id === id ? { ...obj, [champ]: valeur } : obj
    ));
  };

  const supprimerObjectif = (id) => {
    setObjectifsEpargne(objectifsEpargne.filter(obj => obj.id !== id));
    showNotification('success', 'Objectif supprimé');
  };

  const [transactions, setTransactions] = useState([
    { id: 1, date: '2025-10-05', libelle: 'Salaire octobre', montant: 2500, type: 'REVENUS', categorie: 'Salaires', sousCategorie: 'Salaire principal', compteId: 1, tags: ['travail'], recurrente: false },
    { id: 2, date: '2025-10-03', libelle: 'Loyer octobre', montant: -750, type: 'DÉPENSES', categorie: 'Logement', sousCategorie: 'Loyer', compteId: 1, tags: ['fixe'], recurrente: false },
    { id: 3, date: '2025-10-07', libelle: 'Courses Carrefour', montant: -85, type: 'DÉPENSES', categorie: 'Alimentation', sousCategorie: 'Courses', compteId: 1, tags: [], recurrente: false },
    { id: 4, date: '2025-10-10', libelle: 'Essence', montant: -60, type: 'DÉPENSES', categorie: 'Transport', sousCategorie: 'Carburant', compteId: 1, tags: [], recurrente: false }
  ]);

  const [transactionsRecurrentes, setTransactionsRecurrentes] = useState([
    { id: 1, libelle: 'Salaire mensuel', montant: 2500, type: 'REVENUS', categorie: 'Salaires', sousCategorie: 'Salaire principal', jour: 5, actif: true, compteId: 1 },
    { id: 2, libelle: 'Loyer', montant: -750, type: 'DÉPENSES', categorie: 'Logement', sousCategorie: 'Loyer', jour: 1, actif: true, compteId: 1 },
    { id: 3, libelle: 'Netflix', montant: -15.99, type: 'DÉPENSES', categorie: 'Loisirs', sousCategorie: 'Abonnements', jour: 15, actif: true, compteId: 1 }
  ]);

  const [showAddRecurrente, setShowAddRecurrente] = useState(false);
  const [editingRecurrente, setEditingRecurrente] = useState(null);
  const [newRecurrente, setNewRecurrente] = useState({
    libelle: '',
    montant: 0,
    type: 'DÉPENSES',
    categorie: '',
    sousCategorie: '',
    jour: 1,
    compteId: compteActif
  });

  const ajouterTransactionRecurrente = () => {
    if (!newRecurrente.libelle || !newRecurrente.categorie || newRecurrente.montant === 0) {
      showNotification('error', 'Veuillez remplir tous les champs');
      return;
    }
    const tr = {
      ...newRecurrente,
      id: Date.now(),
      actif: true,
      montant: newRecurrente.type === 'REVENUS' ? Math.abs(newRecurrente.montant) : -Math.abs(newRecurrente.montant)
    };
    setTransactionsRecurrentes([...transactionsRecurrentes, tr]);
    setNewRecurrente({ libelle: '', montant: 0, type: 'DÉPENSES', categorie: '', sousCategorie: '', jour: 1, compteId: compteActif });
    setShowAddRecurrente(false);
    showNotification('success', 'Transaction récurrente créée');
  };

  const modifierTransactionRecurrente = (id, champ, valeur) => {
    setTransactionsRecurrentes(transactionsRecurrentes.map(tr =>
      tr.id === id ? { ...tr, [champ]: valeur } : tr
    ));
  };

  const supprimerTransactionRecurrente = (id) => {
    setTransactionsRecurrentes(transactionsRecurrentes.filter(tr => tr.id !== id));
    showNotification('success', 'Transaction récurrente supprimée');
  };

  useEffect(() => {
    const moisActuel = selectedMonth;
    const anneeActuelle = selectedYear;
    
    transactionsRecurrentes.forEach(tr => {
      if (!tr.actif) return;
      
      const dateTransaction = new Date(anneeActuelle, moisActuel, tr.jour);
      const dateStr = dateTransaction.toISOString().split('T')[0];
      
      const existe = transactions.some(t => 
        t.libelle === tr.libelle && 
        t.date === dateStr &&
        t.montant === tr.montant &&
        t.compteId === tr.compteId
      );
      
      if (!existe && dateTransaction <= new Date()) {
        const nouvelleTransaction = {
          id: Date.now() + Math.random(),
          date: dateStr,
          libelle: tr.libelle,
          montant: tr.montant,
          type: tr.type,
          categorie: tr.categorie,
          sousCategorie: tr.sousCategorie,
          compteId: tr.compteId,
          tags: ['récurrent'],
          recurrente: true
        };
        setTransactions(prev => [...prev, nouvelleTransaction]);
      }
    });
  }, [selectedMonth, selectedYear, transactionsRecurrentes]);

  const transactionsFiltrees = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      const moisMatch = date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
      const compteMatch = vueConsolidee || t.compteId === compteActif;
      const searchMatch = searchTerm === '' || 
        t.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.categorie.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = filterType === 'ALL' || t.type === filterType;
      
      const type = t.type === 'REVENUS' ? 'revenus' : t.type === 'DÉPENSES' ? 'depenses' : 'placements';
      const categorieExiste = categories[type] && categories[type].some(c => c.nom === t.categorie);
      
      return moisMatch && compteMatch && searchMatch && typeMatch && categorieExiste;
    });
  }, [transactions, selectedMonth, selectedYear, compteActif, searchTerm, filterType, vueConsolidee, categories]);

  const totalRevenus = useMemo(() => 
    transactionsFiltrees.filter(t => t.type === 'REVENUS').reduce((sum, t) => sum + t.montant, 0)
  , [transactionsFiltrees]);

  const totalDepenses = useMemo(() => 
    Math.abs(transactionsFiltrees.filter(t => t.type === 'DÉPENSES').reduce((sum, t) => sum + t.montant, 0))
  , [transactionsFiltrees]);

  const totalPlacements = useMemo(() => 
    Math.abs(transactionsFiltrees.filter(t => t.type === 'PLACEMENTS').reduce((sum, t) => sum + t.montant, 0))
  , [transactionsFiltrees]);

  const getSoldeCompte = (compteId) => {
    const compte = comptes.find(c => c.id === compteId);
    if (!compte) return 0;
    const transactionsCompte = transactions.filter(t => t.compteId === compteId);
    return compte.soldeInitial + transactionsCompte.reduce((sum, t) => sum + t.montant, 0);
  };

  const soldeActuel = useMemo(() => {
    if (vueConsolidee) {
      return comptes.reduce((total, c) => total + getSoldeCompte(c.id), 0);
    }
    return getSoldeCompte(compteActif);
  }, [transactions, compteActif, comptes, vueConsolidee]);

  const patrimoineTotal = useMemo(() => {
    return comptes.reduce((total, c) => total + getSoldeCompte(c.id), 0);
  }, [transactions, comptes]);

  const depensesParCategorie = useMemo(() => {
    const result = {};
    transactionsFiltrees.filter(t => t.type === 'DÉPENSES').forEach(t => {
      if (!result[t.categorie]) result[t.categorie] = 0;
      result[t.categorie] += Math.abs(t.montant);
    });
    return result;
  }, [transactionsFiltrees]);

  const placementsParCategorie = useMemo(() => {
    const result = {};
    transactions.filter(t => t.type === 'PLACEMENTS').forEach(t => {
      if (!result[t.categorie]) result[t.categorie] = 0;
      result[t.categorie] += Math.abs(t.montant);
    });
    return result;
  }, [transactions]);

  const depensesEssentielles = useMemo(() => 
    transactionsFiltrees
      .filter(t => t.type === 'DÉPENSES')
      .filter(t => categories.depenses.find(c => c.nom === t.categorie && c.essentiel))
      .reduce((sum, t) => sum + Math.abs(t.montant), 0)
  , [transactionsFiltrees, categories]);

  const depensesLoisirs = useMemo(() => 
    transactionsFiltrees
      .filter(t => t.type === 'DÉPENSES')
      .filter(t => categories.depenses.find(c => c.nom === t.categorie && !c.essentiel))
      .reduce((sum, t) => sum + Math.abs(t.montant), 0)
  , [transactionsFiltrees, categories]);

  const totalRevenusMensuel = totalRevenus || 1;
  const pourcentageEssentiels = ((depensesEssentielles / totalRevenusMensuel) * 100).toFixed(1);
  const pourcentageLoisirs = ((depensesLoisirs / totalRevenusMensuel) * 100).toFixed(1);
  const pourcentageEpargne = ((totalPlacements / totalRevenusMensuel) * 100).toFixed(1);

  const evolutionData = useMemo(() => {
    const mois = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
    return mois.map((nomMois, index) => {
      const transactionsMois = transactions.filter(t => {
        const date = new Date(t.date);
        const compteMatch = vueConsolidee || t.compteId === compteActif;
        return date.getMonth() === index && date.getFullYear() === selectedYear && compteMatch;
      });
      
      const revenus = transactionsMois.filter(t => t.type === 'REVENUS').reduce((sum, t) => sum + t.montant, 0);
      const depenses = Math.abs(transactionsMois.filter(t => t.type === 'DÉPENSES').reduce((sum, t) => sum + t.montant, 0));
      const epargne = Math.abs(transactionsMois.filter(t => t.type === 'PLACEMENTS').reduce((sum, t) => sum + t.montant, 0));
      
      return { mois: nomMois, revenus, depenses, epargne, solde: revenus - depenses - epargne };
    });
  }, [transactions, selectedYear, compteActif, vueConsolidee]);

  const budgetVsReelData = useMemo(() => {
    return categories.depenses.map(cat => ({
      categorie: cat.nom,
      budget: cat.budget,
      reel: depensesParCategorie[cat.nom] || 0,
      couleur: cat.couleur
    }));
  }, [categories, depensesParCategorie]);

  const placementsData = useMemo(() => {
    return categories.placements.map(cat => ({
      name: cat.nom,
      value: placementsParCategorie[cat.nom] || 0,
      color: cat.couleur
    })).filter(p => p.value > 0);
  }, [categories, placementsParCategorie]);

  const predictions = useMemo(() => {
    const derniersMois = evolutionData.slice(0, selectedMonth + 1);
    if (derniersMois.length < 2) return null;
    
    const moyenneRevenus = derniersMois.reduce((sum, m) => sum + m.revenus, 0) / derniersMois.length;
    const moyenneDepenses = derniersMois.reduce((sum, m) => sum + m.depenses, 0) / derniersMois.length;
    const moyenneEpargne = derniersMois.reduce((sum, m) => sum + m.epargne, 0) / derniersMois.length;
    
    const moisRestants = 12 - selectedMonth;
    const soldePrevuFinAnnee = soldeActuel + (moyenneRevenus - moyenneDepenses - moyenneEpargne) * moisRestants;
    const epargnePrevueFinAnnee = totalPlacements + (moyenneEpargne * moisRestants);
    
    return (
  <div className="flex h-screen bg-gray-100">
    <ToastContainer />
    
    {/* Sidebar */}
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-orange-500 to-orange-600 text-white transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && <h1 className="text-xl font-bold">Budget App</h1>}
        <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-orange-700 rounded">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 mt-8">
        <button type="button" onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 ${currentView === 'dashboard' ? 'bg-orange-700' : ''}`}>
          <Home className="w-5 h-5" />
          {sidebarOpen && <span>Tableau de bord</span>}
        </button>
        <button type="button" onClick={() => setCurrentView('transactions')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 ${currentView === 'transactions' ? 'bg-orange-700' : ''}`}>
          <CreditCard className="w-5 h-5" />
          {sidebarOpen && <span>Transactions</span>}
        </button>
        <button type="button" onClick={() => setCurrentView('objectifs')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 ${currentView === 'objectifs' ? 'bg-orange-700' : ''}`}>
          <Target className="w-5 h-5" />
          {sidebarOpen && <span>Objectifs</span>}
        </button>
        <button type="button" onClick={() => setCurrentView('config')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 ${currentView === 'config' ? 'bg-orange-700' : ''}`}>
          <Settings className="w-5 h-5" />
          {sidebarOpen && <span>Configuration</span>}
        </button>
        <button type="button" onClick={() => setCurrentView('profil')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 ${currentView === 'profil' ? 'bg-orange-700' : ''}`}>
          <User className="w-5 h-5" />
          {sidebarOpen && <span>Profil</span>}
        </button>
      </nav>

      {sidebarOpen && (
        <div className="p-4 border-t border-orange-400">
          <div className="text-xs opacity-75">Connecté en tant que</div>
          <div className="font-semibold truncate">{profil.nom}</div>
          <div className="text-xs opacity-75 truncate">{profil.email}</div>
        </div>
      )}
    </div>

    {/* Main Content */}
    {currentView === 'dashboard' && <DashboardView />}
    {currentView === 'transactions' && <TransactionsView />}
    {currentView === 'objectifs' && <ObjectifsView />}
    {currentView === 'config' && <ConfigView />}
    {currentView === 'profil' && <ProfilView />}

    {/* Modal Ajout Compte */}
    {showAddCompte && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Nouveau compte</h3>
          <form onSubmit={ajouterCompte}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom du compte</label>
                <input type="text" value={newCompte.nom} onChange={(e) => setNewCompte({ ...newCompte, nom: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Ex: Compte épargne" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={newCompte.type} onChange={(e) => setNewCompte({ ...newCompte, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  {typesComptes.map(type => (<option key={type.value} value={type.value}>{type.icon} {type.label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Solde initial ({config.devise})</label>
                <input type="number" step="0.01" value={newCompte.soldeInitial} onChange={(e) => setNewCompte({ ...newCompte, soldeInitial: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Couleur</label>
                <input type="color" value={newCompte.couleur} onChange={(e) => setNewCompte({ ...newCompte, couleur: e.target.value })} className="w-full h-10 px-2 py-1 border rounded-lg" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="submit" className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Créer</button>
              <button type="button" onClick={() => setShowAddCompte(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Modal Ajout Objectif */}
    {showAddObjectif && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Nouvel objectif d'épargne</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom de l'objectif</label>
              <input type="text" value={newObjectif.nom} onChange={(e) => setNewObjectif({ ...newObjectif, nom: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Ex: Voyage en Italie" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Montant cible ({config.devise})</label>
              <input type="number" value={newObjectif.montantCible} onChange={(e) => setNewObjectif({ ...newObjectif, montantCible: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Montant actuel ({config.devise})</label>
              <input type="number" value={newObjectif.montantActuel} onChange={(e) => setNewObjectif({ ...newObjectif, montantActuel: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date objectif</label>
              <input type="date" value={newObjectif.dateObjectif} onChange={(e) => setNewObjectif({ ...newObjectif, dateObjectif: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Catégorie</label>
              <input type="text" value={newObjectif.categorie} onChange={(e) => setNewObjectif({ ...newObjectif, categorie: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Ex: Vacances" />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button type="button" onClick={ajouterObjectif} className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Créer</button>
            <button type="button" onClick={() => setShowAddObjectif(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Annuler</button>
          </div>
        </div>
      </div>
    )}

    {/* Modal Ajout Transaction Récurrente */}
    {showAddRecurrente && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Nouvelle transaction récurrente</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Libellé</label>
              <input type="text" value={newRecurrente.libelle} onChange={(e) => setNewRecurrente({ ...newRecurrente, libelle: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Ex: Abonnement Spotify" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Montant ({config.devise})</label>
              <input type="number" step="0.01" value={newRecurrente.montant} onChange={(e) => setNewRecurrente({ ...newRecurrente, montant: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={newRecurrente.type} onChange={(e) => setNewRecurrente({ ...newRecurrente, type: e.target.value, categorie: '' })} className="w-full px-3 py-2 border rounded-lg">
                <option value="DÉPENSES">Dépenses</option>
                <option value="REVENUS">Revenus</option>
                <option value="PLACEMENTS">Placements</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Catégorie</label>
              <select value={newRecurrente.categorie} onChange={(e) => setNewRecurrente({ ...newRecurrente, categorie: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option value="">Sélectionner...</option>
                {newRecurrente.type === 'DÉPENSES' && categories.depenses.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
                {newRecurrente.type === 'REVENUS' && categories.revenus.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
                {newRecurrente.type === 'PLACEMENTS' && categories.placements.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jour du mois (1-31)</label>
              <input type="number" min="1" max="31" value={newRecurrente.jour} onChange={(e) => setNewRecurrente({ ...newRecurrente, jour: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button type="button" onClick={ajouterTransactionRecurrente} className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">Créer</button>
            <button type="button" onClick={() => setShowAddRecurrente(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Annuler</button>
          </div>
        </div>
      </div>
    )}

    {/* Modal Ajout Tag */}
    {showAddTag && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Nouveau tag</h3>
          <form onSubmit={ajouterTag}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nom du tag</label>
              <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Ex: personnel" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">Créer</button>
              <button type="button" onClick={() => setShowAddTag(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
}
    
    return alertes;
  }, [soldeActuel, objectifs, depensesParCategorie, categories, pourcentageEpargne, regleBudgetaireValide, totalPourcentage]);

  const moisDisponibles = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const anneesDisponibles = [2024, 2025, 2026];

  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    libelle: '',
    montant: '',
    type: 'DÉPENSES',
    categorie: '',
    sousCategorie: '',
    tags: [],
    compteId: compteActif
  });

  const ajouterTransaction = (e) => {
    if (e) e.preventDefault();
    if (!newTransaction.libelle || !newTransaction.montant || !newTransaction.categorie) {
      showNotification('error', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const montant = parseFloat(newTransaction.montant);
    if (isNaN(montant) || montant === 0) {
      showNotification('error', 'Le montant doit être un nombre valide');
      return;
    }
    
    const transaction = {
      id: Date.now(),
      ...newTransaction,
      montant: newTransaction.type === 'REVENUS' ? Math.abs(montant) : -Math.abs(montant),
      compteId: compteActif
    };
    
    setTransactions([...transactions, transaction]);
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      libelle: '',
      montant: '',
      type: 'DÉPENSES',
      categorie: '',
      sousCategorie: '',
      tags: [],
      compteId: compteActif
    });
    showNotification('success', 'Transaction ajoutée');
  };

  const supprimerTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    showNotification('success', 'Transaction supprimée');
  };

  const ajouterCompte = (e) => {
    if (e) e.preventDefault();
    if (!newCompte.nom.trim()) {
      showNotification('error', 'Veuillez saisir un nom');
      return;
    }
    const compte = { id: Date.now(), ...newCompte, locked: false };
    setComptes([...comptes, compte]);
    setNewCompte({ nom: '', soldeInitial: 0, type: 'courant', couleur: '#3b82f6' });
    setShowAddCompte(false);
    showNotification('success', 'Compte créé');
  };

  const supprimerCompte = (id) => {
    if (comptes.length === 1) {
      showNotification('error', 'Vous devez avoir au moins un compte');
      return;
    }
    const transactionsCompte = transactions.filter(t => t.compteId === id);
    if (transactionsCompte.length > 0) {
      if (!window.confirm(`Ce compte contient ${transactionsCompte.length} transaction(s). Continuer ?`)) return;
    }
    setComptes(comptes.filter(c => c.id !== id));
    setTransactions(transactions.filter(t => t.compteId !== id));
    if (compteActif === id) {
      setCompteActif(comptes.find(c => c.id !== id).id);
    }
    showNotification('success', 'Compte supprimé');
  };

  const modifierCompte = (id, champ, valeur) => {
    const compte = comptes.find(c => c.id === id);
    
    if (champ === 'soldeInitial' && compte.locked) {
      showNotification('error', 'Solde verrouillé');
      return;
    }
    
    setComptes(comptes.map(c => c.id === id ? { ...c, [champ]: valeur } : c));
  };

  useEffect(() => {
    comptes.forEach(compte => {
      const hasTransactions = transactions.some(t => t.compteId === compte.id);
      if (hasTransactions && !compte.locked) {
        setComptes(prev => prev.map(c => 
          c.id === compte.id ? { ...c, locked: true } : c
        ));
      }
    });
  }, [transactions]);

  const ajouterCategorie = (type) => {
    const nouvelleCategorie = {
      id: Date.now(),
      nom: 'Nouvelle catégorie',
      budget: 0,
      couleur: '#808080',
      sousCategories: [],
      essentiel: type === 'depenses'
    };
    setCategories({ ...categories, [type]: [...categories[type], nouvelleCategorie] });
    showNotification('success', 'Catégorie ajoutée');
  };

  const supprimerCategorie = (type, id) => {
    const cat = categories[type].find(c => c.id === id);
    const transactionsOrphelines = transactions.filter(t => t.categorie === cat.nom);
    
    if (transactionsOrphelines.length > 0) {
      if (!window.confirm(`${transactionsOrphelines.length} transaction(s) seront supprimées. Continuer ?`)) return;
      setTransactions(transactions.filter(t => t.categorie !== cat.nom));
    }
    
    setCategories({ ...categories, [type]: categories[type].filter(cat => cat.id !== id) });
    showNotification('success', 'Catégorie supprimée');
  };

  const modifierCategorie = (type, id, champ, valeur) => {
    setCategories({
      ...categories,
      [type]: categories[type].map(cat => cat.id === id ? { ...cat, [champ]: valeur } : cat)
    });
  };

  const ajouterTag = (e) => {
    if (e) e.preventDefault();
    if (!newTag.trim() || tagsDisponibles.includes(newTag.trim())) {
      showNotification('error', 'Tag invalide');
      return;
    }
    setTagsDisponibles([...tagsDisponibles, newTag.trim()]);
    setNewTag('');
    setShowAddTag(false);
    showNotification('success', 'Tag ajouté');
  };

  const supprimerTag = (tag) => {
    setTagsDisponibles(tagsDisponibles.filter(t => t !== tag));
    showNotification('success', 'Tag supprimé');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfil({ ...profil, photo: reader.result });
        showNotification('success', 'Photo mise à jour');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lignes = text.split('\n');
        const nouvellesTransactions = [];
        
        for (let i = 1; i < lignes.length; i++) {
          const ligne = lignes[i].split(';');
          if (ligne.length >= 3) {
            const [date, libelle, montantStr, type, categorie, compteNom] = ligne;
            const montant = parseFloat(montantStr.replace(',', '.'));
            
            let compteId = compteActif;
            if (compteNom) {
              const compte = comptes.find(c => c.nom.toLowerCase() === compteNom.trim().toLowerCase());
              if (compte) compteId = compte.id;
            }
            
            if (date && libelle && !isNaN(montant)) {
              nouvellesTransactions.push({
                id: Date.now() + i,
                date: date.trim(),
                libelle: libelle.trim(),
                montant: montant,
                type: type ? type.trim() : (montant > 0 ? 'REVENUS' : 'DÉPENSES'),
                categorie: categorie ? categorie.trim() : 'Autres',
                sousCategorie: '',
                compteId: compteId,
                tags: []
              });
            }
          }
        }
        
        if (nouvellesTransactions.length > 0) {
          setTransactions([...transactions, ...nouvellesTransactions]);
          showNotification('success', `${nouvellesTransactions.length} transactions importées`);
        } else {
          showNotification('error', 'Aucune transaction valide');
        }
      };
      reader.readAsText(file);
    }
  };

  const exporterCSV = () => {
    let csv = 'Date;Libellé;Montant;Type;Catégorie;Sous-catégorie;Compte\n';
    transactions.forEach(t => {
      const compte = comptes.find(c => c.id === t.compteId);
      csv += `${t.date};${t.libelle};${t.montant};${t.type};${t.categorie};${t.sousCategorie};${compte?.nom || ''}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${selectedYear}_${moisDisponibles[selectedMonth]}.csv`;
    a.click();
    showNotification('success', 'Export CSV réussi');
  };

  const exporterDonnees = () => {
    const donnees = {
      profil,
      config,
      categories,
      objectifs,
      objectifsEpargne,
      transactions,
      transactionsRecurrentes,
      comptes,
      tagsDisponibles,
      version: '3.0'
    };
    
    const json = JSON.stringify(donnees, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showNotification('success', 'Sauvegarde créée');
  };

  const exporterPDF = () => {
    showNotification('info', 'Génération du PDF...');
    setTimeout(() => window.print(), 500);
  };

  const importerDonnees = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const donnees = JSON.parse(event.target.result);
          if (donnees.version && donnees.profil && donnees.transactions) {
            setProfil(donnees.profil);
            setConfig(donnees.config);
            setCategories(donnees.categories);
            setObjectifs(donnees.objectifs);
            setObjectifsEpargne(donnees.objectifsEpargne || []);
            setTransactions(donnees.transactions);
            setTransactionsRecurrentes(donnees.transactionsRecurrentes || []);
            setComptes(donnees.comptes || comptes);
            setTagsDisponibles(donnees.tagsDisponibles || tagsDisponibles);
            showNotification('success', 'Données importées');
          } else {
            showNotification('error', 'Fichier invalide');
          }
        } catch (error) {
          showNotification('error', 'Erreur importation');
        }
      };
      reader.readAsText(file);
    }
  };

  const Alerte = ({ type, titre, message }) => {
    const couleurs = {
      danger: 'bg-red-50 border-red-500 text-red-800',
      warning: 'bg-orange-50 border-orange-500 text-orange-800',
      success: 'bg-green-50 border-green-500 text-green-800'
    };
    
    return (
      <div className={`border-l-4 p-4 rounded ${couleurs[type]}`}>
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">{titre}</p>
            <p className="text-sm">{message}</p>
          </div>
        </div>
      </div>
    );
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notif => {
        const styles = {
          success: 'bg-green-500',
          error: 'bg-red-500',
          warning: 'bg-orange-500',
          info: 'bg-blue-500'
        };
        
        return (
          <div
            key={notif.id}
            className={`${styles[notif.type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}
          >
            {notif.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notif.type === 'error' && <XCircle className="w-5 h-5" />}
            {notif.type === 'warning' && <AlertCircle className="w-5 h-5" />}
            <span>{notif.message}</span>
          </div>
        );
      })}
    </div>
  );

  // Vues principales suivent...
  const TransactionsView = () => (
  <div className="flex-1 overflow-auto bg-gray-100 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <div className="flex gap-2">
          <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import CSV
            <input type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
          </label>
          <button type="button" onClick={exporterCSV} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Ajouter une transaction</h2>
        <form onSubmit={ajouterTransaction}>
          <div className="grid grid-cols-6 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <input type="date" value={newTransaction.date} onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Libellé</label>
              <input type="text" value={newTransaction.libelle} onChange={(e) => setNewTransaction({ ...newTransaction, libelle: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Ex: Courses" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Montant ({config.devise})</label>
              <input type="number" step="0.01" value={newTransaction.montant} onChange={(e) => setNewTransaction({ ...newTransaction, montant: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Type</label>
              <select value={newTransaction.type} onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value, categorie: '', sousCategorie: '' })} className="w-full px-3 py-2 border rounded-lg">
                <option value="DÉPENSES">Dépenses</option>
                <option value="REVENUS">Revenus</option>
                <option value="PLACEMENTS">Placements</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Catégorie</label>
              <select value={newTransaction.categorie} onChange={(e) => setNewTransaction({ ...newTransaction, categorie: e.target.value, sousCategorie: '' })} className="w-full px-3 py-2 border rounded-lg">
                <option value="">Sélectionner...</option>
                {newTransaction.type === 'DÉPENSES' && categories.depenses.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
                {newTransaction.type === 'REVENUS' && categories.revenus.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
                {newTransaction.type === 'PLACEMENTS' && categories.placements.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="ALL">Tous</option>
            <option value="REVENUS">Revenus</option>
            <option value="DÉPENSES">Dépenses</option>
            <option value="PLACEMENTS">Placements</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">Libellé</th>
              <th className="px-4 py-3 text-right text-xs font-semibold">Montant</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">Catégorie</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactionsFiltrees.sort((a, b) => new Date(b.date) - new Date(a.date)).map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{new Date(t.date).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3 text-sm font-medium">{t.libelle}</td>
                <td className={`px-4 py-3 text-sm text-right font-bold ${t.montant >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {t.montant >= 0 ? '+' : ''}{t.montant.toFixed(2)} {config.devise}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${t.type === 'REVENUS' ? 'bg-green-100 text-green-700' : t.type === 'DÉPENSES' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{t.type}</span>
                </td>
                <td className="px-4 py-3 text-sm">{t.categorie}</td>
                <td className="px-4 py-3 text-center">
                  <button type="button" onClick={() => supprimerTransaction(t.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const ObjectifsView = () => (
  <div className="flex-1 overflow-auto bg-gray-100 p-6">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Objectifs budgétaires</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ma règle budgétaire</h2>
        {!regleBudgetaireValide && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-800 font-medium">La somme doit être égale à 100% (actuellement: {totalPourcentage}%)</p>
          </div>
        )}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Essentiels (%)</label>
            <input type="number" value={objectifs.essentiels} onChange={(e) => setObjectifs({ ...objectifs, essentiels: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Loisirs (%)</label>
            <input type="number" value={objectifs.loisirs} onChange={(e) => setObjectifs({ ...objectifs, loisirs: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Épargne (%)</label>
            <input type="number" value={objectifs.epargne} onChange={(e) => setObjectifs({ ...objectifs, epargne: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>
        <div className="flex h-8 rounded-lg overflow-hidden">
          <div className="bg-blue-500 flex items-center justify-center text-white text-sm" style={{ width: `${objectifs.essentiels}%` }}>{objectifs.essentiels}%</div>
          <div className="bg-purple-500 flex items-center justify-center text-white text-sm" style={{ width: `${objectifs.loisirs}%` }}>{objectifs.loisirs}%</div>
          <div className="bg-green-500 flex items-center justify-center text-white text-sm" style={{ width: `${objectifs.epargne}%` }}>{objectifs.epargne}%</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance {moisDisponibles[selectedMonth]}</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Essentiels</div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{pourcentageEssentiels}%</div>
            <div className="text-xs text-gray-500">Objectif: {objectifs.essentiels}%</div>
            <div className={`text-sm font-medium mt-2 ${parseFloat(pourcentageEssentiels) <= objectifs.essentiels ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(pourcentageEssentiels) <= objectifs.essentiels ? '✓ OK' : '✗ Dépassement'}
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Loisirs</div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{pourcentageLoisirs}%</div>
            <div className="text-xs text-gray-500">Objectif: {objectifs.loisirs}%</div>
            <div className={`text-sm font-medium mt-2 ${parseFloat(pourcentageLoisirs) <= objectifs.loisirs ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(pourcentageLoisirs) <= objectifs.loisirs ? '✓ OK' : '✗ Dépassement'}
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Épargne</div>
            <div className="text-3xl font-bold text-green-600 mb-1">{pourcentageEpargne}%</div>
            <div className="text-xs text-gray-500">Objectif: {objectifs.epargne}%</div>
            <div className={`text-sm font-medium mt-2 ${parseFloat(pourcentageEpargne) >= objectifs.epargne ? 'text-green-600' : 'text-orange-600'}`}>
              {parseFloat(pourcentageEpargne) >= objectifs.epargne ? '✓ Atteint' : '⚠ En dessous'}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
const ConfigView = () => (
  <div className="flex-1 overflow-auto bg-gray-100 p-6">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Configuration</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sauvegarde et Export</h2>
        <div className="grid grid-cols-3 gap-4">
          <button type="button" onClick={exporterDonnees} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            <span className="text-sm">Sauvegarder JSON</span>
          </button>
          <label className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer">
            <Upload className="w-5 h-5" />
            <span className="text-sm">Restaurer</span>
            <input type="file" accept=".json" onChange={importerDonnees} className="hidden" />
          </label>
          <button type="button" onClick={exporterPDF} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            <span className="text-sm">Export PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Paramètres</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block font-medium text-gray-800 mb-2">Devise</label>
            <select value={config.devise} onChange={(e) => setConfig({ ...config, devise: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="€">€ Euro</option>
              <option value="$">$ Dollar US</option>
              <option value="£">£ Livre Sterling</option>
              <option value="CHF">CHF Franc Suisse</option>
            </select>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block font-medium text-gray-800 mb-2">N° Carte bancaire (4 derniers chiffres)</label>
            <input type="text" maxLength="4" value={config.carteBancaire} onChange={(e) => setConfig({ ...config, carteBancaire: e.target.value.replace(/\D/g, '') })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="1234" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {['revenus', 'depenses', 'placements'].map(type => (
          <div key={type} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{type === 'revenus' ? 'Revenus' : type === 'depenses' ? 'Dépenses' : 'Placements'}</h3>
              <button type="button" onClick={() => ajouterCategorie(type)} className="text-blue-600">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {categories[type].map((cat) => (
                <div key={cat.id} className="border rounded-lg p-2">
                  {editingCategory === `${type}-${cat.id}` ? (
                    <div className="space-y-2">
                      <input type="text" value={cat.nom} onChange={(e) => modifierCategorie(type, cat.id, 'nom', e.target.value)} className="w-full px-2 py-1 text-sm border rounded" />
                      <input type="number" value={cat.budget} onChange={(e) => modifierCategorie(type, cat.id, 'budget', parseFloat(e.target.value) || 0)} className="w-full px-2 py-1 text-sm border rounded" placeholder="Budget" />
                      <button type="button" onClick={() => setEditingCategory(null)} className="w-full bg-green-500 text-white px-2 py-1 rounded text-sm">Enregistrer</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex-1 text-sm font-medium">{cat.nom}</span>
                        <span className="text-sm text-gray-600">{cat.budget}{config.devise}</span>
                        <button type="button" onClick={() => setEditingCategory(`${type}-${cat.id}`)} className="text-gray-400"><Edit2 className="w-4 h-4" /></button>
                        <button type="button" onClick={() => supprimerCategorie(type, cat.id)} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      {editingSousCategories === `${type}-${cat.id}` ? (
                        <div className="space-y-1">
                          {cat.sousCategories.map((sc, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded text-xs">
                              <span className="flex-1">{sc}</span>
                              <button type="button" onClick={() => supprimerSousCategorie(type, cat.id, sc)} className="text-red-400"><X className="w-3 h-3" /></button>
                            </div>
                          ))}
                          <div className="flex gap-1">
                            <input type="text" value={newSousCategorie} onChange={(e) => setNewSousCategorie(e.target.value)} placeholder="Nouvelle sous-catégorie" className="flex-1 px-2 py-1 text-xs border rounded" />
                            <button type="button" onClick={() => ajouterSousCategorie(type, cat.id)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">+</button>
                          </div>
                          <button type="button" onClick={() => setEditingSousCategories(null)} className="w-full text-xs text-gray-600 mt-1">Fermer</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => setEditingSousCategories(`${type}-${cat.id}`)} className="text-xs text-blue-600 hover:underline">
                          {cat.sousCategories.length} sous-catégorie(s) →
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Mes comptes bancaires</h2>
          <button type="button" onClick={() => setShowAddCompte(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {comptes.map(compte => (
            <div key={compte.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              {editingCompte === compte.id ? (
                <div className="space-y-3">
                  <input type="text" value={compte.nom} onChange={(e) => modifierCompte(compte.id, 'nom', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                  <div className="grid grid-cols-2 gap-3">
                    <select value={compte.type} onChange={(e) => modifierCompte(compte.id, 'type', e.target.value)} className="px-3 py-2 border rounded-lg">
                      {typesComptes.map(type => (<option key={type.value} value={type.value}>{type.icon} {type.label}</option>))}
                    </select>
                    <input type="number" step="0.01" value={compte.soldeInitial} onChange={(e) => modifierCompte(compte.id, 'soldeInitial', parseFloat(e.target.value) || 0)} className="px-3 py-2 border rounded-lg" disabled={compte.locked} />
                  </div>
                  {compte.locked && <p className="text-xs text-orange-600">Solde verrouillé (transactions existantes)</p>}
                  <input type="color" value={compte.couleur} onChange={(e) => modifierCompte(compte.id, 'couleur', e.target.value)} className="w-full h-10 px-2 py-1 border rounded-lg" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setEditingCompte(null)} className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg">Enregistrer</button>
                    <button type="button" onClick={() => setEditingCompte(null)} className="px-4 py-2 border rounded-lg">Annuler</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: compte.couleur }}>
                      {typesComptes.find(t => t.value === compte.type)?.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{compte.nom}</div>
                      <div className="text-sm text-gray-600">{typesComptes.find(t => t.value === compte.type)?.label}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-800">{getSoldeCompte(compte.id).toFixed(2)} {config.devise}</div>
                      {compteActif === compte.id && <div className="text-xs text-green-600 font-medium">✓ Actif</div>}
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setCompteActif(compte.id)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><CreditCard className="w-4 h-4" /></button>
                      <button type="button" onClick={() => setEditingCompte(compte.id)} className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                      <button type="button" onClick={() => supprimerCompte(compte.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Transactions récurrentes</h2>
          <button type="button" onClick={() => setShowAddRecurrente(true)} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {transactionsRecurrentes.map(tr => (
            <div key={tr.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              {editingRecurrente === tr.id ? (
                <div className="flex-1 grid grid-cols-5 gap-2">
                  <input type="text" value={tr.libelle} onChange={(e) => modifierTransactionRecurrente(tr.id, 'libelle', e.target.value)} className="px-2 py-1 border rounded text-sm" />
                  <input type="number" value={Math.abs(tr.montant)} onChange={(e) => modifierTransactionRecurrente(tr.id, 'montant', tr.type === 'REVENUS' ? parseFloat(e.target.value) : -parseFloat(e.target.value))} className="px-2 py-1 border rounded text-sm" />
                  <select value={tr.categorie} onChange={(e) => modifierTransactionRecurrente(tr.id, 'categorie', e.target.value)} className="px-2 py-1 border rounded text-sm">
                    {(tr.type === 'DÉPENSES' ? categories.depenses : tr.type === 'REVENUS' ? categories.revenus : categories.placements).map(c => (<option key={c.id} value={c.nom}>{c.nom}</option>))}
                  </select>
                  <input type="number" min="1" max="31" value={tr.jour} onChange={(e) => modifierTransactionRecurrente(tr.id, 'jour', parseInt(e.target.value))} className="px-2 py-1 border rounded text-sm" />
                  <div className="flex gap-1">
                    <button type="button" onClick={() => setEditingRecurrente(null)} className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs">OK</button>
                    <button type="button" onClick={() => supprimerTransactionRecurrente(tr.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ) : (
                <>
                  <Repeat className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium">{tr.libelle}</div>
                    <div className="text-sm text-gray-600">{tr.categorie} • Le {tr.jour} de chaque mois</div>
                  </div>
                  <div className={`font-bold ${tr.montant > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tr.montant > 0 ? '+' : ''}{tr.montant}{config.devise}
                  </div>
                  <button type="button" onClick={() => setEditingRecurrente(tr.id)} className="text-gray-400 hover:text-gray-600"><Edit2 className="w-4 h-4" /></button>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={tr.actif} onChange={(e) => modifierTransactionRecurrente(tr.id, 'actif', e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Tags personnalisés</h2>
          <button type="button" onClick={() => setShowAddTag(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tagsDisponibles.map(tag => (
            <div key={tag} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
              <span className="text-sm">#{tag}</span>
              <button type="button" onClick={() => supprimerTag(tag)} className="text-red-500 hover:text-red-700">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ProfilView = () => (
  <div className="flex-1 overflow-auto bg-gray-100 p-6">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mon Profil</h1>
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-start gap-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profil.photo ? (
                  <img src={profil.photo} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full cursor-pointer shadow-lg">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">Cliquer pour modifier</p>
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
              <input type="text" value={profil.nom} onChange={(e) => setProfil({ ...profil, nom: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse e-mail</label>
              <input type="email" value={profil.email} onChange={(e) => setProfil({ ...profil, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
              <input type="date" value={profil.dateNaissance} onChange={(e) => setProfil({ ...profil, dateNaissance: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <button type="button" onClick={() => showNotification('success', 'Profil enregistré')} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
              <Save className="w-4 h-4" />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
