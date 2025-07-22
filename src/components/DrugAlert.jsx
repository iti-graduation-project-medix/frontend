import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, ChevronDown, Search, Loader2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/store/useAuth";
import { fetchDrugs, createDrugAlert } from "@/api/drugs";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

export function DrugAlert() {
  const [searchTerm, setSearchTerm] = useState("");
  const [drugs, setDrugs] = useState([]);
  const [filteredDrugs, setFilteredDrugs] = useState([]);
  const [isLoadingDrugs, setIsLoadingDrugs] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();

  // Async search function
  const searchDrugs = useCallback(
    async (searchValue) => {
      if (!token) return;
      try {
        setIsLoadingDrugs(true);
        const response = await fetchDrugs(token, {
          search: searchValue,
          size: 20,
        });
        setFilteredDrugs(response.data?.drugs || []);
      } catch (error) {
        setFilteredDrugs([]);
      } finally {
        setIsLoadingDrugs(false);
      }
    },
    [token]
  );

  // Debounced search
  const debouncedSearch = useDebounce(searchDrugs, 300);

  // Load initial drugs
  useEffect(() => {
    const loadInitialDrugs = async () => {
      if (!token) return;
      try {
        setIsLoadingDrugs(true);
        const response = await fetchDrugs(token, { size: 20 });
        setDrugs(response.data?.drugs || []);
        setFilteredDrugs(response.data?.drugs || []);
      } catch (error) {
        setDrugs([]);
        setFilteredDrugs([]);
      } finally {
        setIsLoadingDrugs(false);
      }
    };
    loadInitialDrugs();
  }, [token]);

  // Handle search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm);
    } else {
      setFilteredDrugs(drugs);
    }
  }, [searchTerm, drugs, debouncedSearch]);

  // Handle drug selection
  const handleDrugSelect = (drugName) => {
    if (!selectedDrugs.includes(drugName)) {
      setSelectedDrugs([...selectedDrugs, drugName]);
    }
    setSearchTerm("");
    setIsSelectOpen(false);
  };

  // Remove drug from selection
  const removeDrug = (drugName) => {
    setSelectedDrugs(selectedDrugs.filter((drug) => drug !== drugName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedDrugs.length === 0) {
      toast.error("Please select at least one drug to create an alert");
      return;
    }

    try {
      setIsSubmitting(true);
      await createDrugAlert(token, { drugNames: selectedDrugs });

      toast.success("Drug alerts created successfully!", {
        description: `You'll be notified about updates for ${
          selectedDrugs.length
        } drug${selectedDrugs.length > 1 ? "s" : ""}`,
      });

      setSelectedDrugs([]);
    } catch (error) {
      console.error("Error creating drug alert:", error);
      toast.error("Failed to create drug alerts", {
        description: error.response?.data?.message || "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full py-6">
      <div className="mx-auto px-4">
        <Card className="bg-muted/20 backdrop-blur-sm shadow-lg border border-border">
          <CardContent className="py-8 px-4 md:px-8 flex flex-col items-center">
            <div className="w-full flex flex-col items-center">
              <div className="flex flex-row items-center justify-center w-full gap-4 mb-2">
                <span className="hidden sm:inline-flex items-center justify-center rounded-full bg-primary/80 text-white" style={{ width: 48, height: 48, minWidth: 48, minHeight: 48 }}>
                  <Bell className="w-7 h-7" />
                </span>
                <div className="flex flex-col items-start justify-center">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                    Stay Updated on When Your Target Drug Added
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Get instant alerts when new information becomes available about your medications
                  </p>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Select
                  open={isSelectOpen}
                  onOpenChange={setIsSelectOpen}
                  value=""
                  onValueChange={handleDrugSelect}
                >
                  <SelectTrigger className="border-gray-300 dark:border-border rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 dark:bg-background/80 backdrop-blur-sm w-full min-w-[250px] text-gray-900 dark:text-foreground">
                    <SelectValue placeholder="Select drugs" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 bg-white dark:bg-card border border-gray-100 dark:border-border">
                    <div className="p-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                        <Input
                          placeholder="Search for drug..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 border-gray-300 dark:border-border rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white dark:bg-background text-gray-900 dark:text-foreground"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {isLoadingDrugs ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary dark:text-primary" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {searchTerm.trim()
                              ? "Searching..."
                              : "Loading drugs..."}
                          </span>
                        </div>
                      ) : filteredDrugs.length > 0 ? (
                        filteredDrugs
                          .filter(
                            (drug) => !selectedDrugs.includes(drug.drugName)
                          )
                          .map((drug) => (
                            <SelectItem
                              key={drug.id}
                              value={drug.drugName}
                              className="dark:text-foreground"
                            >
                              <div>
                                <div className="font-medium">
                                  {drug.drugName}
                                </div>
                              </div>
                            </SelectItem>
                          ))
                      ) : searchTerm.trim() ? (
                        <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          No drugs found for "{searchTerm}"
                        </div>
                      ) : drugs.length === 0 ? (
                        <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          No drugs available
                        </div>
                      ) : (
                        <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          Start typing to search for drugs
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  className="whitespace-nowrap dark:bg-primary dark:hover:bg-primary-hover"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Alert Me"
                  )}
                </Button>
              </div>

              {/* Selected Drugs Display */}
              {selectedDrugs.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedDrugs.map((drug) => (
                    <Badge
                      key={drug}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-muted text-gray-900 dark:text-foreground border border-gray-200 dark:border-border"
                    >
                      {drug}
                      <button
                        type="button"
                        onClick={() => removeDrug(drug)}
                        className="ml-1 hover:bg-gray-300 dark:hover:bg-muted/30 rounded-full p-0.5"
                        disabled={isSubmitting}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </form>
            <p className="text-xs text-muted-foreground dark:text-gray-400 mt-4">
              We'll notify you about safety updates, recalls, and important drug
              information.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
