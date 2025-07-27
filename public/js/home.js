async function handleDelete(postId) {
  const confirmed = confirm("Are you sure you want to delete this post?");
  if (!confirmed) return;

  try {
    const response = await fetch(`/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      window.location.href = "/";
    }
  } catch (error) {
    console.error(error);
  }
}
