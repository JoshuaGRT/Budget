import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Menu, Home, CreditCard, Target, Settings, User, Plus, TrendingUp, TrendingDown, Wallet, Calendar, Trash2, Download, Upload, Search, Sun, Moon, BarChart3, AlertCircle, CheckCircle, X, Edit, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Modal Import CSV
const ModalImportCSV = memo(({ show, onClose, onImport, darkMode, comptes }) => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({ date: '', libelle: '', montant: '', categorie: '' });
  const [step, setStep] = useState(1);
  const [selectedCompte, setSelectedCompte] = useState(comptes[0]?.id || 1);
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length === 0) return;
      const headerLine = lines[0].split(/[;,\t]/);
      setHeaders(headerLine);
      const data = lines.slice(1).map(line => {
        const values = line.split(/[;,\t]/);
        const row = {};
        headerLine.forEach((h, i) => row[h] = values[i] || '');
        return row;
      });
      setCsvData(data);
      setStep(2);
    };
    reader.readAsText(file);
  };
  
  const processImport = () => {
    const transactions = csvData.map((row, index) => {
      let montant = parseFloat(row[mapping.montant]?.replace(',', '.')) || 0;
      const libelle = row[mapping.libelle] || `Transaction ${index + 1}`;
      let type = 'DÉPENSES';
      if (montant > 0) type = 'REVENUS';
      else montant = Math.abs(montant);
      return {
        date: row[mapping.date] || new Date().toISOString().split('T')[0],
        libelle,
        montant: type === 'DÉPENSES' ? -montant : montant,
        type,
        categorie: row[mapping.categorie] || 'Autre',
        compteId: selectedCompte
      };
    });
    onImport(transactions);
    setStep(1);
    setCsvData([]);
    setHeaders([]);
  };
  
  useEffect(() => {
    if (!show) {
      setStep(1);
      setCsvData([]);
      setHeaders([]);
    }
  }, [show]);
  
  if (!show) return null;
  
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm overflow-auto p-4">
      <div className={`${cardClass} rounded-2xl p-6 w-full max-w-4xl shadow-2xl border ${borderClass} max-h-[90vh] overflow-auto`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Import CSV - Étape {step}/3</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Compte</label>
              <select value={selectedCompte} onChange={(e) => setSelectedCompte(parseInt(e.target.value))} className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                {comptes.map(c => (<option key={c.id} value={c.id}>{c.nom}</option>))}
              </select>
            </div>
            <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed ${borderClass} rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700`}>
              <Upload className="w-12 h-12 mb-2 text-gray-400" />
              <span className="text-sm">Sélectionner CSV</span>
              <input type="file" accept=".csv,.txt,.tsv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {['date', 'libelle', 'montant', 'categorie'].map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                  <select value={mapping[field]} onChange={(e) => setMapping({...mapping, [field]: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <option value="">Sélectionner...</option>
                    {headers.map(h => (<option key={h} value={h}>{h}</option>))}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 bg-gray-300 px-4 py-3 rounded-xl">Retour</button>
              <button onClick={() => setStep(3)} disabled={!mapping.date || !mapping.libelle || !mapping.montant} className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-xl disabled:opacity-50">Suivant</button>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-4">
            <div className={`max-h-96 overflow-auto border ${borderClass} rounded-xl`}>
              <table className="w-full text-sm">
                <thead className={`sticky top-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Libellé</th>
                    <th className="px-4 py-2 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 50).map((row, i) => {
                    const montant = parseFloat(row[mapping.montant]?.replace(',', '.')) || 0;
                    return (
                      <tr key={i} className={`border-t ${borderClass}`}>
                        <td className="px-4 py-2">{row[mapping.date]}</td>
                        <td className="px-4 py-2">{row[mapping.libelle]}</td>
                        <td className={`px-4 py-2 text-right ${montant < 0 ? 'text-red-600' : 'text-green-600'}`}>{montant.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="flex-1 bg-gray-300 px-4 py-3 rounded-xl">Retour</button>
              <button onClick={processImport} className="flex-1 bg-green-500 text-white px-4 py-3 rounded-xl">Importer {csvData.length}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Modal Config Dashboard
const ModalConfigDashboard = memo(({ show, onClose, onSave, darkMode, currentConfig }) => {
  const [widgets, setWidgets] = useState(currentConfig);
  const widgetsList = [
    { key: 'statsCards', label: 'Cartes stats' },
    { key: 'patrimoineChart', label: 'Évolution patrimoine' },
    { key: 'depensesChart', label: 'Dépenses/catégorie' },
    { key: 'budgetsSection', label: 'Budgets' },
    { key: 'comptesSection', label: 'Comptes' },
    { key: 'objectifsSection', label: 'Objectifs' }
  ];
  
  useEffect(() => { if (show && currentConfig) setWidgets(currentConfig); }, [show, currentConfig]);
  if (!show) return null;
  
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${cardClass} rounded-2xl p-6 w-full max-w-2xl shadow-2xl border ${borderClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Personnaliser dashboard</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          {widgetsList.map(w => (
            <label key={w.key} className={`flex items-center gap-3 p-4 rounded-xl border ${borderClass} cursor-pointer ${widgets[w.key] ? 'ring-2 ring-orange-500' : ''}`}>
              <input type="checkbox" checked={widgets[w.key]} onChange={(e) => setWidgets({...widgets, [w.key]: e.target.checked})} className="w-5 h-5" />
              <span>{w.label}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={() => onSave(widgets)} className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-xl">Enregistrer</button>
          <button onClick={onClose} className="flex-1 bg-gray-300 px-4 py-3 rounded-xl">Annuler</button>
        </div>
      </div>
    </div>
  );
});

// Modal Compte
const ModalCompte = memo(({ show, onClose, onCreate, darkMode, typesComptes, devise }) => {
  const [data, setData] = useState({ nom: '', type: 'courant', soldeInitial: '' });
  useEffect(() => { if (!show) setData({ nom: '', type: 'courant', soldeInitial: '' }); }, [show]);
  if (!show) return null;
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${cardClass} rounded-2xl p-6 w-full max-w-md shadow-2xl border ${borderClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Nouveau compte</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom du compte</label>
            <input type="text" value={data.nom} onChange={(e) => setData({...data, nom: e.target.value})} placeholder="Ex: Mon Livret A" className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type de compte</label>
            <select value={data.type} onChange={(e) => setData({...data, type: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              {typesComptes.map(t => (<option key={t.value} value={t.value}>{t.icon} {t.label}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Solde initial ({devise})</label>
            <input type="number" step="0.01" value={data.soldeInitial} onChange={(e) => setData({...data, soldeInitial: e.target.value})} placeholder="0.00" className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={() => onCreate({...data, soldeInitial: parseFloat(data.soldeInitial) || 0, couleur: '#3b82f6'})} className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-xl">Créer</button>
          <button onClick={onClose} className="flex-1 bg-gray-300 px-4 py-3 rounded-xl">Annuler</button>
        </div>
      </div>
    </div>
  );
});

// Modal Transaction
const ModalTransaction = memo(({ show, onClose, onCreate, darkMode, comptes, categories, devise }) => {
  const [data, setData] = useState({ date: new Date().toISOString().split('T')[0], libelle: '', montant: '', type: 'DÉPENSES', categorie: '' });
  useEffect(() => { if (!show) setData({ date: new Date().toISOString().split('T')[0], libelle: '', montant: '', type: 'DÉPENSES', categorie: '' }); }, [show]);
  if (!show) return null;
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${cardClass} rounded-2xl p-6 w-full max-w-md shadow-2xl border ${borderClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Nouvelle transaction</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <input type="date" value={data.date} onChange={(e) => setData({...data, date: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
          <input type="text" value={data.libelle} onChange={(e) => setData({...data, libelle: e.target.value})} placeholder="Libellé" className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
          <input type="number" step="0.01" value={data.montant} onChange={(e) => setData({...data, montant: e.target.value})} placeholder="Montant" className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
          <select value={data.type} onChange={(e) => setData({...data, type: e.target.value, categorie: ''})} className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <option value="DÉPENSES">Dépenses</option>
            <option value="REVENUS">Revenus</option>
          </select>
          <select value={data.categorie} onChange={(e) => setData({...data, categorie: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <option value="">Catégorie...</option>
            {data.type === 'DÉPENSES' && categories.depenses.map(c => (<option key={c.id} value={c.nom}>{c.nom}</option>))}
            {data.type === 'REVENUS' && categories.revenus.map(c => (<option key={c.id} value={c.nom}>{c.nom}</option>))}
          </select>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={() => onCreate({...data, montant: parseFloat(data.montant) || 0, compteId: comptes[0]?.id || 1})} className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-xl">Créer</button>
          <button onClick={onClose} className="flex-1 bg-gray-300 px-4 py-3 rounded-xl">Annuler</button>
        </div>
      </div>
    </div>
  );
});

// Modal Objectif
const ModalObjectif = memo(({ show, onClose, onCreate, darkMode, devise }) => {
  const [data, setData] = useState({ nom: '', montantCible: '', montantActuel: '', dateObjectif: '', categorie: '' });
  useEffect(() => { if (!show) setData({ nom: '', montantCible: '', montantActuel: '', dateObjectif: '', categorie: '' }); }, [show]);
  if (!show) return null;
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${cardClass} rounded-2xl p-6 w-full max-w-md shadow-2xl border ${borderClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Nouvel objectif</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <input type="text" value={data.nom} onChange={(e) => setData({...data, nom: e.target.value})} placeholder="Nom" className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
          <input type="number" value={data.montantCible} onChange={(e) => setData({...data, montantCible: e.target.value})} placeholder="Montant cible" className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
          <input type="number" value={data.montantActuel} onChange={(e) => setData({...data, montantActuel: e.target.value})} placeholder="Montant actuel" className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
          <input type="date" value={data.dateObjectif} onChange={(e) => setData({...data, dateObjectif: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={() => onCreate({...data, montantCible: parseFloat(data.montantCible) || 0, montantActuel: parseFloat(data.montantActuel) || 0})} className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-xl">Créer</button>
          <button onClick={onClose} className="flex-1 bg-gray-300 px-4 py-3 rounded-xl">Annuler</button>
        </div>
      </div>
    </div>
  );
});

// Modal Budget
const ModalBudget = memo(({ show, onClose, onCreate, darkMode, categories, devise }) => {
  const [data, setData] = useState({ categorie: '', montantMax: '', mois: new Date().toISOString().slice(0, 7) });
  useEffect(() => { if (!show) setData({ categorie: '', montantMax: '', mois: new Date().toISOString().slice(0, 7) }); }, [show]);
  if (!show) return null;
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${cardClass} rounded-2xl p-6 w-full max-w-md shadow-2xl border ${borderClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Nouveau budget</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <select value={data.categorie} onChange={(e) => setData({...data, categorie: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <option value="">Catégorie...</option>
            {categories.depenses.map(c => (<option key={c.id} value={c.nom}>{c.nom}</option>))}
          </select>
          <input type="number" value={data.montantMax} onChange={(e) => setData({...data, montantMax: e.target.value})} placeholder="Montant max" className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
          <input type="month" value={data.mois} onChange={(e) => setData({...data, mois: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={() => onCreate({...data, montantMax: parseFloat(data.montantMax) || 0})} className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-xl">Créer</button>
          <button onClick={onClose} className="flex-1 bg-gray-300 px-4 py-3 rounded-xl">Annuler</button>
        </div>
      </div>
    </div>
  );
});

// Modal Catégorie (Edit)
const ModalEditCategorie = memo(({ show, onClose, onUpdate, darkMode, categorie }) => {
  const [data, setData] = useState({ nom: '', icon: '', color: '' });
  useEffect(() => { if (show && categorie) setData({ nom: categorie.nom, icon: categorie.icon, color: categorie.color }); }, [show, categorie]);
  if (!show) return null;
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${cardClass} rounded-2xl p-6 w-full max-w-md shadow-2xl border ${borderClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Modifier catégorie</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <input type="text" value={data.nom} onChange={(e) => setData({...data, nom: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
          <input type="text" value={data.icon} onChange={(e) => setData({...data, icon: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
          <input type="color" value={data.color} onChange={(e) => setData({...data, color: e.target.value})} className={`w-full h-12 border ${borderClass} rounded-xl`} />
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={() => onUpdate(data)} className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-xl">Modifier</button>
          <button onClick={onClose} className="flex-1 bg-gray-300 px-4 py-3 rounded-xl">Annuler</button>
        </div>
      </div>
    </div>
  );
});

const BudgetApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('tout');
  const [vueComparative, setVueComparative] = useState('none');
  const [filtreType, setFiltreType] = useState('TOUS');
  const [filtreCategorie, setFiltreCategorie] = useState('');
  const [filtreCompte, setFiltreCompte] = useState('');
  
  const [config, setConfig] = useState({ devise: '€' });
  const [profil, setProfil] = useState({ nom: 'Jean Dupont', email: 'jean@example.com' });
  
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
  
  const [comptes, setComptes] = useState([
    { id: 1, nom: 'Compte courant', type: 'courant', soldeInitial: 2500, couleur: '#3b82f6' },
    { id: 2, nom: 'PEA', type: 'pea', soldeInitial: 5000, couleur: '#10b981' }
  ]);
  
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2025-10-01', libelle: 'Salaire', montant: 2500, type: 'REVENUS', categorie: 'Salaire', compteId: 1 },
    { id: 2, date: '2025-10-01', libelle: 'Loyer', montant: -800, type: 'DÉPENSES', categorie: 'Logement', compteId: 1 },
    { id: 3, date: '2025-10-02', libelle: 'Courses', montant: -120, type: 'DÉPENSES', categorie: 'Alimentation', compteId: 1 },
    { id: 4, date: '2024-10-01', libelle: 'Salaire', montant: 2400, type: 'REVENUS', categorie: 'Salaire', compteId: 1 }
  ]);
  
  const [objectifs, setObjectifs] = useState([
    { id: 1, nom: 'Vacances été', montantCible: 2000, montantActuel: 500, dateObjectif: '2025-07-01' }
  ]);
  
  const [budgets, setBudgets] = useState([
    { id: 1, categorie: 'Alimentation', montantMax: 400, mois: '2025-10' }
  ]);
  
  const [categories, setCategories] = useState({
    depenses: [
      { id: 1, nom: 'Alimentation', icon: '🍕', color: '#ef4444' },
      { id: 2, nom: 'Logement', icon: '🏠', color: '#f59e0b' },
      { id: 3, nom: 'Transport', icon: '🚗', color: '#3b82f6' }
    ],
    revenus: [
      { id: 1, nom: 'Salaire', icon: '💼', color: '#10b981' },
      { id: 2, nom: 'Freelance', icon: '💻', color: '#14b8a6' }
    ],
    placements: []
  });
  
  const [showImportCSV, setShowImportCSV] = useState(false);
  const [showConfigDashboard, setShowConfigDashboard] = useState(false);
  const [showAddCompte, setShowAddCompte] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddObjectif, setShowAddObjectif] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddCategorie, setShowAddCategorie] = useState(false);
  const [showEditCategorie, setShowEditCategorie] = useState(false);
  const [categorieType, setCategorieType] = useState('depenses');
  const [categorieToEdit, setCategorieToEdit] = useState(null);
  
  const [dashboardConfig, setDashboardConfig] = useState({
    statsCards: true,
    patrimoineChart: true,
    budgetsSection: true,
    comptesSection: true,
    objectifsSection: true,
    depensesChart: true
  });
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }, []);
  
  const comptesAvecSoldes = useMemo(() => {
    return comptes.map(compte => {
      const transactionsCompte = transactions.filter(t => t.compteId === compte.id);
      const soldeActuel = compte.soldeInitial + transactionsCompte.reduce((sum, t) => sum + t.montant, 0);
      return { ...compte, soldeActuel };
    });
  }, [comptes, transactions]);
  
  const getTransactionsFiltrees = useCallback(() => {
    let filtered = [...transactions];
    const now = new Date();
    
    if (periodFilter === 'semaine') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
    } else if (periodFilter === 'mois') {
      filtered = filtered.filter(t => t.date.startsWith(now.toISOString().slice(0, 7)));
    }
    
    if (filtreType !== 'TOUS') filtered = filtered.filter(t => t.type === filtreType);
    if (filtreCategorie) filtered = filtered.filter(t => t.categorie === filtreCategorie);
    if (filtreCompte) filtered = filtered.filter(t => t.compteId === parseInt(filtreCompte));
    if (searchTerm) filtered = filtered.filter(t => t.libelle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return filtered;
  }, [transactions, periodFilter, filtreType, filtreCategorie, filtreCompte, searchTerm]);
  
  const stats = useMemo(() => {
    const filtered = getTransactionsFiltrees();
    return {
      totalRevenus: filtered.filter(t => t.montant > 0).reduce((sum, t) => sum + t.montant, 0),
      totalDepenses: Math.abs(filtered.filter(t => t.montant < 0).reduce((sum, t) => sum + t.montant, 0)),
      soldeTotal: comptesAvecSoldes.reduce((sum, c) => sum + c.soldeActuel, 0),
      nbTransactions: filtered.length
    };
  }, [getTransactionsFiltrees, comptesAvecSoldes]);
  
  const getDepensesParCategorie = useCallback(() => {
    const depenses = transactions.filter(t => t.montant < 0);
    const parCategorie = {};
    depenses.forEach(t => {
      if (!parCategorie[t.categorie]) parCategorie[t.categorie] = 0;
      parCategorie[t.categorie] += Math.abs(t.montant);
    });
    return Object.entries(parCategorie).map(([name, value]) => ({ name, value }));
  }, [transactions]);
  
  const getPatrimoineNet = useCallback(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const initial = comptes.reduce((sum, c) => sum + c.soldeInitial, 0);
    let patrimoine = initial;
    const result = [{ date: 'Initial', patrimoine: initial }];
    sorted.forEach(t => {
      patrimoine += t.montant;
      result.push({ date: t.date, patrimoine });
    });
    return result;
  }, [transactions, comptes]);
  
  const getRevenusDepensesMois = useCallback(() => {
    const mois = {};
    transactions.forEach(t => {
      const moisKey = t.date.slice(0, 7);
      if (!mois[moisKey]) mois[moisKey] = { mois: moisKey, revenus: 0, depenses: 0 };
      if (t.montant > 0) mois[moisKey].revenus += t.montant;
      else mois[moisKey].depenses += Math.abs(t.montant);
    });
    return Object.values(mois).sort((a, b) => a.mois.localeCompare(b.mois));
  }, [transactions]);
  
  const getComparaisonAnnuelle = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const currentYearTrans = transactions.filter(t => new Date(t.date).getFullYear() === currentYear);
    const lastYearTrans = transactions.filter(t => new Date(t.date).getFullYear() === lastYear);
    return {
      currentYear: {
        revenus: currentYearTrans.filter(t => t.montant > 0).reduce((sum, t) => sum + t.montant, 0),
        depenses: Math.abs(currentYearTrans.filter(t => t.montant < 0).reduce((sum, t) => sum + t.montant, 0))
      },
      lastYear: {
        revenus: lastYearTrans.filter(t => t.montant > 0).reduce((sum, t) => sum + t.montant, 0),
        depenses: Math.abs(lastYearTrans.filter(t => t.montant < 0).reduce((sum, t) => sum + t.montant, 0))
      }
    };
  }, [transactions]);
  
  const getBudgetAlerts = useCallback(() => {
    return budgets.map(budget => {
      const depenses = transactions
        .filter(t => t.montant < 0 && t.categorie === budget.categorie && t.date.startsWith(budget.mois))
        .reduce((sum, t) => sum + Math.abs(t.montant), 0);
      const pourcentage = (depenses / budget.montantMax) * 100;
      return { ...budget, depenses, pourcentage, alerte: pourcentage >= 80 };
    });
  }, [budgets, transactions]);
  
  const importerTransactionsCSV = useCallback((newTransactions) => {
    const existingKeys = new Set(transactions.map(t => `${t.date}-${t.libelle}-${t.montant}`));
    const uniqueTransactions = newTransactions.filter(t => !existingKeys.has(`${t.date}-${t.libelle}-${t.montant}`));
    setTransactions(prev => [...uniqueTransactions.map((t, i) => ({ ...t, id: Date.now() + i })), ...prev]);
    setShowImportCSV(false);
    showToast(`${uniqueTransactions.length} transactions importées`, 'success');
  }, [transactions, showToast]);
  
  const saveDashboardConfig = useCallback((cfg) => {
    setDashboardConfig(cfg);
    setShowConfigDashboard(false);
    showToast('Configuration enregistrée', 'success');
  }, [showToast]);
  
  const ajouterCompte = useCallback((data) => {
    if (!data.nom) return showToast('Nom requis', 'error');
    setComptes(prev => [...prev, { id: Date.now(), ...data }]);
    setShowAddCompte(false);
    showToast('Compte créé', 'success');
  }, [showToast]);
  
  const ajouterTransaction = useCallback((data) => {
    if (!data.libelle) return showToast('Libellé requis', 'error');
    const nouvelle = {
      id: Date.now(),
      ...data,
      montant: data.type === 'DÉPENSES' ? -Math.abs(data.montant) : Math.abs(data.montant)
    };
    setTransactions(prev => [nouvelle, ...prev]);
    setShowAddTransaction(false);
    showToast('Transaction ajoutée', 'success');
  }, [showToast]);
  
  const ajouterObjectif = useCallback((data) => {
    if (!data.nom) return showToast('Nom requis', 'error');
    setObjectifs(prev => [...prev, { id: Date.now(), ...data }]);
    setShowAddObjectif(false);
    showToast('Objectif créé', 'success');
  }, [showToast]);
  
  const ajouterBudget = useCallback((data) => {
    if (!data.categorie) return showToast('Catégorie requise', 'error');
    setBudgets(prev => [...prev, { id: Date.now(), ...data }]);
    setShowAddBudget(false);
    showToast('Budget créé', 'success');
  }, [showToast]);
  
  const ajouterCategorie = useCallback((data) => {
    if (!data.nom) return showToast('Nom requis', 'error');
    setCategories(prev => ({
      ...prev,
      [categorieType]: [...prev[categorieType], { id: Date.now(), ...data }]
    }));
    setShowAddCategorie(false);
    showToast('Catégorie créée', 'success');
  }, [categorieType, showToast]);
  
  const modifierCategorie = useCallback((data) => {
    if (!data.nom || !categorieToEdit) return showToast('Données invalides', 'error');
    setCategories(prev => ({
      ...prev,
      [categorieType]: prev[categorieType].map(c => c.id === categorieToEdit.id ? { ...c, ...data } : c)
    }));
    setShowEditCategorie(false);
    setCategorieToEdit(null);
    showToast('Catégorie modifiée', 'success');
  }, [categorieType, categorieToEdit, showToast]);
  
  const supprimerCategorie = useCallback((type, id) => {
    setCategories(prev => ({
      ...prev,
      [type]: prev[type].filter(c => c.id !== id)
    }));
    showToast('Catégorie supprimée', 'success');
  }, [showToast]);
  
  const supprimerTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast('Transaction supprimée', 'success');
  }, [showToast]);
  
  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);
  
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900';
  const mutedClass = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];
  
  return (
    <div className={`flex h-screen ${bgClass}`}>
      {toast.show && (
        <div className={`fixed top-4 right-4 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-xl shadow-2xl z-50`}>
          {toast.message}
        </div>
      )}
      
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-orange-500 to-orange-600 text-white transition-all flex flex-col shadow-2xl`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Budget Pro</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-orange-700 rounded-xl">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 mt-8">
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard' },
            { id: 'transactions', icon: CreditCard, label: 'Transactions' },
            { id: 'objectifs', icon: Target, label: 'Objectifs' },
            { id: 'parametres', icon: Settings, label: 'Paramètres' },
            { id: 'profil', icon: User, label: 'Profil' }
          ].map(item => (
            <button key={item.id} onClick={() => setCurrentView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 rounded-xl mx-2 ${currentView === item.id ? 'bg-orange-700' : ''}`}>
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4">
          <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-center gap-2 p-2 hover:bg-orange-700 rounded-xl">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {currentView === 'dashboard' && (
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-3xl font-bold ${textClass}`}>Tableau de bord</h2>
            <div className="flex gap-2">
              <button onClick={() => setShowConfigDashboard(true)} className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Personnaliser
              </button>
              <select value={vueComparative} onChange={(e) => setVueComparative(e.target.value)} className={`px-4 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <option value="none">Sans comparaison</option>
                <option value="mensuelle">Vue mensuelle</option>
                <option value="annuelle">Vue annuelle</option>
              </select>
            </div>
          </div>
          
          {dashboardConfig.statsCards && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={mutedClass}>Patrimoine</span>
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold">{stats.soldeTotal.toFixed(2)} {config.devise}</div>
              </div>
              
              <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={mutedClass}>Revenus</span>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{stats.totalRevenus.toFixed(2)} {config.devise}</div>
              </div>
              
              <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={mutedClass}>Dépenses</span>
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-600">{stats.totalDepenses.toFixed(2)} {config.devise}</div>
              </div>
              
              <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={mutedClass}>Épargne</span>
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{(stats.totalRevenus - stats.totalDepenses).toFixed(2)} {config.devise}</div>
              </div>
            </div>
          )}
          
          {vueComparative !== 'none' && (
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg mb-6 border ${borderClass}`}>
              <h3 className="text-xl font-bold mb-4">
                {vueComparative === 'annuelle' ? 'Comparaison annuelle' : 'Comparaison mensuelle'}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                {vueComparative === 'annuelle' ? (
                  <BarChart data={[
                    { name: new Date().getFullYear() - 1, Revenus: getComparaisonAnnuelle().lastYear.revenus, Depenses: getComparaisonAnnuelle().lastYear.depenses },
                    { name: new Date().getFullYear(), Revenus: getComparaisonAnnuelle().currentYear.revenus, Depenses: getComparaisonAnnuelle().currentYear.depenses }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Revenus" fill="#10b981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="Depenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                ) : (
                  <BarChart data={getRevenusDepensesMois()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenus" fill="#10b981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="depenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {dashboardConfig.patrimoineChart && (
              <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
                <h3 className="text-xl font-bold mb-4">Évolution patrimoine</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={getPatrimoineNet()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="patrimoine" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {dashboardConfig.depensesChart && (
              <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
                <h3 className="text-xl font-bold mb-4">Dépenses par catégorie</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie data={getDepensesParCategorie()} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                      {getDepensesParCategorie().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {dashboardConfig.budgetsSection && (
              <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Budgets</h3>
                  <button onClick={() => setShowAddBudget(true)} className="text-orange-600">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {getBudgetAlerts().map(budget => (
                    <div key={budget.id} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${borderClass}`}>
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">{budget.categorie}</span>
                        {budget.alerte && <AlertCircle className="w-5 h-5 text-orange-500" />}
                      </div>
                      <div className={`w-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-3`}>
                        <div className={`h-3 rounded-full ${budget.alerte ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${Math.min(budget.pourcentage, 100)}%` }}></div>
                      </div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span>{budget.depenses.toFixed(2)} / {budget.montantMax} {config.devise}</span>
                        <span className={budget.alerte ? 'text-orange-500' : 'text-green-500'}>{budget.pourcentage.toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dashboardConfig.comptesSection && (
              <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
                <h3 className="text-xl font-bold mb-4">Comptes</h3>
                <div className="space-y-3">
                  {comptesAvecSoldes.map(compte => {
                    const typeCompte = typesComptes.find(t => t.value === compte.type);
                    return (
                      <div key={compte.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${borderClass}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{typeCompte?.icon || '💳'}</span>
                          <span className="font-medium">{compte.nom}</span>
                        </div>
                        <span className="font-bold text-lg">{compte.soldeActuel.toFixed(2)} {config.devise}</span>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setShowAddCompte(true)} className="mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
              </div>
            )}
            
            {dashboardConfig.objectifsSection && (
              <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Objectifs</h3>
                  <button onClick={() => setShowAddObjectif(true)} className="text-blue-600">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {objectifs.map(obj => {
                    const progress = (obj.montantActuel / obj.montantCible) * 100;
                    return (
                      <div key={obj.id} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${borderClass}`}>
                        <div className="font-semibold mb-2">{obj.nom}</div>
                        <div className={`w-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-3`}>
                          <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                          <span>{obj.montantActuel.toFixed(2)} {config.devise}</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {currentView === 'transactions' && (
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-3xl font-bold ${textClass}`}>Transactions</h2>
            <button onClick={() => setShowAddTransaction(true)} className="bg-orange-500 text-white px-4 py-2 rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Nouvelle
            </button>
          </div>
          
          <div className={`${cardClass} p-4 rounded-2xl shadow-lg mb-6 border ${borderClass}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher..." className={`w-full pl-10 px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
              </div>
              <select value={filtreType} onChange={(e) => setFiltreType(e.target.value)} className={`px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <option value="TOUS">Tous types</option>
                <option value="REVENUS">Revenus</option>
                <option value="DÉPENSES">Dépenses</option>
              </select>
              <select value={filtreCategorie} onChange={(e) => setFiltreCategorie(e.target.value)} className={`px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <option value="">Toutes catégories</option>
                {[...categories.depenses, ...categories.revenus].map(c => (
                  <option key={c.id + c.nom} value={c.nom}>{c.nom}</option>
                ))}
              </select>
              <select value={filtreCompte} onChange={(e) => setFiltreCompte(e.target.value)} className={`px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <option value="">Tous comptes</option>
                {comptes.map(c => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className={`${cardClass} rounded-2xl shadow-lg overflow-hidden border ${borderClass}`}>
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${mutedClass} uppercase`}>Date</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${mutedClass} uppercase`}>Libellé</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${mutedClass} uppercase`}>Catégorie</th>
                  <th className={`px-6 py-3 text-right text-xs font-medium ${mutedClass} uppercase`}>Montant</th>
                  <th className={`px-6 py-3 text-right text-xs font-medium ${mutedClass} uppercase`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${borderClass}`}>
                {getTransactionsFiltrees().map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm">{t.date}</td>
                    <td className="px-6 py-4 text-sm">{t.libelle}</td>
                    <td className="px-6 py-4 text-sm">{t.categorie}</td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${t.montant > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {t.montant > 0 ? '+' : ''}{t.montant.toFixed(2)} {config.devise}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
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
      )}

      {currentView === 'objectifs' && (
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-3xl font-bold ${textClass}`}>Objectifs</h2>
            <button onClick={() => setShowAddObjectif(true)} className="bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Nouvel objectif
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectifs.map(obj => {
              const progress = (obj.montantActuel / obj.montantCible) * 100;
              return (
                <div key={obj.id} className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
                  <h3 className="text-lg font-bold mb-2">{obj.nom}</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>{obj.montantActuel.toFixed(2)} {config.devise}</span>
                      <span>{obj.montantCible.toFixed(2)} {config.devise}</span>
                    </div>
                    <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3`}>
                      <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                    <div className="text-center text-sm font-semibold mt-2">{progress.toFixed(0)}%</div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {obj.dateObjectif}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {currentView === 'parametres' && (
        <div className="flex-1 p-8 overflow-auto">
          <h2 className={`text-3xl font-bold mb-6 ${textClass}`}>Paramètres</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
              <h3 className="text-xl font-bold mb-4">Import / Export</h3>
              <button onClick={() => setShowImportCSV(true)} className="w-full bg-green-500 text-white px-4 py-3 rounded-xl hover:bg-green-600 flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" /> Importer CSV
              </button>
            </div>
            
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
              <h3 className="text-xl font-bold mb-4">Catégories</h3>
              {['depenses', 'revenus'].map(type => (
                <div key={type} className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold capitalize">{type}</h4>
                    <button onClick={() => { setCategorieType(type); setShowAddCategorie(true); }} className="text-orange-600">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {categories[type].map(cat => (
                      <div key={cat.id} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${borderClass}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{cat.icon}</span>
                          <span>{cat.nom}</span>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setCategorieToEdit(cat); setCategorieType(type); setShowEditCategorie(true); }} className="text-blue-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => supprimerCategorie(type, cat.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentView === 'profil' && (
        <div className="flex-1 p-8 overflow-auto">
          <h2 className={`text-3xl font-bold mb-6 ${textClass}`}>Profil</h2>
          
          <div className={`${cardClass} p-6 rounded-2xl shadow-lg max-w-2xl border ${borderClass}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {profil.nom.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{profil.nom}</h3>
                <p className={mutedClass}>{profil.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <input type="text" value={profil.nom} onChange={(e) => setProfil({...profil, nom: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
              <input type="email" value={profil.email} onChange={(e) => setProfil({...profil, email: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} />
              <button onClick={() => showToast('Profil mis à jour')} className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <ModalImportCSV show={showImportCSV} onClose={() => setShowImportCSV(false)} onImport={importerTransactionsCSV} darkMode={darkMode} comptes={comptes} />
      <ModalConfigDashboard show={showConfigDashboard} onClose={() => setShowConfigDashboard(false)} onSave={saveDashboardConfig} darkMode={darkMode} currentConfig={dashboardConfig} />
      <ModalCompte show={showAddCompte} onClose={() => setShowAddCompte(false)} onCreate={ajouterCompte} darkMode={darkMode} typesComptes={typesComptes} devise={config.devise} />
      <ModalTransaction show={showAddTransaction} onClose={() => setShowAddTransaction(false)} onCreate={ajouterTransaction} darkMode={darkMode} comptes={comptes} categories={categories} devise={config.devise} />
      <ModalObjectif show={showAddObjectif} onClose={() => setShowAddObjectif(false)} onCreate={ajouterObjectif} darkMode={darkMode} devise={config.devise} />
      <ModalBudget show={showAddBudget} onClose={() => setShowAddBudget(false)} onCreate={ajouterBudget} darkMode={darkMode} categories={categories} devise={config.devise} />
      
      {showAddCategorie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cardClass} rounded-2xl p-6 w-full max-w-md shadow-2xl border ${borderClass}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Nouvelle catégorie</h3>
              <button onClick={() => setShowAddCategorie(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Nom" className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} id="newCatNom" />
              <input type="text" placeholder="Emoji" className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} id="newCatIcon" />
              <input type="color" className={`w-full h-12 border ${borderClass} rounded-xl`} id="newCatColor" defaultValue="#3b82f6" />
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => {
                const nom = document.getElementById('newCatNom').value;
                const icon = document.getElementById('newCatIcon').value;
                const color = document.getElementById('newCatColor').value;
                ajouterCategorie({ nom, icon: icon || '📦', color });
              }} className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-xl">Créer</button>
              <button onClick={() => setShowAddCategorie(false)} className="flex-1 bg-gray-300 px-4 py-3 rounded-xl">Annuler</button>
            </div>
          </div>
        </div>
      )}
      
      <ModalEditCategorie show={showEditCategorie} onClose={() => { setShowEditCategorie(false); setCategorieToEdit(null); }} onUpdate={modifierCategorie} darkMode={darkMode} categorie={categorieToEdit} />
    </div>
  );
};

export default BudgetApp;
