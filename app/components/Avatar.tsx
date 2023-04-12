import { formatClasses as cx } from "~/helpers";

export function Avatar({
  emailHash,
  name,
  size = "sm",
}: {
  emailHash: string;
  name?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <img
      alt={name ? name : undefined}
      className={cx(" rounded-full", {
        "h-10 w-10": size === "lg",
        "h-8 w-8": size === "md",
        "h-6 w-6": size === "sm",
      })}
      src={`https://gravatar.com/avatar/${emailHash}`}
    />
  );
}
