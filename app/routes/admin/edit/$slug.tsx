import {
  useActionData,
  redirect,
  Form,
  useTransition,
  LoaderFunction,
  useLoaderData,
} from "remix";
import invariant from "tiny-invariant";
import type { ActionFunction } from "remix";

import { createPost, getPost, getPostAsRaw } from "~/post";

type PostError = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));

  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  // TODO: This validation is duplicate of admin/new.tsx. How can we reuse it?
  const errors: PostError = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");
  await createPost({ title, slug, markdown });

  return redirect("/admin");
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return getPostAsRaw(params.slug);
};

export default function NewPost() {
  const errors = useActionData();
  const transition = useTransition();
  const post = useLoaderData();

  return (
  // TODO: This validation is duplicate of admin/new.tsx. How can we reuse it?
    <Form method="post">
      <p>
        <label>
          Post Title: {errors?.title ? <em>Title is required</em> : null}
          <input type="text" name="title" defaultValue={post.title} />
        </label>
      </p>
      <p>
        <label>
          Post Slug: {errors?.slug ? <em>Slug is required</em> : null}
          <input type="text" name="slug" defaultValue={post.slug} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>{" "}
        {errors?.markdown ? <em>Markdown is required</em> : null}
        <br />
        <textarea id="markdown" rows={20} name="markdown" defaultValue={post.body} />
      </p>
      <p>
        <button type="submit">
          {transition.submission ? "Editing..." : "Edit Post"}
        </button>
      </p>
    </Form>
  );
}
