"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { sendEmailWithNaverCloud, createEmailTemplate } from "@/lib/naverCloudEmail";
import { generateEmailTemplate, EmailTemplateData } from "@/lib/emailTemplate";
import { useLanguage } from "@/contexts/LanguageContext";
import {
    Mail,
    Search,
    Send,
    Users,
    CheckSquare,
    Activity,
    X,
} from "lucide-react";

interface Subscriber {
    id: string;
    email: string;
    subscribed_at: string;
    is_active: boolean;
    preferences: {
        categories: string[];
        frequency: string;
    };
}

export default function AdminSubscribersPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [showComposeModal, setShowComposeModal] = useState(false);
    const [emailContent, setEmailContent] = useState({
        subject: "",
        body: "",
        preview: ""
    });
    const [emailTemplateData, setEmailTemplateData] = useState<EmailTemplateData>({
        recipientName: language === 'ko' ? '구독자' : 'Subscriber',
        recipientEmail: '',
        subject: '',
        mainContent: '',
        buttonText: '',
        buttonUrl: '',
        footerText: ''
    });
    const [useHtmlTemplate, setUseHtmlTemplate] = useState(true);
    const [previewTab, setPreviewTab] = useState<'edit' | 'preview'>('edit');
    const [searchTerm, setSearchTerm] = useState("");
    const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        thisWeek: 0
    });

    // Load subscribers from Supabase
    const loadSubscribers = async () => {
        setIsLoading(true);
        try {
            if (!supabase) {
                console.warn("Supabase not configured");
                setIsLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("subscribers")
                .select("*")
                .order("subscribed_at", { ascending: false });

            if (error) {
                console.error("Error loading subscribers:", error);
                return;
            }

            if (data) {
                setSubscribers(data);
                calculateStats(data);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        const authTime = localStorage.getItem("admin_auth_time");

        if (!token || !authTime) {
            router.push("/");
            return;
        }

        const tokenAge = Date.now() - parseInt(authTime);
        if (tokenAge > 24 * 60 * 60 * 1000) {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_auth_time");
            router.push("/");
            return;
        }

        setIsAuthenticated(true);
        loadSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    // Calculate statistics
    const calculateStats = (data: Subscriber[]) => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const stats = {
            total: data.length,
            active: data.filter(s => s.is_active).length,
            inactive: data.filter(s => !s.is_active).length,
            thisWeek: data.filter(s => new Date(s.subscribed_at) > weekAgo).length
        };

        setStats(stats);
    };

    // Filter subscribers based on search and filter
    const filteredSubscribers = subscribers.filter(subscriber => {
        const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterActive === "all" ||
            (filterActive === "active" && subscriber.is_active) ||
            (filterActive === "inactive" && !subscriber.is_active);
        return matchesSearch && matchesFilter;
    });

    // Toggle email selection
    const toggleEmailSelection = (email: string) => {
        const newSelection = new Set(selectedEmails);
        if (newSelection.has(email)) {
            newSelection.delete(email);
        } else {
            newSelection.add(email);
        }
        setSelectedEmails(newSelection);
    };

    // Select all visible emails
    const selectAllVisible = () => {
        const allEmails = new Set(filteredSubscribers.map(s => s.email));
        setSelectedEmails(allEmails);
    };

    // Clear selection
    const clearSelection = () => {
        setSelectedEmails(new Set());
    };

    // Handle logout

    // Handle email composition
    const handleCompose = () => {
        if (selectedEmails.size === 0) {
            alert(language === 'ko' ? "이메일을 선택해주세요." : "Please select emails.");
            return;
        }
        setShowComposeModal(true);
    };

    // Send email using email service
    const handleSendEmail = async () => {
        const subject = useHtmlTemplate ? emailTemplateData.subject : emailContent.subject;
        const body = useHtmlTemplate
            ? generateEmailTemplate(emailTemplateData)
            : emailContent.body;

        if (!subject || (!useHtmlTemplate && !emailContent.body) || (useHtmlTemplate && !emailTemplateData.mainContent)) {
            alert(language === 'ko'
                ? "제목과 내용을 입력해주세요."
                : "Please enter subject and content."
            );
            return;
        }

        const confirmSend = window.confirm(
            language === 'ko'
                ? `${selectedEmails.size}명에게 이메일을 전송하시겠습니까?`
                : `Send email to ${selectedEmails.size} recipients?`
        );

        if (!confirmSend) return;

        setIsSubmitting(true);
        try {

            // Send email using Naver Cloud
            const result = await sendEmailWithNaverCloud({
                to: Array.from(selectedEmails),
                subject: subject,
                body: body,
                isHtml: useHtmlTemplate
            });

            // Log email sending to Supabase (한 번에 하나의 로그로 기록)
            try {
                if (supabase) {
                    await supabase
                        .from('email_logs')
                        .insert({
                        subject: emailContent.subject + ` (${selectedEmails.size} recipients)`,
                        content: emailContent.body,
                        status: result.success ? 'sent' : 'failed',
                        sent_at: result.success ? new Date().toISOString() : null,
                        error_message: result.success ? null : result.message
                    });
                }
            } catch (logError) {
                console.error('Failed to log email:', logError);
                // 로그 실패는 무시하고 계속 진행
            }

            if (result.success) {
                alert(language === 'ko'
                    ? `${selectedEmails.size}명에게 이메일을 성공적으로 전송했습니다.`
                    : `Successfully sent email to ${selectedEmails.size} recipients.`
                );

                setShowComposeModal(false);
                setEmailContent({ subject: "", body: "", preview: "" });
                clearSelection();
            } else {
                alert(language === 'ko'
                    ? `이메일 전송 실패: ${result.message}`
                    : `Failed to send email: ${result.message}`
                );
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert(language === 'ko'
                ? "이메일 전송 중 오류가 발생했습니다."
                : "Error sending email."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen">
            <main className="max-w-[1400px] mx-auto px-6 py-12">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-white/20 transition-colors">
                                    <Users className="w-6 h-6 text-blue-600 group-hover:text-white" />
                                </div>
                                {stats.thisWeek > 0 && (
                                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full animate-pulse">
                                        NEW
                                    </span>
                                )}
                            </div>
                            <div className="text-3xl font-bold text-gray-900 group-hover:text-white mb-1">
                                {stats.total}
                            </div>
                            <div className="text-sm text-gray-600 group-hover:text-white/90">
                                {language === 'ko' ? '전체 구독자' : 'Total Subscribers'}
                            </div>
                        </div>
                    </div>

                    <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-100 rounded-xl group-hover:bg-white/20 transition-colors">
                                    <CheckSquare className="w-6 h-6 text-green-600 group-hover:text-white" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 group-hover:text-white mb-1">
                                {stats.active}
                            </div>
                            <div className="text-sm text-gray-600 group-hover:text-white/90">
                                {language === 'ko' ? '활성 구독자' : 'Active Subscribers'}
                            </div>
                        </div>
                    </div>

                    <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-white/20 transition-colors">
                                    <Activity className="w-6 h-6 text-blue-600 group-hover:text-white" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 group-hover:text-white mb-1">
                                {stats.thisWeek}
                            </div>
                            <div className="text-sm text-gray-600 group-hover:text-white/90">
                                {language === 'ko' ? '이번 주 신규' : 'New This Week'}
                            </div>
                        </div>
                    </div>

                    <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-white/20 transition-colors">
                                    <Mail className="w-6 h-6 text-orange-600 group-hover:text-white" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 group-hover:text-white mb-1">
                                {selectedEmails.size}
                            </div>
                            <div className="text-sm text-gray-600 group-hover:text-white/90">
                                {language === 'ko' ? '선택된 이메일' : 'Selected Emails'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={language === 'ko' ? '이메일 검색...' : 'Search email...'}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex bg-gray-100 rounded-xl p-1">
                                {(['all', 'active', 'inactive'] as const).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilterActive(f)}
                                        className={`px-4 py-2 text-sm rounded-lg transition-all font-medium ${
                                            filterActive === f
                                                ? 'bg-white text-gray-900 shadow-md'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {f === 'all' && (language === 'ko' ? '전체' : 'All')}
                                        {f === 'active' && (language === 'ko' ? '활성' : 'Active')}
                                        {f === 'inactive' && (language === 'ko' ? '비활성' : 'Inactive')}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={selectAllVisible}
                                className={`px-4 py-2.5 text-sm rounded-xl transition-all font-medium flex items-center gap-2 ${
                                    selectedEmails.size === filteredSubscribers.length && filteredSubscribers.length > 0
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <CheckSquare className="w-4 h-4" />
                                {language === 'ko' ? '전체 선택' : 'Select All'}
                            </button>

                            {selectedEmails.size > 0 && (
                                <button
                                    onClick={clearSelection}
                                    className="px-4 py-2.5 text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-all font-medium"
                                >
                                    {language === 'ko' ? '선택 해제' : 'Clear'}
                                </button>
                            )}

                            <button
                                onClick={handleCompose}
                                disabled={selectedEmails.size === 0}
                                className={`px-5 py-2.5 text-sm rounded-xl transition-all font-medium flex items-center gap-2 ${
                                    selectedEmails.size === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700'
                                }`}
                            >
                                <Send className="w-4 h-4" />
                                <span>
                                    {language === 'ko'
                                        ? `이메일 보내기${selectedEmails.size > 0 ? ` (${selectedEmails.size})` : ''}`
                                        : `Send Email${selectedEmails.size > 0 ? ` (${selectedEmails.size})` : ''}`
                                    }
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Subscribers Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        {searchTerm || filterActive !== 'all'
                                            ? (language === 'ko' ? '검색 결과' : 'Search Results')
                                            : (language === 'ko' ? '구독자 목록' : 'Subscriber List')
                                        }
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {filteredSubscribers.length}명의 구독자
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {isLoading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                                <p className="text-gray-600">{language === 'ko' ? '로딩 중...' : 'Loading...'}</p>
                            </div>
                        ) : filteredSubscribers.length === 0 ? (
                            <div className="p-12 text-center">
                                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">
                                    {language === 'ko' ? '구독자가 없습니다' : 'No subscribers found'}
                                </p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-white border-b">
                                    <tr>
                                        <th className="px-5 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedEmails.size === filteredSubscribers.length && filteredSubscribers.length > 0}
                                                onChange={() => {
                                                    if (selectedEmails.size === filteredSubscribers.length) {
                                                        clearSelection();
                                                    } else {
                                                        selectAllVisible();
                                                    }
                                                }}
                                                className="rounded"
                                            />
                                        </th>
                                        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                                            {language === 'ko' ? '이메일' : 'Email'}
                                        </th>
                                        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                                            {language === 'ko' ? '구독일' : 'Subscribed'}
                                        </th>
                                        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                                            {language === 'ko' ? '상태' : 'Status'}
                                        </th>
                                        <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                                            {language === 'ko' ? '설정' : 'Preferences'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSubscribers.map((subscriber) => {
                                        const isNew = new Date(subscriber.subscribed_at).getTime() > Date.now() - 24 * 60 * 60 * 1000;
                                        return (
                                            <tr
                                                key={subscriber.id}
                                                className={`border-b hover:bg-gray-50 transition-colors ${
                                                    isNew ? 'bg-blue-50/30' : ''
                                                }`}
                                            >
                                                <td className="px-5 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedEmails.has(subscriber.email)}
                                                        onChange={() => toggleEmailSelection(subscriber.email)}
                                                        className="rounded"
                                                    />
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900">{subscriber.email}</span>
                                                        {isNew && (
                                                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded">
                                                                NEW
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    {formatDate(subscriber.subscribed_at)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                                                        subscriber.is_active 
                                                            ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200' 
                                                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                            subscriber.is_active ? 'bg-green-500' : 'bg-gray-400'
                                                        }`}></span>
                                                        {subscriber.is_active
                                                            ? (language === 'ko' ? '활성' : 'Active')
                                                            : (language === 'ko' ? '비활성' : 'Inactive')
                                                        }
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                                                            {subscriber.preferences?.frequency || 'weekly'}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>

            {/* Email Compose Modal */}
            {showComposeModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-7xl shadow-2xl max-h-[95vh] flex flex-col">
                        <div className="px-8 py-6 border-b bg-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {language === 'ko' ? '이메일 작성' : 'Compose Email'}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {language === 'ko'
                                            ? `${selectedEmails.size}명의 구독자에게 전송`
                                            : `Sending to ${selectedEmails.size} subscribers`
                                        }
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowComposeModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden flex">
                            {/* Left Panel - Email Editor */}
                            <div className="flex-1 overflow-y-auto p-6 border-r">
                                <div className="space-y-6">
                                    {/* Template Type Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            {language === 'ko' ? '이메일 형식' : 'Email Format'}
                                        </label>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setUseHtmlTemplate(true)}
                                                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                                                    useHtmlTemplate
                                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                🎨 {language === 'ko' ? 'HTML 템플릿' : 'HTML Template'}
                                            </button>
                                            <button
                                                onClick={() => setUseHtmlTemplate(false)}
                                                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                                                    !useHtmlTemplate
                                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                📝 {language === 'ko' ? '일반 텍스트' : 'Plain Text'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Recipients Preview */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {language === 'ko' ? '받는 사람' : 'Recipients'}
                                        </label>
                                        <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl text-sm max-h-20 overflow-auto border border-gray-200">
                                            {Array.from(selectedEmails).join(', ')}
                                        </div>
                                    </div>

                                    {useHtmlTemplate ? (
                                        <>
                                            {/* Quick Templates */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    {language === 'ko' ? '빠른 템플릿' : 'Quick Templates'}
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => setEmailTemplateData({
                                                            recipientName: language === 'ko' ? '연구원' : 'Researcher',
                                                            recipientEmail: '',
                                                            subject: language === 'ko'
                                                                ? '✨ AlphaFold3 단백질 구조 분석이 완료되었습니다'
                                                                : '✨ Your AlphaFold3 Protein Structure Analysis is Complete',
                                                            mainContent: language === 'ko'
                                                                ? `요청하신 단백질 구조 분석이 성공적으로 완료되었습니다.

주요 분석 결과:
• 전체 구조 신뢰도 (pLDDT): 92.3
• 고신뢰 영역 (pLDDT > 90): 78%
• 예측된 도메인: 4개
• 처리 시간: 4분 23초

분석 결과를 확인하시려면 아래 버튼을 클릭해주세요.`
                                                                : `Your protein structure analysis has been completed successfully.

Key Results:
• Overall confidence (pLDDT): 92.3
• High confidence regions (pLDDT > 90): 78%
• Predicted domains: 4
• Processing time: 4m 23s

Click below to view your results.`,
                                                            buttonText: language === 'ko' ? '결과 확인하기' : 'View Results',
                                                            buttonUrl: 'https://curieus.net/results',
                                                            footerText: language === 'ko'
                                                                ? '💡 분석 결과는 30일간 보관됩니다.'
                                                                : '💡 Analysis results will be stored for 30 days.'
                                                        })}
                                                        className="p-3 text-left bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all"
                                                    >
                                                        <span className="text-2xl mb-1 block">🧬</span>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {language === 'ko' ? '분석 완료' : 'Analysis Complete'}
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={() => setEmailTemplateData({
                                                            recipientName: language === 'ko' ? '고객' : 'Customer',
                                                            recipientEmail: '',
                                                            subject: language === 'ko'
                                                                ? '🚀 Curieus 새로운 기능 업데이트'
                                                                : '🚀 Curieus New Feature Update',
                                                            mainContent: language === 'ko'
                                                                ? `Curieus에 새로운 기능이 추가되었습니다!

이번 업데이트 내용:
• 멀티 체인 분석 기능 추가
• AI 기반 리간드 자동 도킹
• 실시간 협업 기능
• AlphaFold3 모델 통합

자세한 내용을 확인해보세요.`
                                                                : `New features have been added to Curieus!

This Update Includes:
• Multi-chain analysis capability
• AI-powered automatic ligand docking
• Real-time collaboration features
• AlphaFold3 model integration

Check out the details below.`,
                                                            buttonText: language === 'ko' ? '새 기능 보기' : 'View Features',
                                                            buttonUrl: 'https://curieus.net/features',
                                                            footerText: ''
                                                        })}
                                                        className="p-3 text-left bg-gradient-to-r from-blue-50 to-pink-50 rounded-xl hover:shadow-md transition-all"
                                                    >
                                                        <span className="text-2xl mb-1 block">🎉</span>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {language === 'ko' ? '업데이트 안내' : 'Update Notice'}
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={() => setEmailTemplateData({
                                                            recipientName: language === 'ko' ? '신규 회원' : 'New Member',
                                                            recipientEmail: '',
                                                            subject: language === 'ko'
                                                                ? '🎊 Curieus에 오신 것을 환영합니다!'
                                                                : '🎊 Welcome to Curieus!',
                                                            mainContent: language === 'ko'
                                                                ? `Curieus 가입을 진심으로 환영합니다!

시작하기:
1. 단백질 시퀀스 업로드
2. 분석 옵션 선택
3. 결과 확인 (평균 5분 이내)

무료 플랜으로 매월 10회 분석이 가능합니다.`
                                                                : `Welcome to Curieus!

Getting Started:
1. Upload your protein sequence
2. Select analysis options
3. View results (average 5 minutes)

Your free plan includes 10 analyses per month.`,
                                                            buttonText: language === 'ko' ? '시작하기' : 'Get Started',
                                                            buttonUrl: 'https://curieus.net',
                                                            footerText: language === 'ko'
                                                                ? '🎁 친구 초대시 추가 크레딧을 받으세요!'
                                                                : '🎁 Invite friends to earn extra credits!'
                                                        })}
                                                        className="p-3 text-left bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all"
                                                    >
                                                        <span className="text-2xl mb-1 block">👋</span>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {language === 'ko' ? '환영 메일' : 'Welcome Email'}
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={() => setEmailTemplateData({
                                                            recipientName: language === 'ko' ? '구독자' : 'Subscriber',
                                                            recipientEmail: '',
                                                            subject: '',
                                                            mainContent: '',
                                                            buttonText: '',
                                                            buttonUrl: '',
                                                            footerText: ''
                                                        })}
                                                        className="p-3 text-left bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all"
                                                    >
                                                        <span className="text-2xl mb-1 block">✏️</span>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {language === 'ko' ? '직접 작성' : 'Custom'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* HTML Template Fields */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        {language === 'ko' ? '제목' : 'Subject'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={emailTemplateData.subject}
                                                        onChange={(e) => setEmailTemplateData({...emailTemplateData, subject: e.target.value})}
                                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                                        placeholder={language === 'ko' ? '이메일 제목' : 'Email subject'}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        {language === 'ko' ? '본문 내용' : 'Main Content'}
                                                    </label>
                                                    <textarea
                                                        value={emailTemplateData.mainContent}
                                                        onChange={(e) => setEmailTemplateData({...emailTemplateData, mainContent: e.target.value})}
                                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                                        rows={6}
                                                        placeholder={language === 'ko' ? '이메일 본문 내용...' : 'Email body content...'}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            {language === 'ko' ? '버튼 텍스트 (선택)' : 'Button Text (Optional)'}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={emailTemplateData.buttonText || ''}
                                                            onChange={(e) => setEmailTemplateData({...emailTemplateData, buttonText: e.target.value})}
                                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                                            placeholder={language === 'ko' ? '자세히 보기' : 'Learn More'}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            {language === 'ko' ? '버튼 링크 (선택)' : 'Button URL (Optional)'}
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={emailTemplateData.buttonUrl || ''}
                                                            onChange={(e) => setEmailTemplateData({...emailTemplateData, buttonUrl: e.target.value})}
                                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                                            placeholder="https://curieus.net"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        {language === 'ko' ? '하단 메시지 (선택)' : 'Footer Message (Optional)'}
                                                    </label>
                                                    <textarea
                                                        value={emailTemplateData.footerText || ''}
                                                        onChange={(e) => setEmailTemplateData({...emailTemplateData, footerText: e.target.value})}
                                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                                        rows={2}
                                                        placeholder={language === 'ko' ? '추가 안내사항...' : 'Additional information...'}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Plain Text Fields */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    {language === 'ko' ? '제목' : 'Subject'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={emailContent.subject}
                                                    onChange={(e) => setEmailContent({...emailContent, subject: e.target.value})}
                                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                                    placeholder={language === 'ko'
                                                        ? 'CONNECTS 뉴스레터'
                                                        : 'CONNECTS Newsletter'
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    {language === 'ko' ? '내용' : 'Content'}
                                                </label>
                                                <textarea
                                                    value={emailContent.body}
                                                    onChange={(e) => setEmailContent({...emailContent, body: e.target.value})}
                                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                                    rows={12}
                                                    placeholder={language === 'ko'
                                                        ? '이메일 내용을 입력하세요...'
                                                        : 'Enter email content...'
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Panel - Preview */}
                            <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
                                <div className="p-4 bg-white border-b">
                                    <h3 className="font-semibold text-gray-800">
                                        {language === 'ko' ? '📧 실시간 미리보기' : '📧 Live Preview'}
                                    </h3>
                                </div>
                                <div className="flex-1 overflow-auto p-4">
                                    {useHtmlTemplate ? (
                                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                            <iframe
                                                srcDoc={generateEmailTemplate(emailTemplateData)}
                                                className="w-full h-full min-h-[600px]"
                                                title="Email Preview"
                                            />
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-lg shadow-lg p-6">
                                            <div className="font-bold text-lg text-gray-900 mb-4">
                                                {emailContent.subject || (language === 'ko' ? '(제목 없음)' : '(No subject)')}
                                            </div>
                                            <div className="whitespace-pre-wrap text-gray-700">
                                                {emailContent.body || (language === 'ko' ? '내용을 입력하면 여기에 표시됩니다.' : 'Content will appear here as you type.')}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                {useHtmlTemplate && (
                                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                                        Curieus HTML 템플릿
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowComposeModal(false)}
                                    className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-all font-medium"
                                >
                                    {language === 'ko' ? '취소' : 'Cancel'}
                                </button>
                                <button
                                    onClick={handleSendEmail}
                                    disabled={
                                        isSubmitting ||
                                        (useHtmlTemplate ? !emailTemplateData.subject || !emailTemplateData.mainContent : !emailContent.subject || !emailContent.body)
                                    }
                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg transition-all font-medium"
                                >
                                    <Send className="w-4 h-4" />
                                    {isSubmitting
                                        ? (language === 'ko' ? '전송 중...' : 'Sending...')
                                        : (language === 'ko' ? '이메일 전송' : 'Send Email')
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
