import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useTranslation } from "../lib/i18n";

interface VehicleFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  brand: string;
  priceRange: string;
  year: string;
  fuelType: string;
  transmission: string;
  importCountry: string;
}

export function VehicleFilters({ onFiltersChange }: VehicleFiltersProps) {
  const { t } = useTranslation();
  const [filters, setFilters] = React.useState<FilterState>({
    brand: "",
    priceRange: "",
    year: "",
    fuelType: "",
    transmission: "",
    importCountry: "",
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearch = () => {
    onFiltersChange(filters);
  };

  const brands = ["BMW", "Mercedes", "Audi", "Volkswagen", "Škoda", "Seat"];
  const priceRanges = [
    { label: "€5,000 - €10,000", value: "5000-10000" },
    { label: "€10,000 - €20,000", value: "10000-20000" },
    { label: "€20,000 - €30,000", value: "20000-30000" },
    { label: "€30,000+", value: "30000+" },
  ];
  const years = [
    { label: "2020+", value: "2020+" },
    { label: "2018-2019", value: "2018-2019" },
    { label: "2015-2017", value: "2015-2017" },
    { label: "2010-2014", value: "2010-2014" },
  ];
  const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];
  const transmissions = ["Manual", "Automatic"];
  const importCountries = ["Finland", "Germany"];

  return (
    <Card className="bg-light-gray">
      <CardContent className="p-6">
        <div className="grid md:grid-cols-6 gap-4">
          <Select onValueChange={(value) => handleFilterChange("brand", value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("inventory.filters.allBrands")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("inventory.filters.allBrands")}</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange("priceRange", value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("inventory.filters.priceRange")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("inventory.filters.priceRange")}</SelectItem>
              {priceRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange("year", value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("inventory.filters.year")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("inventory.filters.year")}</SelectItem>
              {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange("fuelType", value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Fuel Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fuel Types</SelectItem>
              {fuelTypes.map((fuel) => (
                <SelectItem key={fuel} value={fuel}>
                  {fuel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange("transmission", value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transmissions</SelectItem>
              {transmissions.map((trans) => (
                <SelectItem key={trans} value={trans}>
                  {trans}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSearch} className="btn-primary">
            <Search className="h-4 w-4 mr-2" />
            {t("inventory.filters.search")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
