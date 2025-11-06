"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import linkSVG from "@/assets/link.svg";
import magnifyingGlassSVG from "@/assets/magnifyingGlass.svg";
import envelopeSVG from "@/assets/envelope.svg";
import {Button} from "../ui/button/button";
import LanguageToggle from "./LanguageToggle";
import SubscriptionModal from "./SubscriptionModal";
import { useLanguage } from "@/contexts/LanguageContext";

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
                <Image src={'/image/curie_tech.webp'} alt="Logo" width={110} height={20}/>
            </Link>
            <div className="flex items-center font-bold">
                {/*<div className="mx-2 flex gap-[6px] items-center">*/}
                {/*  <Button variant="link">*/}
                {/*    <span>SLASH</span>*/}
                {/*    <Image src={linkSVG} alt="link" width={20} height={20} />*/}
                {/*  </Button>*/}
                {/*</div>*/}
                <div className="mx-2">
                    <Button
                        variant="default"
                        onClick={() => setIsSubscriptionModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Image src={envelopeSVG} alt="subscribe" width={16} height={16}/>
                        {t('header.subscribe')}
                    </Button>
                </div>
                <div className="mx-2 flex gap-[6px] items-center">
                    <Link href="https://curieus.net" className="flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                        <Image src={linkSVG} alt="link" width={20} height={20}/>
                        <span>Curieus</span>
                    </Link>
                </div>
                {/*<div className="mx-2 flex gap-[6px] items-center">*/}
                {/*    <Link href="https://curie.kr" className="flex items-center gap-1">*/}
                {/*        <Image src={linkSVG} alt="link" width={20} height={20}/>*/}
                {/*        <span>About Us</span>*/}
                {/*    </Link>*/}
                {/*</div>*/}
                {/*<div className="ml-2">*/}
                {/*  <Button variant="default">구독하기</Button>*/}
                {/*</div>*/}
                {/*<div className="ml-2">*/}
                {/*  <Button variant="gray">채용 바로가기</Button>*/}
                {/*</div>*/}
                <div className="mx-2">
                    <LanguageToggle />
                </div>
                <div className="mx-2">
                    <Button variant="destructive" onClick={onSearchClick}>
                        <Image src={magnifyingGlassSVG} alt="search" width={20} height={20}/>
                    </Button>
                </div>
            </div>
            <SubscriptionModal
                isOpen={isSubscriptionModalOpen}
                onClose={() => setIsSubscriptionModalOpen(false)}
            />
        </header>
    );
}
