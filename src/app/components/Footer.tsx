// components/Footer.tsx
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    SendHorizonal,
    Github,
    Globe,
} from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full bg-zinc-900 text-white border-t border-zinc-700 mt-auto">
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Social Links */}
                <div className="flex gap-4">
                    <a
                        href="https://t.me/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-all"
                        aria-label="Telegram"
                    >
                        <SendHorizonal size={22} />
                    </a>
                    <a
                        href="https://twitter.com/Rabidas_Prakash"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-sky-400 transition-all"
                        aria-label="Twitter"
                    >
                        <Twitter size={22} />
                    </a>
                    <a
                        href="https://www.facebook.com/light144/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500 transition-all"
                        aria-label="Facebook"
                    >
                        <Facebook size={22} />
                    </a>
                    <a
                        href="https://www.instagram.com/__prakash_r__/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-pink-500 transition-all"
                        aria-label="Instagram"
                    >
                        <Instagram size={22} />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/prakashrabidas/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition-all"
                        aria-label="LinkedIn"
                    >
                        <Linkedin size={22} />
                    </a>
                    <a
                        href="https://github.com/prakash144"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-300 transition-all"
                        aria-label="GitHub"
                    >
                        <Github size={22} />
                    </a>
                    <a
                        href="https://prakashrabidas.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-400 transition-all"
                        aria-label="Portfolio"
                    >
                        <Globe size={22} />
                    </a>
                </div>

                {/* Copyright */}
                <p className="text-sm md:text-base text-gray-400 text-center leading-relaxed">
                    &copy; {new Date().getFullYear()}{" "}
                    <a
                        href="https://www.prakashrabidas.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                    >
                        PrakashRabidas.in
                    </a>{" "}
                    · All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
