import { redirect } from "next/navigation";

/** Avoid 404 + repeated RSC fetches on `/login`; real page is `/auth/login`. */
export default function LoginAliasPage() {
  redirect("/auth/login");
}
