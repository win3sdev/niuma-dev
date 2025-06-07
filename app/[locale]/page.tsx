"use client";

import Link from "next/link";
import {
  FaUserShield,
  FaClock,
  FaHandsHelping,
  FaBullseye,
  FaHeart,
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
          你的境遇，掷地有声
        </h1>

        <p className="text-5xl font-bold text-foreground mt-5 sm:text-5xl">
          牛马ICU | $Li
        </p>

        

        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          <FaUsers className="inline-block text-blue-500 mr-2" />
          本项目由 <strong className="text-primary">$Li社区团队</strong>{" "}
            运营，在极权环境中，<strong className="text-primary">$LI 社区</strong>{" "}
          致力于
          <strong className="text-primary">
            捍卫人权、新闻自由与言论自由。
          </strong>
          我们凝聚共识，共同推动这些核心价值的实现，让每一位劳动者都能
          <strong className="text-primary">活得有尊严。</strong>
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="https://牛马.icu/form"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 border border-primary text-lg font-medium rounded-lg shadow-md text-primary bg-background hover:bg-muted transition-all duration-300 transform hover:scale-105"
          >
            立即曝光血汗公司
            <FaBullhorn className="ml-2 -mr-1 h-6 w-6" />
          </Link>
          <Link
            href="https://牛马.icu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 border border-primary text-lg font-medium rounded-lg shadow-md text-primary bg-background hover:bg-muted transition-all duration-300 transform hover:scale-105"
          >
            了解更多项目详情
            <FaArrowRight className="ml-2 -mr-1 h-6 w-6" />
          </Link>
        </div>
      </section>

      <hr className="border-t border-muted-foreground/20" />

      {/* Main Content Grid */}
      <section className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {/* 核心理念卡片 */}
        <div
          className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in"
          tabIndex={0}
          aria-label="核心理念卡片"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
            <FaUsers className="text-blue-500 bg-blue-100 dark:bg-blue-900 rounded-full p-2 w-10 h-10" />
            社区核心理念
          </h2>
          <p className="text-lg leading-relaxed">
            <strong>$LI</strong> 希望建设一个
            独一无二的社区，在中国这样的极权环境中，
            <span className="text-primary font-medium">
              捍卫人权、新闻自由与言论自由。
            </span>
            随着 <strong>$LI 社区的壮大</strong>
            ，我们希望凝聚共识，共同推动这些核心价值的实现。
          </p>
        </div>

        {/* 牛马 ICU 项目介绍卡片 */}
        <div
          className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in"
          tabIndex={0}
          aria-label="牛马 ICU 项目介绍卡片"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 text-red-600">
            <FaBuilding className="text-red-500 bg-red-100 dark:bg-red-900 rounded-full p-2 w-10 h-10" />
            “牛马 ICU”——曝光血汗公司
          </h2>
          <p className="text-lg leading-relaxed">
            Li 社区最新发起的项目——
            <strong className="text-primary">“牛马 ICU”</strong>
            ，旨在收集全国超时工作公司的名单，让公众了解哪些企业在压榨劳动者，并以此向相关部门施压，敦促他们履行职责，
            <strong className="text-primary">改善中国劳工的生存环境。</strong>
          </p>
          <p className="text-base text-muted-foreground italic">
            如果你或你身边的人曾遭遇过超时工作、无偿加班、恶劣的工作条件，你可以匿名登记这些公司的信息，帮助更多的劳动者规避这些“血汗工厂”，并共同推动社会进步。
          </p>
        </div>

        {/* 团结一致卡片 */}
        <div
          className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in"
          tabIndex={0}
          aria-label="团结一致卡片"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 text-purple-600">
            <FaGavel className="text-purple-500 bg-purple-100 dark:bg-purple-900 rounded-full p-2 w-10 h-10" />
            团结一致，推动变革
          </h2>
          <p className="text-lg leading-relaxed">
            如果劳动部门和工会选择视而不见，那就让我们团结一致，
            <strong className="text-primary">逼迫他们完成本职工作</strong>
            。每一份登记、每一次曝光，都是向血汗企业和不作为的机构施加压力的一步。
          </p>
          <p className="font-extrabold text-xl text-center text-primary-foreground bg-primary px-4 py-2 rounded-lg mt-4 shadow-inner">
            让“牛马”活得像人，而不是机器！
          </p>
        </div>

        {/* 牛马 ICU 项目背景卡片 - Full width on small, then fills remaining columns */}
        <div
          className="rounded-2xl border bg-card p-6 shadow-md space-y-4 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in md:col-span-1 lg:col-span-1"
          tabIndex={0}
          aria-label="牛马 ICU 项目背景卡片"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 text-pink-600">
            <FaLightbulb className="text-pink-500 bg-pink-100 dark:bg-pink-900 rounded-full p-2 w-10 h-10" />
            项目发起与宗旨
          </h2>
          <p className="text-lg leading-relaxed">
            <strong className="text-primary">牛马ICU</strong> 是由{" "}
            <strong className="text-primary">「$Li 社区」</strong>与
            <strong className="text-primary">「李老师不是你老师」</strong>
            发起的公益项目，我们希望调查曝光中国国内存在的一切剥削打工人的恶劣行为！
          </p>
          <p className="font-bold text-xl text-destructive mt-4">
            拒绝996！拒绝无休止加班！拒绝剥削！拒绝压榨！拒绝压迫！拒绝一切不平等的待遇！
          </p>
        </div>

        {/* 如何参与？卡片 - Spans two columns on medium, three on large to occupy remaining space */}
        <div
          className="rounded-2xl border bg-card p-6 shadow-md space-y-6 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer animate-fade-in md:col-span-2 lg:col-span-2"
          tabIndex={0}
          aria-label="如何参与卡片"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 text-green-600">
            <FaHandsHelping className="text-green-500 bg-green-100 dark:bg-green-900 rounded-full p-2 w-10 h-10" />
            立即参与，共同行动！
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="https://牛马.icu/form"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <FaClock className="text-yellow-500 mr-3 text-2xl group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-semibold text-lg text-foreground">
                  登记血汗公司
                </p>
                <p className="text-sm text-muted-foreground">
                  填写问卷，提交超时工作企业名单
                </p>
              </div>
              <FaArrowRight className="ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="https://www.牛马.icu/zh-CN/results"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <FaBullhorn className="text-orange-500 mr-3 text-2xl group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-semibold text-lg text-foreground">
                  查看血汗公司名单
                </p>
                <p className="text-sm text-muted-foreground">
                  了解哪些企业存在超时工作问题
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
                  访问项目官网
                </p>
                <p className="text-sm text-muted-foreground">
                  获取更多信息，关注最新动态
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
                  备用英文域名
                </p>
                <p className="text-sm text-muted-foreground">
                  如遇访问障碍，请使用此链接
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
