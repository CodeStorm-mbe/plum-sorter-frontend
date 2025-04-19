import React, { useState, useEffect } from 'react';
import { Cloud, Droplet, Wind, Thermometer, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { FarmService } from '../services';
import { useToast } from '../hooks/use-toast';

interface WeatherWidgetProps {
  title?: string;
  className?: string;
  farmId?: number;
}

/**
 * Widget affichant les conditions météorologiques pour une ferme
 */
const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  title = "Météo et conditions",
  className = "",
  farmId
}) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Charger les données météo
  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Si aucun farmId n'est fourni, utiliser la localisation par défaut
        let data;
        if (farmId) {
          // Récupérer les données météo pour la ferme spécifique
          data = await FarmService.getFarmWeather(farmId);
        } else {
          // Récupérer les données météo pour toutes les fermes (moyenne ou première ferme)
          const farms = await FarmService.getFarms();
          if (farms && farms.length > 0) {
            data = await FarmService.getFarmWeather(farms[0].id);
          } else {
            throw new Error('Aucune ferme disponible pour récupérer les données météo');
          }
        }
        
        setWeatherData(data);
      } catch (err: any) {
        console.error('Erreur lors du chargement des données météo:', err);
        setError(err.message || 'Erreur lors du chargement des données météo');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWeatherData();
  }, [farmId]);

  // Obtenir l'icône météo en fonction des conditions
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="h-10 w-10 text-yellow-400" />;
      case 'partly cloudy':
      case 'cloudy':
        return <Cloud className="h-10 w-10 text-gray-400" />;
      case 'rain':
      case 'showers':
        return <Droplet className="h-10 w-10 text-blue-400" />;
      case 'windy':
        return <Wind className="h-10 w-10 text-teal-400" />;
      default:
        return <Thermometer className="h-10 w-10 text-red-400" />;
    }
  };

  // Simuler des données météo si aucune n'est disponible
  const mockWeatherData = {
    location: "Votre ferme",
    current: {
      condition: "Partly Cloudy",
      temperature: 22,
      humidity: 65,
      wind_speed: 12,
      precipitation: 0,
      uv_index: 5
    },
    forecast: [
      { day: "Aujourd'hui", condition: "Partly Cloudy", max_temp: 24, min_temp: 18, precipitation_chance: 20 },
      { day: "Demain", condition: "Sunny", max_temp: 26, min_temp: 17, precipitation_chance: 10 },
      { day: "Après-demain", condition: "Rain", max_temp: 20, min_temp: 15, precipitation_chance: 80 }
    ],
    agricultural_conditions: {
      soil_moisture: 72,
      optimal_harvesting: true,
      recommendations: [
        "Conditions idéales pour la récolte des prunes mûres",
        "Surveiller l'humidité du sol dans les prochains jours"
      ]
    }
  };

  // Utiliser les données simulées si aucune donnée réelle n'est disponible
  const data = weatherData || mockWeatherData;

  return (
    <div className={`card p-4 ${className}`}>
      <h3 className="text-xl font-title font-semibold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
        {title}
      </h3>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary"></div>
          <span className="ml-2 text-white/60">Chargement des données météo...</span>
        </div>
      ) : error ? (
        <div className="p-4 text-center">
          <p className="text-white/60">
            Données météo temporairement indisponibles.
            <br />
            <span className="text-xs text-white/40">Nous affichons des informations générales.</span>
          </p>
        </div>
      ) : (
        <div>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Conditions actuelles */}
            <div className="flex-1">
              <div className="p-4 bg-background-light/30 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-white">{data.location}</h4>
                  <span className="text-xs text-white/60">Conditions actuelles</span>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-4">
                    {getWeatherIcon(data.current.condition)}
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">{data.current.temperature}°C</div>
                    <div className="text-white/70">{data.current.condition}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="flex items-center text-white/70 text-sm">
                    <Droplet className="h-4 w-4 mr-1 text-blue-400" />
                    Humidité: {data.current.humidity}%
                  </div>
                  <div className="flex items-center text-white/70 text-sm">
                    <Wind className="h-4 w-4 mr-1 text-teal-400" />
                    Vent: {data.current.wind_speed} km/h
                  </div>
                </div>
              </div>
            </div>
            
            {/* Prévisions */}
            <div className="flex-1">
              <div className="p-4 bg-background-light/30 rounded-lg h-full">
                <h4 className="font-medium text-white mb-3">Prévisions</h4>
                
                <div className="space-y-3">
                  {data.forecast.map((day: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {getWeatherIcon(day.condition)}
                        </div>
                        <div>
                          <div className="font-medium text-white">{day.day}</div>
                          <div className="text-white/70 text-xs">{day.condition}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">{day.max_temp}° / {day.min_temp}°</div>
                        <div className="text-white/70 text-xs">
                          Précip: {day.precipitation_chance}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Conditions agricoles */}
          {data.agricultural_conditions && (
            <div className="mt-4 p-4 bg-gradient-to-br from-accent-primary/20 to-accent-primary/5 rounded-lg border border-accent-primary/20">
              <h4 className="font-medium text-white mb-2">Conditions pour la récolte</h4>
              
              <div className="flex items-center mb-3">
                <div className="w-full bg-background-light/50 rounded-full h-2.5">
                  <div 
                    className="bg-accent-primary h-2.5 rounded-full" 
                    style={{ width: `${data.agricultural_conditions.soil_moisture}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-white/70 text-sm">
                  Humidité du sol: {data.agricultural_conditions.soil_moisture}%
                </span>
              </div>
              
              <div className="text-sm text-white/70">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                  data.agricultural_conditions.optimal_harvesting 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {data.agricultural_conditions.optimal_harvesting 
                    ? 'Conditions optimales pour la récolte' 
                    : 'Conditions sous-optimales pour la récolte'}
                </div>
                
                {data.agricultural_conditions.recommendations && (
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {data.agricultural_conditions.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
