import { handleError } from "../common-components/handleError";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";

export const useAllCatArray = () => {
  const [allCatArray, setAllCatArray] = useState([]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, subcategories, subCat1");

      if (error) throw error;

      const formatted = data
        .map((item) => ({
          name: item.name,
          subcategories: JSON.parse(item.subcategories || "[]"),
          subCat1: JSON.parse(item.subCat1 || "[]"),
        }))
        .sort((a, b) => a.id - b.id);

      setAllCatArray(formatted);
    } catch (err) {
      handleError(err, {
        prodMessage: "Error fetching categories. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return allCatArray;
};

export const specialArray = [
  {
    name: "HVAC",
    type: "Centralized AC",
    subcategories: ["Centralized"],
  },
  {
    name: "HVAC",
    type: "other",
    subcategories: [
      "Cabins",
      "Open Workspaces",
      "Meeting Rooms",
      "Public Spaces",
      "Support Spaces",
    ],
  },
  {
    name: "Civil / Plumbing",
    type: "other",
    subcategories: ["Washrooms", "Pantry"],
  },
  {
    name: "Civil / Plumbing",
    type: "Pods",
    subcategories: ["Washrooms"],
  },
];

export const category = [
  "furniture",
  "HVAC",
  "paint",
  "partitions / ceilings",
  "lux",
  "civil / plumbing",
  "flooring",
  "lighting",
  "smart solutions",
];
export const displayOptions = ["boq", "ecommerce", "both"];
