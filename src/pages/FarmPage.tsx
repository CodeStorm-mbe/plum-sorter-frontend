// FarmPage.tsx - Page pour la gestion des fermes
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, MapPin, Info, BarChart } from "lucide-react";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../contexts/AuthContext";
import { FarmService, Farm } from "../services";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { toast } from "../hooks/use-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const FarmPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    size: 0,
    geo_coordinates: {
      latitude: 0,
      longitude: 0,
    },
  });

  // Récupérer la liste des fermes
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setIsLoading(true);
        const farmsData = await FarmService.getFarms();
        setFarms(farmsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des fermes:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer la liste des fermes",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarms();
  }, []);

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "latitude" || name === "longitude") {
      setFormData({
        ...formData,
        geo_coordinates: {
          ...formData.geo_coordinates,
          [name]: parseFloat(value) || 0,
        },
      });
    } else if (name === "size") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Ouvrir le dialogue de création/modification
  const openDialog = (farm?: Farm) => {
    if (farm) {
      setSelectedFarm(farm);
      setFormData({
        name: farm.name,
        description: farm.description,
        location: farm.location,
        size: farm.size || 0,
        geo_coordinates: farm.geo_coordinates || {
          latitude: 0,
          longitude: 0,
        },
      });
    } else {
      setSelectedFarm(null);
      setFormData({
        name: "",
        description: "",
        location: "",
        size: 0,
        geo_coordinates: {
          latitude: 0,
          longitude: 0,
        },
      });
    }
    setIsDialogOpen(true);
  };

  // Ouvrir le dialogue de suppression
  const openDeleteDialog = (farm: Farm) => {
    setSelectedFarm(farm);
    setIsDeleteDialogOpen(true);
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (selectedFarm) {
        // Mise à jour d'une ferme existante
        await FarmService.updateFarm(selectedFarm.id, formData);
        toast({
          title: "Succès",
          description: "La ferme a été mise à jour avec succès",
        });
      } else {
        // Création d'une nouvelle ferme
        await FarmService.createFarm(formData);
        toast({
          title: "Succès",
          description: "La ferme a été créée avec succès",
        });
      }
      
      // Rafraîchir la liste des fermes
      const farmsData = await FarmService.getFarms();
      setFarms(farmsData);
      
      // Fermer le dialogue
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la ferme:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la ferme",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer une ferme
  const handleDelete = async () => {
    if (!selectedFarm) return;
    
    try {
      setIsLoading(true);
      await FarmService.deleteFarm(selectedFarm.id);
      
      // Rafraîchir la liste des fermes
      const farmsData = await FarmService.getFarms();
      setFarms(farmsData);
      
      toast({
        title: "Succès",
        description: "La ferme a été supprimée avec succès",
      });
      
      // Fermer le dialogue
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de la ferme:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la ferme",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Naviguer vers les détails d'une ferme
  const navigateToFarmDetails = (farmId: number) => {
    navigate(`/farms/${farmId}`);
  };

  // Naviguer vers les statistiques d'une ferme
  const navigateToFarmStats = (farmId: number) => {
    navigate(`/farms/${farmId}/stats`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <motion.div
          className="container mx-auto pt-28 pb-16 px-4 md:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-title font-bold">
              <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                Mes Fermes
              </span>
            </h1>
            <Button onClick={() => openDialog()} className="bg-accent-primary hover:bg-accent-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Nouvelle Ferme
            </Button>
          </motion.div>

          {isLoading && !isDialogOpen && !isDeleteDialogOpen ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : farms.length === 0 ? (
            <motion.div
              className="text-center py-16 bg-background-light/30 rounded-lg border border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-white/70 mb-4">Vous n'avez pas encore de fermes enregistrées.</p>
              <Button onClick={() => openDialog()} className="bg-accent-primary hover:bg-accent-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Créer ma première ferme
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {farms.map((farm) => (
                <Card key={farm.id} className="bg-background-light/50 border border-white/10 hover:border-accent-primary/50 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-title">{farm.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-start mb-2">
                        <MapPin className="h-4 w-4 text-white/60 mt-1 mr-2 flex-shrink-0" />
                        <p className="text-white/80">{farm.location}</p>
                      </div>
                      <p className="text-white/60 line-clamp-2 mb-4">{farm.description}</p>
                      <div className="text-sm text-white/50">
                        Taille: {farm.size ? `${farm.size} hectares` : "Non spécifiée"}
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(farm)}
                          className="border-white/10 hover:border-accent-primary/50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(farm)}
                          className="border-white/10 hover:border-red-500/50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateToFarmStats(farm.id)}
                          className="border-white/10 hover:border-accent-primary/50"
                        >
                          <BarChart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateToFarmDetails(farm.id)}
                          className="border-white/10 hover:border-accent-primary/50"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Dialogue de création/modification de ferme */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-background-light border border-white/10 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-title">
                {selectedFarm ? "Modifier la ferme" : "Nouvelle ferme"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la ferme</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-background border border-white/10 focus:border-accent-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="bg-background border border-white/10 focus:border-accent-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="bg-background border border-white/10 focus:border-accent-primary/50"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Taille (hectares)</Label>
                  <Input
                    id="size"
                    name="size"
                    type="number"
                    value={formData.size || ""}
                    onChange={handleChange}
                    className="bg-background border border-white/10 focus:border-accent-primary/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="0.000001"
                      value={formData.geo_coordinates?.latitude || ""}
                      onChange={handleChange}
                      className="bg-background border border-white/10 focus:border-accent-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="0.000001"
                      value={formData.geo_coordinates?.longitude || ""}
                      onChange={handleChange}
                      className="bg-background border border-white/10 focus:border-accent-primary/50"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-white/10"
                >
                  Annuler
                </Button>
                <Button type="submit" className="bg-accent-primary hover:bg-accent-primary/90" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner size="sm" /> : selectedFarm ? "Mettre à jour" : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialogue de confirmation de suppression */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-background-light border border-white/10 sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-title">Confirmer la suppression</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-white/80">
                Êtes-vous sûr de vouloir supprimer la ferme "{selectedFarm?.name}" ? Cette action est irréversible.
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="border-white/10"
              >
                Annuler
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : "Supprimer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <footer className="py-8 px-4 md:px-8 lg:px-16 bg-background-light/50 backdrop-blur-md border-t border-white/5">
          <div className="container mx-auto text-center">
            <p className="text-white/60">© 2025 TriPrune - Projet JCIA Hackathon</p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default FarmPage;
