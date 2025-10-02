import { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { CreditCard, Settings, FileText, Plus, Home, Target, User, Camera, Trash2, Edit2, Save, X, TrendingUp, AlertCircle, Download, Upload, Search, Bell, Repeat, ArrowLeftRight, CheckCircle, XCircle, Eye, EyeOff, ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';

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
        titre: 'Objectif d\'épargne atteint',
        message: `Vous avez épargné ${pourcentageEpargne}% de vos revenus (objectif: ${objectifs.epargne}%)`
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
    showNotification('success', 'Transfert effectué');
  };

  const ajouterTransaction = () => {
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

  const ajouterCompte = () => {
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
      if (!confirm(`Ce compte contient ${transactionsCompte.length} transaction(s). Continuer ?`)) return;
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
      if (!confirm(`${transactionsOrphelines.length} transaction(s) seront supprimées. Continuer ?`)) return;
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
              <input
                type="number"
                value={objectifs.essentiels}
                onChange={(e) => setObjectifs({ ...objectifs, essentiels: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Loisirs (%)</label>
              <input
                type="number"
                value={objectifs.loisirs}
                onChange={(e) => setObjectifs({ ...objectifs, loisirs: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Épargne (%)</label>
              <input
                type="number"
                value={objectifs.epargne}
                onChange={(e) => setObjectifs({ ...objectifs, epargne: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
              />
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

        {objectifsEpargne.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Objectifs d'épargne</h2>
              <button
                onClick={() => setShowAddObjectif(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
            <div className="space-y-4">
              {objectifsEpargne.map(obj => {
                const progression = (obj.montantActuel / obj.montantCible) * 100;
                const reste = obj.montantCible - obj.montantActuel;
                const joursRestants = Math.ceil((new Date(obj.dateObjectif) - new Date()) / (1000 * 60 * 60 * 24));
                const parMois = reste / Math.max((joursRestants / 30), 1);
                
                return (
                  <div key={obj.id} className="p-4 bg-blue-50 rounded-lg">
                    {editingObjectif === obj.id ? (
                      <div className="space-y-3">
                        <input type="text" value={obj.nom} onChange={(e) => modifierObjectif(obj.id, 'nom', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="number" value={obj.montantCible} onChange={(e) => modifierObjectif(obj.id, 'montantCible', parseFloat(e.target.value))} className="px-3 py-2 border rounded-lg" placeholder="Cible" />
                          <input type="number" value={obj.montantActuel} onChange={(e) => modifierObjectif(obj.id, 'montantActuel', parseFloat(e.target.value))} className="px-3 py-2 border rounded-lg" placeholder="Actuel" />
                        </div>
                        <input type="date" value={obj.dateObjectif} onChange={(e) => modifierObjectif(obj.id, 'dateObjectif', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                        <div className="flex gap-2">
                          <button onClick={() => setEditingObjectif(null)} className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg">OK</button>
                          <button onClick={() => supprimerObjectif(obj.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">{obj.nom}</h4>
                            <p className="text-xs text-gray-600">{obj.categorie}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">{progression.toFixed(0)}%</div>
                              <div className="text-xs text-gray-500">{obj.montantActuel} / {obj.montantCible}{config.devise}</div>
                            </div>
                            <button onClick={() => setEditingObjectif(obj.id)} className="text-gray-400 hover:text-gray-600">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(progression, 100)}%` }}></div>
                        </div>
                        <div className="text-xs text-gray-600">
                          {joursRestants > 0 ? `Économiser ${parMois.toFixed(0)}${config.devise}/mois × ${Math.ceil(joursRestants / 30)} mois` : 'Objectif dépassé'}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

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
            <button onClick={exporterCSV} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ajouter une transaction</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
            <div>
              <label className="block text-sm text-gray-600 mb-1">Sous-catégorie</label>
              <select value={newTransaction.sousCategorie} onChange={(e) => setNewTransaction({ ...newTransaction, sousCategorie: e.target.value })} className="w-full px-3 py-2 border rounded-lg" disabled={!newTransaction.categorie}>
                <option value="">Aucune</option>
                {newTransaction.categorie && (
                  <>
                    {newTransaction.type === 'DÉPENSES' && categories.depenses.find(c => c.nom === newTransaction.categorie)?.sousCategories.map((sc, i) => (<option key={i} value={sc}>{sc}</option>))}
                    {newTransaction.type === 'REVENUS' && categories.revenus.find(c => c.nom === newTransaction.categorie)?.sousCategories.map((sc, i) => (<option key={i} value={sc}>{sc}</option>))}
                    {newTransaction.type === 'PLACEMENTS' && categories.placements.find(c => c.nom === newTransaction.categorie)?.sousCategories.map((sc, i) => (<option key={i} value={sc}>{sc}</option>))}
                  </>
                )}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tagsDisponibles.map(tag => (
                  <button key={tag} onClick={() => {
                    const tags = newTransaction.tags || [];
                    if (tags.includes(tag)) {
                      setNewTransaction({ ...newTransaction, tags: tags.filter(t => t !== tag) });
                    } else {
                      setNewTransaction({ ...newTransaction, tags: [...tags, tag] });
                    }
                  }} className={`px-3 py-1 rounded-full text-xs ${(newTransaction.tags || []).includes(tag) ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={ajouterTransaction} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 mt-6">
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
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
                    <button onClick={() => supprimerTransaction(t.id)} className="text-red-500 hover:text-red-700">
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

  const ConfigView = () => (
    <div className="flex-1 overflow-auto bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Configuration</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sauvegarde et Export</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={exporterDonnees}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span className="text-sm">Sauvegarder JSON</span>
            </button>
            <label className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-5 h-5" />
              <span className="text-sm">Restaurer</span>
              <input type="file" accept=".json" onChange={importerDonnees} className="hidden" />
            </label>
            <button
              onClick={exporterPDF}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
            >
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
              <select
                value={config.devise}
                onChange={(e) => setConfig({ ...config, devise: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="€">€ Euro</option>
                <option value="$">$ Dollar US</option>
                <option value="£">£ Livre Sterling</option>
                <option value="CHF">CHF Franc Suisse</option>
              </select>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block font-medium text-gray-800 mb-2">N° Carte bancaire (4 derniers chiffres)</label>
              <input
                type="text"
                maxLength="4"
                value={config.carteBancaire}
                onChange={(e) => setConfig({ ...config, carteBancaire: e.target.value.replace(/\D/g, '') })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="1234"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {['revenus', 'depenses', 'placements'].map(type => (
            <div key={type} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{type === 'revenus' ? 'Revenus' : type === 'depenses' ? 'Dépenses' : 'Placements'}</h3>
                <button onClick={() => ajouterCategorie(type)} className="text-blue-600">
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
                        <button onClick={() => setEditingCategory(null)} className="w-full bg-green-500 text-white px-2 py-1 rounded text-sm">Enregistrer</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex-1 text-sm font-medium">{cat.nom}</span>
                          <span className="text-sm text-gray-600">{cat.budget}{config.devise}</span>
                          <button onClick={() => setEditingCategory(`${type}-${cat.id}`)} className="text-gray-400"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => supprimerCategorie(type, cat.id)} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        {editingSousCategories === `${type}-${cat.id}` ? (
                          <div className="space-y-1">
                            {cat.sousCategories.map((sc, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded text-xs">
                                <span className="flex-1">{sc}</span>
                                <button onClick={() => supprimerSousCategorie(type, cat.id, sc)} className="text-red-400"><X className="w-3 h-3" /></button>
                              </div>
                            ))}
                            <div className="flex gap-1">
                              <input type="text" value={newSousCategorie} onChange={(e) => setNewSousCategorie(e.target.value)} placeholder="Nouvelle sous-catégorie" className="flex-1 px-2 py-1 text-xs border rounded" />
                              <button onClick={() => ajouterSousCategorie(type, cat.id)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">+</button>
                            </div>
                            <button onClick={() => setEditingSousCategories(null)} className="w-full text-xs text-gray-600 mt-1">Fermer</button>
                          </div>
                        ) : (
                          <button onClick={() => setEditingSousCategories(`${type}-${cat.id}`)} className="text-xs text-blue-600 hover:underline">
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
            <button onClick={() => setShowAddCompte(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
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
                      <button onClick={() => setEditingCompte(null)} className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg">Enregistrer</button>
                      <button onClick={() => setEditingCompte(null)} className="px-4 py-2 border rounded-lg">Annuler</button>
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
                        <button onClick={() => setCompteActif(compte.id)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><CreditCard className="w-4 h-4" /></button>
                        <button onClick={() => setEditingCompte(compte.id)} className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => supprimerCompte(compte.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
            <button onClick={() => setShowAddRecurrente(true)} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
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
                      <button onClick={() => setEditingRecurrente(null)} className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs">OK</button>
                      <button onClick={() => supprimerTransactionRecurrente(tr.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs"><Trash2 className="w-3 h-3" /></button>
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
                    <button onClick={() => setEditingRecurrente(tr.id)} className="text-gray-400 hover:text-gray-600"><Edit2 className="w-4 h-4" /></button>
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
            <button onClick={() => setShowAddTag(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tagsDisponibles.map(tag => (
              <div key={tag} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
                <span className="text-sm">#{tag}</span>
                <button onClick={() => supprimerTag(tag)} className="text-red-500 hover:text-red-700">
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
                <input
                  type="text"
                  value={profil.nom}
                  onChange={(e) => setProfil({ ...profil, nom: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse e-mail</label>
                <input
                  type="email"
                  value={profil.email}
                  onChange={(e) => setProfil({ ...profil, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                <input
                  type="date"
                  value={profil.dateNaissance}
                  onChange={(e) => setProfil({ ...profil, dateNaissance: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <button 
                onClick={() => showNotification('success', 'Profil enregistré')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
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

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Évolution {selectedYear}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenus" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} name="Revenus" />
              <Area type="monotone" dataKey="depenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Dépenses" />
              <Area type="monotone" dataKey="epargne" stackId="3" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Épargne" />
            </AreaChart>
          </ResponsiveContainer>
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

          <button
            onClick={() => setCurrentView('objectifs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              currentView === 'objectifs' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Target className="w-5 h-5" />
            Objectifs
          </button>
          
          <button
            onClick={() => setCurrentView('transactions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              currentView === 'transactions' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FileText className="w-5 h-5" />
            Transactions
          </button>

          <button
            onClick={() => setCurrentView('config')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              currentView === 'config' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            Configuration
          </button>

          <button
            onClick={() => setCurrentView('profil')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              currentView === 'profil' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <User className="w-5 h-5" />
            Mon Profil
          </button>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-between px-4 mb-2">
              <div className="text-xs text-gray-400">MES COMPTES</div>
              <button
                onClick={() => {
                  setCurrentView('config');
                  setShowAddCompte(true);
                }}
                className="text-orange-500 hover:text-orange-400"
              >
                <Plus className="w-4 h-4" />
              </button>
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
                  {compteActif === compte.id && !vueConsolidee && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            <button
              onClick={() => setShowTransfert(true)}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Virement
            </button>
          </div>
        </nav>

        {alertesActives.length > 0 && (
          <div className="p-4 border-t border-gray-700">
            <div className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2">
              <Bell className="w-4 h-4" />
              {alertesActives.length} alerte{alertesActives.length > 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-white/20 rounded-lg"
              >
                <Settings className="w-5 h-5" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold">Dashboard Budgétaire Pro</h1>
            </div>
            <div className="text-sm text-right">
              <div className="font-medium">{moisDisponibles[selectedMonth]} {selectedYear}</div>
              <div className="text-xs opacity-90">
                {vueConsolidee ? 'Vue consolidée' : comptes.find(c => c.id === compteActif)?.nom}
              </div>
            </div>
          </div>
        </div>

        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'profil' && <ProfilView />}
        {currentView === 'objectifs' && <ObjectifsView />}
        {currentView === 'transactions' && <TransactionsView />}
        {currentView === 'config' && <ConfigView />}
      </div>

      {showTransfert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Virement entre comptes</h3>
              <button onClick={() => setShowTransfert(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Depuis</label>
                <select
                  value={transfert.de}
                  onChange={(e) => setTransfert({ ...transfert, de: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {comptes.map(c => (
                    <option key={c.id} value={c.id}>{c.nom} ({getSoldeCompte(c.id).toFixed(2)}{config.devise})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Vers</label>
                <select
                  value={transfert.vers || ''}
                  onChange={(e) => setTransfert({ ...transfert, vers: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Sélectionner...</option>
                  {comptes.filter(c => c.id !== transfert.de).map(c => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Montant ({config.devise})</label>
                <input
                  type="number"
                  step="0.01"
                  value={transfert.montant}
                  onChange={(e) => setTransfert({ ...transfert, montant: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Libellé</label>
                <input
                  type="text"
                  value={transfert.libelle}
                  onChange={(e) => setTransfert({ ...transfert, libelle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowTransfert(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={creerTransfert}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Transférer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddObjectif && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nouvel objectif d'épargne</h3>
              <button onClick={() => setShowAddObjectif(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom de l'objectif"
                value={newObjectif.nom}
                onChange={(e) => setNewObjectif({ ...newObjectif, nom: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Montant cible"
                value={newObjectif.montantCible}
                onChange={(e) => setNewObjectif({ ...newObjectif, montantCible: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Montant actuel"
                value={newObjectif.montantActuel}
                onChange={(e) => setNewObjectif({ ...newObjectif, montantActuel: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="date"
                value={newObjectif.dateObjectif}
                onChange={(e) => setNewObjectif({ ...newObjectif, dateObjectif: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Catégorie"
                value={newObjectif.categorie}
                onChange={(e) => setNewObjectif({ ...newObjectif, categorie: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddObjectif(false)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={ajouterObjectif}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddCompte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nouveau compte</h3>
              <button onClick={() => setShowAddCompte(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom du compte"
                value={newCompte.nom}
                onChange={(e) => setNewCompte({ ...newCompte, nom: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <select
                value={newCompte.type}
                onChange={(e) => setNewCompte({ ...newCompte, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {typesComptes.map(type => (
                  <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Solde initial"
                value={newCompte.soldeInitial}
                onChange={(e) => setNewCompte({ ...newCompte, soldeInitial: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="color"
                value={newCompte.couleur}
                onChange={(e) => setNewCompte({ ...newCompte, couleur: e.target.value })}
                className="w-full h-10 px-2 py-1 border rounded-lg"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddCompte(false)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={ajouterCompte}
                  className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nouveau tag</h3>
              <button onClick={() => setShowAddTag(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom du tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddTag(false)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={ajouterTag}
                  className="flex-1 bg-indigo-500 text-white px-4 py-2 rounded-lg"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddRecurrente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nouvelle transaction récurrente</h3>
              <button onClick={() => setShowAddRecurrente(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Libellé"
                value={newRecurrente.libelle}
                onChange={(e) => setNewRecurrente({ ...newRecurrente, libelle: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <select
                value={newRecurrente.type}
                onChange={(e) => setNewRecurrente({ ...newRecurrente, type: e.target.value, categorie: '' })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="DÉPENSES">Dépenses</option>
                <option value="REVENUS">Revenus</option>
                <option value="PLACEMENTS">Placements</option>
              </select>
              <select
                value={newRecurrente.categorie}
                onChange={(e) => setNewRecurrente({ ...newRecurrente, categorie: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Sélectionner une catégorie</option>
                {newRecurrente.type === 'DÉPENSES' && categories.depenses.map(cat => (
                  <option key={cat.id} value={cat.nom}>{cat.nom}</option>
                ))}
                {newRecurrente.type === 'REVENUS' && categories.revenus.map(cat => (
                  <option key={cat.id} value={cat.nom}>{cat.nom}</option>
                ))}
                {newRecurrente.type === 'PLACEMENTS' && categories.placements.map(cat => (
                  <option key={cat.id} value={cat.nom}>{cat.nom}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Montant"
                value={newRecurrente.montant}
                onChange={(e) => setNewRecurrente({ ...newRecurrente, montant: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                min="1"
                max="31"
                placeholder="Jour du mois (1-31)"
                value={newRecurrente.jour}
                onChange={(e) => setNewRecurrente({ ...newRecurrente, jour: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddRecurrente(false)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={ajouterTransactionRecurrente}
                  className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
