import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, ChevronDown, Search, Loader2, X, Info } from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/store/useAuth";
import { useSubscribe } from "@/store/useSubscribe";
import { fetchDrugs, createDrugAlert } from "@/api/drugs";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function DrugAlert() {
  const [searchTerm, setSearchTerm] = useState("");
  const [drugs, setDrugs] = useState([]);
  const [filteredDrugs, setFilteredDrugs] = useState([]);
  const [isLoadingDrugs, setIsLoadingDrugs] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  const isAuthenticated = Boolean(token);
  const { currentSubscription } = useSubscribe();
  const isPremium =
    isAuthenticated &&
    currentSubscription &&
    currentSubscription.status === true &&
    currentSubscription.planName === "premium";

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
    <section className="w-full pb-7">
      <div className="mx-auto px-2">
        <Card className=" shadow-lg rounded-xl dark:bg-gradient-to-br dark:from-blue-900/60 dark:via-background/80 dark:to-indigo-900/60 dark:border-0 dark:shadow-2xl dark:rounded-2xl dark:backdrop-blur-md">
          <CardContent className="py-5 px-3 md:px-8 flex flex-col items-center">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center w-full md:w-auto text-center md:text-left">
              <div className="bg-primary/90 rounded-full p-2.5 mb-2 md:mb-0 shadow-md mx-auto md:mx-0">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-primary text-center md:text-left mb-1">
                  Stay Updated on When Your Target Drug Added
                </h2>
                <p className="text-muted-foreground text-sm text-center md:text-left mb-2">
                  Get instant alerts when new information becomes available
                  about your medications.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-2 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-2">
                <Select
                  open={isSelectOpen}
                  onOpenChange={setIsSelectOpen}
                  value=""
                  onValueChange={handleDrugSelect}
                  disabled={!isPremium}
                >
                  <SelectTrigger
                    className="border-gray-300 dark:border-border rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 dark:bg-background/80 backdrop-blur-sm w-full min-w-[250px] text-gray-900 dark:text-foreground"
                    disabled={!isPremium}
                  >
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
                          disabled={!isPremium}
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
                  disabled={isSubmitting || !isPremium}
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
              {!isPremium && (
                <div className="flex items-center justify-center bg-muted/40 rounded-md px-3 py-2 mt-2 text-xs text-muted-foreground">
                  <Info className="w-4 h-4 mr-2 text-primary" />
                  <span>
                    This feature is only available for Premium subscribers.
                    Please{" "}
                    {isAuthenticated ? (
                      <>
                        upgrade your subscription to{" "}
                        <span className="text-primary font-semibold">
                          Premium
                        </span>
                        .
                      </>
                    ) : (
                      <>
                        <Link
                          to="/auth/login"
                          className="text-primary underline hover:text-primary-hover"
                        >
                          log in
                        </Link>{" "}
                        to use drug alerts.
                      </>
                    )}
                  </span>
                </div>
              )}
              {/* Selected Drugs Display */}
              {selectedDrugs.length > 0 && isAuthenticated && (
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
            <p className="text-xs text-muted-foreground mt-4 text-center">
              We'll notify you about safety updates, recalls, and important drug
              information.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
