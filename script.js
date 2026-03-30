
// 2 fetch

function fetchUserProfile(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: "Enzo Endres",
        email: "enzoendres12@gmail.com",
        username: "Enzo123"
      });
    }, 1000);
  });
}

function fetchUserPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { postId: 1, userId, title: "Post 1", content: "Type content " },
        { postId: 2, userId, title: "Post 2", content: "Type content " },
        { postId: 3, userId, title: "Post 3", content: "Type content " }
      ]);
    }, 1500);
  });
}

function fetchPostComments(postId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {


      if (Math.random() < 0.3) { // unreliable part 
        reject(new Error("Failed to fetch comments"));
        return;
      }

      resolve([
        { commentId: 1, postId, username: "userA", comment: "Nice post!" },
        { commentId: 2, postId, username: "userB", comment: "Great content!" }
      ]);
    }, 2000);
  });
}

// 3 sequetinal

async function fetchDataSequentially(userId) {
  console.log("Starting sequential fetch...");
  const startTime = Date.now();

  try {
    const user = await fetchUserProfile(userId);
    console.log("User profile retrieved");

    const posts = await fetchUserPosts(userId);
    console.log("Posts retrieved");

    for (let post of posts) {
      try {
        const comments = await fetchPostComments(post.postId);
        post.comments = comments;
        console.log(`Comments retrieved for post ${post.postId}`);
      } catch (err) {
        console.log(`Error for post ${post.postId}: ${err.message}`);
        post.comments = [];
      }
    }

    const endTime = Date.now();
    console.log(`Sequential fetch took ${endTime - startTime}ms`);

    return { user, posts };

  } catch (error) {
    console.error("Error in sequential fetch:", error.message);
  }
}

// parallel

async function fetchDataInParallel(userId) {
  console.log("Starting parallel fetch...");
  const startTime = Date.now();

  try {
    const [user, posts] = await Promise.all([
      fetchUserProfile(userId),
      fetchUserPosts(userId)
    ]);

    console.log("User and posts retrieved simultaneously");

    const commentsPromises = posts.map(post =>
      fetchPostComments(post.postId)
        .then(comments => ({ ...post, comments }))
        .catch(err => {
          console.log(`Error for post ${post.postId}: ${err.message}`);
          return { ...post, comments: [] };
        })
    );

    const postsWithComments = await Promise.all(commentsPromises);

    const endTime = Date.now();
    console.log(`Parallel fetch took ${endTime - startTime}ms`);

    return { user, posts: postsWithComments };

  } catch (error) {
    console.error("Error in parallel fetch:", error.message);
  }
}

// 5 function

async function getUserContent(userId) {
  console.log("=== Fetching all user content ===");

  try {
    const user = await fetchUserProfile(userId);
    console.log("Step 1: User profile retrieved -", user.name);

    const posts = await fetchUserPosts(userId);
    console.log("Step 2: Posts retrieved -", posts.length);

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        try {
          const comments = await fetchPostComments(post.postId);
          return { ...post, comments };
        } catch {
          return { ...post, comments: [] };
        }
      })
    );

    console.log("Step 3: Comments retrieved");

    return {
      user,
      posts: postsWithComments
    };

  } catch (error) {
    console.error("Failed to fetch user content:", error.message);
  }
}

// 6 display

function displayResults(data, container) {
  container.innerHTML = "";

  const userDiv = document.createElement("div");
  userDiv.innerHTML = `
    <h2>${data.user.name}</h2>
    <p>Email: ${data.user.email}</p>
    <p>Username: ${data.user.username}</p>
  `;
  container.appendChild(userDiv);

  data.posts.forEach(post => {
    const postDiv = document.createElement("div");
    postDiv.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
    `;

    const commentsList = document.createElement("ul");

    post.comments.forEach(comment => {
      const li = document.createElement("li");
      li.textContent = `${comment.username}: ${comment.comment}`;
      commentsList.appendChild(li);
    });

    postDiv.appendChild(commentsList);
    container.appendChild(postDiv);
  });
}

// Events

const output = document.getElementById("output");

document.getElementById("sequentialBtn").addEventListener("click", async () => {
  output.innerHTML = "Loading sequential...";
  const data = await fetchDataSequentially(1);
  displayResults(data, output);
});

document.getElementById("parallelBtn").addEventListener("click", async () => {
  output.innerHTML = "Loading parallel...";
  const data = await fetchDataInParallel(1);
  displayResults(data, output);
});