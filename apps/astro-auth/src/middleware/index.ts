import { sequence } from "astro/middleware";

import { user } from "./user";
import { supabase } from "./supabase";

export const onRequest = sequence(supabase, user);