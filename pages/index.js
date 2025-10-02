import { useState, useEffect } from 'react';
import { PiggyBank, TrendingUp, AlertCircle, Save, Download, Upload, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { db, sauvegarderDonnees, chargerDonnees } from '../lib/firebase';

export default function BudgetDashboard() {
  const [salaire, setSalaire] = useState('');
  const [epargne, setEpargne] = useState(50);
  const [investissement, setInvestissement] = useState(30);
  const [loisirs, setLoisirs] = useState(20);
  const [depenses, setDepenses] = useState([]);
  const [nouvelleDepense, setNouvelleDepense] = useState({ nom: '', montant: '', categorie: 'Fixe' });
  const [message, setMessage] = useState('');
  const [chargement, setChargement] = useState(false);

  // Chargement automatique au démarrage
  useEffect(() => {
    chargerDepuisCloud();
  }, []);

  // Calculs
  const salaireNum = parseFloat(salaire) || 0;
  const montantEpargne = (salaireNum * epargne) / 100;
  const montantInvestissement = (salaireNum * investissement) / 100;
  const montantLoisirs = (salaireNum * loisirs) / 100;
  const totalDepenses = depenses.reduce((sum, d) => sum + parseFloat(d.montant || 0), 0);
  const budgetRestant = salaireNum - montantEpargne - montantInvestissement - montantLoisirs - totalDepenses;

  // Ajouter une dépense
  const ajouterDepense = () => {
    if (nouvelleDepense.nom && nouvelleDepense.montant) {
      setDepenses([...depenses, { ...nouvelleDepense, id: Date.now() }]);
      setNouvelleDepense({ nom: '', montant: '', categorie: 'Fixe' });
      afficherMessage('✅ Dépense ajoutée !', 'success');
    }
  };

  // Supprimer une dépense
  const supprimerDepense = (id) => {
    setDepenses(depenses.filter(d => d.id !== id));
    afficherMessage('🗑️ Dépense supprimée', 'info');
  };

  // Sauvegarder dans le cloud
  const sauvegarderDansCloud = async () => {
    setChargement(true);
    const donnees = {
      salaire,
      epargne,
      investissement,
      loisirs,
      depenses
    };
    
    const resultat = await sauvegarderDonnees(donnees);
    setChargement(false);
    
    if (resultat.success) {
      afficherMessage('☁️ Sauvegardé dans le cloud !', 'success');
    } else {
      afficherMessage('❌ Erreur de sauvegarde', 'error');
    }
  };

  // Charger depuis le cloud
  const chargerDepuisCloud = async () => {
    setChargement(true);
    const resultat = await chargerDonnees();
    setChargement(false);
    
    if (resultat.success && resultat.data) {
      const data = resultat.data;
      setSalaire(data.salaire || '');
      setEpargne(data.epargne || 50);
      setInvestissement(data.investissement || 30);
      setLoisirs(data.loisirs || 20);
      setDepenses(data.depenses || []);
      afficherMessage('📥 Données chargées !', 'success');
    } else if (resultat.message === 'Aucune données') {
      afficherMessage('ℹ️ Aucune sauvegarde trouvée', 'info');
    } else {
      afficherMessage('❌ Erreur de chargement', 'error');
    }
  };

  // Réinitialiser
  const reinitialiser = () => {
    if (confirm('Voulez-vous vraiment tout réinitialiser ?')) {
      setSalaire('');
      setEpargne(50);
      setInvestissement(30);
      setLoisirs(20);
      setDepenses([]);
      afficherMessage('🔄 Réinitialisé !', 'info');
    }
  };

  // Afficher un message temporaire
  const afficherMessage = (texte, type) => {
    setMessage({ texte, type });
    setTimeout(() => setMessage(''), 3000);
  };

  // Données pour le graphique
  const donneesGraphique = [
    { nom: 'Épargne', montant: montantEpargne, couleur: '#10b981' },
    { nom: 'Investissement', montant: montantInvestissement, couleur: '#3b82f6' },
    { nom: 'Loisirs', montant: montantLoisirs, couleur: '#f59e0b' },
    { nom: 'Dépenses', montant: totalDepenses, couleur: '#ef4444' },
    { nom: 'Restant', montant: Math.max(0, budgetRestant), couleur: '#6366f1' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '30px', marginBottom: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <PiggyBank size={40} color="#667eea" />
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  Dashboard Budget Pro
                </h1>
                <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>
                  Gérez votre argent intelligemment 💰
                </p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={sauvegarderDansCloud}
                disabled={chargement}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: chargement ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: chargement ? 0.6 : 1
                }}
              >
                <Save size={18} />
                Sauvegarder
              </button>

              <button
                onClick={chargerDepuisCloud}
                disabled={chargement}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: chargement ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: chargement ? 0.6 : 1
                }}
              >
                <Download size={18} />
                Charger
              </button>

              <button
                onClick={reinitialiser}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <Trash2 size={18} />
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Message de feedback */}
          {message && (
            <div style={{
              marginTop: '15px',
              padding: '12px 20px',
              borderRadius: '8px',
              background: message.type === 'success' ? '#d1fae5' : message.type === 'error' ? '#fee2e2' : '#dbeafe',
              color: message.type === 'success' ? '#065f46' : message.type === 'error' ? '#991b1b' : '#1e40af',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {message.texte}
            </div>
          )}
        </div>

        {/* Section Salaire */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '25px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>
            💵 Salaire mensuel net
          </label>
          <input
            type="number"
            value={salaire}
            onChange={(e) => setSalaire(e.target.value)}
            placeholder="Ex: 2500"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '18px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              outline: 'none'
            }}
          />
        </div>

        {/* Répartition du budget */}
        {salaireNum > 0 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              
              {/* Épargne */}
              <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '16px', padding: '25px', color: 'white', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>💰 ÉPARGNE</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '15px' }}>
                  {montantEpargne.toFixed(0)}€
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={epargne}
                  onChange={(e) => setEpargne(Number(e.target.value))}
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <div style={{ fontSize: '16px', fontWeight: '500' }}>{epargne}%</div>
              </div>

              {/* Investissement */}
              <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '16px', padding: '25px', color: 'white', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)' }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>📈 INVESTISSEMENT</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '15px' }}>
                  {montantInvestissement.toFixed(0)}€
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={investissement}
                  onChange={(e) => setInvestissement(Number(e.target.value))}
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <div style={{ fontSize: '16px', fontWeight: '500' }}>{investissement}%</div>
              </div>

              {/* Loisirs */}
              <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '16px', padding: '25px', color: 'white', boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)' }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>🎉 LOISIRS</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '15px' }}>
                  {montantLoisirs.toFixed(0)}€
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={loisirs}
                  onChange={(e) => setLoisirs(Number(e.target.value))}
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <div style={{ fontSize: '16px', fontWeight: '500' }}>{loisirs}%</div>
              </div>
            </div>

            {/* Ajouter une dépense */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '25px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '20px' }}>
                🧾 Ajouter une dépense
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Nom (ex: Loyer)"
                  value={nouvelleDepense.nom}
                  onChange={(e) => setNouvelleDepense({ ...nouvelleDepense, nom: e.target.value })}
                  style={{
                    padding: '12px',
                    fontSize: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
                <input
                  type="number"
                  placeholder="Montant (€)"
                  value={nouvelleDepense.montant}
                  onChange={(e) => setNouvelleDepense({ ...nouvelleDepense, montant: e.target.value })}
                  style={{
                    padding: '12px',
                    fontSize: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
                <select
                  value={nouvelleDepense.categorie}
                  onChange={(e) => setNouvelleDepense({ ...nouvelleDepense, categorie: e.target.value })}
                  style={{
                    padding: '12px',
                    fontSize: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    background: 'white'
                  }}
                >
                  <option>Fixe</option>
                  <option>Variable</option>
                  <option>Ponctuelle</option>
                </select>
              </div>
              <button
                onClick={ajouterDepense}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                + Ajouter
              </button>
            </div>

            {/* Liste des dépenses */}
            {depenses.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '25px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '20px' }}>
                  📋 Mes dépenses ({depenses.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {depenses.map((depense) => (
                    <div
                      key={depense.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
                          {depense.nom}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                          {depense.categorie}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444' }}>
                          {parseFloat(depense.montant).toFixed(0)}€
                        </div>
                        <button
                          onClick={() => supprimerDepense(depense.id)}
                          style={{
                            padding: '8px',
                            background: '#fee2e2',
                            color: '#991b1b',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: '#fef2f2',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#991b1b' }}>
                    Total des dépenses
                  </span>
                  <span style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>
                    {totalDepenses.toFixed(0)}€
                  </span>
                </div>
              </div>
            )}

            {/* Budget restant */}
            <div style={{
              background: budgetRestant >= 0 ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '20px',
              color: 'white',
              boxShadow: budgetRestant >= 0 ? '0 4px 20px rgba(99, 102, 241, 0.3)' : '0 4px 20px rgba(239, 68, 68, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', opacity: 0.9, marginBottom: '10px' }}>
                {budgetRestant >= 0 ? '✅ BUDGET RESTANT' : '⚠️ DÉPASSEMENT'}
              </div>
              <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                {Math.abs(budgetRestant).toFixed(0)}€
              </div>
              {budgetRestant < 0 && (
                <div style={{ marginTop: '10px', fontSize: '14px', opacity: 0.9 }}>
                  Vous dépensez {Math.abs(budgetRestant).toFixed(0)}€ de plus que votre salaire !
                </div>
              )}
            </div>

            {/* Graphique */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '20px' }}>
                📊 Répartition de votre budget
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={donneesGraphique}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nom" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="montant" radius={[8, 8, 0, 0]}>
                    {donneesGraphique.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.couleur} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
