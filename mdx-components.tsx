import { readFileSync } from "node:fs";
import { join } from "node:path";
import { imageSize } from "image-size";
import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";

function dimensions(src: string) {
  const { width, height } = imageSize(
    readFileSync(join(process.cwd(), "public", src)),
  );
  return { width, height };
}

type PostImageProps = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  /** Path under public/. An .mp4 needs a .jpg poster with the same name. */
  src: string;
  alt: string;
  /** For the LCP image only: loads eagerly with high priority. */
  eager?: boolean;
};

/** Server-only image or video with real dimensions, read at build time. */
export function PostImage({ src, alt, eager, ...props }: PostImageProps) {
  if (src.endsWith(".mp4")) {
    const poster = src.replace(/mp4$/, "jpg");
    return (
      <video
        src={src}
        poster={poster}
        {...dimensions(poster)}
        aria-label={alt}
        controls
        muted
        loop
        playsInline
        preload="none"
        // preload="none" does not cover the poster; this does, where supported.
        {...{ loading: "lazy" }}
        className={props.className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      {...dimensions(src)}
      // The post text column is at most 672px wide.
      sizes="(max-width: 768px) calc(100vw - 56px), 672px"
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      {...props}
    />
  );
}

const components: MDXComponents = {
  img: ({ src, alt, title }) => (
    <PostImage src={String(src)} alt={alt ?? ""} title={title} />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
