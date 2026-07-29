import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContactContent } from "./contact-content";

export const metadata: Metadata = {
  title: "Contact - AI0FY",
  description: "Get in touch with the AI0FY team.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar user={null} />
      <div className="bg-[#F9F9F6]">
        <main>
          <ContactContent />
        </main>
      </div>
      <Footer />
    </>
  );
}
