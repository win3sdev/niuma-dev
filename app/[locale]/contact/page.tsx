"use client";

import { useTranslations } from "next-intl";
import {
  FaGithub,
  FaYoutube,
  FaInstagram,
  FaGlobe,
  FaEnvelope,
  FaTwitter,
  FaTelegramPlane, // Added Telegram icon for consistency
  FaHandshake, // For "Join Us"
  FaUsersCog, // For "Committee"
  FaQuestionCircle, // For "Why Join"
  FaLightbulb, // For "How to Join" or general contact
} from "react-icons/fa"; // Ensure you import all necessary icons

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16 space-y-12 md:space-y-20 text-base text-foreground">
      {/* Page Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-10 text-primary dark:text-primary-light animate-fade-in-up">
        {t("title")}
      </h1>

      {/* Grid Layout for Sections - Changed to lg:grid-cols-2 for wider screens */}
      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {/* Section: Join Us */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg space-y-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary cursor-pointer animate-fade-in delay-100">
          <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground border-l-4 border-amber-500 pl-4">
            <FaHandshake className="text-amber-500" /> {t("join.title")}
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t.rich("join.content", {
              strong: (chunks) => (
                <strong className="font-semibold text-foreground">
                  {chunks}
                </strong>
              ),
              a: (chunks) => (
                <a
                  href="https://t.me/whyyoutouzhele_memecoin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark underline-offset-4 hover:underline transition-colors duration-200"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in">
          <h2 className="text-2xl font-semibold border-l-4 border-gray-600 dark:border-gray-400 pl-4 mb-4">
            {t("foundation.title")}
          </h2>
          <ul className="space-y-8">
            <li>
              <p className="font-semibold text-lg mb-2">
                {t("foundation.name")}
              </p>
              <p className="flex items-center gap-2 mb-1 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                <FaTwitter />
                <a
                  href="https://twitter.com/whyyoutouzhele"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  @whyyoutouzhele
                </a>
              </p>
              <p className="flex items-center gap-2 hover:text-green-700 dark:hover:text-green-300 transition-colors">
                <FaEnvelope />
                <a
                  href="mailto:lilaoshitougao@gmail.com"
                  className="hover:underline"
                >
                  lilaoshitougao@gmail.com
                </a>
              </p>
            </li>
          </ul>
        </div>

        {/* Section: Why Join Us */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg space-y-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary cursor-pointer animate-fade-in delay-300">
          <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground border-l-4 border-purple-500 pl-4">
            <FaQuestionCircle className="text-purple-500" /> {t("why.title")}
          </h2>
          <ul className="list-disc list-inside space-y-3 text-muted-foreground">
            {["mission", "freedom", "future"].map((key) => (
              <li key={key} className="text-base">
                {t(`why.${key}`)}
              </li>
            ))}
          </ul>
        </div>

        {/* Section: How to Contact Us */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg space-y-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary cursor-pointer animate-fade-in delay-400">
          <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground border-l-4 border-sky-500 pl-4">
            <FaLightbulb className="text-sky-500" /> {t("how.title")}
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t("how.intro")}
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-base text-muted-foreground">
              <FaTelegramPlane className="text-blue-500 text-xl flex-shrink-0" />{" "}
              {/* Added Telegram icon */}
              <strong className="font-semibold text-foreground">
                Telegram：
              </strong>{" "}
              <a
                href="https://t.me/whyyoutouzhele_memecoin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark underline-offset-4 hover:underline transition-colors duration-200 break-words" // break-words for long links
              >
                {t("how.telegram")}
              </a>
            </li>
            <li className="flex items-center gap-3 text-base text-muted-foreground">
              <FaEnvelope className="text-red-500 text-xl flex-shrink-0" />{" "}
              {/* Email icon */}
              <strong className="font-semibold text-foreground">
                电子邮件：
              </strong>{" "}
              <a
                href="mailto:dev@lidao.pro"
                className="text-primary hover:text-primary-dark underline-offset-4 hover:underline transition-colors duration-200 break-words"
              >
                dev@lidao.pro
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* You can uncomment and style these sections similarly if needed in the future */}

      <section className="grid gap-10 md:grid-cols-2 lg:grid-cols-1">
        {/* Section: Committee (Our Team) */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg space-y-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary cursor-pointer animate-fade-in delay-200">
          <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground border-l-4 border-green-500 pl-4">
            <FaUsersCog className="text-green-500" /> {t("committee.title")}
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t.rich("committee.intro", {
              strong: (chunks) => (
                <strong className="font-semibold text-foreground">
                  {chunks}
                </strong>
              ),
            })}
          </p>
          <ul className="list-disc list-inside space-y-3 text-muted-foreground">
            {["visionary", "tech", "design", "rights"].map((key) => (
              <li key={key} className="text-base">
                {t.rich(`committee.roles.${key}`, {
                  strong: (chunks) => (
                    <strong className="font-semibold text-foreground">
                      {chunks}
                    </strong>
                  ),
                })}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* <section className="grid gap-10 md:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in">
          <h2 className="text-2xl font-semibold border-l-4 border-indigo-600 dark:border-indigo-400 pl-4">
            {t("jiang.title")}
          </h2>
          <p className="italic text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed my-4">
            {t("jiang.bio")}
          </p>
          <ul className="flex flex-wrap gap-6">
            <li className="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              <FaGlobe />
              <a
                href="https://chiangseeta.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                chiangseeta.org
              </a>
            </li>
            <li className="flex items-center gap-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              <FaEnvelope />
              <a
                href="mailto:chiangseeta@gmail.com"
                className="hover:underline"
              >
                chiangseeta@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in">
          <h2 className="text-2xl font-semibold border-l-4 border-gray-600 dark:border-gray-400 pl-4 mb-4">
            {t("tech.title")}
          </h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-2 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              <FaTwitter />
              <a
                href="https://twitter.com/xROx8964"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                @xROx8964
              </a>
            </li>
            <li className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors">
              <FaGithub />
              <a
                href="https://github.com/Li-DAO-Dev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                github.com/Li-DAO-Dev
              </a>
            </li>
          </ul>
        </div>
      </section> */}
    </div>
  );
}
