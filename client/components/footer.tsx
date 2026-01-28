import Link from 'next/link';
import { Mail, Github, Code2, Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-slate-200 bg-white/50 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/50">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 md:flex-row md:py-6">
                <div className="flex flex-col items-center gap-2 md:items-start">
                    <p className="text-center text-sm font-medium leading-loose text-slate-600 dark:text-slate-400 md:text-left">
                        © {currentYear} Coworking SaaS. All rights reserved.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Code2 className="h-4 w-4" />
                        <span>Developed by</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                            Miguel Angel Cesary Sorioco
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="mailto:mangelcs2003@gmail.com"
                            className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                            title="Contact via Email"
                        >
                            <Mail className="h-5 w-5" />
                            <span className="sr-only">Email</span>
                        </Link>
                        <Link
                            href="https://github.com/MiguelCs03"
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                            title="GitHub Profile"
                        >
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
                    Made with <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> in Bolivia
                </div>
            </div>
        </footer>
    );
};

export default Footer;
