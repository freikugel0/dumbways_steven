const postData = window.__POST_DATA__;
const postId = postData.id;

document
  .getElementById("edit-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    try {
      const response = await fetch(`/posts/${postId}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
    }
  });
