import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { MapPin, Phone, Mail } from "lucide-react";

export default function SiteFooter() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const tc = useTranslations("common");

  const footerLinks = [
    {
      title: t("institute"),
      links: [
        { label: tn("institute"), href: "/institute" },
        { label: tn("research"), href: "/research" },
      ],
    },
    {
      title: t("services"),
      links: [
        { label: tn("dmc"), href: "/dmc" },
        { label: tn("products"), href: "/products" },
      ],
    },
    {
      title: t("info"),
      links: [
        { label: tn("contact"), href: "/contact" },
        { label: t("admin"), href: "/admin" },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="text-base font-bold text-white">{tc("siteTitle")}</div>
            <div className="mt-1 text-sm text-slate-400">{tc("siteSubtitle")}</div>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>{t("address")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-slate-500" />
                <span>{t("phone")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                <span>{t("email")}</span>
              </div>
            </div>
          </div>
          {footerLinks.map((col) => (
            <div key={col.title}>
              <div className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                {col.title}
              </div>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-400 transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-slate-800 pt-6 text-xs text-slate-600">
          © {new Date().getFullYear()} {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
