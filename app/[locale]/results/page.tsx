import { redirect } from "next/navigation";
import { useLocale } from "next-intl";

export default function ResultsPage({}) {
  const locale = useLocale();
  redirect(`/${locale}/display`);

  // 
  return null;
}
