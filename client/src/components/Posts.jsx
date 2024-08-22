import Post from "./Post";

function Posts() {
  return (
    <div>
      {[1, 2, 3, 4].map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
}

export default Posts;
