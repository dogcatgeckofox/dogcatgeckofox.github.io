const SUPABASE_URL = "https://xtrsbusvlilntkjbzawm.supabase.co";
const SUPABASE_KEY = "sb_publishable_26OsfPsmtNibQ55r805QsQ_O3Z37p-Y";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
        accessToken: async () => {
            if (!window.Clerk || !Clerk.session) {
                return null;
            }

            return await Clerk.session.getToken();
        }
    }
);

async function createProfile() {

    if (!Clerk.user) {
        return;
    }

    const username =
        Clerk.user.username ||
        Clerk.user.firstName ||
        "user";

    const userId = Clerk.user.id;

    const { error } = await supabaseClient
        .from("profiles")
        .upsert(
            {
                user_id: userId,
                username: username
            },
            {
                onConflict: "user_id"
            }
        );

    if (error) {
        console.error("Could not create profile:", error);
    }
}

window.createProfile = createProfile;
