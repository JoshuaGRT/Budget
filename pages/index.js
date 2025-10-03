import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Menu, Home, CreditCard, Target, Settings, User, Plus, TrendingUp, TrendingDown, Wallet, Calendar, Trash2, Download, Upload, Search, Sun, Moon, BarChart3, AlertCircle, CheckCircle, X } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Modal composants séparés pour éviter les re-renders
const ModalCompte = memo(({ show, onClose, onCreate, darkMode, typesComptes, devise }) => {
  const [data, setData] = useState({ nom: '', type: 'courant', soldeInitial: '', couleur: '#3b82f6' });
  
  useEffect(() => {
    if (!show) {
      setData({ nom: '', type: 'courant', soldeInitial: '', couleur: '#3b82f6' });
    }
  }, [show]);
  
  if (!show) return null;
  
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
  const handleSubmit = () => {
    onCreate({ ...data, soldeInitial: parseFloat(data.soldeInitial) || 0 });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className={`${cardClass} rounded-2xl p-6 w-full max-w-md shadow-2xl border ${borderClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Nouveau compte</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom du compte</label>
            <input 
              type="text" 
              value={data.nom} 
              onChange={(e) => setData({ ...data, nom: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`} 
              placeholder="Ex: Compte épargne" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select 
              value={data.type} 
              onChange={(e) => setData({ ...data, type: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`}
            >
              {typesComptes.map(type => (<option key={type.value} value={type.value}>{type.icon} {type.label}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Solde initial ({devise})</label>
            <input 
              type="number" 
              step="0.01" 
              value={data.soldeInitial} 
              onChange={(e) => setData({ ...data, soldeInitial: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`} 
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Couleur</label>
            <input 
              type="color" 
              value={data.couleur} 
              onChange={(e) => setData({ ...data, couleur: e.target.value })} 
              className={`w-full h-12 px-2 py-1 border ${borderClass} rounded-xl cursor-pointer`} 
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button type="button" onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg transition-all">Créer</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-400 transition-all">Annuler</button>
        </div>
      </div>
    </div>
  );
});

const ModalTransaction = memo(({ show, onClose, onCreate, darkMode, comptes, categories, devise }) => {
  const [data, setData] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    libelle: '', 
    montant: '', 
    type: 'DÉPENSES', 
    categorie: '', 
    compteId: comptes[0]?.id || 1, 
    tags: [] 
  });
  
  useEffect(() => {
    if (!show) {
      setData({ 
        date: new Date().toISOString().split('T')[0], 
        libelle: '', 
        montant: '', 
        type: 'DÉPENSES', 
        categorie: '', 
        compteId: comptes[0]?.id || 1, 
        tags: [] 
      });
    }
  }, [show, comptes]);
  
  if (!show) return null;
  
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
  const handleSubmit = () => {
    onCreate({ ...data, montant: parseFloat(data.montant) || 0 });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className={`${cardClass} rounded-2xl p-6 w-full max-w-md shadow-2xl border ${borderClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Nouvelle transaction</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input 
              type="date" 
              value={data.date} 
              onChange={(e) => setData({ ...data, date: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Libellé</label>
            <input 
              type="text" 
              value={data.libelle} 
              onChange={(e) => setData({ ...data, libelle: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`} 
              placeholder="Ex: Courses" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Montant ({devise})</label>
            <input 
              type="number" 
              step="0.01" 
              value={data.montant} 
              onChange={(e) => setData({ ...data, montant: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`} 
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select 
              value={data.type} 
              onChange={(e) => setData({ ...data, type: e.target.value, categorie: '' })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`}
            >
              <option value="DÉPENSES">Dépenses</option>
              <option value="REVENUS">Revenus</option>
              <option value="PLACEMENTS">Placements</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <select 
              value={data.categorie} 
              onChange={(e) => setData({ ...data, categorie: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`}
            >
              <option value="">Sélectionner...</option>
              {data.type === 'DÉPENSES' && categories.depenses.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
              {data.type === 'REVENUS' && categories.revenus.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
              {data.type === 'PLACEMENTS' && categories.placements.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Compte</label>
            <select 
              value={data.compteId} 
              onChange={(e) => setData({ ...data, compteId: parseInt(e.target.value) })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`}
            >
              {comptes.map(c => (<option key={c.id} value={c.id}>{c.nom}</option>))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button type="button" onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg transition-all">Créer</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-400 transition-all">Annuler</button>
        </div>
      </div>
    </div>
  );
});

const ModalObjectif = memo(({ show, onClose, onCreate, darkMode, devise }) => {
  const [data, setData] = useState({ nom: '', montantCible: '', montantActuel: '', dateObjectif: '', categorie: '' });
  
  useEffect(() => {
    if (!show) {
      setData({ nom: '', montantCible: '', montantActuel: '', dateObjectif: '', categorie: '' });
    }
  }, [show]);
  
  if (!show) return null;
  
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
  const handleSubmit = () => {
    onCreate({
      ...data,
      montantCible: parseFloat(data.montantCible) || 0,
      montantActuel: parseFloat(data.montantActuel) || 0
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className={`${cardClass} rounded-2xl p-6 w-full max-w-md shadow-2xl border ${borderClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Nouvel objectif d'épargne</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom de l'objectif</label>
            <input 
              type="text" 
              value={data.nom} 
              onChange={(e) => setData({ ...data, nom: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`} 
              placeholder="Ex: Voyage en Italie" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Montant cible ({devise})</label>
            <input 
              type="number" 
              value={data.montantCible} 
              onChange={(e) => setData({ ...data, montantCible: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`} 
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Montant actuel ({devise})</label>
            <input 
              type="number" 
              value={data.montantActuel} 
              onChange={(e) => setData({ ...data, montantActuel: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`} 
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date objectif</label>
            <input 
              type="date" 
              value={data.dateObjectif} 
              onChange={(e) => setData({ ...data, dateObjectif: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <input 
              type="text" 
              value={data.categorie} 
              onChange={(e) => setData({ ...data, categorie: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-blue-500 outline-none`} 
              placeholder="Ex: Vacances" 
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button type="button" onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all">Créer</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-400 transition-all">Annuler</button>
        </div>
      </div>
    </div>
  );
});

const ModalBudget = memo(({ show, onClose, onCreate, darkMode, categories, devise }) => {
  const [data, setData] = useState({ categorie: '', montantMax: '', mois: new Date().toISOString().slice(0, 7) });
  
  useEffect(() => {
    if (!show) {
      setData({ categorie: '', montantMax: '', mois: new Date().toISOString().slice(0, 7) });
    }
  }, [show]);
  
  if (!show) return null;
  
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
  const handleSubmit = () => {
    onCreate({ ...data, montantMax: parseFloat(data.montantMax) || 0 });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className={`${cardClass} rounded-2xl p-6 w-full max-w-md shadow-2xl border ${borderClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Nouveau budget</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <select 
              value={data.categorie} 
              onChange={(e) => setData({ ...data, categorie: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`}
            >
              <option value="">Sélectionner...</option>
              {categories.depenses.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Montant maximum ({devise})</label>
            <input 
              type="number" 
              value={data.montantMax} 
              onChange={(e) => setData({ ...data, montantMax: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`} 
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mois</label>
            <input 
              type="month" 
              value={data.mois} 
              onChange={(e) => setData({ ...data, mois: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`} 
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button type="button" onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg transition-all">Créer</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-400 transition-all">Annuler</button>
        </div>
      </div>
    </div>
  );
});

const ModalRecurrente = memo(({ show, onClose, onCreate, darkMode, categories, devise }) => {
  const [data, setData] = useState({ libelle: '', montant: '', type: 'DÉPENSES', categorie: '', jour: 1 });
  
  useEffect(() => {
    if (!show) {
      setData({ libelle: '', montant: '', type: 'DÉPENSES', categorie: '', jour: 1 });
    }
  }, [show]);
  
  if (!show) return null;
  
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
  const handleSubmit = () => {
    onCreate({ ...data, montant: parseFloat(data.montant) || 0 });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className={`${cardClass} rounded-2xl p-6 w-full max-w-md shadow-2xl border ${borderClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Nouvelle transaction récurrente</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Libellé</label>
            <input 
              type="text" 
              value={data.libelle} 
              onChange={(e) => setData({ ...data, libelle: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-purple-500 outline-none`} 
              placeholder="Ex: Abonnement" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Montant ({devise})</label>
            <input 
              type="number" 
              step="0.01" 
              value={data.montant} 
              onChange={(e) => setData({ ...data, montant: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-purple-500 outline-none`} 
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select 
              value={data.type} 
              onChange={(e) => setData({ ...data, type: e.target.value, categorie: '' })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-purple-500 outline-none`}
            >
              <option value="DÉPENSES">Dépenses</option>
              <option value="REVENUS">Revenus</option>
              <option value="PLACEMENTS">Placements</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <select 
              value={data.categorie} 
              onChange={(e) => setData({ ...data, categorie: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-purple-500 outline-none`}
            >
              <option value="">Sélectionner...</option>
              {data.type === 'DÉPENSES' && categories.depenses.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
              {data.type === 'REVENUS' && categories.revenus.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
              {data.type === 'PLACEMENTS' && categories.placements.map(cat => (<option key={cat.id} value={cat.nom}>{cat.nom}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Jour du mois (1-31)</label>
            <input 
              type="number" 
              min="1" 
              max="31" 
              value={data.jour} 
              onChange={(e) => setData({ ...data, jour: parseInt(e.target.value) || 1 })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-purple-500 outline-none`} 
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button type="button" onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 shadow-lg transition-all">Créer</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-400 transition-all">Annuler</button>
        </div>
      </div>
    </div>
  );
});

// Composants de vue séparés et mémorisés
const TransactionsSearchBar = memo(({ searchTerm, onSearchChange, filtreType, onTypeChange, filtreCategorie, onCategorieChange, filtreCompte, onCompteChange, categories, comptes, darkMode }) => {
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
  return (
    <div className={`${cardClass} p-4 rounded-2xl shadow-lg mb-6 border ${borderClass}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => onSearchChange(e.target.value)} 
            placeholder="Rechercher..." 
            className={`w-full pl-10 px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`} 
          />
        </div>
        <select value={filtreType} onChange={(e) => onTypeChange(e.target.value)} className={`px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`}>
          <option value="TOUS">Tous les types</option>
          <option value="REVENUS">Revenus</option>
          <option value="DÉPENSES">Dépenses</option>
          <option value="PLACEMENTS">Placements</option>
        </select>
        <select value={filtreCategorie} onChange={(e) => onCategorieChange(e.target.value)} className={`px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`}>
          <option value="">Toutes les catégories</option>
          {[...categories.depenses, ...categories.revenus, ...categories.placements].map(cat => (
            <option key={cat.id + cat.nom} value={cat.nom}>{cat.nom}</option>
          ))}
        </select>
        <select value={filtreCompte} onChange={(e) => onCompteChange(e.target.value)} className={`px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`}>
          <option value="">Tous les comptes</option>
          {comptes.map(c => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
      </div>
    </div>
  );
});

const ProfilForm = memo(({ profil, onProfilChange, onSave, darkMode }) => {
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nom</label>
        <input 
          type="text" 
          value={profil.nom} 
          onChange={(e) => onProfilChange({ ...profil, nom: e.target.value })} 
          className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`} 
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input 
          type="email" 
          value={profil.email} 
          onChange={(e) => onProfilChange({ ...profil, email: e.target.value })} 
          className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`} 
        />
      </div>
      <button onClick={onSave} className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg transition-all">
        Enregistrer les modifications
      </button>
    </div>
  );
});

const BudgetApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [config, setConfig] = useState({
    devise: '€',
    langue: 'fr'
  });
  
  const [profil, setProfil] = useState({
    nom: 'Jean Dupont',
    email: 'jean.dupont@example.com'
  });
  
  const [comptes, setComptes] = useState([
    { id: 1, nom: 'Compte courant', type: 'courant', soldeInitial: 2500, couleur: '#3b82f6' },
    { id: 2, nom: 'Compte épargne', type: 'epargne', soldeInitial: 5000, couleur: '#10b981' }
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
  
  const categories = useMemo(() => ({
    depenses: [
      { id: 1, nom: 'Alimentation', icon: '🍕', color: '#ef4444' },
      { id: 2, nom: 'Logement', icon: '🏠', color: '#f59e0b' },
      { id: 3, nom: 'Transport', icon: '🚗', color: '#3b82f6' },
      { id: 4, nom: 'Santé', icon: '💊', color: '#ec4899' },
      { id: 5, nom: 'Loisirs', icon: '🎮', color: '#8b5cf6' },
      { id: 6, nom: 'Shopping', icon: '🛍️', color: '#06b6d4' },
      { id: 7, nom: 'Autre', icon: '📦', color: '#64748b' }
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
  }), []);
  
  const typesComptes = useMemo(() => [
    { value: 'courant', label: 'Compte courant', icon: '💳' },
    { value: 'epargne', label: 'Compte épargne', icon: '🏦' },
    { value: 'investissement', label: 'Investissement', icon: '📈' }
  ], []);
  
  const [showAddCompte, setShowAddCompte] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddObjectif, setShowAddObjectif] = useState(false);
  const [showAddRecurrente, setShowAddRecurrente] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  const [filtreType, setFiltreType] = useState('TOUS');
  const [filtreCategorie, setFiltreCategorie] = useState('');
  const [filtreCompte, setFiltreCompte] = useState('');
  
  const comptesAvecSoldes = useMemo(() => {
    return comptes.map(compte => {
      const transactionsCompte = transactions.filter(t => t.compteId === compte.id);
      const soldeActuel = compte.soldeInitial + transactionsCompte.reduce((sum, t) => sum + t.montant, 0);
      return { ...compte, soldeActuel };
    });
  }, [comptes, transactions]);
  
  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }, []);
  
  const ajouterCompte = useCallback((data) => {
    if (!data.nom) return showToast('Veuillez entrer un nom', 'error');
    const nouveauCompte = { id: Date.now(), ...data };
    setComptes(prev => [...prev, nouveauCompte]);
    setShowAddCompte(false);
    showToast('Compte créé avec succès', 'success');
  }, [showToast]);
  
  const ajouterTransaction = useCallback((data) => {
    if (!data.libelle || !data.categorie) {
      return showToast('Veuillez remplir tous les champs', 'error');
    }
    const nouvelleTransaction = {
      id: Date.now(),
      ...data,
      montant: data.type === 'DÉPENSES' ? -Math.abs(data.montant) : Math.abs(data.montant)
    };
    setTransactions(prev => [nouvelleTransaction, ...prev]);
    setShowAddTransaction(false);
    showToast('Transaction ajoutée', 'success');
  }, [showToast]);
  
  const ajouterObjectif = useCallback((data) => {
    if (!data.nom || data.montantCible <= 0) {
      return showToast('Veuillez remplir tous les champs', 'error');
    }
    const nouvelObjectif = { id: Date.now(), ...data };
    setObjectifs(prev => [...prev, nouvelObjectif]);
    setShowAddObjectif(false);
    showToast('Objectif créé', 'success');
  }, [showToast]);
  
  const ajouterBudget = useCallback((data) => {
    if (!data.categorie || data.montantMax <= 0) {
      return showToast('Veuillez remplir tous les champs', 'error');
    }
    const nouveauBudget = { id: Date.now(), ...data };
    setBudgets(prev => [...prev, nouveauBudget]);
    setShowAddBudget(false);
    showToast('Budget créé', 'success');
  }, [showToast]);
  
  const ajouterTransactionRecurrente = useCallback((data) => {
    if (!data.libelle || !data.categorie) {
      return showToast('Veuillez remplir tous les champs', 'error');
    }
    const nouvelleRecurrente = { id: Date.now(), ...data, actif: true };
    setTransactionsRecurrentes(prev => [...prev, nouvelleRecurrente]);
    setShowAddRecurrente(false);
    showToast('Transaction récurrente créée', 'success');
  }, [showToast]);
  
  const supprimerTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast('Transaction supprimée', 'success');
  }, [showToast]);
  
  const supprimerObjectif = useCallback((id) => {
    setObjectifs(prev => prev.filter(o => o.id !== id));
    showToast('Objectif supprimé', 'success');
  }, [showToast]);
  
  const supprimerBudget = useCallback((id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    showToast('Budget supprimé', 'success');
  }, [showToast]);
  
  const exporterDonnees = useCallback(() => {
    const data = { comptes, transactions, objectifs, transactionsRecurrentes, budgets, tags, profil, config };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Données exportées', 'success');
  }, [comptes, transactions, objectifs, transactionsRecurrentes, budgets, tags, profil, config, showToast]);
  
  const importerDonnees = useCallback((e) => {
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
  }, [showToast]);
  
  const stats = useMemo(() => ({
    totalRevenus: transactions.filter(t => t.montant > 0).reduce((sum, t) => sum + t.montant, 0),
    totalDepenses: Math.abs(transactions.filter(t => t.montant < 0).reduce((sum, t) => sum + t.montant, 0)),
    soldeTotal: comptesAvecSoldes.reduce((sum, c) => sum + c.soldeActuel, 0),
    nbTransactions: transactions.length
  }), [transactions, comptesAvecSoldes]);
  
  const transactionsFiltrees = useMemo(() => {
    return transactions.filter(t => {
      if (filtreType !== 'TOUS' && t.type !== filtreType) return false;
      if (filtreCategorie && t.categorie !== filtreCategorie) return false;
      if (filtreCompte && t.compteId !== parseInt(filtreCompte)) return false;
      if (searchTerm && !t.libelle.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [transactions, filtreType, filtreCategorie, filtreCompte, searchTerm]);
  
  const getDepensesParCategorie = useCallback(() => {
    const depenses = transactions.filter(t => t.montant < 0);
    const parCategorie = {};
    depenses.forEach(t => {
      if (!parCategorie[t.categorie]) parCategorie[t.categorie] = 0;
      parCategorie[t.categorie] += Math.abs(t.montant);
    });
    return Object.entries(parCategorie).map(([name, value]) => ({ name, value }));
  }, [transactions]);
  
  const getEvolutionSolde = useCallback(() => {
    const sortedTrans = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let solde = comptes[0]?.soldeInitial || 0;
    return sortedTrans.map(t => {
      solde += t.montant;
      return { date: t.date, solde };
    });
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
  
  const getBudgetAlerts = useCallback(() => {
    return budgets.map(budget => {
      const depensesCat = transactions
        .filter(t => t.montant < 0 && t.categorie === budget.categorie && t.date.startsWith(budget.mois))
        .reduce((sum, t) => sum + Math.abs(t.montant), 0);
      const pourcentage = (depensesCat / budget.montantMax) * 100;
      return { ...budget, depenses: depensesCat, pourcentage, alerte: pourcentage >= 80 };
    });
  }, [budgets, transactions]);
  
  const getStatsAvancees = useCallback(() => {
    const depensesMoyennes = stats.totalDepenses / (transactions.filter(t => t.montant < 0).length || 1);
    const revenusMoyens = stats.totalRevenus / (transactions.filter(t => t.montant > 0).length || 1);
    const tauxEpargne = ((stats.totalRevenus - stats.totalDepenses) / stats.totalRevenus) * 100;
    return { depensesMoyennes, revenusMoyens, tauxEpargne };
  }, [stats, transactions]);
  
  const handleProfilChange = useCallback((newProfil) => {
    setProfil(newProfil);
  }, []);
  
  const handleProfilSave = useCallback(() => {
    showToast('Profil mis à jour', 'success');
  }, [showToast]);
  
  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];
  
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900';
  const mutedClass = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  
  return (
    <div className={`flex h-screen ${bgClass}`}>
      {toast.show && (
        <div className={`fixed top-4 right-4 ${toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white px-6 py-3 rounded-xl shadow-2xl z-50`}>
          {toast.message}
        </div>
      )}
      
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-orange-500 to-orange-600 text-white transition-all duration-300 flex flex-col shadow-2xl`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Budget App</h1>}
          <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-orange-700 rounded-xl transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 mt-8">
          <button type="button" onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 transition-colors rounded-xl mx-2 ${currentView === 'dashboard' ? 'bg-orange-700 shadow-lg' : ''}`}>
            <Home className="w-5 h-5" />
            {sidebarOpen && <span>Tableau de bord</span>}
          </button>
          <button type="button" onClick={() => setCurrentView('transactions')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 transition-colors rounded-xl mx-2 ${currentView === 'transactions' ? 'bg-orange-700 shadow-lg' : ''}`}>
            <CreditCard className="w-5 h-5" />
            {sidebarOpen && <span>Transactions</span>}
          </button>
          <button type="button" onClick={() => setCurrentView('objectifs')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 transition-colors rounded-xl mx-2 ${currentView === 'objectifs' ? 'bg-orange-700 shadow-lg' : ''}`}>
            <Target className="w-5 h-5" />
            {sidebarOpen && <span>Objectifs</span>}
          </button>
          <button type="button" onClick={() => setCurrentView('config')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 transition-colors rounded-xl mx-2 ${currentView === 'config' ? 'bg-orange-700 shadow-lg' : ''}`}>
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>Configuration</span>}
          </button>
          <button type="button" onClick={() => setCurrentView('profil')} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 transition-colors rounded-xl mx-2 ${currentView === 'profil' ? 'bg-orange-700 shadow-lg' : ''}`}>
            <User className="w-5 h-5" />
            {sidebarOpen && <span>Profil</span>}
          </button>
        </nav>

        <div className="p-4">
          <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-center gap-2 p-2 hover:bg-orange-700 rounded-xl transition-colors">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {sidebarOpen && <span>{darkMode ? 'Mode clair' : 'Mode sombre'}</span>}
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

      {currentView === 'dashboard' && (
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-3xl font-bold ${textClass}`}>Tableau de bord</h2>
            <button onClick={() => setShowStats(true)} className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-purple-700 flex items-center gap-2 shadow-lg transition-all">
              <BarChart3 className="w-4 h-4" /> Statistiques
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg transition-all hover:scale-105 hover:shadow-xl border ${borderClass}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={mutedClass}>Solde total</span>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-2xl font-bold">{stats.soldeTotal.toFixed(2)} {config.devise}</div>
            </div>
            
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg transition-all hover:scale-105 hover:shadow-xl border ${borderClass}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={mutedClass}>Revenus</span>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.totalRevenus.toFixed(2)} {config.devise}</div>
            </div>
            
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg transition-all hover:scale-105 hover:shadow-xl border ${borderClass}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={mutedClass}>Dépenses</span>
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.totalDepenses.toFixed(2)} {config.devise}</div>
            </div>
            
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg transition-all hover:scale-105 hover:shadow-xl border ${borderClass}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={mutedClass}>Transactions</span>
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="text-2xl font-bold">{stats.nbTransactions}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
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
            
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
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
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Budgets mensuels</h3>
                <button onClick={() => setShowAddBudget(true)} className="text-orange-600 hover:text-orange-700">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {getBudgetAlerts().map(budget => {
                  const catInfo = categories.depenses.find(c => c.nom === budget.categorie);
                  return (
                    <div key={budget.id} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-gray-50 to-gray-100'} backdrop-blur-sm transition-all hover:shadow-md border ${borderClass}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{catInfo?.icon}</span>
                          <span className="font-semibold">{budget.categorie}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {budget.alerte ? (
                            <AlertCircle className="w-5 h-5 text-orange-500" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          <button onClick={() => supprimerBudget(budget.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm ${mutedClass}`}>
                          {budget.depenses.toFixed(2)} / {budget.montantMax} {config.devise}
                        </span>
                        <span className={`text-sm font-bold ${budget.alerte ? 'text-orange-500' : 'text-green-500'}`}>
                          {budget.pourcentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className={`w-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-3 overflow-hidden`}>
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${budget.alerte ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gradient-to-r from-green-400 to-green-500'}`} 
                          style={{ width: `${Math.min(budget.pourcentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                {getBudgetAlerts().length === 0 && (
                  <div className="text-center py-8">
                    <p className={mutedClass}>Aucun budget défini</p>
                    <button onClick={() => setShowAddBudget(true)} className="mt-2 text-orange-600 hover:text-orange-700 text-sm">
                      Créer votre premier budget
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
              <h3 className="text-xl font-bold mb-4">Comptes</h3>
              <div className="space-y-3">
                {comptesAvecSoldes.map(compte => (
                  <div key={compte.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-gray-50 to-gray-100'} border ${borderClass} hover:shadow-md transition-all`}>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: compte.couleur }}></div>
                      <span className="font-medium">{compte.nom}</span>
                    </div>
                    <span className="font-bold text-lg">{compte.soldeActuel.toFixed(2)} {config.devise}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowAddCompte(true)} className="mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 flex items-center justify-center gap-2 shadow-lg transition-all">
                <Plus className="w-4 h-4" /> Ajouter un compte
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === 'transactions' && (
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-3xl font-bold ${textClass}`}>Transactions</h2>
            <button onClick={() => setShowAddTransaction(true)} className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 flex items-center gap-2 shadow-lg transition-all">
              <Plus className="w-4 h-4" /> Nouvelle transaction
            </button>
          </div>
          
          <TransactionsSearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filtreType={filtreType}
            onTypeChange={setFiltreType}
            filtreCategorie={filtreCategorie}
            onCategorieChange={setFiltreCategorie}
            filtreCompte={filtreCompte}
            onCompteChange={setFiltreCompte}
            categories={categories}
            comptes={comptes}
            darkMode={darkMode}
          />
          
          <div className={`${cardClass} rounded-2xl shadow-lg overflow-hidden border ${borderClass}`}>
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
                    <td className="px-6 py-4 text-sm">{comptesAvecSoldes.find(c => c.id === t.compteId)?.nom}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${t.montant > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {t.montant > 0 ? '+' : ''}{t.montant.toFixed(2)} {config.devise}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <button onClick={() => supprimerTransaction(t.id)} className="text-red-600 hover:text-red-800 transition-colors">
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
            <h2 className={`text-3xl font-bold ${textClass}`}>Objectifs d'épargne</h2>
            <button onClick={() => setShowAddObjectif(true)} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center gap-2 shadow-lg transition-all">
              <Plus className="w-4 h-4" /> Nouvel objectif
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectifs.map(obj => {
              const progression = (obj.montantActuel / obj.montantCible) * 100;
              return (
                <div key={obj.id} className={`${cardClass} p-6 rounded-2xl shadow-lg transition-all hover:scale-105 border ${borderClass}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{obj.nom}</h3>
                      <p className={`text-sm ${mutedClass}`}>{obj.categorie}</p>
                    </div>
                    <button onClick={() => supprimerObjectif(obj.id)} className="text-red-600 hover:text-red-800 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold">{obj.montantActuel.toFixed(2)} {config.devise}</span>
                      <span className={mutedClass}>{obj.montantCible.toFixed(2)} {config.devise}</span>
                    </div>
                    <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 overflow-hidden`}>
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${Math.min(progression, 100)}%` }}></div>
                    </div>
                    <div className={`text-center text-sm font-semibold ${mutedClass} mt-2`}>{progression.toFixed(0)}% atteint</div>
                  </div>
                  
                  <div className={`flex items-center text-sm ${mutedClass}`}>
                    <Calendar className="w-4 h-4 mr-1" />
                    {obj.dateObjectif || 'Non définie'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {currentView === 'config' && (
        <div className="flex-1 p-8 overflow-auto">
          <h2 className={`text-3xl font-bold mb-6 ${textClass}`}>Configuration</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
              <h3 className="text-xl font-bold mb-4">Import / Export</h3>
              <div className="space-y-3">
                <button onClick={exporterDonnees} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2 shadow-lg transition-all">
                  <Download className="w-4 h-4" /> Exporter les données
                </button>
                <label className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-green-700 flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all">
                  <Upload className="w-4 h-4" /> Importer les données
                  <input type="file" accept=".json" onChange={importerDonnees} className="hidden" />
                </label>
              </div>
            </div>
            
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
              <h3 className="text-xl font-bold mb-4">Transactions récurrentes</h3>
              <div className="space-y-2 mb-4">
                {transactionsRecurrentes.map(tr => (
                  <div key={tr.id} className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl border ${borderClass}`}>
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
              <button onClick={() => setShowAddRecurrente(true)} className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 flex items-center justify-center gap-2 shadow-lg transition-all">
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            </div>
            
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
              <h3 className="text-xl font-bold mb-4">Paramètres généraux</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Devise</label>
                  <select value={config.devise} onChange={(e) => setConfig({...config, devise: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`}>
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
      )}

      {currentView === 'profil' && (
        <div className="flex-1 p-8 overflow-auto">
          <h2 className={`text-3xl font-bold mb-6 ${textClass}`}>Mon profil</h2>
          
          <div className={`${cardClass} p-6 rounded-2xl shadow-lg max-w-2xl border ${borderClass}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {profil.nom.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{profil.nom}</h3>
                <p className={mutedClass}>{profil.email}</p>
              </div>
            </div>
            
            <ProfilForm 
              profil={profil}
              onProfilChange={handleProfilChange}
              onSave={handleProfilSave}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}

      <ModalCompte 
        show={showAddCompte} 
        onClose={() => setShowAddCompte(false)} 
        onCreate={ajouterCompte}
        darkMode={darkMode}
        typesComptes={typesComptes}
        devise={config.devise}
      />

      <ModalTransaction 
        show={showAddTransaction} 
        onClose={() => setShowAddTransaction(false)} 
        onCreate={ajouterTransaction}
        darkMode={darkMode}
        comptes={comptes}
        categories={categories}
        devise={config.devise}
      />

      <ModalObjectif 
        show={showAddObjectif} 
        onClose={() => setShowAddObjectif(false)} 
        onCreate={ajouterObjectif}
        darkMode={darkMode}
        devise={config.devise}
      />

      <ModalBudget 
        show={showAddBudget} 
        onClose={() => setShowAddBudget(false)} 
        onCreate={ajouterBudget}
        darkMode={darkMode}
        categories={categories}
        devise={config.devise}
      />

      <ModalRecurrente 
        show={showAddRecurrente} 
        onClose={() => setShowAddRecurrente(false)} 
        onCreate={ajouterTransactionRecurrente}
        darkMode={darkMode}
        categories={categories}
        devise={config.devise}
      />

      {showStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8 backdrop-blur-sm overflow-auto">
          <div className={`${cardClass} rounded-2xl p-6 w-full max-w-4xl max-h-full overflow-auto shadow-2xl border ${borderClass}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Statistiques avancées</h3>
              <button onClick={() => setShowStats(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-blue-100'} border ${borderClass}`}>
                <div className={`text-sm ${mutedClass} mb-1`}>Dépense moyenne</div>
                <div className="text-xl font-bold">{getStatsAvancees().depensesMoyennes.toFixed(2)} {config.devise}</div>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-green-50 to-green-100'} border ${borderClass}`}>
                <div className={`text-sm ${mutedClass} mb-1`}>Revenu moyen</div>
                <div className="text-xl font-bold">{getStatsAvancees().revenusMoyens.toFixed(2)} {config.devise}</div>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-purple-50 to-purple-100'} border ${borderClass}`}>
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
                  <Bar dataKey="revenus" fill="#10b981" name="Revenus" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="depenses" fill="#ef4444" name="Dépenses" radius={[8, 8, 0, 0]} />
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
