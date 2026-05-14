"use client";

import { motion } from "framer-motion";
import { BiSolidLeaf } from "react-icons/bi";
import {
  SiOpenai,
  SiWhatsapp,
  SiHubspot,
  SiStripe,
  SiSlack,
  SiZapier,
  SiGmail,
  SiSupabase,
} from "react-icons/si";
import {
  MdDashboard,
  MdSpeed,
  MdTrendingUp,
  MdAutoAwesome,
} from "react-icons/md";
import { HiArrowRight, HiCheckCircle, HiSparkles } from "react-icons/hi2";
import { FiArrowUpRight } from "react-icons/fi";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.23, 1, 0.82, 0.67] },
  },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    company_name: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.from("waitlist").insert([formData]);

    setLoading(false);

    if (error) {
      console.log(error);
      alert("Something went wrong.");
      return;
    }

    await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: formData.full_name,
        email: formData.email,
      }),
    });

    setSuccess(true);

    setFormData({
      full_name: "",
      email: "",
      company_name: "",
      message: "",
    });

    setLoading(false);

    setTimeout(() => {
      setShowModal(false);

      setTimeout(() => {
        setSuccess(false);
      }, 300);
    }, 3000);

    return;

    // setFormData({
    //   full_name: "",
    //   email: "",
    //   company_name: "",
    //   message: "",
    // });

    // setShowModal(false);
  };

  return (
    <main className="bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        className="sticky top-0 z-50 border-b border-primary/5 bg-background/60 backdrop-blur-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <BiSolidLeaf className="w-7 h-7 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              SolarFlow
            </span>
          </motion.div>

          <div className="hidden md:flex gap-8">
            {["Features", "Pricing", "About", "Contact"].map((item) => (
              <motion.a
                key={item}
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                whileHover={{ scale: 1.05 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          <div className="flex gap-3">
            <motion.button
              className="hidden sm:block px-5 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
            <motion.button
              className="px-5 py-2 text-sm font-semibold bg-primary text-foreground rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-40 right-1/4 w-72 h-72 rounded-full bg-primary/20 blur-3xl opacity-40 animate-pulse" />
        <div
          className="absolute bottom-40 left-1/4 w-96 h-96 rounded-full bg-accent/15 blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <HiSparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">
              Smart Lead Automation for Solar Companies
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl sm:text-7xl lg:text-8xl font-bold text-balance leading-tight text-foreground"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Close More Solar Deals{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              with One CRM
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-balance font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Capture solar leads, manage your sales pipeline, automate
            follow-ups, and convert more prospects into paying customers all
            from one powerful CRM platform.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <>
              {/* CTA Button */}
              <motion.button
                onClick={() => setShowModal(true)}
                className="group relative px-8 py-4 font-semibold rounded-lg bg-primary text-foreground overflow-hidden"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative flex items-center justify-center gap-2">
                  Start Free Trial
                  <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              {/* Modal */}
              <AnimatePresence>
                {showModal && (
                  <motion.div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 backdrop-blur-md px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Modal Card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 40 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 40 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      className="
          relative
          w-full
          max-w-lg
          overflow-hidden
          rounded-3xl
          border
          border-primary/30
          bg-[#111111]/95
          backdrop-blur-3xl
          p-8
          shadow-[0_0_120px_rgba(0,255,140,0.25)]
        "
                    >
                      {/* Close Button */}
                      <button
                        onClick={() => setShowModal(false)}
                        className="
            absolute
            top-5
            right-5
            z-[999]
            flex
            items-center
            justify-center
            w-10
            h-10
            rounded-full
            border
            border-white/10
            bg-white/5
            text-white
            text-lg
            backdrop-blur-xl
            transition-all
            hover:bg-primary/20
            hover:border-primary/40
            hover:scale-110
          "
                      >
                        ✕
                      </button>

                      {/* Content */}
                      <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-3">
                          Join the Waitlist
                        </h2>

                        <p className="text-gray-300 mb-6">
                          Automate solar lead capture and follow-ups.
                        </p>

                        {success ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-10 text-center"
                          >
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                              <span className="text-4xl text-primary">✓</span>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">
                              You’re on the list!
                            </h3>

                            <p className="text-gray-400">
                              We’ll notify you once SolarFlow launches.
                            </p>
                          </motion.div>
                        ) : (
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={formData.full_name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  full_name: e.target.value,
                                })
                              }
                              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                            />

                            <input
                              type="email"
                              placeholder="Email Address"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                            />

                            <input
                              type="text"
                              placeholder="Company Name"
                              value={formData.company_name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  company_name: e.target.value,
                                })
                              }
                              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                            />

                            <textarea
                              placeholder="Tell us about your solar business..."
                              rows={4}
                              value={formData.message}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  message: e.target.value,
                                })
                              }
                              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                            />

                            <motion.button
                              type="submit"
                              disabled={loading}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full rounded-xl bg-primary py-4 font-semibold text-black disabled:opacity-50"
                            >
                              {loading ? "Joining..." : "Join Waitlist"}
                            </motion.button>
                          </form>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>

            <motion.button
              className="px-8 py-4 font-semibold border border-primary/30 text-foreground rounded-lg hover:bg-primary/5 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            14-day free trial • No credit card required
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 pt-8 opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {["Tesla Energy", "SunPeak", "GreenVolt", "EcoGrid"].map(
              (brand) => (
                <div
                  key={brand}
                  className="text-sm font-semibold tracking-widest text-muted-foreground"
                >
                  {brand}
                </div>
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden border border-primary/20 bg-gradient-to-b from-card/60 to-transparent backdrop-blur-xl p-2"
          >
            <div className="relative rounded-3xl overflow-hidden bg-background/80">
              <Image
                src="/hero-product.jpg"
                alt="SolarFlow AI Dashboard"
                width={1400}
                height={800}
                className="w-full h-auto rounded-3xl object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/10 to-transparent blur-3xl opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.p
              className="text-primary text-sm font-semibold tracking-wide uppercase mb-4"
              variants={itemVariants}
            >
              Features
            </motion.p>
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance text-foreground"
              variants={itemVariants}
            >
              Powerful Tools for Solar Sales Teams
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Capture leads, track conversations, manage follow-ups, and
              organize your entire solar sales workflow from one centralized
              platform.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {[
              {
                icon: MdDashboard,
                title: "Lead Pipeline Management",
                features: [
                  "Drag-and-drop sales stages",
                  "Real-time lead tracking",
                  "Centralized customer pipeline",
                ],
              },
              {
                icon: MdAutoAwesome,
                title: "Smart Sales Automation",
                features: [
                  "Automated follow-up reminders",
                  "AI-ready lead qualification",
                  "WhatsApp & email workflows",
                ],
              },
              {
                icon: MdTrendingUp,
                title: "Analytics & Reporting",
                features: [
                  "Conversion tracking",
                  "Sales performance insights",
                  "Lead source analytics",
                ],
              },
              {
                icon: BiSolidLeaf,
                title: "Team Collaboration",
                features: [
                  "Assign leads to team members",
                  "Internal notes & activity logs",
                  "Multi-user CRM access",
                ],
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ x: 8 }}
                  className="group p-8 rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-accent/5 hover:border-primary/30 transition-all duration-300"
                >
                  <Icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {feature.title}
                  </h3>
                  <ul className="space-y-2">
                    {feature.features.map((f, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-2 text-muted-foreground text-sm"
                      >
                        <HiCheckCircle className="w-4 h-4 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-primary/3 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance text-foreground mb-6"
              variants={itemVariants}
            >
              Sales Intelligence Dashboard
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Track leads, monitor team activity, manage follow-ups, and gain
              real-time visibility into your entire solar sales pipeline.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.82, 0.67] }}
            className="relative rounded-3xl border border-primary/30 bg-gradient-to-br from-card/70 via-card/40 to-background/50 backdrop-blur-2xl p-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 pointer-events-none rounded-3xl" />
            <div className="relative rounded-3xl overflow-hidden bg-background/60 border border-primary/10">
              <Image
                src="/dashboard-preview.jpg"
                alt="SolarFlow Dashboard"
                width={1400}
                height={800}
                className="w-full h-auto object-cover rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50 rounded-3xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.p
              className="text-primary text-sm font-semibold tracking-wide uppercase mb-4"
              variants={itemVariants}
            >
              Testimonials
            </motion.p>
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance text-foreground"
              variants={itemVariants}
            >
              Trusted by Growing Solar Teams
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Solar companies use SolarFlow to capture leads, streamline
              follow-ups, and manage their entire sales workflow from one
              platform.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {[
              {
                quote:
                  "SolarFlow helped our sales team organize incoming leads and follow up faster. We stopped losing opportunities in spreadsheets.",
                author: "Sarah Chen",
                role: "Operations Director, GreenTech Energy",
                initials: "SC",
                rating: 5,
              },
              {
                quote:
                  "The pipeline system made it easy to track prospects from inquiry to closed deal. Our workflow became much more efficient.",
                author: "Mike Johnson",
                role: "CEO, Solar Solutions Ltd",
                initials: "MJ",
                rating: 5,
              },
              {
                quote:
                  "We finally have one place to manage leads, reminders, team notes, and customer conversations. It simplified everything.",
                author: "Emma Davis",
                role: "Plant Manager, Renewable Corp",
                initials: "ED",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-card/50 to-background/30 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 pointer-events-none transition-all duration-300" />

                <div className="relative z-10">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="text-primary text-lg"
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>

                  <p className="text-foreground font-medium mb-8 text-lg leading-relaxed">
                    {testimonial.quote}
                  </p>

                  <div className="flex items-center gap-4 pt-6 border-t border-primary/10">
                    <motion.div
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-foreground shadow-lg shadow-primary/20"
                      whileHover={{ scale: 1.1 }}
                    >
                      {testimonial.initials}
                    </motion.div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {testimonial.author}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10 pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.p
              className="text-primary text-sm font-semibold tracking-wide uppercase mb-4"
              variants={itemVariants}
            >
              Pricing
            </motion.p>

            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance text-foreground"
              variants={itemVariants}
            >
              Simple, Transparent Pricing
            </motion.h2>

            <motion.p
              className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Built for solar companies that want to automate lead capture,
              follow-ups, and pipeline tracking without increasing sales
              headcount.
            </motion.p>

            <motion.p
              className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto"
              variants={itemVariants}
            >
              Businesses using SolarFlow typically recover their monthly cost
              after closing just 1–2 additional deals.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {[
              {
                name: "Starter",
                price: "$299",
                description:
                  "For small solar teams starting to organize leads and automate basic follow-ups.",
                features: [
                  "Manage up to 5 solar facilities",
                  "Real-time lead tracking dashboard",
                  "Email support for onboarding",
                ],
              },
              {
                name: "Growth",
                price: "$799",
                highlight: true,
                description:
                  "Most popular for growing solar companies scaling installations and improving conversion rates.",
                features: [
                  "Manage up to 20 facilities",
                  "Predictive maintenance alerts to reduce downtime",
                  "Priority support with faster response time",
                  "Full API access for custom automation workflows",
                ],
              },
              {
                name: "Enterprise",
                price: "Custom",
                description:
                  "For large solar operations that need full-scale CRM infrastructure and custom integrations.",
                features: [
                  "Unlimited facilities and pipeline scaling",
                  "Custom CRM + enterprise system integrations",
                  "Dedicated account manager",
                  "Enterprise SLA with uptime guarantees",
                ],
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                  plan.highlight
                    ? "border-primary/50 bg-gradient-to-br from-primary/10 to-accent/5 shadow-lg shadow-primary/10"
                    : "border-primary/10 bg-card/30 backdrop-blur-sm"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-6 px-3 py-1 bg-primary text-foreground text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>

                <p className="text-sm text-muted-foreground mb-5">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground ml-2">/month</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-3 text-muted-foreground text-sm"
                    >
                      <HiCheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.highlight
                      ? "bg-primary text-foreground hover:shadow-lg hover:shadow-primary/30"
                      : "border border-primary/30 text-foreground hover:bg-primary/5"
                  }`}
                >
                  {plan.highlight ? "Start Scaling" : "Get Started"}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-primary text-sm font-semibold uppercase mb-4">
            Integrations
          </p>

          <h2 className="text-5xl font-bold mb-4">Connect Your Workflow</h2>

          <p className="text-gray-400 max-w-2xl mx-auto mb-14">
            Integrate SolarFlow with your favorite tools for automation,
            communication, payments, AI workflows, and CRM operations.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "OpenAI",
                icon: SiOpenai,
              },
              {
                name: "WhatsApp",
                icon: SiWhatsapp,
              },
              {
                name: "HubSpot",
                icon: SiHubspot,
              },
              {
                name: "Stripe",
                icon: SiStripe,
              },
              {
                name: "Slack",
                icon: SiSlack,
              },
              {
                name: "Zapier",
                icon: SiZapier,
              },
              {
                name: "Gmail",
                icon: SiGmail,
              },
              {
                name: "Supabase",
                icon: SiSupabase,
              },
            ].map((tool, i) => {
              const Icon = tool.icon;

              return (
                <div
                  key={i}
                  className="
              group
              rounded-3xl
              border
              border-white/10
              bg-white/[0.03]
              backdrop-blur-xl
              p-8
              flex
              flex-col
              items-center
              justify-center
              gap-4
              hover:border-primary/40
              hover:bg-primary/[0.04]
              transition-all
              duration-300
            "
                >
                  <div
                    className="
                w-16
                h-16
                rounded-2xl
                bg-black/40
                border
                border-white/10
                flex
                items-center
                justify-center
                group-hover:scale-110
                transition-transform
              "
                  >
                    <Icon className="text-3xl text-primary" />
                  </div>

                  <p className="font-semibold text-white">{tool.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2
              className="text-4xl sm:text-5xl font-bold text-balance text-foreground"
              variants={itemVariants}
            >
              Frequently Asked Questions
            </motion.h2>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {[
              {
                q: "How long does setup take?",
                a: "Most setups are complete within 24 hours with our guided integration process.",
              },
              {
                q: "Is my data secure?",
                a: "Yes, we use enterprise-grade encryption and comply with all major security standards.",
              },
              {
                q: "What support do you provide?",
                a: "All plans include email support. Growth and Enterprise include priority support.",
              },
              {
                q: "Can I integrate with existing systems?",
                a: "Yes, we offer API integration with most major solar management systems.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-6 rounded-xl border border-primary/10 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => setActiveTab(activeTab === i ? -1 : i)}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">{item.q}</p>
                  <HiArrowRight
                    className={`w-5 h-5 text-primary transition-transform ${activeTab === i ? "rotate-90" : ""}`}
                  />
                </div>
                {activeTab === i && (
                  <motion.p
                    className="mt-4 text-muted-foreground text-sm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    {item.a}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-primary/5">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance text-foreground"
            variants={itemVariants}
          >
            AI-Powered Solar CRM for Modern Energy Teams
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-xl max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Join hundreds of solar companies using SolarFlow to optimize their
            operations and increase revenue.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            variants={itemVariants}
          >
            <>
              {/* CTA Button */}
              <motion.button
                onClick={() => setShowModal(true)}
                className="group relative px-8 py-4 font-semibold rounded-lg bg-primary text-foreground overflow-hidden"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative flex items-center justify-center gap-2">
                  Start Free Trial
                  <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              {/* Modal */}
              <AnimatePresence>
                {showModal && (
                  <motion.div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 backdrop-blur-md px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Modal Card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 40 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 40 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      className="
          relative
          w-full
          max-w-lg
          overflow-hidden
          rounded-3xl
          border
          border-primary/30
          bg-[#111111]/95
          backdrop-blur-3xl
          p-8
          shadow-[0_0_120px_rgba(0,255,140,0.25)]
        "
                    >
                      {/* Close Button */}
                      <button
                        onClick={() => setShowModal(false)}
                        className="
            absolute
            top-5
            right-5
            z-[999]
            flex
            items-center
            justify-center
            w-10
            h-10
            rounded-full
            border
            border-white/10
            bg-white/5
            text-white
            text-lg
            backdrop-blur-xl
            transition-all
            hover:bg-primary/20
            hover:border-primary/40
            hover:scale-110
          "
                      >
                        ✕
                      </button>

                      {/* Content */}
                      <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-3">
                          Join the Waitlist
                        </h2>

                        <p className="text-gray-300 mb-6">
                          Automate solar lead capture and follow-ups.
                        </p>

                        {success ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-10 text-center"
                          >
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                              <span className="text-4xl text-primary">✓</span>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">
                              You’re on the list!
                            </h3>

                            <p className="text-gray-400">
                              We’ll notify you once SolarFlow launches.
                            </p>
                          </motion.div>
                        ) : (
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={formData.full_name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  full_name: e.target.value,
                                })
                              }
                              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                            />

                            <input
                              type="email"
                              placeholder="Email Address"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                            />

                            <input
                              type="text"
                              placeholder="Company Name"
                              value={formData.company_name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  company_name: e.target.value,
                                })
                              }
                              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                            />

                            <textarea
                              placeholder="Tell us about your solar business..."
                              rows={4}
                              value={formData.message}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  message: e.target.value,
                                })
                              }
                              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
                            />

                            <motion.button
                              type="submit"
                              disabled={loading}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full rounded-xl bg-primary py-4 font-semibold text-black disabled:opacity-50"
                            >
                              {loading ? "Joining..." : "Join Waitlist"}
                            </motion.button>
                          </form>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
            <motion.button
              className="px-8 py-4 font-semibold border border-primary/30 text-foreground rounded-lg hover:bg-primary/5 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Demo
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-background/50 backdrop-blur py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BiSolidLeaf className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg text-foreground">
                  SolarFlow
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Maximizing solar efficiency with AI.
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Security"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Resources", links: ["Docs", "API", "Support"] },
              { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-foreground mb-4 text-sm">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-muted-foreground text-sm hover:text-primary transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-primary/10 pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2024 SolarFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
