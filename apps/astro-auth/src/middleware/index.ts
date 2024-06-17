import { sequence } from "astro/middleware";

import { user } from "./user";
import { supabase } from "./supabase";
import { handleLastReferer } from "./handleLastReferer";

export const onRequest = sequence(supabase, user, handleLastReferer);