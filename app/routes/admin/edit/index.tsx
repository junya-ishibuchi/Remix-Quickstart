import { Link, useLoaderData } from "remix";
import { getPosts, Post } from "~/post";

export const loader = async () => {
    return getPosts();
}

export default function EditList() {
  const posts = useLoaderData<Post[]>();
  // TODO: This is a duplicate of posts/index.tsx. How can we reuse it?
  return (
    <div>
      <h1>Which post do you want edit?</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
