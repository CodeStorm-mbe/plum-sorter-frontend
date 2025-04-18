import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './UIComponents';

interface ModelManagementWidgetProps {
  title?: string;
  className?: string;
}

const ModelManagementWidget: React.FC<ModelManagementWidgetProps> = ({
  title = "Gestion des modèles",
  className = ""
}) => {
  const [models, setModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModel, setActiveModel] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      try {
        // Simuler un chargement de données
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données fictives pour la démonstration
        const demoModels = [
          {
            id: 'model-v1',
            name: 'PlumClassifier v1.0',
            version: '1.0.0',
            accuracy: 0.82,
            created_at: '2024-01-15',
            status: 'inactive',
            size: '24.5 MB'
          },
          {
            id: 'model-v2',
            name: 'PlumClassifier v2.0',
            version: '2.0.0',
            accuracy: 0.89,
            created_at: '2024-03-10',
            status: 'active',
            size: '32.1 MB'
          },
          {
            id: 'model-exp',
            name: 'PlumClassifier Experimental',
            version: '2.1.0-beta',
            accuracy: 0.91,
            created_at: '2024-04-01',
            status: 'inactive',
            size: '35.7 MB'
          }
        ];
        
        setModels(demoModels);
        setActiveModel(demoModels.find(model => model.status === 'active')?.id || null);
      } catch (error) {
        console.error('Erreur lors du chargement des modèles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const handleActivateModel = async (modelId: string) => {
    try {
      // Simuler l'activation du modèle
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour l'état local
      setModels(prevModels => 
        prevModels.map(model => ({
          ...model,
          status: model.id === modelId ? 'active' : 'inactive'
        }))
      );
      setActiveModel(modelId);
    } catch (error) {
      console.error('Erreur lors de l\'activation du modèle:', error);
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-background-light/30">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Version
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Précision
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Date de création
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {models.map((model) => (
                <tr key={model.id} className={model.id === activeModel ? 'bg-accent-primary/10' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {model.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                    {model.version}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                    {(model.accuracy * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                    {model.created_at}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      model.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/60'
                    }`}>
                      {model.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                    {model.status !== 'active' ? (
                      <button
                        onClick={() => handleActivateModel(model.id)}
                        className="text-accent-primary hover:text-accent-primary/80 transition-colors"
                      >
                        Activer
                      </button>
                    ) : (
                      <span className="text-white/40">Activé</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-4 text-white/60 text-sm">
        <p>Le modèle actif est utilisé pour toutes les nouvelles classifications.</p>
      </div>
    </Card>
  );
};

export default ModelManagementWidget;
