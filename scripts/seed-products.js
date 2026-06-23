import dotenv from "dotenv";
import { readFileSync } from "fs";
import { supabaseAdmin, isSupabaseConfigured } from "../server/lib/supabase.js";

dotenv.config();

if (!isSupabaseConfigured()) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const products = JSON.parse(readFileSync(new URL("./seed-products.json", import.meta.url)));

const { error } = await supabaseAdmin.from("products").upsert(products, { onConflict: "sku" });
if (error) {
  console.error(error);
  process.exit(1);
}
console.log(`Seeded ${products.length} products.`);
