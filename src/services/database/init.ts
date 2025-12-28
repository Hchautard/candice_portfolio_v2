import supabase from "../../utils/supabase";

export const initDatabase = async () => {
  // Example: Check if the connection to the database is successful
  const { data, error } = await supabase.from("reviews").select("*");

  if (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Database initialization failed");
  }

  console.log("Database initialized successfully:", data);
};