import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Menu, Home, CreditCard, Target, Settings, User, Plus, TrendingUp, TrendingDown, Wallet, Calendar, Trash2, Download, Upload, Search, Sun, Moon, BarChart3, AlertCircle, CheckCircle, X, Edit, FileText, Filter, ChevronLeft, ChevronRight, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Modal Compte
const ModalCompte = memo(({ show, onClose, onCreate, darkMode, typesComptes, devise, plateformes }) => {
  const [data, setData] = useState({ nom: '', type: 'courant', soldeInitial: '', couleur: '#3b82f6', plateforme: '' });
  
  useEffect(() => {
    if (!show) {
      setData({ nom: '', type: 'courant', soldeInitial: '', couleur: '#3b82f6', plateforme: '' });
    }
  }, [show]);
  
  if (!show) return null;
  
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
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
              placeholder="Ex: PEA Boursorama" 
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
            <label className="block text-sm font-medium mb-1">Plateforme (optionnel)</label>
            <select 
              value={data.plateforme} 
              onChange={(e) => setData({ ...data, plateforme: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`}
            >
              <option value="">Aucune</option>
              {plateformes.map(p => (<option key={p.id} value={p.nom}>{p.nom}</option>))}
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
          <button type="button" onClick={() => onCreate({ ...data, soldeInitial: parseFloat(data.soldeInitial) || 0 })} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg transition-all">Créer</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-400 transition-all">Annuler</button>
        </div>
      </div>
    </div>
  );
});

// Modal Transaction
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
          <button type="button" onClick={() => onCreate({ ...data, montant: parseFloat(data.montant) || 0 })} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg transition-all">Créer</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-400 transition-all">Annuler</button>
        </div>
      </div>
    </div>
  );
});

// Modal Objectif
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
          <button type="button" onClick={() => onCreate({...data, montantCible: parseFloat(data.montantCible) || 0, montantActuel: parseFloat(data.montantActuel) || 0})} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all">Créer</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-400 transition-all">Annuler</button>
        </div>
      </div>
    </div>
  );
});

// Modal Budget
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
          <button type="button" onClick={() => onCreate({ ...data, montantMax: parseFloat(data.montantMax) || 0 })} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg transition-all">Créer</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-400 transition-all">Annuler</button>
        </div>
      </div>
    </div>
  );
});

// Modal Catégorie
const ModalCategorie = memo(({ show, onClose, onCreate, darkMode, type }) => {
  const [data, setData] = useState({ nom: '', icon: '📦', color: '#3b82f6' });
  
  useEffect(() => {
    if (!show) {
      setData({ nom: '', icon: '📦', color: '#3b82f6' });
    }
  }, [show]);
  
  if (!show) return null;
  
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
  const iconsCommuns = ['🍕', '🏠', '🚗', '💊', '🎮', '🛍️', '💼', '💻', '📈', '💰', '📊', '🏦', '₿', '✈️', '🎬', '📱', '⚡', '🎓', '🏋️', '🎨'];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className={`${cardClass} rounded-2xl p-6 w-full max-w-md shadow-2xl border ${borderClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Nouvelle catégorie - {type}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input 
              type="text" 
              value={data.nom} 
              onChange={(e) => setData({ ...data, nom: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`} 
              placeholder="Ex: Sport" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Icône</label>
            <div className="grid grid-cols-10 gap-2 mb-2">
              {iconsCommuns.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setData({ ...data, icon })}
                  className={`text-2xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${data.icon === icon ? 'bg-orange-100 dark:bg-orange-900 ring-2 ring-orange-500' : ''}`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <input 
              type="text" 
              value={data.icon} 
              onChange={(e) => setData({ ...data, icon: e.target.value })} 
              className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:ring-2 focus:ring-orange-500 outline-none`} 
              placeholder="ou saisir un emoji" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Couleur</label>
            <input 
              type="color" 
              value={data.color} 
              onChange={(e) => setData({ ...data, color: e.target.value })} 
              className={`w-full h-12 px-2 py-1 border ${borderClass} rounded-xl cursor-pointer`} 
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button type="button" onClick={() => onCreate(data)} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg transition-all">Créer</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-400 transition-all">Annuler</button>
        </div>
      </div>
    </div>
  );
});

// Composant Vue Calendrier
const VueCalendrier = memo(({ transactions, darkMode, onSelectDate, config }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  const getTransactionsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return transactions.filter(t => t.date === dateStr);
  };
  
  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  
  return (
    <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold capitalize">{monthYear}</h3>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <div key={day} className="text-center text-sm font-semibold py-2">
            {day}
          </div>
        ))}
        
        {days.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} className="aspect-square" />;
          
          const dayTransactions = getTransactionsForDate(date);
          const totalDay = dayTransactions.reduce((sum, t) => sum + t.montant, 0);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <button
              key={index}
              onClick={() => onSelectDate && onSelectDate(date)}
              className={`aspect-square p-1 rounded-lg border ${borderClass} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isToday ? 'ring-2 ring-orange-500' : ''}`}
            >
              <div className="text-sm font-medium">{date.getDate()}</div>
              {dayTransactions.length > 0 && (
                <div className={`text-xs ${totalDay >= 0 ? 'text-green-600' : 'text-red-600'} font-bold truncate`}>
                  {totalDay > 0 ? '+' : ''}{totalDay.toFixed(0)}{config.devise}
                </div>
              )}
              <div className="text-xs text-gray-500">{dayTransactions.length > 0 && `${dayTransactions.length}`}</div>
            </button>
          );
        })}
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
  const [compareYear, setCompareYear] = useState(false);
  
  const [config, setConfig] = useState({
    devise: '€',
    langue: 'fr'
  });
  
  const [profil, setProfil] = useState({
    nom: 'Jean Dupont',
    email: 'jean.dupont@example.com'
  });
  
  const [typesComptes, setTypesComptes] = useState([
    { value: 'courant', label: 'Compte courant', icon: '💳' },
    { value: 'epargne', label: 'Compte épargne', icon: '🏦' },
    { value: 'livret_a', label: 'Livret A', icon: '📘' },
    { value: 'ldds', label: 'LDDS', icon: '📗' },
    { value: 'pel', label: 'PEL', icon: '🏡' },
    { value: 'cel', label: 'CEL', icon: '🏘️' },
    { value: 'pea', label: 'PEA', icon: '📊' },
    { value: 'per', label: 'PER', icon: '👴' },
    { value: 'av', label: 'Assurance Vie', icon: '🛡️' },
    { value: 'investissement', label: 'Compte-titres', icon: '📈' },
    { value: 'crypto', label: 'Crypto', icon: '₿' }
  ]);
  
  const [plateformes, setPlateformes] = useState([
    { id: 1, nom: 'Boursorama', type: 'banque' },
    { id: 2, nom: 'Fortuneo', type: 'banque' },
    { id: 3, nom: 'Trade Republic', type: 'courtier' },
    { id: 4, nom: 'Binance', type: 'crypto' }
  ]);
  
  const [comptes, setComptes] = useState([
    { id: 1, nom: 'Compte courant', type: 'courant', soldeInitial: 2500, couleur: '#3b82f6', plateforme: 'Boursorama' },
    { id: 2, nom: 'PEA', type: 'pea', soldeInitial: 5000, couleur: '#10b981', plateforme: 'Trade Republic' }
  ]);
  
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2025-10-01', libelle: 'Salaire', montant: 2500, type: 'REVENUS', categorie: 'Salaire', compteId: 1, tags: [] },
    { id: 2, date: '2025-10-01', libelle: 'Loyer', montant: -800, type: 'DÉPENSES', categorie: 'Logement', compteId: 1, tags: ['urgent'] },
    { id: 3, date: '2025-10-02', libelle: 'Courses', montant: -120, type: 'DÉPENSES', categorie: 'Alimentation', compteId: 1, tags: [] },
    { id: 4, date: '2024-10-01', libelle: 'Salaire', montant: 2400, type: 'REVENUS', categorie: 'Salaire', compteId: 1, tags: [] },
    { id: 5, date: '2024-10-01', libelle: 'Loyer', montant: -750, type: 'DÉPENSES', categorie: 'Logement', compteId: 1, tags: [] }
  ]);
  
  const [objectifs, setObjectifs] = useState([
    { id: 1, nom: 'Vacances été', montantCible: 2000, montantActuel: 500, dateObjectif: '2025-07-01', categorie: 'Voyage' }
  ]);
  
  const [budgets, setBudgets] = useState([
    { id: 1, categorie: 'Alimentation', montantMax: 400, mois: '2025-10' },
    { id: 2, categorie: 'Transport', montantMax: 200, mois: '2025-10' }
  ]);
  
  const [categories, setCategories] = useState({
    depenses: [
      { id: 1, nom: 'Alimentation', icon: '🍕', color: '#ef4444' },
      { id: 2, nom: 'Logement', icon: '🏠', color: '#f59e0b' },
      { id: 3, nom: 'Transport', icon: '🚗', color: '#3b82f6' },
      { id: 4, nom: 'Santé', icon: '💊', color: '#ec4899' },
      { id: 5, nom: 'Loisirs', icon: '🎮', color: '#8b5cf6' }
    ],
    revenus: [
      { id: 1, nom: 'Salaire', icon: '💼', color: '#10b981' },
      { id: 2, nom: 'Freelance', icon: '💻', color: '#14b8a6' }
    ],
    placements: [
      { id: 1, nom: 'Actions', icon: '📊', color: '#6366f1' },
      { id: 2, nom: 'Crypto', icon: '₿', color: '#a855f7' }
    ]
  });
  
  const [showAddCompte, setShowAddCompte] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddObjectif, setShowAddObjectif] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddCategorie, setShowAddCategorie] = useState(false);
  const [categorieType, setCategorieType] = useState('depenses');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  const [filtreType, setFiltreType] = useState('TOUS');
  const [filtreCategorie, setFiltreCategorie] = useState('');
  const [filtreCompte, setFiltreCompte] = useState('');
  
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
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    if (periodFilter === 'semaine') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
    } else if (periodFilter === 'mois') {
      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
    } else if (periodFilter === 'trimestre') {
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      filtered = filtered.filter(t => new Date(t.date) >= threeMonthsAgo);
    } else if (periodFilter === 'annee') {
      filtered = filtered.filter(t => new Date(t.date).getFullYear() === currentYear);
    }
    
    if (filtreType !== 'TOUS') {
      filtered = filtered.filter(t => t.type === filtreType);
    }
    
    if (filtreCategorie) {
      filtered = filtered.filter(t => t.categorie === filtreCategorie);
    }
    
    if (filtreCompte) {
      filtered = filtered.filter(t => t.compteId === parseInt(filtreCompte));
    }
    
    if (searchTerm) {
      filtered = filtered.filter(t => t.libelle.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
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
  
  const exporterPDF = useCallback(() => {
    const filtered = getTransactionsFiltrees();
    let content = `RAPPORT FINANCIER\n`;
    content += `Période: ${periodFilter}\n\n`;
    content += `RÉSUMÉ\n`;
    content += `Revenus: ${stats.totalRevenus.toFixed(2)} ${config.devise}\n`;
    content += `Dépenses: ${stats.totalDepenses.toFixed(2)} ${config.devise}\n`;
    content += `Solde: ${(stats.totalRevenus - stats.totalDepenses).toFixed(2)} ${config.devise}\n`;
    content += `Patrimoine total: ${stats.soldeTotal.toFixed(2)} ${config.devise}\n\n`;
    content += `TRANSACTIONS (${filtered.length})\n`;
    filtered.forEach(t => {
      content += `${t.date} | ${t.libelle} | ${t.montant} ${config.devise} | ${t.categorie}\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    showToast('Rapport exporté', 'success');
  }, [getTransactionsFiltrees, stats, periodFilter, config.devise, showToast]);
  
  const ajouterCompte = useCallback((data) => {
    if (!data.nom) return showToast('Nom requis', 'error');
    setComptes(prev => [...prev, { id: Date.now(), ...data }]);
    setShowAddCompte(false);
    showToast('Compte créé', 'success');
  }, [showToast]);
  
  const ajouterTransaction = useCallback((data) => {
    if (!data.libelle || !data.categorie) return showToast('Champs requis', 'error');
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
    const newCat = { id: Date.now(), ...data };
    setCategories(prev => ({
      ...prev,
      [categorieType]: [...prev[categorieType], newCat]
    }));
    setShowAddCategorie(false);
    showToast('Catégorie créée', 'success');
  }, [categorieType, showToast]);
  
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
  
  const getBudgetAlerts = useCallback(() => {
    return budgets.map(budget => {
      const depenses = transactions
        .filter(t => t.montant < 0 && t.categorie === budget.categorie && t.date.startsWith(budget.mois))
        .reduce((sum, t) => sum + Math.abs(t.montant), 0);
      const pourcentage = (depenses / budget.montantMax) * 100;
      return { ...budget, depenses, pourcentage, alerte: pourcentage >= 80 };
    });
  }, [budgets, transactions]);
  
  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);
  
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100';
  const cardClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900';
  const mutedClass = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  
  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];
  
  return (
    <div className={`flex h-screen ${bgClass}`}>
      {toast.show && (
        <div className={`fixed top-4 right-4 ${toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white px-6 py-3 rounded-xl shadow-2xl z-50`}>
          {toast.message}
        </div>
      )}
      
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-orange-500 to-orange-600 text-white transition-all duration-300 flex flex-col shadow-2xl`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Budget Pro</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-orange-700 rounded-xl">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 mt-8">
          {[
            { id: 'dashboard', icon: Home, label: 'Tableau de bord' },
            { id: 'transactions', icon: CreditCard, label: 'Transactions' },
            { id: 'calendrier', icon: Calendar, label: 'Calendrier' },
            { id: 'objectifs', icon: Target, label: 'Objectifs' },
            { id: 'parametres', icon: Settings, label: 'Paramètres' },
            { id: 'profil', icon: User, label: 'Profil' }
          ].map(item => (
            <button key={item.id} onClick={() => setCurrentView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-700 transition-colors rounded-xl mx-2 ${currentView === item.id ? 'bg-orange-700 shadow-lg' : ''}`}>
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4">
          <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-center gap-2 p-2 hover:bg-orange-700 rounded-xl">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {sidebarOpen && <span>{darkMode ? 'Mode clair' : 'Mode sombre'}</span>}
          </button>
        </div>
      </div>

      {currentView === 'dashboard' && (
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-3xl font-bold ${textClass}`}>Tableau de bord</h2>
            <div className="flex gap-2">
              <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} className={`px-4 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <option value="tout">Tout</option>
                <option value="semaine">Cette semaine</option>
                <option value="mois">Ce mois</option>
                <option value="trimestre">Ce trimestre</option>
                <option value="annee">Cette année</option>
              </select>
              <button onClick={() => setCompareYear(!compareYear)} className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600">
                {compareYear ? 'Masquer' : 'Comparer'} N vs N-1
              </button>
              <button onClick={exporterPDF} className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg transition-all hover:scale-105 border ${borderClass}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={mutedClass}>Patrimoine net</span>
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{stats.soldeTotal.toFixed(2)} {config.devise}</div>
            </div>
            
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg transition-all hover:scale-105 border ${borderClass}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={mutedClass}>Revenus</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.totalRevenus.toFixed(2)} {config.devise}</div>
            </div>
            
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg transition-all hover:scale-105 border ${borderClass}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={mutedClass}>Dépenses</span>
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.totalDepenses.toFixed(2)} {config.devise}</div>
            </div>
            
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg transition-all hover:scale-105 border ${borderClass}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={mutedClass}>Épargne</span>
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{(stats.totalRevenus - stats.totalDepenses).toFixed(2)} {config.devise}</div>
            </div>
          </div>
          
          {compareYear && (
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg mb-6 border ${borderClass}`}>
              <h3 className="text-xl font-bold mb-4">Comparaison annuelle</h3>
              <ResponsiveContainer width="100%" height={200}>
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
              </ResponsiveContainer>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
              <h3 className="text-xl font-bold mb-4">Évolution du patrimoine</h3>
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
            
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Budgets mensuels</h3>
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
                      <span className={budget.alerte ? 'text-orange-500 font-bold' : 'text-green-500'}>{budget.pourcentage.toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
              <h3 className="text-xl font-bold mb-4">Comptes</h3>
              <div className="space-y-3">
                {comptesAvecSoldes.map(compte => (
                  <div key={compte.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${borderClass}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: compte.couleur }}></div>
                      <div>
                        <div className="font-medium">{compte.nom}</div>
                        {compte.plateforme && <div className="text-xs text-gray-500">{compte.plateforme}</div>}
                      </div>
                    </div>
                    <span className="font-bold">{compte.soldeActuel.toFixed(2)} {config.devise}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowAddCompte(true)} className="mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Ajouter un compte
              </button>
            </div>
            
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
          </div>
        </div>
      )}

      {currentView === 'transactions' && (
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-3xl font-bold ${textClass}`}>Transactions</h2>
            <button onClick={() => setShowAddTransaction(true)} className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Nouvelle transaction
            </button>
          </div>
          
          <div className={`${cardClass} p-4 rounded-2xl shadow-lg mb-6 border ${borderClass}`}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Rechercher..." 
                  className={`w-full pl-10 px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} 
                />
              </div>
              <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} className={`px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <option value="tout">Toutes périodes</option>
                <option value="semaine">Cette semaine</option>
                <option value="mois">Ce mois</option>
                <option value="trimestre">Ce trimestre</option>
                <option value="annee">Cette année</option>
              </select>
              <select value={filtreType} onChange={(e) => setFiltreType(e.target.value)} className={`px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <option value="TOUS">Tous types</option>
                <option value="REVENUS">Revenus</option>
                <option value="DÉPENSES">Dépenses</option>
                <option value="PLACEMENTS">Placements</option>
              </select>
              <select value={filtreCategorie} onChange={(e) => setFiltreCategorie(e.target.value)} className={`px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <option value="">Toutes catégories</option>
                {[...categories.depenses, ...categories.revenus, ...categories.placements].map(cat => (
                  <option key={cat.id + cat.nom} value={cat.nom}>{cat.nom}</option>
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
                  <th className={`px-6 py-3 text-left text-xs font-medium ${mutedClass} uppercase`}>Compte</th>
                  <th className={`px-6 py-3 text-right text-xs font-medium ${mutedClass} uppercase`}>Montant</th>
                  <th className={`px-6 py-3 text-right text-xs font-medium ${mutedClass} uppercase`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${borderClass}`}>
                {getTransactionsFiltrees().map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm">{t.date}</td>
                    <td className="px-6 py-4 text-sm font-medium">{t.libelle}</td>
                    <td className="px-6 py-4 text-sm">{t.categorie}</td>
                    <td className="px-6 py-4 text-sm">{comptesAvecSoldes.find(c => c.id === t.compteId)?.nom}</td>
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

      {currentView === 'calendrier' && (
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-3xl font-bold ${textClass}`}>Calendrier</h2>
            <button onClick={() => setShowAddTransaction(true)} className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>
          
          <VueCalendrier 
            transactions={transactions}
            darkMode={darkMode}
            config={config}
            onSelectDate={(date) => {
              console.log('Date sélectionnée:', date);
            }}
          />
        </div>
      )}

      {currentView === 'objectifs' && (
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-3xl font-bold ${textClass}`}>Objectifs d'épargne</h2>
            <button onClick={() => setShowAddObjectif(true)} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Nouvel objectif
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectifs.map(obj => {
              const progression = (obj.montantActuel / obj.montantCible) * 100;
              return (
                <div key={obj.id} className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
                  <h3 className="text-lg font-bold mb-2">{obj.nom}</h3>
                  <p className={`text-sm ${mutedClass} mb-4`}>{obj.categorie}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>{obj.montantActuel.toFixed(2)} {config.devise}</span>
                      <span>{obj.montantCible.toFixed(2)} {config.devise}</span>
                    </div>
                    <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3`}>
                      <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${Math.min(progression, 100)}%` }}></div>
                    </div>
                    <div className="text-center text-sm font-semibold mt-2">{progression.toFixed(0)}%</div>
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
              <h3 className="text-xl font-bold mb-4">Gestion des catégories</h3>
              
              {['depenses', 'revenus', 'placements'].map(type => (
                <div key={type} className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold capitalize">{type}</h4>
                    <button 
                      onClick={() => { setCategorieType(type); setShowAddCategorie(true); }} 
                      className="text-orange-600 hover:text-orange-700"
                    >
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
                        <button onClick={() => supprimerCategorie(type, cat.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
              <h3 className="text-xl font-bold mb-4">Plateformes</h3>
              <div className="space-y-2 mb-4">
                {plateformes.map(p => (
                  <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${borderClass}`}>
                    <div>
                      <div className="font-medium">{p.nom}</div>
                      <div className="text-xs text-gray-500">{p.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`${cardClass} p-6 rounded-2xl shadow-lg border ${borderClass}`}>
              <h3 className="text-xl font-bold mb-4">Paramètres généraux</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Devise</label>
                  <select value={config.devise} onChange={(e) => setConfig({...config, devise: e.target.value})} className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
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
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
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
                <input 
                  type="text" 
                  value={profil.nom} 
                  onChange={(e) => setProfil({ ...profil, nom: e.target.value })} 
                  className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={profil.email} 
                  onChange={(e) => setProfil({ ...profil, email: e.target.value })} 
                  className={`w-full px-3 py-2 border ${borderClass} rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`} 
                />
              </div>
              <button onClick={() => showToast('Profil mis à jour')} className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalCompte show={showAddCompte} onClose={() => setShowAddCompte(false)} onCreate={ajouterCompte} darkMode={darkMode} typesComptes={typesComptes} devise={config.devise} plateformes={plateformes} />
      <ModalTransaction show={showAddTransaction} onClose={() => setShowAddTransaction(false)} onCreate={ajouterTransaction} darkMode={darkMode} comptes={comptes} categories={categories} devise={config.devise} />
      <ModalObjectif show={showAddObjectif} onClose={() => setShowAddObjectif(false)} onCreate={ajouterObjectif} darkMode={darkMode} devise={config.devise} />
      <ModalBudget show={showAddBudget} onClose={() => setShowAddBudget(false)} onCreate={ajouterBudget} darkMode={darkMode} categories={categories} devise={config.devise} />
      <ModalCategorie show={showAddCategorie} onClose={() => setShowAddCategorie(false)} onCreate={ajouterCategorie} darkMode={darkMode} type={categorieType} />
    </div>
  );
};

export default BudgetApp;
