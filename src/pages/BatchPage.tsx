// BatchPage.tsx - Page pour la gestion des lots de prunes
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, FileText, BarChart, Image } from "lucide-react";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../contexts/AuthContext";
import { BatchService, FarmService, PlumBatch, Farm } from "../services";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "../hooks/use-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const BatchPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [batches, setBatches] = useState<PlumBatch[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<PlumBatch | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    farm: 0,
  });

  // Récupérer la liste des lots et des fermes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [batchesData, farmsData] = await Promise.all([
          BatchService.getBatches(),
          FarmService.getFarms()
        ]);
        setBatches(batchesData);
        setFarms(farmsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les données",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Gérer les changements de sélection de ferme
  const handleFarmChange = (value: string) => {
    setFormData({
      ...formData,
      farm: parseInt(value),
    });
  };

  // Ouvrir le dialogue de création/modification
  const openDialog = (batch?: PlumBatch) => {
    if (batch) {
      setSelectedBatch(batch);
      setFormData({
        name: batch.name,
        description: batch.description,
        farm: batch.farm,
      });
    } else {
      setSelectedBatch(null);
      setFormData({
        name: "",
        description: "",
        farm: farms.length > 0 ? farms[0].id : 0,
      });
    }
    setIsDialogOpen(true);
  };

  // Ouvrir le dialogue de suppression
  const openDeleteDialog = (batch: PlumBatch) => {
    setSelectedBatch(batch);
    setIsDeleteDialogOpen(true);
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (selectedBatch) {
        // Mise à jour d'un lot existant
        await BatchService.updateBatch(selectedBatch.id, {
          name: formData.name,
          description: formData.description,
        });
        toast({
          title: "Succès",
          description: "Le lot a été mis à jour avec succès",
        });
      } else {
        // Création d'un nouveau lot
        await BatchService.createBatch(formData);
        toast({
          title: "Succès",
          description: "Le lot a été créé avec succès",
        });
      }
      
      // Rafraîchir la liste des lots
      const batchesData = await BatchService.getBatches();
      setBatches(batchesData);
      
      // Fermer le dialogue
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du lot:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du lot",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un lot
  const handleDelete = async () => {
    if (!selectedBatch) return;
    
    try {
      setIsLoading(true);
      await BatchService.deleteBatch(selectedBatch.id);
      
      // Rafraîchir la liste des lots
      const batchesData = await BatchService.getBatches();
      setBatches(batchesData);
      
      toast({
        title: "Succès",
        description: "Le lot a été supprimé avec succès",
      });
      
      // Fermer le dialogue
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression du lot:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du lot",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Naviguer vers les détails d'un lot
  const navigateToBatchDetails = (batchId: number) => {
    navigate(`/batches/${batchId}`);
  };

  // Naviguer vers les classifications d'un lot
  const navigateToBatchClassifications = (batchId: number) => {
    navigate(`/batches/${batchId}/classifications`);
  };

  // Naviguer vers la page d'ajout d'images à un lot
  const navigateToAddImages = (batchId: number) => {
    navigate(`/batches/${batchId}/add-images`);
  };

  // Obtenir le nom de la ferme à partir de son ID
  const getFarmName = (farmId: number) => {
    const farm = farms.find(f => f.id === farmId);
    return farm ? farm.name : "Ferme inconnue";
  };

  // Formater le statut pour l'affichage
  const formatStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "processing":
        return "En traitement";
      case "completed":
        return "Terminé";
      case "failed":
        return "Échoué";
      default:
        return status;
    }
  };

  // Obtenir la classe CSS pour le statut
  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300";
      case "processing":
        return "bg-blue-500/20 text-blue-300";
      case "completed":
        return "bg-green-500/20 text-green-300";
      case "failed":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
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
                Lots de Prunes
              </span>
            </h1>
            <Button 
              onClick={() => openDialog()} 
              className="bg-accent-primary hover:bg-accent-primary/90"
              disabled={farms.length === 0}
            >
              <Plus className="mr-2 h-4 w-4" /> Nouveau Lot
            </Button>
          </motion.div>

          {farms.length === 0 && !isLoading && (
            <motion.div
              className="text-center py-16 bg-background-light/30 rounded-lg border border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-white/70 mb-4">Vous devez d'abord créer une ferme avant de pouvoir créer des lots.</p>
              <Button onClick={() => navigate("/farms")} className="bg-accent-primary hover:bg-accent-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Créer une ferme
              </Button>
            </motion.div>
          )}

          {isLoading && !isDialogOpen && !isDeleteDialogOpen ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : batches.length === 0 && farms.length > 0 ? (
            <motion.div
              className="text-center py-16 bg-background-light/30 rounded-lg border border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-white/70 mb-4">Vous n'avez pas encore de lots enregistrés.</p>
              <Button onClick={() => openDialog()} className="bg-accent-primary hover:bg-accent-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Créer mon premier lot
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {batches.map((batch) => (
                <Card key={batch.id} className="bg-background-light/50 border border-white/10 hover:border-accent-primary/50 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-title">{batch.name}</CardTitle>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(batch.status)}`}>
                        {formatStatus(batch.status)}
                      </span>
                    </div>
                    <CardDescription className="text-white/60">
                      Ferme: {getFarmName(batch.farm)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-white/80 line-clamp-2 mb-4">{batch.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-white/60">
                        <div>Total: {batch.total_plums || 0} prunes</div>
                        <div>Classifications: {batch.classifications_count || 0}</div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(batch)}
                          className="border-white/10 hover:border-accent-primary/50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(batch)}
                          className="border-white/10 hover:border-red-500/50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateToAddImages(batch.id)}
                          className="border-white/10 hover:border-accent-primary/50"
                        >
                          <Image className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateToBatchClassifications(batch.id)}
                          className="border-white/10 hover:border-accent-primary/50"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateToBatchDetails(batch.id)}
                          className="border-white/10 hover:border-accent-primary/50"
                        >
                          <BarChart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Dialogue de création/modification de lot */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-background-light border border-white/10 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-title">
                {selectedBatch ? "Modifier le lot" : "Nouveau lot"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du lot</Label>
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
                  <Label htmlFor="farm">Ferme</Label>
                  <Select
                    value={formData.farm.toString()}
                    onValueChange={handleFarmChange}
                    disabled={selectedBatch !== null}
                  >
                    <SelectTrigger className="bg-background border border-white/10 focus:border-accent-primary/50">
                      <SelectValue placeholder="Sélectionner une ferme" />
                    </SelectTrigger>
                    <SelectContent className="bg-background-light border border-white/10">
                      {farms.map((farm) => (
                        <SelectItem key={farm.id} value={farm.id.toString()}>
                          {farm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedBatch && (
                    <p className="text-xs text-white/60 mt-1">La ferme ne peut pas être modifiée après la création du lot.</p>
                  )}
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
                  {isLoading ? <LoadingSpinner size="sm" /> : selectedBatch ? "Mettre à jour" : "Créer"}
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
                Êtes-vous sûr de vouloir supprimer le lot "{selectedBatch?.name}" ? Cette action est irréversible et supprimera également toutes les classifications associées.
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

export default BatchPage;
