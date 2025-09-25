"use client";

import Link from "next/link";
import Image from "next/image";
import linkSVG from "@/assets/link.svg";
import magnifyingGlassSVG from "@/assets/magnifyingGlass.svg";
import {Button} from "../ui/button/button";

export default function Header() {
    return (
        <header className="w-full h-[60px] flex justify-between items-center bg-white">
            <Link href="/">
                <Image src={'/image/curie_tech.webp'} alt="Logo" width={110} height={20}/>
            </Link>
            <div className="flex items-center">
                {/*<div className="mx-2 flex gap-[6px] items-center">*/}
                {/*  <Button variant="link">*/}
                {/*    <span>SLASH</span>*/}
                {/*    <Image src={linkSVG} alt="link" width={20} height={20} />*/}
                {/*  </Button>*/}
                {/*</div>*/}
                <div className="mx-2 flex gap-[6px] items-center">
                    <Link href="https://curie.kr" className="flex items-center gap-1">
                        <span>CURIE</span>
                        <Image src={linkSVG} alt="link" width={20} height={20}/>
                    </Link>
                </div>
                {/*<div className="ml-2">*/}
                {/*  <Button variant="default">구독하기</Button>*/}
                {/*</div>*/}
                {/*<div className="ml-2">*/}
                {/*  <Button variant="gray">채용 바로가기</Button>*/}
                {/*</div>*/}
                <div className="mx-2">
                    <Button variant="destructive">
                        <Image src={magnifyingGlassSVG} alt="search" width={20} height={20}/>
                    </Button>
                </div>
            </div>
        </header>
    );
}
