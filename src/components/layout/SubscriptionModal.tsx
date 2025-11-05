"use client";

import { useState } from "react";
import { Button } from "../ui/button/button";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { t, language } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            setMessage(t('subscription.modal.error.empty'));
            return;
        }

        // 이메일 유효성 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage(t('subscription.modal.error.invalid'));
            return;
        }

        setIsLoading(true);
        setMessage("");

        try {
            // 이미 구독했는지 확인
            if (!supabase) {
                setMessage(t('subscription.modal.error.unavailable'));
                setIsLoading(false);
                return;
            }

            const { data: existingSubscribers } = await supabase
                .from("subscribers")
                .select("id")
                .eq("email", email);

            if (existingSubscribers && existingSubscribers.length > 0) {
                setMessage(t('subscription.modal.error.exists'));
                setIsLoading(false);
                return;
            }

            // 새 구독자 추가
            const { error } = await supabase
                .from("subscribers")
                .insert([
                    {
                        email,
                        subscribed_at: new Date().toISOString(),
                        is_active: true,
                    },
                ])
                .select();

            if (error) {
                console.error("Supabase error:", error);
                setMessage(t('subscription.modal.error.server'));
            } else {
                setMessage(t('subscription.modal.success'));
                setEmail("");
                setTimeout(() => {
                    onClose();
                    setMessage("");
                }, 2000);
            }
        } catch (error) {
            console.error("Subscribe error:", error);
            setMessage(t('subscription.modal.error.network'));
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div 
                className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-2">{t('subscription.modal.title')}</h2>
                <p className="text-gray-600 mb-6">
                    {t('subscription.modal.description')}
                </p>
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('subscription.modal.placeholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    
                    {message && (
                        <div className={`mb-4 p-3 rounded-lg text-sm ${
                            message === t('subscription.modal.success') 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                        }`}>
                            {message}
                        </div>
                    )}
                    
                    <div className="flex gap-3">
                        <Button 
                            type="submit" 
                            variant="default" 
                            className="flex-1"
                            disabled={isLoading}
                        >
                            {isLoading ? t('subscription.modal.submitting') : t('subscription.modal.submit')}
                        </Button>
                        <Button 
                            type="button"
                            variant="gray" 
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {t('subscription.modal.cancel')}
                        </Button>
                    </div>
                </form>
                
                <p className="text-xs text-gray-500 mt-4">
                    {t('subscription.modal.privacy')}
                </p>
            </div>
        </div>
    );
}