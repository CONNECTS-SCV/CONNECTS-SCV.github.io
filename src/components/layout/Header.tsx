"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import linkSVG from "@/assets/link-dark.svg";
import magnifyingGlassSVG from "@/assets/magnifyingGlass-dark.svg";
import envelopeSVG from "@/assets/envelope-dark.svg";
import {Button} from "../ui/button/button";
import LanguageToggle from "./LanguageToggle";
import SubscriptionModal from "./SubscriptionModal";
import { useLanguage } from "@/contexts/LanguageContext";
import "@/styles/header-buttons.css";

interface HeaderProps {
    onSearchClick?: () => void;
}

export default function Header({onSearchClick}: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        // 초기 스크롤 위치 확인
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`w-full h-[80px] flex justify-between items-center bg-white px-4 xl:px-2 border-b transition-colors ${isScrolled ? 'border-calloutbox' : 'border-transparent'}`}>
            <Link href="/">
                <Image src={'/image/curieus_tech.webp'} alt="Logo" width={110} height={20} className="w-[90px] sm:w-[110px]"/>
            </Link>
            <div className="header-menu">
                <button
                    className="header-link"
                    onClick={() => setIsSubscriptionModalOpen(true)}
                >
                    <span className="link-icon">
                        <Image src={envelopeSVG} alt="subscribe" width={24} height={24}/>
                    </span>
                    <span className="link-title">{t('header.subscribe')}</span>
                </button>

                <Link href="https://curieus.net" className="header-link" target="_blank" rel="noopener noreferrer">
                    <span className="link-icon">
                        <Image src={linkSVG} alt="link" width={20} height={20}/>
                    </span>
                    <span className="link-title">Curieus</span>
                </Link>

                <LanguageToggle />

                <button
                    className="header-link"
                    onClick={onSearchClick}
                >
                    <span className="link-icon">
                        <Image src={magnifyingGlassSVG} alt="search" width={20} height={20}/>
                    </span>
                    <span className="link-title">{t('header.search')}</span>
                </button>
            </div>

            <SubscriptionModal
                isOpen={isSubscriptionModalOpen}
                onClose={() => setIsSubscriptionModalOpen(false)}
            />
        </header>
    );
}
