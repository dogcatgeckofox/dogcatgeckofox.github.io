const SUPABASE_URL = "https://xtrsbusvlilntkjbzawm.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_26OsfPsmtNibQ55r805QsQ_O3Z37p-Y";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function getSupabaseClient() {
    const session = await Clerk.session;

    if (!session) {
        return null;
    }

    const token = await session.getToken();

    supabase.realtime.setAuth(token);

    return supabase;
}
