import { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { CreditCard, Settings, FileText, Plus, Home, Target, User, Camera, Trash2, Edit2, Save, X, TrendingUp, AlertCircle, Download, Upload, Filter, Search, Tag, Bell, RefreshCw, ArrowUpCircle, ArrowDownCircle, DollarSign, Repeat, ArrowLeftRight, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

export default function BudgetDashboard() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(2025);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);
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
    email: 'joshua.grillot@email.com',
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
    showNotification('success', 'Objectif créé avec succès');
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
    { id: 2, date: '2025-10-03', libelle: 'Loyer octobre', montant: -750, type: 'DÉPENSES', categorie: 'Logement', sousCategorie: 'Loyer', compteId: 1, tags: ['fixe'], recurrente: false }
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
  }, [selectedMonth, selectedYear]);

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
      const categorieExiste = categories[type].some(c => c.nom === t.categorie);
      
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
    
    return {
      moyenneRevenus,
      moyenneDepenses,
      moyenneEpargne,
      soldePrevuFinAnnee,
      epargnePrevueFinAnnee,
      tauxEpargne: ((moyenneEpargne / moyenneRevenus) * 100).toFixed(1)
    };
  }, [evolutionData, selectedMonth, soldeActuel, totalPlacements]);

  const alertesActives = useMemo(() => {
    const alertes = [];
    
    if (soldeActuel < objectifs.alertes.soldeBasSeuil) {
      alertes.push({
        type: 'danger',
        titre: 'Solde faible',
        message: `Votre solde (${soldeActuel.toFixed(2)}€) est en dessous du seuil de ${objectifs.alertes.soldeBasSeuil}€`
      });
    }
    
    if (!regleBudgetaireValide) {
      alertes.push({
        type: 'warning',
        titre: 'Règle budgétaire invalide',
        message: `La somme de vos pourcentages est de ${totalPourcentage}% au lieu de 100%`
      });
    }
    
    if (objectifs.alertes.depassementBudget) {
      categories.depenses.forEach(cat => {
        const depense = depensesParCategorie[cat.nom] || 0;
        if (depense > cat.budget) {
          const depassement = ((depense / cat.budget - 1) * 100).toFixed(0);
          alertes.push({
            type: 'warning',
            titre: `Budget ${cat.nom} dépassé`,
            message: `${depense.toFixed(2)}€ dépensés sur ${cat.budget}€ (+${depassement}%)`
          });
        }
      });
    }
    
    if (objectifs.alertes.objectifAtteint && pourcentageEpargne >= objectifs.epargne) {
      alertes.push({
        type: 'success',
        titre: 'Objectif d\'épargne atteint !',
        message: `Félicitations ! Vous avez épargné ${pourcentageEpargne}% de vos revenus (objectif: ${objectifs.epargne}%)`
      });
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

  const [showTransfert, setShowTransfert] = useState(false);
  const [transfert, setTransfert] = useState({
    de: compteActif,
    vers: null,
    montant: '',
    libelle: 'Virement interne'
  });

  const creerTransfert = () => {
    if (!transfert.vers || !transfert.montant || parseFloat(transfert.montant) <= 0) {
      showNotification('error', 'Veuillez remplir tous les champs');
      return;
    }
    
    if (transfert.de === transfert.vers) {
      showNotification('error', 'Les comptes source et destination doivent être différents');
      return;
    }
    
    const montant = parseFloat(transfert.montant);
    const date = new Date().toISOString().split('T')[0];
    
    const transactionDebit = {
      id: Date.now(),
      date,
      libelle: `${transfert.libelle} (vers ${comptes.find(c => c.id === transfert.vers)?.nom})`,
      montant: -montant,
      type: 'TRANSFERT',
      categorie: 'Transfert',
      sousCategorie: '',
      compteId: transfert.de,
      tags: ['transfert']
    };
    
    const transactionCredit = {
      id: Date.now() + 1,
      date,
      libelle: `${transfert.libelle} (depuis ${comptes.find(c => c.id === transfert.de)?.nom})`,
      montant: montant,
      type: 'TRANSFERT',
      categorie: 'Transfert',
      sousCategorie: '',
      compteId: transfert.vers,
      tags: ['transfert']
    };
    
    setTransactions([...transactions, transactionDebit, transactionCredit]);
    setShowTransfert(false);
    setTransfert({ de: compteActif, vers: null, montant: '', libelle: 'Virement interne' });
    showNotification('success', 'Transfert effectué avec succès');
  };

  const ajouterTransaction = () => {
    if (!newTransaction.libelle || !newTransaction.montant || !newTransaction.categorie) {
      showNotification('error', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const montant = parseFloat(newTransaction.montant);
    if (isNaN(montant) || montant === 0) {
      showNotification('error', 'Le montant doit être un nombre valide et différent de 0');
      return;
    }
    
    const dateTransaction = new Date(newTransaction.date);
    const aujourd_hui = new Date();
    aujourd_hui.setHours(0, 0, 0, 0);
    
    if (dateTransaction > aujourd_hui) {
      if (!confirm('Cette transaction est dans le futur. Voulez-vous continuer ?')) {
        return;
      }
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
    showNotification('success', '✓ Transaction ajoutée');
  };

  const supprimerTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    showNotification('success', 'Transaction supprimée');
  };

  const ajouterCompte = () => {
    if (!newCompte.nom.trim()) {
      showNotification('error', 'Veuillez saisir un nom pour le compte');
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
      const message = `Ce compte contient ${transactionsCompte.length} transaction(s). Elles seront également supprimées. Continuer ?`;
      if (!confirm(message)) return;
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
      showNotification('error', 'Le solde initial ne peut plus être modifié (transactions existantes)');
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
  }, [transactions, comptes]);

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
      const message = `${transactionsOrphelines.length} transaction(s) utilisent cette catégorie. Elles seront supprimées. Continuer ?`;
      if (!confirm(message)) return;
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

  const ajouterTag = () => {
    if (!newTag.trim() || tagsDisponibles.includes(newTag.trim())) {
      showNotification('error', 'Tag invalide ou déjà existant');
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
          showNotification('error', 'Aucune transaction valide dans le fichier');
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
    a.download = `budget_dashboard_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showNotification('success', 'Sauvegarde créée');
  };

  const exporterPDF = () => {
    showNotification('info', 'Génération du PDF...');
    window.print();
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
            showNotification('success', 'Données importées avec succès');
          } else {
            showNotification('error', 'Format de fichier invalide');
          }
        } catch (error) {
          showNotification('error', 'Erreur lors de l\'importation');
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

  const DashboardView = () => (
    <div className="flex-1 overflow-auto bg-gray-100 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Tableau de bord</h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <button
              onClick={() => setVueConsolidee(!vueConsolidee)}
              className={`px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${vueConsolidee ? 'bg-purple-500 text-white' : 'bg-white border border-gray-300'}`}
            >
              {vueConsolidee ? 'Consolidé' : 'Par compte'}
            </button>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {moisDisponibles.map((mois, index) => (
                <option key={index} value={index}>{mois}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {anneesDisponibles.map(annee => (
                <option key={annee} value={annee}>{annee}</option>
              ))}
            </select>
          </div>
        </div>

        {alertesActives.length > 0 && (
          <div className="space-y-3 mb-6">
            {alertesActives.map((alerte, index) => (
              <Alerte key={index} {...alerte} />
            ))}
          </div>
        )}

        {vueConsolidee && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-sm opacity-90 mb-1">Patrimoine total</div>
                <div className="text-3xl md:text-4xl font-bold">{patrimoineTotal.toFixed(2)} {config.devise}</div>
                <div className="text-sm mt-2">{comptes.length} compte{comptes.length > 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="text-gray-600 text-xs md:text-sm mb-2">Solde dispo</div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-4">{soldeActuel.toFixed(0)} {config.devise}</div>
            {!vueConsolidee && (
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-2 md:p-3">
                <div className="text-xs opacity-80">•••• {config.carteBancaire}</div>
                <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="text-green-600 font-semibold text-sm md:text-base mb-2">Revenus</div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800">{totalRevenus.toFixed(0)} {config.devise}</div>
            <div className="text-xs text-gray-500 mt-1">{moisDisponibles[selectedMonth]}</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="text-red-600 font-semibold text-sm md:text-base mb-2">Dépenses</div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800">{totalDepenses.toFixed(0)} {config.devise}</div>
            <div className="text-xs text-gray-500 mt-1">{moisDisponibles[selectedMonth]}</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="text-blue-600 font-semibold text-sm md:text-base mb-2">Épargne</div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800">{totalPlacements.toFixed(0)} {config.devise}</div>
            <div className="text-xs text-gray-500 mt-1">{pourcentageEpargne}%</div>
          </div>
        </div>

        {predictions && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-md p-4 md:p-6 mb-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Prédictions {selectedYear}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div>
                <div className="text-sm opacity-90">Solde prévu</div>
                <div className="text-xl md:text-2xl font-bold">{predictions.soldePrevuFinAnnee.toFixed(0)} {config.devise}</div>
              </div>
              <div>
                <div className="text-sm opacity-90">Épargne prévue</div>
                <div className="text-xl md:text-2xl font-bold">{predictions.epargnePrevueFinAnnee.toFixed(0)} {config.devise}</div>
              </div>
              <div>
                <div className="text-sm opacity-90">Taux moyen</div>
                <div className="text-xl md:text-2xl font-bold">{predictions.tauxEpargne}%</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Budget vs Réel</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={budgetVsReelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categorie" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="budget" fill="#cbd5e1" name="Budget" />
                <Bar dataKey="reel" fill="#ef4444" name="Réel" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Placements</h3>
            {placementsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={placementsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {placementsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <p className="text-sm">Aucun placement</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-900">
      <ToastContainer />
      
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} md:w-64 bg-gray-800 text-white flex flex-col transition-all duration-300 overflow-hidden md:overflow-visible`}>
        <div className="p-6 border-b border-gray-700">
          <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-3 overflow-hidden flex items-center justify-center">
            {profil.photo ? (
              <img src={profil.photo} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <div className="text-center text-sm text-gray-300">{profil.nom}</div>
          <div className="text-center text-xs text-gray-500 mt-1">{profil.email}</div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              currentView === 'dashboard' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Home className="w-5 h-5" />
            Tableau de bord
          </button>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-between px-4 mb-2">
              <div className="text-xs text-gray-400">MES COMPTES</div>
            </div>
            {comptes.map(compte => {
              const typeCompte = typesComptes.find(t => t.value === compte.type);
              const soldeCompte = getSoldeCompte(compte.id);
              
              return (
                <button
                  key={compte.id}
                  onClick={() => {
                    setCompteActif(compte.id);
                    setVueConsolidee(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg mb-1 transition-colors ${
                    compteActif === compte.id && !vueConsolidee ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{ backgroundColor: compte.couleur }}
                  >
                    {typeCompte?.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium truncate">{compte.nom}</div>
                    <div className="text-xs opacity-70">{soldeCompte.toFixed(0)}{config.devise}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold">Dashboard Budgétaire Pro</h1>
            <div className="text-sm text-right">
              <div className="font-medium">{moisDisponibles[selectedMonth]} {selectedYear}</div>
            </div>
          </div>
        </div>

        <DashboardView />
      </div>
    </div>
  );
}
