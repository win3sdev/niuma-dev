"use client";

import Link from "next/link";
import {
  FaClock,
  FaHandsHelping,
  FaArrowRight,
  FaBuilding,
  FaGavel,
  FaLightbulb,
  FaUsers,
  FaBullhorn,
} from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <div className="mx-auto px-4 py-12 space-y-16 text-base text-foreground">
      <section className="text-center space-y-6 animate-fade-in mb-16 px-4 py-8 md:py-16 bg-gradient-to-br from-background via-card to-background rounded-b-3xl shadow-xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-6xl md:text-7xl leading-tight">
          {t("home.hero.title")}
        </h1>

        <p className="text-5xl font-bold text-foreground mt-5 sm:text-5xl">
          {t("home.hero.subtitle")}
        </p>

        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          <FaUsers className="inline-block text-blue-500 mr-2" />
          {t("home.hero.tmp1")}{" "}
          <strong className="text-primary">{t("home.hero.tmp2")}</strong>{" "}
          {t("home.hero.tmp3")}
          <strong className="text-primary">{t("home.hero.tmp4")}</strong>{" "}
          {t("home.hero.tmp5")}
          <strong className="text-primary">{t("home.hero.tmp6")}</strong>
          {t("home.hero.tmp7")}
          <strong className="text-primary">{t("home.hero.tmp8")}</strong>
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href={`/${locale}/submit`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 border border-primary text-lg font-medium rounded-lg shadow-md text-primary bg-background hover:bg-muted transition-all duration-300 transform hover:scale-105"
          >
            {t("home.hero.buttonExpose")}
            <FaBullhorn className="ml-2 -mr-1 h-6 w-6" />
          </Link>
          <Link
            href={`/${locale}/display`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 border border-primary text-lg font-medium rounded-lg shadow-md text-primary bg-background hover:bg-muted transition-all duration-300 transform hover:scale-105"
          >
            {t("home.hero.buttonView")}
            <FaArrowRight className="ml-2 -mr-1 h-6 w-6" />
          </Link>
        </div>
      </section>

      <hr className="border-t border-muted-foreground/20" />

      <section className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        <div
          className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in"
          tabIndex={0}
          aria-label="核心理念卡片"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
            <FaUsers className="text-blue-500 bg-blue-100 dark:bg-blue-900 rounded-full p-2 w-10 h-10" />
            {t("home.card1.title")}
          </h2>
          <p className="text-lg leading-relaxed">
            <strong>$LI</strong> {t("home.card1.tmp1")}
            <span className="text-primary font-medium">
              {t("home.card1.tmp2")}
            </span>
            {t("home.card1.tmp3")} <strong>{t("home.card1.tmp4")}</strong>
            {t("home.card1.tmp5")}
          </p>
        </div>

        <div
          className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in"
          tabIndex={0}
          aria-label="牛马 ICU 项目介绍卡片"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 text-red-600">
            <FaBuilding className="text-red-500 bg-red-100 dark:bg-red-900 rounded-full p-2 w-10 h-10" />
            {t("home.card2.title")}
          </h2>

          <p className="text-lg leading-relaxed">
            {t.rich("home.card2.description", {
              strong: (chunks) => (
                <strong className="text-primary">{chunks}</strong>
              ),
            })}
          </p>

          <p className="text-base text-muted-foreground italic">
            {t("home.card2.note")}
          </p>
        </div>

        <div
          className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in"
          tabIndex={0}
          aria-label="团结一致卡片"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 text-purple-600">
            <FaGavel className="text-purple-500 bg-purple-100 dark:bg-purple-900 rounded-full p-2 w-10 h-10" />
            {t("home.solidarityCard.title")}
          </h2>

          <p className="text-lg leading-relaxed">
            {t.rich("home.solidarityCard.description", {
              strong: (chunks) => (
                <strong className="text-primary">{chunks}</strong>
              ),
            })}
          </p>

          <p className="font-extrabold text-xl text-center text-primary-foreground bg-primary px-4 py-2 rounded-lg mt-4 shadow-inner">
            {t("home.solidarityCard.slogan")}
          </p>
        </div>

        <div
          className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in md:col-span-1 lg:col-span-1"
          tabIndex={0}
          aria-label="牛马 ICU 项目背景卡片"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 text-pink-600">
            <FaLightbulb className="text-pink-500 bg-pink-100 dark:bg-pink-900 rounded-full p-2 w-10 h-10" />
            {t("home.backgroundCard.title")}
          </h2>

          <p className="text-lg leading-relaxed">
            {t.rich("home.backgroundCard.description", {
              strong: (chunks) => (
                <strong className="text-primary">{chunks}</strong>
              ),
            })}
          </p>

          <p className="font-bold text-xl text-destructive mt-4">
            {t("home.backgroundCard.slogan")}
          </p>
        </div>

        <div
          className="rounded-2xl border bg-card p-6 shadow-md space-y-6 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in md:col-span-2 lg:col-span-2"
          tabIndex={0}
          aria-label="如何参与卡片"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 text-green-600">
            <FaHandsHelping className="text-green-500 bg-green-100 dark:bg-green-900 rounded-full p-2 w-10 h-10" />
            {t("home.actionCard.title")}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href={`/${locale}/submit`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <FaClock className="text-yellow-500 mr-3 text-2xl group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-semibold text-lg text-foreground">
                  {t("home.actionCard.submit.title")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("home.actionCard.submit.desc")}
                </p>
              </div>
              <FaArrowRight className="ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href={`/${locale}/display`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <FaBullhorn className="text-orange-500 mr-3 text-2xl group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-semibold text-lg text-foreground">
                  {t("home.actionCard.view.title")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("home.actionCard.view.desc")}
                </p>
              </div>
              <FaArrowRight className="ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="https://牛马.icu"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <FaLightbulb className="text-indigo-500 mr-3 text-2xl group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-semibold text-lg text-foreground">
                  {t("home.actionCard.official.title")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("home.actionCard.official.desc")}
                </p>
              </div>
              <FaArrowRight className="ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="http://work2icu.org"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <FaArrowRight className="text-cyan-500 mr-3 text-2xl group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-semibold text-lg text-foreground">
                  {t("home.actionCard.backup.title")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("home.actionCard.backup.desc")}
                </p>
              </div>
              <FaArrowRight className="ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
