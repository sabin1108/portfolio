import { motion } from "motion/react";
import { Github, Mail } from "lucide-react";
import { portfolio } from "../data/portfolio";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function Contact() {
  const { profile } = portfolio;

  return (
    <motion.section
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="pb-8"
    >
      <Card className="border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mb-2 text-[1.5rem] font-semibold tracking-tight text-slate-800">
              Contact
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-indigo-600 text-white hover:bg-indigo-700">
              <a href={`mailto:${profile.contacts.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </a>
            </Button>
            <Button asChild variant="outline" className="border-slate-300 text-slate-700">
              <a href={profile.contacts.github} target="_blank" rel="noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </Card>
    </motion.section>
  );
}
