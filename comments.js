const SUPABASE_URL = "https://xtrsbusvlilntkjbzawm.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_26OsfPsmtNibQ55r805QsQ_O3Z37p-Y";

const supabase = window.supabase.createClient(
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

async function initComments() {

    const commentLogin = document.getElementById("comment-login");
    const commentForm = document.getElementById("comment-form");
    const commentList = document.getElementById("comment-list");
    const postComment = document.getElementById("post-comment");
    const commentText = document.getElementById("comment-text");
    const signInButton = document.getElementById("comment-sign-in");

    if (!commentList) {
        return;
    }

    const postId = window.location.pathname;

    if (!Clerk.user) {
        commentLogin.style.display = "block";
        commentForm.style.display = "none";

        signInButton.onclick = function () {
            Clerk.openSignIn();
        };
    } else {
        commentLogin.style.display = "none";
        commentForm.style.display = "block";
    }

    async function loadComments() {

        commentList.innerHTML = "<p>Loading comments...</p>";

        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", postId)
            .order("created_at", { ascending: true });

        if (error) {
            commentList.innerHTML = "<p>Could not load comments.</p>";
            console.error(error);
            return;
        }

        if (data.length === 0) {
            commentList.innerHTML = "<p>No comments yet.</p>";
            return;
        }

        commentList.innerHTML = "";

        data.forEach(function (comment) {

            const commentBox = document.createElement("div");

            commentBox.style.border = "1px solid #333";
            commentBox.style.padding = "10px";
            commentBox.style.margin = "10px 0";
            commentBox.style.textAlign = "left";

            commentBox.innerHTML =
                "<strong>" +
                escapeHtml(comment.username) +
                "</strong>: " +
                escapeHtml(comment.content);

            commentList.appendChild(commentBox);
        });
    }

    postComment.onclick = async function () {

        const text = commentText.value.trim();

        if (!text) {
            return;
        }

        if (!Clerk.user) {
            Clerk.openSignIn();
            return;
        }

        postComment.disabled = true;

        const username =
            Clerk.user.username ||
            Clerk.user.firstName ||
            "user";

        const { error } = await supabase
            .from("comments")
            .insert({
                post_id: postId,
                username: username,
                content: text
            });

        postComment.disabled = false;

        if (error) {
            console.error(error);
            alert("Sorry, your comment could not be posted.");
            return;
        }

        commentText.value = "";

        await loadComments();
    };

    await loadComments();
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

window.initComments = initComments;
